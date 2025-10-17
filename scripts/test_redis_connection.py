#!/usr/bin/env python3
"""
Test Redis connection with the provided credentials
"""
import asyncio
import os
import redis.asyncio as redis
from urllib.parse import urlparse
import certifi

async def test_redis_connection():
    """Test Redis connection with TLS"""
    # Get Redis URL from environment variable
    # For production, set REDIS_URL in your environment or .env file
    redis_url = os.getenv("REDIS_URL", "redis://localhost:6379")

    print(f"Testing Redis connection to: {redis_url}")
    
    try:
        # Parse the URL
        parsed = urlparse(redis_url)
        
        # Create Redis client with TLS
        client = redis.Redis(
            host=parsed.hostname,
            port=parsed.port,
            password=parsed.password,
            decode_responses=True,
            ssl=True,
            ssl_ca_certs=certifi.where()
        )
        
        # Test connection
        print("Testing connection...")
        pong = await client.ping()
        print(f"[SUCCESS] Redis connection successful: {pong}")
        
        # Test stream operations
        stream_key = "signals:live"
        print(f"Testing stream operations on: {stream_key}")
        
        # Add a test message
        test_data = {
            "symbol": "BTCUSDT",
            "side": "BUY", 
            "price": "50000.00",
            "timestamp": "1700000000000"
        }
        
        entry_id = await client.xadd(stream_key, test_data)
        print(f"[SUCCESS] Added test message: {entry_id}")
        
        # Read the message back
        messages = await client.xrevrange(stream_key, count=1)
        print(f"[SUCCESS] Retrieved message: {messages}")
        
        # Get stream length
        length = await client.xlen(stream_key)
        print(f"[SUCCESS] Stream length: {length}")
        
        await client.close()
        print("[SUCCESS] Redis connection test completed successfully")
        
    except Exception as e:
        print(f"[ERROR] Redis connection failed: {e}")
        return False
    
    return True

if __name__ == "__main__":
    asyncio.run(test_redis_connection())
