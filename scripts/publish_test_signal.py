#!/usr/bin/env python3
import asyncio
import os
import redis.asyncio as redis
import json
import time

async def publish_test_signal():
    redis_url = os.getenv("REDIS_URL", "redis://localhost:6379")
    ssl = os.getenv("REDIS_SSL", "false").lower() == "true"
    ca_cert_use_certifi = os.getenv("REDIS_CA_CERT_USE_CERTIFI", "false").lower() == "true"
    stream_key = os.getenv("REDIS_STREAM_KEY", "signals:live")
    
    connection_kwargs = {
        "decode_responses": True,
    }
    
    if ssl:
        from urllib.parse import urlparse
        import certifi
        parsed = urlparse(redis_url)
        client = redis.Redis(
            host=parsed.hostname,
            port=parsed.port,
            password=parsed.password,
            decode_responses=True,
            ssl=True,
            ssl_ca_certs=certifi.where() if ca_cert_use_certifi else None
        )
    else:
        client = redis.from_url(redis_url, **connection_kwargs)
    
    try:
        # Generate a test signal
        signal_data = {
            "symbol": "BTCUSDT",
            "side": "BUY",
            "price": f"{50000 + (time.time() % 1000):.2f}",
            "timestamp": str(int(time.time() * 1000))
        }
        
        # Add to Redis stream
        entry_id = await client.xadd(stream_key, signal_data)
        print(f"Published test signal: {entry_id}")
        print(f"Data: {json.dumps(signal_data, indent=2)}")
        
    except Exception as e:
        print(f"Error publishing signal: {e}")
    finally:
        await client.close()

if __name__ == "__main__":
    asyncio.run(publish_test_signal())
