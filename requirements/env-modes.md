# Environment & Safety Controls

This document provides a comprehensive reference for environment variables, safety controls, and configuration keys used by the crypto AI bot system.

## Core Environment Variables

### Primary Environment Control

| Variable | Purpose | Values | Default | Set In | Read In |
|----------|---------|--------|---------|--------|---------|
| `ENVIRONMENT` | Environment identifier | `development`, `staging`, `production` | `staging` | `env.*.template`, `docker-compose.yml` | `scripts/run_staging.py:135`, `monitoring/slo_report.py:68` |
| `MODE` | Trading mode | `PAPER`, `LIVE` | `PAPER` | `docker-compose.yml:16,52` | `scripts/run_execution_agent.py:37`, `scripts/run_staging.py:144` |

### Trading Mode Controls

| Variable | Purpose | Values | Default | Set In | Read In |
|----------|---------|--------|---------|--------|---------|
| `PAPER_TRADING_ENABLED` | Enable/disable paper trading | `true`, `false` | `true` | `env.*.template:12`, `docker-compose.yml:17,53` | `scripts/preflight.py:133`, `scripts/verify_docker_setup.py:66,92` |
| `LIVE_TRADING_CONFIRMATION` | Safety confirmation for live trading | `""` (empty), `"I CONFIRM LIVE TRADING ENABLED"` | `""` | `env.*.template:13`, `docker-compose.yml:18,54` | `config/exchange_configs/kraken.yaml:67`, `agents/scalper/config_loader.py.bak:468` |

## Environment-Specific Defaults

### Development Environment
- **Files**: `compose.env.example:12`, `config/settings.yaml:2`
- **ENVIRONMENT**: `staging` (default)
- **MODE**: `PAPER`
- **PAPER_TRADING_ENABLED**: `true`
- **LIVE_TRADING_CONFIRMATION**: `""` (empty)
- **Signals Stream**: `signals:paper`

### Staging Environment
- **Files**: `env.staging.template:7,12,13`, `docker-compose.yml:15-18`, `config/overrides/staging.yaml:38-40`
- **ENVIRONMENT**: `staging`
- **MODE**: `PAPER`
- **PAPER_TRADING_ENABLED**: `true`
- **LIVE_TRADING_CONFIRMATION**: `""` (empty)
- **Signals Stream**: `signals:staging`

### Production Environment
- **Files**: `env.prod.template:7,12,13`, `docker-compose.yml:51-54`
- **ENVIRONMENT**: `production`
- **MODE**: `LIVE`
- **PAPER_TRADING_ENABLED**: `false`
- **LIVE_TRADING_CONFIRMATION**: `"I CONFIRM LIVE TRADING ENABLED"`
- **Signals Stream**: `signals:live`

## Safety Confirmation Strings

### Exact Values

| Environment | Variable | Value | Purpose |
|-------------|----------|-------|---------|
| Staging | `LIVE_TRADING_CONFIRMATION` | `""` (empty string) | Prevents live trading in staging |
| Production | `LIVE_TRADING_CONFIRMATION` | `"I CONFIRM LIVE TRADING ENABLED"` | Required for live trading activation |

### Legacy/Alternative Values
- **Legacy**: `"I-accept-the-risk"` (found in `agents/scalper/config_loader.py.bak:470`)
- **Current**: `"I CONFIRM LIVE TRADING ENABLED"` (canonical value)

## Configuration Loading Paths

### Environment Variable Loading
- **Primary**: `python-dotenv` via `load_dotenv()` calls
- **Files**: `agents/core/signal_processor.py:28-29`, `utils/kraken_ws.py:22-23`, `scripts/run_staging.py:37,132`
- **Pattern**: `from dotenv import load_dotenv; load_dotenv()`

### YAML Configuration Loading
- **Primary**: `yaml.safe_load()` calls
- **Files**: `agents/core/signal_analyst.py:124,129`, `config/merge_config.py:62`, `config/stream_registry.py:55`
- **Main Config**: `config/settings.yaml` (default)
- **Overrides**: `config/overrides/staging.yaml`, `config/overrides/prod.yaml`

### Pydantic Settings
- **Package**: `pydantic-settings==2.10.1`
- **Usage**: `BaseSettings` classes for configuration validation
- **Files**: `requirements.txt:10`, `pyproject.toml:19`

## Publishing Path Logic

### Stream Selection Logic

The system determines which Redis stream to publish signals to based on the `ENVIRONMENT` variable:

