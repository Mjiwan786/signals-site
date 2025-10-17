#!/usr/bin/env python3
"""
Test bot startup without Discord connection
"""
import os
import sys
import asyncio
from pathlib import Path

# Add the api directory to the Python path
api_dir = Path(__file__).parent.parent / "api"
sys.path.insert(0, str(api_dir))

# Set up default environment variables for local testing
# For production, set REDIS_URL in your environment or .env file
os.environ.setdefault("REDIS_URL", "redis://localhost:6379")
os.environ.setdefault("REDIS_SSL", "false")
os.environ.setdefault("REDIS_CA_CERT_USE_CERTIFI", "false")
os.environ.setdefault("REDIS_STREAM_KEY", "signals:live")

async def test_bot_startup():
    """Test bot startup process"""
    print("Testing bot startup...")
    
    try:
        from bot import bot, get_redis_client
        
        print("[SUCCESS] Bot imported successfully")
        print(f"[SUCCESS] Bot intents: {bot.intents}")
        print(f"[SUCCESS] Bot command prefix: {bot.command_prefix}")
        print(f"[SUCCESS] Bot commands: {[cmd.name for cmd in bot.commands]}")
        
        # Test Redis connection
        print("\nTesting Redis connection...")
        client = await get_redis_client()
        pong = await client.ping()
        print(f"[SUCCESS] Redis ping: {pong}")
        
        # Test stream operations
        stream_key = os.getenv("REDIS_STREAM_KEY", "signals:live")
        length = await client.xlen(stream_key)
        print(f"[SUCCESS] Stream length: {length}")
        
        await client.aclose()
        print("[SUCCESS] Redis connection closed")
        
        print("\n[SUCCESS] Bot startup test passed!")
        print("\nBot is ready to run with:")
        print("python scripts/run_bot.py")
        print("\n(Requires DISCORD_BOT_TOKEN environment variable)")
        
        return True
        
    except Exception as e:
        print(f"[ERROR] Bot startup test failed: {e}")
        return False

if __name__ == "__main__":
    asyncio.run(test_bot_startup())
