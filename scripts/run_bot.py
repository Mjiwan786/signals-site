#!/usr/bin/env python3
"""
Run the Discord bot with proper environment setup
"""
import os
import sys
import asyncio
from pathlib import Path

# Add the api directory to the Python path
api_dir = Path(__file__).parent.parent / "api"
sys.path.insert(0, str(api_dir))

# Set up default environment variables for testing
# For production, set REDIS_URL in your environment or .env file
os.environ.setdefault("REDIS_URL", "redis://localhost:6379")
os.environ.setdefault("REDIS_SSL", "false")
os.environ.setdefault("REDIS_CA_CERT_USE_CERTIFI", "false")
os.environ.setdefault("REDIS_STREAM_KEY", "signals:live")

# You'll need to set these in your environment or .env file
# os.environ.setdefault("DISCORD_BOT_TOKEN", "your_bot_token_here")
# os.environ.setdefault("STRIPE_SECRET_KEY", "your_stripe_secret_key_here")

async def main():
    """Main function to run the bot"""
    try:
        from bot import main as bot_main
        await bot_main()
    except ImportError as e:
        print(f"Error importing bot: {e}")
        print("Make sure you have installed the requirements:")
        print("pip install -r api/requirements.txt -c api/constraints.txt")
    except Exception as e:
        print(f"Error running bot: {e}")

if __name__ == "__main__":
    asyncio.run(main())

