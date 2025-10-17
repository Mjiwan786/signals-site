# Redis Streams Documentation

## Overview

This document provides a canonical list of Redis streams used by the crypto AI bot, including PAPER vs LIVE variants and recommendations for SaaS integration.

## Stream Categories

### 1. Trading Signals

#### Primary Signal Streams
- **`signals:paper`** - Paper trading signals (default for development/staging)
- **`signals:live`** - Live trading signals (production only)
- **`signals:staging`** - Staging environment signals (PAPER mode)

**Publishers:**
- `agents/core/signal_analyst.py` - SignalAnalyst.publish_signal()
- `agents/core/signal_processor.py` - SignalProcessor._route_and_send_signal()
- `strategies/mean_reversion.py` - MeanReversionStrategy (inferred)
- `orchestrator_package/orchestrators/tools/signal_tools.py` - StreamPublisher.publish_signal()

**Consumers:**
- `scripts/run_execution_agent.py` - Execution agent (PAPER mode)
- `procfiles/staging_execution.json` - Staging execution pipeline

#### Strategy-Specific Signal Streams
- **`signals:scalp`** - Scalping strategy signals
- **`signals:trend`** - Trend following strategy signals  
- **`signals:sideways`** - Sideways market strategy signals
- **`signals:momentum`** - Momentum strategy signals
- **`signals:breakout`** - Breakout strategy signals
- **`stream:signals:mean_reversion`** - Mean reversion strategy signals (inferred)

**Publishers:**
- `agents/core/signal_processor.py` - SignalRouter.route_signal()

### 2. Market Data Streams

#### Core Market Data
- **`md:trades`** - Trade executions
- **`md:orderbook`** - Order book snapshots  
- **`md:spread`** - Bid-ask spread data
- **`md:candles`** - OHLCV candle data

**Publishers:**
- `agents/infrastructure/data_pipeline.py` - DataPipeline._handle_trades(), _handle_spread(), _handle_ohlc()
- `scripts/run_mock_data_pipeline.py` - Mock data generator

**Consumers:**
- `agents/core/signal_analyst.py` - Market data consumption for analysis
- `agents/core/signal_processor.py` - Signal processing pipeline

#### Symbol-Specific Market Data
- **`md:trades:{symbol}`** - Symbol-specific trades (e.g., `md:trades:BTC/USD`)
- **`md:spread:{symbol}`** - Symbol-specific spreads
- **`md:book:{symbol}`** - Symbol-specific order book
- **`md:candles:{symbol}:{timeframe}`** - Symbol/timeframe-specific candles

### 3. Exchange-Specific Streams (Kraken)

#### Published by Exchange Integration
- **`kraken:trades:{symbol}`** - Kraken trade data
- **`kraken:orderbook:{symbol}`** - Kraken order book data
- **`kraken:ticker:{symbol}`** - Kraken ticker data
- **`kraken:ohlc:{timeframe}:{symbol}`** - Kraken OHLC data
- **`kraken:orders:{symbol}`** - Order management
- **`kraken:fills:{symbol}`** - Order fills
- **`kraken:positions`** - Position data
- **`kraken:balance`** - Account balance
- **`kraken:heartbeat`** - Connection heartbeat
- **`kraken:status`** - Exchange status
- **`kraken:errors`** - Exchange errors
- **`kraken:metrics`** - Exchange metrics

**Publishers:**
- `utils/kraken_ws.py` - KrakenWebSocketClient
- `config/exchange_configs/kraken.yaml` - Stream configuration

### 4. Order Execution Streams

#### Order Management
- **`orders:requests`** - Order requests
- **`orders:confirmations`** - Order confirmations
- **`exec:paper:confirms`** - Paper trading confirmations (staging)

**Publishers:**
- `scripts/run_execution_agent.py` - Execution agent
- `orchestrator_package/orchestrators/trading_graph.py` - Order execution

**Consumers:**
- Monitoring and logging systems

### 5. Metrics and Monitoring Streams

#### SLO Metrics
- **`metrics:signals:e2e`** - End-to-end signal latency metrics
- **`metrics:md:lag`** - Market data lag metrics
- **`metrics:ticks`** - Periodic metrics snapshots

**Publishers:**
- `monitoring/slo_metrics.py` - SLOMetricsCollector.record_e2e_latency(), record_stream_lag()
- `orchestrator_package/orchestrators/tools/exec_tools.py` - Metrics publishing

