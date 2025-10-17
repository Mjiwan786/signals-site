#!/usr/bin/env python3
"""
Comprehensive smoke test for the signals bot
"""
import os
import sys
import asyncio
import subprocess
import time
from pathlib import Path

# Add the api directory to the Python path
api_dir = Path(__file__).parent.parent / "api"
sys.path.insert(0, str(api_dir))

def print_header(title):
    """Print a formatted header"""
    print("\n" + "="*60)
    print(f" {title}")
    print("="*60)

def print_step(step, description):
    """Print a formatted step"""
    print(f"\n[STEP {step}] {description}")
    print("-" * 40)

async def test_redis_connection():
    """Test Redis connection"""
    print_step(1, "Testing Redis Connection")
    
    try:
        from test_redis_connection import test_redis_connection
        result = await test_redis_connection()
        if result:
            print("[SUCCESS] Redis connection test passed")
            return True
        else:
            print("[FAILED] Redis connection test failed")
            return False
    except Exception as e:
        print(f"[ERROR] Redis connection test error: {e}")
        return False

def test_environment_setup():
    """Test environment setup"""
    print_step(2, "Testing Environment Setup")
    
    required_vars = [
        "REDIS_URL",
        "REDIS_SSL", 
        "REDIS_CA_CERT_USE_CERTIFI",
        "REDIS_STREAM_KEY"
    ]
    
    missing_vars = []
    for var in required_vars:
        if not os.getenv(var):
            missing_vars.append(var)
    
    if missing_vars:
        print(f"[WARNING] Missing environment variables: {missing_vars}")
        print("Setting default values for testing...")
        
        # Set default values for local testing
        # For production, set REDIS_URL in your environment or .env file
        os.environ.setdefault("REDIS_URL", "redis://localhost:6379")
        os.environ.setdefault("REDIS_SSL", "false")
        os.environ.setdefault("REDIS_CA_CERT_USE_CERTIFI", "false")
        os.environ.setdefault("REDIS_STREAM_KEY", "signals:live")
        print("[SUCCESS] Default environment variables set")
    else:
        print("[SUCCESS] All required environment variables are set")
    
    return True

def test_dependencies():
    """Test if all dependencies are installed"""
    print_step(3, "Testing Dependencies")
    
    required_packages = [
        "discord.py",
        "redis",
        "fastapi",
        "uvicorn",
        "stripe",
        "orjson",
        "certifi"
    ]
    
    missing_packages = []
    for package in required_packages:
        try:
            __import__(package.replace("-", "_"))
            print(f"[SUCCESS] {package} is installed")
        except ImportError:
            missing_packages.append(package)
            print(f"[MISSING] {package} is not installed")
    
    if missing_packages:
        print(f"\n[WARNING] Missing packages: {missing_packages}")
        print("To install missing packages, run:")
        print("pip install -r api/requirements.txt -c api/constraints.txt")
        return False
    
    print("[SUCCESS] All dependencies are installed")
    return True

def test_bot_code():
    """Test if bot code can be imported"""
    print_step(4, "Testing Bot Code Import")
    
    try:
        from bot import bot, get_redis_client
        print("[SUCCESS] Bot code imported successfully")
        print(f"[INFO] Bot intents: {bot.intents}")
        print(f"[INFO] Bot command prefix: {bot.command_prefix}")
        return True
    except Exception as e:
        print(f"[ERROR] Failed to import bot code: {e}")
        return False

async def test_bot_redis_integration():
    """Test bot's Redis integration"""
    print_step(5, "Testing Bot Redis Integration")
    
    try:
        from bot import get_redis_client
        client = await get_redis_client()
        
        # Test ping
        pong = await client.ping()
        print(f"[SUCCESS] Bot Redis ping: {pong}")
        
        # Test stream operations
        stream_key = os.getenv("REDIS_STREAM_KEY", "signals:live")
        length = await client.xlen(stream_key)
        print(f"[SUCCESS] Stream length: {length}")
        
        await client.aclose()
        return True
    except Exception as e:
        print(f"[ERROR] Bot Redis integration failed: {e}")
        return False

