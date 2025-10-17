# Backpressure, Rate Limiting, and Circuit Breaker Inventory

This document inventories all rate-limit, throttling, and circuit-breaker logic in the crypto AI bot system, including the events they emit and Redis keys/streams they write to.

## Rate Limiting Implementations

### 1. Kraken Rate Limiting System
**Location**: `config/exchange_configs/kraken_rate_limits.py`

#### Core Classes:
- **`KrakenRateLimitManager`** (lines 384-548): Central rate limit manager
- **`TokenBucket`** (lines 139-262): Async-safe token bucket implementation
- **`DistributedBucket`** (lines 301-329): Redis-based distributed token bucket
- **`BackoffManager`** (lines 334-361): Adaptive backoff strategies

#### Rate Limit Configurations:
```python
# Default limits per endpoint type (lines 79-111)
PUBLIC_REST: 60 RPM, 1.0 RPS, burst=5, recovery=20s
PRIVATE_REST: 60 RPM, 1.0 RPS, burst=4, recovery=30s  
TRADING_REST: 60 RPM, 1.0 RPS, burst=3, recovery=45s
WEBSOCKET_PUBLIC: 50 RPM, 1.0 RPS, burst=3, recovery=15s
WEBSOCKET_PRIVATE: 45 RPM, 0.8 RPS, burst=3, recovery=20s
HISTORICAL_DATA: 30 RPM, 0.5 RPS, burst=2, recovery=90s
ORDER_MANAGEMENT: 90 RPM, 1.5 RPS, burst=5, recovery=20s
```

#### Redis Keys/Streams:
- **`kraken:rate_limits`** (line 493): Global rate limit status hash
  - Fields: `global`, `buckets`, `circuits`, `ts`
  - TTL: 3600 seconds
- **`rl:{endpoint}:tokens`** (line 317): Distributed token bucket keys
- **`rl:{endpoint}:ts`** (line 317): Timestamp keys for distributed buckets

#### Usage Points:
- **Kraken Gateway**: `agents/scalper/execution/kraken_gateway.py:115`
- **WebSocket Client**: `utils/kraken_ws.py:412-428`
- **Scalper Agent**: `agents/scalper/kraken_scalper_agent.py:396`

### 2. Simple Kraken Rate Limiter
**Location**: `agents/scalper/execution/kraken_gateway.py:745-771`

#### Configuration:
- **Calls per second**: 1.0 (configurable via `rate_limits.calls_per_second`)
- **Burst size**: 2.0 (configurable via `rate_limits.burst_size`)

#### Usage:
- All Kraken API calls in gateway (lines 209, 336, 354, 415, 454)

### 3. Scalping Rate Limits
**Location**: `utils/kraken_ws.py:412-428`

#### Configuration:
- **Max trades per minute**: Configurable via `SCALP_MAX_TRADES_PER_MINUTE` env var
- **Cooldown**: 30 seconds between signals (configurable via `SCALP_COOLDOWN_SECONDS`)

#### Events Emitted:
- Circuit breaker trigger when rate limit exceeded (line 421-425)

## Circuit Breaker Implementations

### 1. Data Pipeline Circuit Breakers
**Location**: `agents/infrastructure/data_pipeline.py:173-226`

#### States:
- **CLOSED**: Normal operation
- **OPEN**: Circuit tripped, blocking requests
- **HALF_OPEN**: Testing if service recovered

#### Configuration:
- **Failure threshold**: 5 consecutive errors (configurable)
- **Timeout**: 60 seconds cooldown (configurable)
- **Max latency**: 200ms (configurable)

#### Circuit Breakers:
- **`ws_connection`** (line 358): WebSocket connection failures
- **`redis_publish`** (line 361): Redis publishing failures

#### Redis Events:
- **`kraken:events`** (line 911): Pipeline events including circuit breaker states
- **Heartbeat events** (line 888): Include circuit breaker status

### 2. Kraken WebSocket Circuit Breaker
**Location**: `utils/kraken_ws.py:110-150`

#### Configuration:
- **Failure threshold**: 3 consecutive errors (configurable)
- **Timeout**: 45 seconds cooldown (configurable)

#### Events:
- Circuit breaker state changes logged
- Scalping rate limit triggers (line 421-425)

### 3. Rate Limit Circuit Breakers
**Location**: `config/exchange_configs/kraken_rate_limits.py:473-486`

#### Configuration:
- **Violation threshold**: 10 violations (configurable via `RATE_LIMIT_CB_VIOLATIONS`)
- **Duration**: 300 seconds (configurable via `RATE_LIMIT_CB_SECONDS`)

#### Redis Events:
- Circuit breaker state published to `kraken:rate_limits` hash

## Throttling and Backpressure

### 1. Alert Cooldown System
**Location**: `monitoring/alert_rules.py:47-58`

#### Configuration:
- **Cooldown period**: 10 minutes (configurable via `ALERT_DEBOUNCE_MIN`)
- **Alert thresholds**:
  - No signals: 15 minutes (configurable via `ALERT_NO_SIGNALS_MIN`)
  - Redis errors: 10 per minute (configurable via `ALERT_REDIS_ERRORS_PER_MIN`)