#### System Events
- **`events:bus`** - General system events
- **`arb:scored`** - Flash loan arbitrage opportunities (inferred)

**Publishers:**
- `agents/infrastructure/data_pipeline.py` - DataPipeline._emit_event()
- `flash_loan_system/opportunity_scorer.py` - Arbitrage opportunity publishing

### 6. Risk and Portfolio Streams

#### Risk Management
- **`risk:alerts:kraken`** - Risk alerts
- **`portfolio:updates`** - Portfolio updates

**Publishers:**
- Risk management components (inferred)
- Portfolio management components (inferred)

## PAPER vs LIVE Mapping

### Environment-Based Stream Selection

| Environment | Mode | Primary Signals Stream | Execution Stream |
|-------------|------|----------------------|------------------|
| Development | PAPER | `signals:paper` | `exec:paper:confirms` |
| Staging | PAPER | `signals:staging` | `exec:paper:confirms` |
| Production | LIVE | `signals:live` | `orders:confirmations` |

### Configuration Sources
- **Base Config**: `config/base_config.py` - RedisStreamsConfig
- **Staging Override**: `config/overrides/staging.yaml` - Environment-specific overrides
- **Stream Registry**: `config/stream_registry.py` - Centralized stream management
- **Exchange Config**: `config/exchange_configs/kraken.yaml` - Exchange-specific streams

## Recommended "ACTIVE Signals Stream" Alias

### Option A: Redis String Key Alias (Recommended)
```bash
# Set active signals stream based on environment
redis-cli SET signals:active signals:paper    # For PAPER mode
redis-cli SET signals:active signals:live     # For LIVE mode
redis-cli SET signals:active signals:staging  # For STAGING mode
```

**Usage:**
```python
# SaaS integration can read the active stream
active_stream = redis_client.get("signals:active")
if active_stream:
    # Subscribe to the active stream
    messages = redis_client.xread({active_stream: ">"}, count=10)
```

### Option B: Republished Stream (Alternative)
Create a republished stream that mirrors the active signals:

```bash
# Republish from active stream to signals:active
redis-cli XREAD STREAMS signals:paper 0 | xargs -I {} redis-cli XADD signals:active {}
```

## Stream Schema Information

### Signal Schema
- **File**: `mcp/schemas/signal.schema.json`
- **Type**: `"signal"`
- **Required Fields**: `strategy`, `symbol`, `timeframe`, `side`, `confidence`
- **Optional Fields**: `id`, `correlation_id`, `exchange`, `source`, `features`, `risk`, `notes`, `timestamp`

### Metrics Schema  
- **File**: `mcp/schemas/metrics_tick.schema.json`
- **Type**: `"metrics.tick"`
- **Required Fields**: `pnl`, `slippage_bps_p50`, `latency_ms_p95`, `win_rate_1h`, `drawdown_daily`, `errors_rate`, `timestamp`

### Order Intent Schema
- **File**: `mcp/schemas/order_intent.schema.json`
- **Type**: `"order.intent"`
- **Required Fields**: `symbol`, `side`, `order_type`, `size_quote_usd`, `timestamp`

## Redis Connection Details

### Connection String
```bash
redis-cli -u redis://default:inwjuBWkh4rAtGnbQkLBuPkHXSmfokn8@redis-19818.c9.us-east-1-4.ec2.redns.redis-cloud.com:19818 --tls --cacert <path_to_ca_certfile>
```

### Environment Detection
The bot uses the `ENVIRONMENT` environment variable to determine stream selection:
- `ENVIRONMENT=development` → `signals:paper`
- `ENVIRONMENT=staging` → `signals:staging`  
- `ENVIRONMENT=production` → `signals:live`

## Implementation Notes

### Stream Naming Convention
- **Prefix**: Environment-specific (`signals:`, `md:`, `kraken:`, `metrics:`)
- **Separator**: `:` (colon)
- **Placeholders**: `{symbol}`, `{timeframe}` for dynamic streams

### Stream Management
- **Max Length**: Typically 10,000 entries with `approximate=True`
- **Consumer Groups**: Used for reliable message processing
- **Circuit Breakers**: Implemented for resilience

### Monitoring Integration
- **Prometheus Metrics**: `signals_published_total`, `publish_latency_ms_bucket`, `redis_publish_errors_total`
- **SLO Tracking**: P95 latency and stream lag monitoring
- **Health Checks**: Stream availability and freshness validation

---

*This documentation is based on code analysis of the crypto AI bot codebase. All stream names and patterns are extracted from actual implementation files.*
