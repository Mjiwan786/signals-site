# Metrics Publisher Requirements

## Overview

The live dashboard (`/live`) expects the following metrics to be published by the `crypto-ai-bot` engine for real-time monitoring.

---

## 1. Prometheus Metrics (HTTP `/metrics`)

The engine should expose the following Prometheus metrics at the `/metrics` endpoint (accessed by signals-api):

### Kraken WebSocket Metrics

```prometheus
# HELP kraken_ws_latency_p50_ms Kraken WebSocket latency P50 in milliseconds
# TYPE kraken_ws_latency_p50_ms gauge
kraken_ws_latency_p50_ms{pair="BTC-USD"} 12.5

# HELP kraken_ws_latency_p95_ms Kraken WebSocket latency P95 in milliseconds
# TYPE kraken_ws_latency_p95_ms gauge
kraken_ws_latency_p95_ms{pair="BTC-USD"} 28.3

# HELP kraken_ws_latency_p99_ms Kraken WebSocket latency P99 in milliseconds
# TYPE kraken_ws_latency_p99_ms gauge
kraken_ws_latency_p99_ms{pair="BTC-USD"} 45.0
```

### Circuit Breaker Metrics

```prometheus
# HELP circuit_breaker_trips_total Total number of circuit breaker trips
# TYPE circuit_breaker_trips_total counter
circuit_breaker_trips_total 0

# HELP circuit_breaker_state Current circuit breaker state (0=closed, 1=open, 2=half_open)
# TYPE circuit_breaker_state gauge
circuit_breaker_state 0
```

### Connection Metrics

```prometheus
# HELP kraken_ws_reconnects_total Total number of WebSocket reconnections
# TYPE kraken_ws_reconnects_total counter
kraken_ws_reconnects_total 2

# HELP kraken_ws_connection_status WebSocket connection status (0=disconnected, 1=connected)
# TYPE kraken_ws_connection_status gauge
kraken_ws_connection_status 1
```

### Throughput Metrics

```prometheus
# HELP kraken_trades_per_minute Number of trades processed per minute
# TYPE kraken_trades_per_minute gauge
kraken_trades_per_minute 127.5

# HELP kraken_events_processed_total Total events processed from Kraken WebSocket
# TYPE kraken_events_processed_total counter
kraken_events_processed_total{event_type="trade"} 15320
kraken_events_processed_total{event_type="spread"} 8640
kraken_events_processed_total{event_type="ohlc"} 4200
```

---

## 2. SSE Metrics Stream (Optional Enhancement)

For real-time updates without polling, the signals-api can expose an SSE endpoint:

### Endpoint: `GET /sse/metrics`

**Event Name:** `kraken_metrics`

**Event Data (JSON):**

```json
{
  "latency_p50_ms": 12.5,
  "latency_p95_ms": 28.3,
  "latency_p99_ms": 45.0,
  "circuit_breaker_trips": 0,
  "reconnect_count": 2,
  "trades_per_min": 127.5,
  "ws_status": "connected",
  "timestamp": 1699999999999
}
```

**Example SSE Stream:**

```
event: kraken_metrics
data: {"latency_p50_ms":12.5,"latency_p95_ms":28.3,"latency_p99_ms":45.0,"circuit_breaker_trips":0,"reconnect_count":2,"trades_per_min":127.5,"ws_status":"connected","timestamp":1699999999999}

event: heartbeat
data: {"timestamp":1699999999999}
```

---

## 3. Engine Implementation Checklist

### Use Existing Components

✅ **Kraken WS Client** - Already tracks latency metrics
✅ **Circuit Breakers** - Already tracks trips, state
✅ **Config Loaders** - Use YAML configs, don't hardcode

### Publishing Flow

1. **Kraken WS Client** → Publishes latency stats to internal metrics collector
2. **Circuit Breaker** → Publishes trip count, state changes
3. **Metrics Collector** → Aggregates all metrics
4. **Metrics Publisher** → Publishes to:
   - Prometheus endpoint (HTTP `/metrics`)
   - Redis stream (optional: `metrics:kraken`)
