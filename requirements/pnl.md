# PAPER PnL/Equity Tracking Inventory

## Overview

This document provides a comprehensive inventory of all PAPER trading PnL, equity, and performance tracking in the crypto AI bot system. It covers Redis streams, file storage, and data structures used for tracking trading performance in paper mode.

## Redis Streams & Keys

### 1. Performance Tracking Streams

#### `metrics:ticks` - Periodic Performance Metrics
- **Type**: Redis Stream
- **Purpose**: Periodic metrics snapshots from agents to MCP
- **Publisher**: `orchestrator_package/orchestrators/tools/exec_tools.py` - Metrics publishing
- **Schema**: `mcp/schemas/metrics_tick.schema.json`
- **Sample Payload**:
  ```json
  {
    "type": "metrics.tick",
    "pnl": {
      "fees": 12.75,
      "realized": 150.25,
      "unrealized": -45.5
    },
    "slippage_bps_p50": 2.5,
    "latency_ms_p95": 45.2,
    "win_rate_1h": 0.65,
    "drawdown_daily": -2.1,
    "errors_rate": 0.001,
    "timestamp": 1703123456.789
  }
  ```

#### `metrics:signals:e2e` - End-to-End Signal Latency
- **Type**: Redis Stream
- **Purpose**: Tracks signal processing latency from decision to publish
- **Publisher**: `monitoring/slo_metrics.py` - `SLOMetricsCollector.record_e2e_latency()`
- **Sample Payload**:
  ```json
  {
    "ts": "1703123456789",
    "ms": "45",
    "agent": "signal_processor",
    "stream": "signals:paper",
    "hash": "a1b2c3d4"
  }
  ```

### 2. Paper Trading Streams

#### `exec:paper:confirms` - Paper Trading Confirmations
- **Type**: Redis Stream
- **Purpose**: Paper trading execution confirmations (staging)
- **Publisher**: `scripts/run_execution_agent.py` - Paper mode execution
- **Sample Payload**:
  ```json
  {
    "order_id": "paper_1703123456789",
    "symbol": "BTC/USD",
    "side": "buy",
    "strategy": "trend_following",
    "status": "filled",
    "price": "0.00",
    "quantity": "0.00",
    "timestamp": "1703123456789",
    "paper_mode": "true",
    "execution_time_ms": "1.0"
  }
  ```

#### `signals:paper` - Paper Trading Signals
- **Type**: Redis Stream
- **Purpose**: Paper trading signals (default for development/staging)
- **Publisher**: `agents/core/signal_analyst.py` - SignalAnalyst.publish_signal()
- **Configuration**: `config/settings.yaml:35`

### 3. Market Data Streams

#### `kraken:trades:{symbol}` - Trade Executions
- **Type**: Redis Stream
- **Purpose**: Trade executions from Kraken exchange
- **Publisher**: `utils/kraken_ws.py` - KrakenWebSocketClient
- **Configuration**: `config/streams.yaml:8`
- **Sample Payload**:
  ```json
  {
    "channel": "trade",
    "pair": "BTC/USD",
    "trades": "[{\"price\":\"50000.0\",\"volume\":\"0.001\",\"time\":\"1703123456.789\",\"side\":\"buy\",\"orderType\":\"market\"}]",
    "timestamp": "1703123456.789",
    "shard": "BTC-USD",
    "batch_size": "1",
    "redis_optimized": "true"
  }
  ```

#### `md:trades` - Market Data Trades
- **Type**: Redis Stream
- **Purpose**: Processed trade data for strategies
- **Publisher**: `agents/infrastructure/data_pipeline.py`
- **Configuration**: `config/settings.yaml:33`

## File Storage

### 1. Backtest Results

#### CSV Files
- **Location**: `reports/{backtest_name}/`
- **Files**:
  - `equity_curve.csv` - Equity curve over time
  - `trades.csv` - Individual trade records
  - `signals.csv` - Signal records
  - `results.json` - Performance metrics summary

#### Sample Equity Curve (CSV)
```csv
datetime,equity,cash
2025-05-24 12:00:00+00:00,10000.0,10000.0
2025-05-24 16:00:00+00:00,10000.0,10000.0
2025-05-24 20:00:00+00:00,10000.0,10000.0
2025-05-25 00:00:00+00:00,10000.0,10000.0
2025-05-25 04:00:00+00:00,10000.0,10000.0
```

#### Sample Trades (CSV)
```csv
symbol,side,qty,price,fee,strategy,cost,proceeds
BTC/EUR,buy,0.006540804138365035,91731.84019999999,1.5599999999999998,trend_following,601.56,
BTC/USD,buy,0.0055268541719740594,108560.85239999999,1.5599999999999998,trend_following,601.56,
ETH/USD,buy,0.23964521005941128,2503.7011999999995,1.5599999999999998,trend_following,601.56,
BTC/USD,sell,0.0055268541719740594,107013.17970000001,1.5377602205710024,trend_following,,589.9084784605838
```

#### Sample Results (JSON)
```json
{
  "total_return": 0.39,
  "sharpe_ratio": 0.011,
  "max_drawdown": -1.41,
  "final_equity": 10038.55,
  "start_value": 10000.0,
  "volatility": 4.02,
  "total_trades": 51,
  "total_signals": 51,
  "signal_to_trade_ratio": 1.0,
  "win_rate": 28.0
}
```