#### Redis Keys:
- **`_alert_cooldowns`**: In-memory dict tracking alert cooldowns
- **`_redis_error_counts`**: Sliding window of error counts

### 2. Signal Cooldown
**Location**: `agents/core/signal_analyst.py:597-602`

#### Configuration:
- **Cooldown**: 30 seconds between signals (configurable via `SCALP_COOLDOWN_SECONDS`)
- **Default**: 90 seconds in production

### 3. Duplicate Rate Throttling
**Location**: `monitoring/slo_report.py:44-46`

#### Configuration:
- **Max duplicate rate**: 0.1% (0.001) in production
- **Staging threshold**: 0.2% (0.002) for more lenient testing

## Redis Event Streams

### 1. Metrics Streams
- **`metrics:signals:e2e`** (line 66): End-to-end latency metrics
- **`metrics:md:lag`** (line 105): Market data lag metrics
- **`signal_processor:metrics`** (line 1127): Signal processor performance
- **`signal_processor:performance`** (line 1198): Performance metrics

### 2. Event Streams
- **`kraken:events`** (line 911): General pipeline events
- **`events:bus`** (line 895): Flash loan execution events
- **`flash_loans:executions`** (line 910): Flash loan outcomes

### 3. Status Streams
- **`kraken:rate_limits`** (line 493): Rate limiting status hash
- **`kraken:heartbeat`** (line 16): System heartbeat
- **`kraken:errors`** (line 18): Error events

## Configuration Thresholds

### Environment Variables:
- `KRAKEN_RATE_LIMIT_{ENDPOINT}_{RPM|RPS|BURST}`: Override rate limits
- `RATE_LIMIT_CB_VIOLATIONS`: Circuit breaker violation threshold (default: 10)
- `RATE_LIMIT_CB_SECONDS`: Circuit breaker duration (default: 300s)
- `ALERT_DEBOUNCE_MIN`: Alert cooldown period (default: 10min)
- `SCALP_COOLDOWN_SECONDS`: Signal cooldown (default: 90s)
- `MAX_DUP_RATE`: Duplicate rate threshold (default: 0.001)

### YAML Configuration:
- **`config/exchange_configs/kraken.yaml:185`**: `max_order_rate_rps: 1.5`
- **`config/overrides/staging.yaml:67`**: `rate_limit_guard: true`

## Usage Flow Integration

### 1. REST API Calls
- **Kraken Gateway**: All API calls go through `KrakenRateLimiter.acquire()`
- **Rate Guard**: Context manager for rate-limited operations
- **Decorator**: `@rate_limited()` for automatic rate limiting

### 2. WebSocket Operations
- **Connection Management**: Circuit breakers for connection failures
- **Message Processing**: Rate limiting for subscription management
- **Scalping**: Dedicated rate limits for high-frequency operations

### 3. Signal Publishing
- **Signal Processor**: Cooldown between signal generation
- **Redis Publishing**: Circuit breakers for publish failures
- **Metrics Collection**: Throttled metrics publishing

## Gaps and Missing Events

### 1. Missing Backpressure Events
- **Rate limit violations**: No dedicated Redis stream for 429 errors
- **Circuit breaker state changes**: Only logged, not published to streams
- **Throttling events**: No events when requests are throttled

### 2. Missing Metrics
- **Token bucket utilization**: Not exposed as metrics
- **Backoff strategy effectiveness**: No tracking of backoff success rates
- **Circuit breaker recovery time**: No metrics on recovery duration

### 3. Missing Redis Keys
- **Rate limit violation counter**: No persistent counter for violations
- **Circuit breaker history**: No historical state changes
- **Throttling statistics**: No aggregated throttling stats

## Recommendations

### 1. Add Missing Events
```python
# Rate limit violation events
await redis.xadd("events:rate_limits", {
    "type": "violation",
    "endpoint": endpoint_type,
    "timestamp": time.time(),
    "violation_count": count
})

# Circuit breaker state changes
await redis.xadd("events:circuit_breakers", {
    "name": breaker_name,
    "old_state": old_state,
    "new_state": new_state,
    "timestamp": time.time()
})
```

### 2. Add Missing Metrics
```python
# Token bucket utilization
await redis.hset("metrics:rate_limits", {
    "utilization": bucket_utilization,
    "available_tokens": available_tokens,
    "timestamp": time.time()
})
```

### 3. Add Health Checks
```python
# Rate limit health endpoint
@app.get("/health/rate_limits")
async def rate_limit_health():
    return await RateLimitHealth.check()
```

## Monitoring Integration

### 1. Prometheus Metrics
- `rate_limit_violations_total`: Counter for violations
- `circuit_breaker_state`: Gauge for breaker states
- `token_bucket_utilization`: Gauge for bucket utilization

### 2. Grafana Dashboards
- Rate limiting dashboard with token bucket levels
- Circuit breaker state timeline
- Backpressure event frequency

### 3. Alerting Rules
- High violation rate alerts
- Circuit breaker open alerts
- Token bucket exhaustion warnings