5. **Signals-API** → Consumes from Redis or scrapes `/metrics`
6. **SSE Endpoint** → Streams to dashboard (`/sse/metrics`)

### Example: Publishing to Redis

```python
# In your Kraken WS client's latency tracker
async def publish_latency_metrics(self):
    metrics = {
        "latency_p50_ms": self.latency_tracker.p50(),
        "latency_p95_ms": self.latency_tracker.p95(),
        "latency_p99_ms": self.latency_tracker.p99(),
        "circuit_breaker_trips": self.circuit_breaker.trip_count,
        "reconnect_count": self.reconnect_count,
        "trades_per_min": self.trades_per_minute,
        "ws_status": self.connection_status,
        "timestamp": int(time.time() * 1000)
    }

    await self.redis.xadd(
        "metrics:kraken",
        fields=metrics,
        maxlen=1000  # Keep last 1000 entries
    )
```

---

## 4. Dashboard Requirements

The live dashboard (`/live`) expects:

1. **Initial Load:** Fetch from `/metrics` (Prometheus format)
2. **Real-time Updates:** Connect to SSE `/sse/metrics`
3. **Fallback:** If SSE fails, poll `/metrics` every 15s
4. **Circuit Breaker Banner:** Appears when `circuit_breaker_trips` increases in last 60s

### Frontend Components

- **KrakenMetrics.tsx** - Displays latency gauges, CB trips, reconnects, trades/min
- **CircuitBreakerBanner.tsx** - Warning banner when trips increase
- **SystemHealth.tsx** - Overall health status

---

## 5. Configuration Sources

❌ **Don't Hardcode**
✅ **Use Config Loaders**

### Stream Names (from YAML)

```yaml
# config/kraken_streams.yaml
streams:
  - name: trade
    pairs: ["BTC-USD", "ETH-USD"]
  - name: spread
    pairs: ["BTC-USD", "ETH-USD"]
  - name: ohlc
    pairs: ["BTC-USD", "ETH-USD"]
    intervals: [1, 5, 15, 60]
```

### Circuit Breaker Config (from YAML)

```yaml
# config/circuit_breaker.yaml
circuit_breaker:
  max_failures: 5
  timeout_seconds: 60
  half_open_timeout: 30
```

**Access via Config Manager:**

```python
from crypto_ai_bot.config import StreamConfigManager, CircuitBreakerConfig

# Use cached, validated config loaders
stream_config = StreamConfigManager().get_streams()
cb_config = CircuitBreakerConfig().load()
```

---

## 6. Testing

### Verify Prometheus Metrics

```bash
curl https://crypto-signals-api.fly.dev/metrics | grep kraken
```

### Verify SSE Stream

```bash
curl -N https://crypto-signals-api.fly.dev/sse/metrics
```

### Test Circuit Breaker Banner

1. Manually increment `circuit_breaker_trips` in Redis
2. Dashboard should show orange banner within 60s
3. Banner auto-dismisses after 60s

---

## 7. Redis Cloud Connection

**Connection String (TLS):**

```bash
rediss://default:Salam78614%2A%2A%24%24@redis-19818.c9.us-east-1-4.ec2.redns.redis-cloud.com:19818
```

**CA Certificate Path (Engine):**

```
C:\Users\Maith\OneDrive\Desktop\crypto_ai_bot\config\certs\redis_ca.pem
```

**Redis Streams:**

- `signals:paper` - Trading signals
- `signals:live` - Live trading signals
- `metrics:kraken` - Kraken metrics (optional)
- `metrics:system` - System health (optional)

---

## Summary

1. **Engine publishes** Kraken WS metrics to Prometheus `/metrics` endpoint
2. **Signals-API scrapes** metrics and exposes via SSE (`/sse/metrics`)
3. **Dashboard subscribes** to SSE for real-time updates
4. **Circuit breaker banner** shows when trips increase
5. **All streams** configured via YAML (no hardcoding)

**Next Step:** Implement metrics publisher in `crypto-ai-bot` engine using existing Kraken WS stats.
