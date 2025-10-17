#!/usr/bin/env python3
import os
import asyncio
import logging
from typing import Optional
import discord
from discord.ext import commands
import redis.asyncio as redis
import orjson
import stripe

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Bot configuration
intents = discord.Intents.default()
intents.message_content = True
bot = commands.Bot(command_prefix='!', intents=intents)

# Redis connection
redis_client: Optional[redis.Redis] = None

# Stripe configuration
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

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

@bot.event
async def on_ready():
    logger.info(f'{bot.user} has connected to Discord!')
    logger.info(f'Bot is online in {len(bot.guilds)} guilds')
    
    # Initialize Redis connection
    try:
        await get_redis_client()
        logger.info("Redis connection established")
    except Exception as e:
        logger.error(f"Failed to connect to Redis: {e}")

@bot.event
async def on_command_error(ctx, error):
    if isinstance(error, commands.CommandNotFound):
        return
    logger.error(f"Command error: {error}")
    await ctx.send(f"An error occurred: {str(error)}")

@bot.command(name="ping")
async def ping(ctx):
    """Ping command to test bot responsiveness"""
    latency = round(bot.latency * 1000)
    await ctx.send(f"🏓 Pong! Latency: {latency}ms")

@bot.command(name="signals")
async def signals(ctx, limit: int = 5):
    """Get latest trading signals from Redis stream"""
    try:
        client = await get_redis_client()
        stream_key = os.getenv("REDIS_STREAM_KEY", "signals:live")
        
        # Get latest signals
        messages = await client.xrevrange(stream_key, count=limit)
        
        if not messages:
            await ctx.send("No signals available at the moment.")
            return
        
        embed = discord.Embed(
            title="📊 Latest Trading Signals",
            color=0x00ff00
        )
        
        for entry_id, fields in messages:
            symbol = fields.get("symbol", "N/A")
            side = fields.get("side", "N/A")
            price = fields.get("price", "N/A")
            timestamp = entry_id.split("-")[0]
            
            # Format timestamp
            import datetime
            dt = datetime.datetime.fromtimestamp(int(timestamp) / 1000)
            formatted_time = dt.strftime("%Y-%m-%d %H:%M:%S")
            
            # Color based on side
            color = 0x00ff00 if side.upper() == "BUY" else 0xff0000
            
            embed.add_field(
                name=f"{symbol} - {side}",
                value=f"Price: ${price}\nTime: {formatted_time}",
                inline=False
            )
        
        await ctx.send(embed=embed)
        
    except Exception as e:
        logger.error(f"Error fetching signals: {e}")
        await ctx.send("Error fetching signals. Please try again later.")

@bot.command(name="subscribe")
async def subscribe(ctx, plan: str = "basic"):
    """Subscribe to trading signals with different plans"""
    try:
        # Define available plans
        plans = {
            "basic": {
                "name": "Basic Plan",
                "price": 9.99,
                "description": "Basic trading signals",
                "price_id": os.getenv("STRIPE_BASIC_PRICE_ID", "price_basic")
            },
            "premium": {
                "name": "Premium Plan", 
                "price": 29.99,
                "description": "Premium trading signals with alerts",
                "price_id": os.getenv("STRIPE_PREMIUM_PRICE_ID", "price_premium")
            },
            "pro": {
                "name": "Pro Plan",
                "price": 99.99,
                "description": "Pro trading signals with real-time alerts",
                "price_id": os.getenv("STRIPE_PRO_PRICE_ID", "price_pro")
            }
        }
        
        if plan not in plans:
            await ctx.send(f"Invalid plan. Available plans: {', '.join(plans.keys())}")
            return
        
        selected_plan = plans[plan]
        
        # Create Stripe checkout session
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price': selected_plan['price_id'],
                'quantity': 1,
            }],
            mode='subscription',
            success_url=f"{os.getenv('NEXTAUTH_URL', 'http://localhost:3000')}/dashboard?success=true",
            cancel_url=f"{os.getenv('NEXTAUTH_URL', 'http://localhost:3000')}/dashboard?canceled=true",
            metadata={
                'discord_user_id': str(ctx.author.id),
                'discord_username': str(ctx.author)
            }
        )
        
        embed = discord.Embed(
            title="💳 Subscription",
            description=f"**{selected_plan['name']}** - ${selected_plan['price']}/month\n{selected_plan['description']}",
            color=0x5865f2
        )
        embed.add_field(
            name="Next Steps",
            value=f"Click [here]({checkout_session.url}) to complete your subscription",
            inline=False
        )
        
        await ctx.send(embed=embed)
        
    except Exception as e:
        logger.error(f"Error creating subscription: {e}")
        await ctx.send("Error creating subscription. Please try again later.")

@bot.command(name="status")
async def status(ctx):
    """Check bot and system status"""
    try:
        client = await get_redis_client()
        
        # Test Redis connection
        redis_status = "✅ Connected"
        try:
            await client.ping()
        except Exception:
            redis_status = "❌ Disconnected"
        
        # Get Redis stream info
        stream_key = os.getenv("REDIS_STREAM_KEY", "signals:live")
        stream_length = await client.xlen(stream_key)
        
        embed = discord.Embed(
            title="🤖 Bot Status",
            color=0x00ff00
        )
        embed.add_field(name="Bot Status", value="✅ Online", inline=True)
        embed.add_field(name="Latency", value=f"{round(bot.latency * 1000)}ms", inline=True)
        embed.add_field(name="Redis", value=redis_status, inline=True)
        embed.add_field(name="Signals in Stream", value=str(stream_length), inline=True)
        embed.add_field(name="Guilds", value=str(len(bot.guilds)), inline=True)
        embed.add_field(name="Users", value=str(len(bot.users)), inline=True)
        
        await ctx.send(embed=embed)
        
    except Exception as e:
        logger.error(f"Error checking status: {e}")
        await ctx.send("Error checking status. Please try again later.")

async def main():
    """Main function to run the bot"""
    token = os.getenv("DISCORD_BOT_TOKEN")
    if not token:
        logger.error("DISCORD_BOT_TOKEN not found in environment variables")
        return
    
    try:
        await bot.start(token)
    except Exception as e:
        logger.error(f"Failed to start bot: {e}")

if __name__ == "__main__":
    asyncio.run(main())