### 2. Log Files

#### Execution Logs
- **Location**: `logs/execution_paper.log`
- **Purpose**: Paper trading execution logs
- **Sample**:
  ```
  2025-09-30 07:55:11,598 - execution_agent - INFO - ✅ Execution agent ready (PAPER mode - no live orders)
  2025-09-30 07:55:11,737 - execution_agent - INFO - Publishing confirmations to exec:paper:confirms
  ```

## Data Structures & Classes

### 1. Performance Tracking

#### `utils/performance.py` - PerformanceTracker
- **Purpose**: Comprehensive performance tracking for trading agents
- **Fields**:
  - `pnl_usd` - PnL in USD
  - `pnl_bps` - PnL in basis points
  - `fees_usd` - Trading fees
  - `slippage_bps` - Slippage in basis points
  - `hold_time_seconds` - Trade duration
  - `strategy` - Strategy name
  - `confidence` - Signal confidence
  - `close_reason` - Trade close reason

#### `agents/scalper/monitoring/performance.py` - PerformanceMonitor
- **Purpose**: Centralized performance and execution-quality monitor
- **Fields**:
  - `gross_pnl_total` - Total gross PnL
  - `net_pnl_total` - Total net PnL
  - `fees_total` - Total fees
  - `max_equity` - Peak equity
  - `min_equity` - Trough equity
  - `max_drawdown` - Maximum drawdown (negative fraction)
  - `equity_curve` - Rolling equity curve data

### 2. Backtest Engine

#### `agents/scalper/backtest/engine.py` - BacktestEngine
- **Purpose**: Production-grade backtesting engine
- **Fields**:
  - `equity` - Current equity
  - `cash` - Available cash
  - `unrealized_pnl` - Unrealized PnL
  - `peak_equity` - Peak equity for drawdown calculation
  - `max_drawdown` - Maximum drawdown
  - `daily_pnl` - Daily PnL tracking
  - `equity_curve` - Equity curve points

## Redis Connection Details

### Connection String
```bash
redis-cli -u redis://default:inwjuBWkh4rAtGnbQkLBuPkHXSmfokn8@redis-19818.c9.us-east-1-4.ec2.redns.redis-cloud.com:19818 --tls --cacert <path_to_ca_certfile>
```

### Key Patterns
- `metrics:*` - Performance metrics streams
- `signals:paper` - Paper trading signals
- `exec:paper:*` - Paper trading confirmations
- `kraken:trades:*` - Exchange trade data
- `md:*` - Market data streams

## Field Mappings

### PnL Fields
- `pnl_usd` - PnL in USD
- `pnl_bps` - PnL in basis points
- `realized` - Realized PnL
- `unrealized` - Unrealized PnL
- `gross_pnl_total` - Total gross PnL
- `net_pnl_total` - Total net PnL

### R-Multiple Fields
- `return_bps` - Return in basis points
- `total_return` - Total return percentage
- `sharpe_ratio` - Risk-adjusted return

### Win Rate Fields
- `win_rate` - Overall win rate
- `win_rate_1h` - 1-hour win rate
- `winning_trades` - Count of winning trades
- `total_trades` - Total trade count

### Drawdown Fields
- `max_drawdown` - Maximum drawdown
- `drawdown_daily` - Daily drawdown
- `current_drawdown` - Current drawdown from peak

## Sample Data (3-5 Rows)

### Redis Stream Sample
```json
{
  "ts": "1703123456789",
  "ms": "45",
  "agent": "signal_processor",
  "stream": "signals:paper",
  "hash": "a1b2c3d4"
}
```

### CSV Trade Sample
```csv
symbol,side,qty,price,fee,strategy,cost,proceeds
BTC/EUR,buy,0.006540804138365035,91731.84019999999,1.5599999999999998,trend_following,601.56,
BTC/USD,buy,0.0055268541719740594,108560.85239999999,1.5599999999999998,trend_following,601.56,
ETH/USD,buy,0.23964521005941128,2503.7011999999995,1.5599999999999998,trend_following,601.56,
BTC/USD,sell,0.0055268541719740594,107013.17970000001,1.5377602205710024,trend_following,,589.9084784605838
ETH/USD,sell,0.23964521005941128,2421.75582,1.5089416737109045,trend_following,,578.8532405227909
```

### JSON Results Sample
```json
{
  "total_return": 0.39,
  "sharpe_ratio": 0.011,
  "max_drawdown": -1.41,
  "final_equity": 10038.55,
  "win_rate": 28.0
}
```

## Source Files

### Core Tracking Files
- `utils/performance.py` - PerformanceTracker class
- `agents/scalper/monitoring/performance.py` - PerformanceMonitor class
- `agents/scalper/backtest/engine.py` - BacktestEngine class
- `scripts/run_execution_agent.py` - Paper trading execution
- `monitoring/slo_metrics.py` - SLO metrics collection

### Configuration Files
- `config/settings.yaml` - Stream configuration
- `config/streams.yaml` - Stream naming
- `mcp/schemas/metrics_tick.schema.json` - Metrics schema

### Report Directories
- `reports/comprehensive_backtest/` - Comprehensive backtest results
- `reports/final_optimized_backtest/` - Optimized backtest results
- `reports/ultimate_aggressive_backtest/` - Aggressive backtest results
- `logs/execution_paper.log` - Paper trading logs