def test_discord_bot_token():
    """Test Discord bot token configuration"""
    print_step(6, "Testing Discord Bot Token")
    
    token = os.getenv("DISCORD_BOT_TOKEN")
    if not token:
        print("[WARNING] DISCORD_BOT_TOKEN not set")
        print("To test the bot online, you need to:")
        print("1. Create a Discord application at https://discord.com/developers/applications")
        print("2. Create a bot and get the token")
        print("3. Set DISCORD_BOT_TOKEN in your environment")
        print("4. Invite the bot to your server with appropriate permissions")
        return False
    
    if token == "your_discord_bot_token_here":
        print("[WARNING] DISCORD_BOT_TOKEN is still set to placeholder value")
        print("Please set a real bot token to test the bot online")
        return False
    
    print("[SUCCESS] Discord bot token is configured")
    return True

def test_stripe_configuration():
    """Test Stripe configuration"""
    print_step(7, "Testing Stripe Configuration")
    
    stripe_key = os.getenv("STRIPE_SECRET_KEY")
    if not stripe_key:
        print("[WARNING] STRIPE_SECRET_KEY not set")
        print("To test payment functionality, you need to:")
        print("1. Create a Stripe account at https://stripe.com")
        print("2. Get your secret key from the dashboard")
        print("3. Set STRIPE_SECRET_KEY in your environment")
        return False
    
    if stripe_key.startswith("sk_test_") or stripe_key.startswith("sk_live_"):
        print("[SUCCESS] Stripe secret key is configured")
        return True
    else:
        print("[WARNING] STRIPE_SECRET_KEY doesn't look like a valid Stripe key")
        return False

def print_bot_commands():
    """Print available bot commands"""
    print_step(8, "Available Bot Commands")
    
    commands = [
        ("/ping", "Check if the bot is online and responsive"),
        ("/signals [limit]", "Get latest trading signals (default: 5)"),
        ("/subscribe [plan]", "Subscribe to trading signals (basic/premium/pro)"),
        ("/status", "Check bot and system status")
    ]
    
    for command, description in commands:
        print(f"  {command:<20} - {description}")
    
    print("\n[INFO] To test these commands:")
    print("1. Set DISCORD_BOT_TOKEN in your environment")
    print("2. Run: python scripts/run_bot.py")
    print("3. Invite the bot to your Discord server")
    print("4. Use the slash commands in Discord")

def print_next_steps():
    """Print next steps for complete setup"""
    print_step(9, "Next Steps for Complete Setup")
    
    print("\n1. DISCORD BOT SETUP:")
    print("   - Create Discord application at https://discord.com/developers/applications")
    print("   - Create a bot and copy the token")
    print("   - Set DISCORD_BOT_TOKEN environment variable")
    print("   - Invite bot to server with 'applications.commands' scope")
    
    print("\n2. STRIPE SETUP:")
    print("   - Create Stripe account at https://stripe.com")
    print("   - Get API keys from dashboard")
    print("   - Create products and price IDs for subscription plans")
    print("   - Set STRIPE_SECRET_KEY and price IDs in environment")
    
    print("\n3. RUN THE BOT:")
    print("   - python scripts/run_bot.py")
    print("   - Check Discord for bot online status")
    print("   - Test /ping command")
    
    print("\n4. TEST SIGNALS:")
    print("   - python scripts/publish_test_signal.py")
    print("   - Use /signals command in Discord")

async def main():
    """Main smoke test function"""
    print_header("SIGNALS BOT SMOKE TEST")
    
    tests = [
        ("Environment Setup", test_environment_setup),
        ("Dependencies", test_dependencies),
        ("Bot Code Import", test_bot_code),
        ("Redis Connection", test_redis_connection),
        ("Bot Redis Integration", test_bot_redis_integration),
        ("Discord Bot Token", test_discord_bot_token),
        ("Stripe Configuration", test_stripe_configuration)
    ]
    
    results = []
    for test_name, test_func in tests:
        if asyncio.iscoroutinefunction(test_func):
            result = await test_func()
        else:
            result = test_func()
        results.append((test_name, result))
    
    print_header("TEST RESULTS SUMMARY")
    
    passed = 0
    total = len(results)
    
    for test_name, result in results:
        status = "PASS" if result else "FAIL"
        print(f"  {test_name:<25} - {status}")
        if result:
            passed += 1
    
    print(f"\nOverall: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n[SUCCESS] All tests passed! Bot is ready for deployment.")
    else:
        print(f"\n[WARNING] {total - passed} tests failed. Please address the issues above.")
    
    print_bot_commands()
    print_next_steps()

if __name__ == "__main__":
    asyncio.run(main())