```python
# From signals-site/requirements/streams.md:191-194
# Environment Detection
- ENVIRONMENT=development → signals:paper
- ENVIRONMENT=staging → signals:staging  
- ENVIRONMENT=production → signals:live
```

### Code References

| File | Function/Method | Line | Logic |
|------|-----------------|------|-------|
| `agents/core/signal_analyst.py` | `__init__()` | 105 | `os.getenv("PAPER_REDIS_STREAM", "signals:paper")` |
| `agents/core/signal_processor.py` | `__init__()` | 254 | `os.getenv('STREAM_SIGNALS_PAPER', 'signals:paper')` |
| `mcp/redis_manager.py` | `__init__()` | 205-206 | Stream name mapping based on registry |
| `config/overrides/staging.yaml` | - | 38-40 | Environment-specific stream overrides |

### Stream Mapping

| Environment | Mode | Primary Stream | Execution Stream | Config Source |
|-------------|------|----------------|------------------|---------------|
| Development | PAPER | `signals:paper` | `exec:paper:confirms` | `config/settings.yaml:35` |
| Staging | PAPER | `signals:staging` | `exec:paper:confirms` | `config/overrides/staging.yaml:38` |
| Production | LIVE | `signals:live` | `orders:confirmations` | `config/settings.yaml:36` |

## Safety Gates and Validation

### Live Trading Safety Gates

1. **Environment Check**: Must be `ENVIRONMENT=production`
2. **Mode Check**: Must be `MODE=LIVE`
3. **Confirmation Check**: Must have `LIVE_TRADING_CONFIRMATION="I CONFIRM LIVE TRADING ENABLED"`

### Code References

| File | Function | Line | Validation |
|------|----------|------|------------|
| `agents/scalper/config_loader.py.bak` | `_validate_live_trading()` | 470-474 | Confirmation string validation |
| `config/exchange_configs/kraken.yaml` | - | 67 | `require_live_confirmation: "${LIVE_TRADING_CONFIRMATION:}"` |
| `scripts/run_staging.py` | `validate_environment()` | 135-145 | Environment and mode validation |

### Docker Compose Safety

| Service | Profile | Environment | Mode | Paper Trading | Live Confirmation |
|---------|---------|-------------|------|---------------|-------------------|
| `bot` | staging | `staging` | `PAPER` | `true` | `""` (empty) |
| `bot-prod` | prod | `production` | `LIVE` | `false` | `${LIVE_TRADING_CONFIRMATION:-}` |

## Redis Cloud Connection

### Connection Details
- **URL**: `rediss://default:inwjuBWkh4rAtGnbQkLBuPkHXSmfokn8@redis-19818.c9.us-east-1-4.ec2.redns.redis-cloud.com:19818/0`
- **TLS**: Enabled (`REDIS_SSL=true`)
- **Certificate**: `/app/certs/redis-ca.crt`

### CLI Connection Command
```bash
redis-cli -u redis://default:inwjuBWkh4rAtGnbQkLBuPkHXSmfokn8@redis-19818.c9.us-east-1-4.ec2.redns.redis-cloud.com:19818 --tls --cacert <path_to_ca_certfile>
```

## Configuration File Hierarchy

1. **Environment Variables** (highest priority)
2. **YAML Overrides** (`config/overrides/{environment}.yaml`)
3. **Base Configuration** (`config/settings.yaml`)
4. **Default Values** (hardcoded in code)

## Validation Scripts

### Pre-flight Checks
- **File**: `scripts/preflight.py`
- **Checks**: Environment variables, Redis connection, configuration files
- **Required Vars**: `ENVIRONMENT`, `PAPER_TRADING_ENABLED`, `LIVE_TRADING_CONFIRMATION`

### Docker Setup Verification
- **File**: `scripts/verify_docker_setup.py`
- **Checks**: Docker Compose configuration, environment variable presence
- **Expected Values**: Per-environment validation

### Health Checks
- **File**: `scripts/healthcheck.py`
- **Checks**: Redis connectivity, stream availability, environment validation
- **Stream Validation**: Environment-appropriate stream selection

## Security Notes

- **Never commit** `.env.staging` or `.env.prod` files to version control
- **Use templates** (`env.*.template`) for configuration
- **Validate confirmation strings** before enabling live trading
- **Environment isolation** via Docker profiles (`staging`, `prod`)
- **TLS encryption** required for Redis Cloud connections
