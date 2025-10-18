# Crypto AI Bot Metrics & Health Inventory

## Overview

This document provides a comprehensive inventory of all health/metrics the crypto AI bot emits, including stream freshness (lag), decision→publish latency p95/p99, and error counts.

## Redis Keys & Streams

### 1. Metrics Streams

#### `metrics:signals:e2e` - End-to-End Signal Latency Metrics
- **Type**: Redis Stream
- **Purpose**: Tracks signal processing latency from decision to publish
- **Publisher**: `monitoring/slo_metrics.py` - `SLOMetricsCollector.record_e2e_latency()`
- **Sample Payload**:
  ```json
  {
    "ts": "1703123456789",     // Timestamp in ms
    "ms": "45",                // Latency in ms
    "agent": "signal_processor", // Agent name
    "stream": "signals:paper",   // Target stream
    "hash": "a1b2c3d4"         // Signal hash for deduplication (optional)
  }
  ```
- **P95/P99 Computation**: Raw samples collected, sorted, then `latencies[int(count * 0.95)]` and `latencies[int(count * 0.99)]`
- **Max Length**: 10,000 entries with `approximate=True`

#### `metrics:md:lag` - Market Data Lag Metrics
- **Type**: Redis Stream  
- **Purpose**: Tracks stream lag (freshness) for market data consumers
- **Publisher**: `monitoring/slo_metrics.py` - `SLOMetricsCollector.record_stream_lag()`
- **Sample Payload**:
  ```json
  {
    "ts": "1703123456789",     // Timestamp in ms
    "lag": "300",              // Lag in ms (now - ts_last_md)
    "stream": "md:trades",     // Stream name
    "consumer": "strategy_consumer" // Consumer name
  }
  ```
- **Lag Computation**: `lag_seconds = (now - ts_last_md)` where `ts_last_md` is timestamp of last processed market data
- **P95/P99 Computation**: Raw samples collected, sorted, then `lag_values[int(len(lag_values) * 0.95)]`
- **Max Length**: 10,000 entries with `approximate=True`

#### `metrics:ticks` - Periodic Metrics Snapshots
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

### 2. Status Keys

#### `bot:up` - Bot Uptime Status
- **Type**: Redis String (with TTL)
- **Purpose**: Bot health status and uptime tracking
- **Publisher**: `monitoring/slo_metrics.py` - `SLOMetricsCollector.set_bot_uptime()`
- **TTL**: 300 seconds (5 minutes)
- **Sample Payload**:
  ```json
  {
    "start_time": "1703123456",
    "last_seen": "1703123456", 
    "status": "running"
  }
  ```

#### `slo:status` - SLO Status Hash
- **Type**: Redis Hash
- **Purpose**: Current SLO status and metrics summary
- **Publisher**: `monitoring/slo_tracker.py` - `SLOTracker._store_slo_status()`
- **Sample Payload**:
  ```json
  {
    "p95_latency_ms": "45.2",
    "stream_lag_p95_sec": "0.3", 
    "uptime_ratio": "0.999",
    "dup_rate": "0.001",
    "window_hours": "72",
    "status": "PASS",
    "timestamp": "1703123456",
    "breaches": "[]",
    "warnings": "[]"
  }
  ```

### 3. Error Streams

#### `kraken:errors` - Exchange Errors
- **Type**: Redis Stream
- **Purpose**: Kraken exchange-specific errors
- **Publisher**: `utils/kraken_ws.py` - KrakenWebSocketClient error handling
- **Configuration**: `config/streams.yaml` and `config/exchange_configs/kraken.yaml`

#### `redis_publish_errors_total` - Redis Publish Error Counter
- **Type**: Prometheus Counter
- **Purpose**: Counts Redis publishing errors by stream
- **Publisher**: `monitoring/metrics_exporter.py` - `inc_redis_publish_error()`
- **Labels**: `["stream"]`
- **Usage**: `agents/core/signal_analyst.py`, `agents/core/signal_processor.py`

## Prometheus Metrics

