import os
import asyncio
from typing import List, Dict, Any
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import redis.asyncio as redis
import orjson

app = FastAPI(title="Signals API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Redis connection
redis_client = None

async def get_redis_client():
    global redis_client
    if redis_client is None:
        redis_url = os.getenv("REDIS_URL", "redis://localhost:6379")
        ssl = os.getenv("REDIS_SSL", "false").lower() == "true"
        ca_cert_use_certifi = os.getenv("REDIS_CA_CERT_USE_CERTIFI", "false").lower() == "true"
        
        connection_kwargs = {
            "decode_responses": True,
        }
        
        if ssl:
            from urllib.parse import urlparse
            import certifi
            parsed = urlparse(redis_url)
            redis_client = redis.Redis(
                host=parsed.hostname,
                port=parsed.port,
                password=parsed.password,
                decode_responses=True,
                ssl=True,
                ssl_ca_certs=certifi.where() if ca_cert_use_certifi else None
            )
        else:
            redis_client = redis.from_url(redis_url, **connection_kwargs)
    
    return redis_client

@app.on_event("startup")
async def startup_event():
    await get_redis_client()

@app.on_event("shutdown")
async def shutdown_event():
    global redis_client
    if redis_client:
        await redis_client.close()

@app.get("/healthz")
async def health_check():
    try:
        client = await get_redis_client()
        await client.ping()
        return {"status": "ok", "redis": "up"}
    except Exception as e:
        raise HTTPException(status_code=503, detail={"status": "error", "redis": "down", "error": str(e)})

@app.get("/signals/latest")
async def get_latest_signals(limit: int = 50):
    try:
        client = await get_redis_client()
        stream_key = os.getenv("REDIS_STREAM_KEY", "signals:live")
        
        # Get the latest entries from the stream
        entries = await client.xrevrange(stream_key, count=limit)
        
        # Convert to list of dictionaries and reverse to get oldest-first
        signals = []
        for entry_id, fields in reversed(entries):
            signal = {
                "id": entry_id,
                "symbol": fields.get("symbol", ""),
                "side": fields.get("side", ""),
                "price": fields.get("price", ""),
                "timestamp": entry_id.split("-")[0]  # Extract timestamp from stream ID
            }
            signals.append(signal)
        
        return {"signals": signals, "count": len(signals)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching signals: {str(e)}")

@app.get("/sse/signals")
async def stream_signals():
    async def event_generator():
        try:
            client = await get_redis_client()
            stream_key = os.getenv("REDIS_STREAM_KEY", "signals:live")
            
            # Start from the latest entry
            last_id = "$"
            
            while True:
                try:
                    # Read from stream with blocking
                    messages = await client.xread({stream_key: last_id}, block=1000)
                    
                    for stream, entries in messages:
                        for entry_id, fields in entries:
                            signal = {
                                "id": entry_id,
                                "symbol": fields.get("symbol", ""),
                                "side": fields.get("side", ""),
                                "price": fields.get("price", ""),
                                "timestamp": entry_id.split("-")[0]
                            }
                            
                            # Send SSE event
                            yield f"event: signal\n"
                            yield f"data: {orjson.dumps(signal).decode()}\n\n"
                            
                            last_id = entry_id
                            
                except Exception as e:
                    print(f"Error in stream: {e}")
                    await asyncio.sleep(1)
                    
        except Exception as e:
            print(f"Error in event generator: {e}")
            yield f"event: error\n"
            yield f"data: {orjson.dumps({'error': str(e)}).decode()}\n\n"
    
    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Cache-Control"
        }
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)