### Core Metrics
- **`signals_published_total`** - Total signals published (Counter, labels: `["agent", "stream", "symbol"]`)
- **`publish_latency_ms_bucket`** - Publish latency histogram (Histogram, labels: `["agent", "stream"]`, buckets: `[5, 10, 20, 50, 100, 200, 500, 1000, 2000]`)
- **`redis_publish_errors_total`** - Redis publish errors (Counter, labels: `["stream"]`)
- **`bot_heartbeat_seconds`** - Bot heartbeat timestamp (Gauge)
- **`stream_lag_seconds`** - Stream lag in seconds (Gauge, labels: `["stream", "consumer"]`)
- **`bot_uptime_seconds`** - Bot uptime in seconds (Gauge)

### SLO Metrics
- **`ingestor_disconnects_total`** - Ingestor disconnections (Counter, labels: `["source"]`)

## Latency Computation Methods

### P95/P99 Latency Calculation
**Location**: `monitoring/slo_metrics.py` - `get_e2e_latency_summary()`

```python
# Raw samples collected from metrics:signals:e2e stream
latencies.sort()
count = len(latencies)
p50 = latencies[count // 2]
p95 = latencies[int(count * 0.95)]  # P95 calculation
p99 = latencies[int(count * 0.99)]  # P99 calculation
```

### Stream Lag Calculation
**Location**: `monitoring/slo_metrics.py` - `record_stream_lag()`

```python
# Lag computation: now - ts_last_md
lag_seconds = (time.time() - ts_last_md)
lag_ms = int(lag_seconds * 1000)
```

## Error Tracking

### Error Count Sources
1. **Redis Publish Errors**: Tracked via `redis_publish_errors_total` Prometheus counter
2. **Agent Error Counts**: Tracked in `agents/scalper/infra/metrics.py` - `MetricsCollector.error_count`
3. **API Error Counts**: Tracked in `agents/scalper/protections/kill_switches.py` - `api_error_count`
4. **Circuit Breaker Errors**: Tracked in various circuit breaker implementations

### Error Stream JSON Shape
**Kraken Errors** (`kraken:errors`):
```json
{
  "timestamp": "1703123456.789",
  "error_type": "websocket_error|api_error|parse_error",
  "message": "Error description",
  "symbol": "BTC/USD",
  "severity": "warning|error|critical"
}
```

## Production vs Legacy Paths

### Production (Current)
- **Latency Metrics**: `metrics:signals:e2e` stream
- **Lag Metrics**: `metrics:md:lag` stream  
- **Status**: `slo:status` hash
- **Uptime**: `bot:up` string with TTL
- **Prometheus**: `monitoring/metrics_exporter.py`

### Legacy (Deprecated)
- No legacy paths identified - all current implementations are production-ready

## Monitoring Integration

### SLO Status API
- **Endpoint**: `GET /slo/status` (port 9109)
- **Implementation**: `monitoring/slo_status_api.py`
- **Returns**: Current SLO status with individual metric statuses

### Prometheus Endpoint
- **Endpoint**: `http://<host>:9108/metrics`
- **Implementation**: `monitoring/metrics_exporter.py`
- **Port**: Configurable via `METRICS_PORT` env var (default: 9108)

### Grafana Dashboards
- **SLO Overview**: `monitoring/grafana_dashboards/slo_overview.json`
- **Crypto AI Bot**: `monitoring/grafana_dashboards/crypto-ai-bot.json`

## Redis Connection Details

```bash
# Production Redis connection
redis-cli -u redis://default:YOUR_PASSWORD@YOUR_HOST:YOUR_PORT --tls --cacert <path_to_ca_certfile>
```

## Key Files & Functions

### Metrics Production
- `monitoring/slo_metrics.py` - `SLOMetricsCollector.record_e2e_latency()`, `record_stream_lag()`
- `monitoring/metrics_exporter.py` - `observe_publish_latency_ms()`, `observe_stream_lag()`, `inc_redis_publish_error()`
- `agents/core/signal_analyst.py` - Signal publishing with error tracking
- `agents/core/signal_processor.py` - Signal routing with error tracking

### Status Tracking
- `monitoring/slo_tracker.py` - `SLOTracker._compute_and_store_slo_status()`
- `monitoring/bot_uptime.py` - `BotUptimeManager` for uptime tracking

### Error Handling
- `monitoring/metrics_exporter.py` - `inc_redis_publish_error()`
- `utils/kraken_ws.py` - Kraken error stream publishing
- `agents/scalper/infra/metrics.py` - Agent-level error counting

---

*This inventory is based on comprehensive code analysis of the crypto AI bot codebase. All Redis keys, streams, and payload structures are extracted from actual implementation files.*
