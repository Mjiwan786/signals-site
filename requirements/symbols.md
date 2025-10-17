# Symbol Mappings & Precision Settings

This document inventories internal→exchange symbol mappings and precision/tick settings for the crypto-ai-bot system.

## Symbol Normalization & Mapping

### Canonical Sources

**Primary Configuration**: `config/exchange_configs/kraken.yaml:86-105`
- **Internal delimiter**: `/` (e.g., `BTC/USD`)
- **Stream delimiter**: `-` (e.g., `BTC-USD` for stream rendering)
- **Exchange separator**: `:` (e.g., `kraken:trades:XBTUSD`)

### Symbol Mappings

#### Internal → Kraken (Normalize)
```yaml
# config/exchange_configs/kraken.yaml:88-96
"BTC/USD": "XBTUSD"
"BTC/EUR": "XBTEUR" 
"ETH/USD": "ETHUSD"
"ETH/EUR": "ETHEUR"
"ADA/USD": "ADAUSD"
"SOL/USD": "SOLUSD"
"AVAX/USD": "AVAXUSD"
"LINK/USD": "LINKUSD"
```

#### Kraken → Internal (Denormalize)
```yaml
# config/exchange_configs/kraken.yaml:97-105
"XBTUSD": "BTC/USD"
"XBTEUR": "BTC/EUR"
"ETHUSD": "ETH/USD"
"ETHEUR": "ETH/EUR"
"ADAUSD": "ADA/USD"
"SOLUSD": "SOL/USD"
"AVAXUSD": "AVAX/USD"
"LINKUSD": "LINK/USD"
```

### Code Implementation

**Data Pipeline Normalization**: `agents/infrastructure/data_pipeline.py:233-238`
```python
def normalize_symbol(symbol: str) -> str:
    """Normalize symbol format (BTC/USD style)."""
    symbol = symbol.upper().strip()
    # Additional normalization logic...
```

**Kraken Gateway Mappings**: `agents/scalper/execution/kraken_gateway.py:135-142`
```python
self.pair_mapping = {
    "BTC/USD": "XBTUSD",
    "ETH/USD": "ETHUSD", 
    "SOL/USD": "SOLUSD",
    "ADA/USD": "ADAUSD",
}
self.reverse_pair_mapping = {v: k for k, v in self.pair_mapping.items()}
```

**WebSocket Pair Mappings**: `agents/infrastructure/data_pipeline.py:48-54`
```python
KRAKEN_PAIRS: Dict[str, str] = {
    "BTC/USD": "XBT/USD",  # Note: WebSocket uses "/" delimiter
    "ETH/USD": "ETH/USD",
    "SOL/USD": "SOL/USD", 
    "ADA/USD": "ADA/USD",
}
```

## Precision & Tick Settings

### Canonical Sources

**Primary Precision Configuration**: `config/exchange_configs/kraken.yaml:116-122`
```yaml
precision:
  "XBTUSD": { price_dp: 1, size_dp: 6, tick_size: 0.1, lot_size: 0.000001, min_notional: 5.0 }
  "ETHUSD": { price_dp: 2, size_dp: 5, tick_size: 0.01, lot_size: 0.00001, min_notional: 5.0 }
  "ADAUSD": { price_dp: 4, size_dp: 2, tick_size: 0.0001, lot_size: 0.01, min_notional: 5.0 }
  "SOLUSD": { price_dp: 3, size_dp: 4, tick_size: 0.001, lot_size: 0.0001, min_notional: 5.0 }
  "AVAXUSD": { price_dp: 3, size_dp: 4, tick_size: 0.001, lot_size: 0.0001, min_notional: 5.0 }
  "LINKUSD": { price_dp: 3, size_dp: 3, tick_size: 0.001, lot_size: 0.001, min_notional: 5.0 }
```

**OHLCV Configuration**: `config/exchange_configs/kraken_ohlcv.yaml:80-162`
- Contains additional tick_size definitions for tier-based trading
- Includes min_volume, max_leverage, and spread_tolerance_bps settings

**Scalping Settings**: `config/scalping_settings.yaml:120-191`
```yaml
"BTC/USD":
  price_increment: 0.1
  size_increment: 0.00000001
  min_notional: 5

"ETH/USD": 
  price_increment: 0.05
  size_increment: 0.0000001
  min_notional: 5

"SOL/USD":
  price_increment: 0.001
  size_increment: 0.000001
  min_notional: 5
```

### Precision Definitions

| Field | Description | Source |
|-------|-------------|---------|
| `price_dp` | Price decimal places | `config/exchange_configs/kraken.yaml:117-122` |
| `size_dp` | Size decimal places | `config/exchange_configs/kraken.yaml:117-122` |
| `tick_size` | Minimum price increment | `config/exchange_configs/kraken.yaml:117-122` |
| `lot_size` | Minimum order size | `config/exchange_configs/kraken.yaml:117-122` |
| `min_notional` | Minimum order value (USD) | `config/exchange_configs/kraken.yaml:117-122` |
| `price_increment` | Alternative tick size naming | `config/scalping_settings.yaml:127,158,189` |
| `size_increment` | Alternative lot size naming | `config/scalping_settings.yaml:128,159,190` |

## Exchange-Specific Quirks

### Kraken Quirks

1. **XBT vs BTC**: Kraken uses `XBT` for Bitcoin instead of `BTC`
   - **Source**: `config/exchange_configs/kraken.yaml:89,98`
   - **Mapping**: `BTC/USD` → `XBTUSD`

2. **WebSocket vs REST Delimiters**:
   - **WebSocket**: Uses `/` delimiter (`XBT/USD`)
   - **REST API**: Uses no delimiter (`XBTUSD`)
   - **Source**: `agents/infrastructure/data_pipeline.py:48-54` vs `config/exchange_configs/kraken.yaml:88-96`

3. **Stream Naming Convention**:
   - **Format**: `kraken:{type}:{symbol}`
   - **Example**: `kraken:trades:XBTUSD`
   - **Source**: `config/exchange_configs/kraken.yaml:204-219`

4. **Precision Validation**:
   - System validates precision matches exchange requirements
   - **Source**: `config/exchange_configs/kraken.yaml:442` (validation check: `asset_pairs_precision_matches`)

## Delimiter Conventions

### Internal System
- **Format**: `{BASE}/{QUOTE}` (e.g., `BTC/USD`)
- **Delimiter**: `/`
- **Source**: `config/exchange_configs/kraken.yaml:86`

### Stream Rendering  
- **Format**: `{BASE}-{QUOTE}` (e.g., `BTC-USD`)
- **Delimiter**: `-`
- **Source**: `config/exchange_configs/kraken.yaml:87`

### Redis Stream Keys
- **Format**: `{exchange}:{type}:{symbol}` (e.g., `kraken:trades:XBTUSD`)
- **Separator**: `:`
- **Source**: `config/exchange_configs/kraken.yaml:204-205`

### WebSocket Subscriptions
- **Format**: `{BASE}/{QUOTE}` (e.g., `XBT/USD`)
- **Delimiter**: `/`
- **Source**: `agents/infrastructure/data_pipeline.py:48-54`

## Validation & Quality Checks

### Symbol Map Validation
- **Check**: `symbol_map_is_bijective` 
- **Source**: `config/exchange_configs/kraken.yaml:443`
- **Purpose**: Ensures internal↔exchange mappings are one-to-one

### Precision Validation
- **Check**: `asset_pairs_precision_matches`
- **Source**: `config/exchange_configs/kraken.yaml:442`
- **Purpose**: Validates precision settings match exchange requirements

### Runtime Validation
- **Symbol Pattern**: `^[A-Z0-9]{2,20}/[A-Z0-9]{2,20}$`
- **Source**: `agents/infrastructure/data_pipeline.py:46`
- **Purpose**: Validates internal symbol format

## Inferred Values

The following values are inferred from code analysis and marked as such:

### (inferred) Additional Mappings
- **Source Files**: `agents/scalper/execution/kraken_gateway.py:135-142`
- **Note**: Gateway has subset of full mapping from main config

### (inferred) WebSocket Delimiter Usage
- **Source Files**: `agents/infrastructure/data_pipeline.py:48-54`
- **Note**: WebSocket pairs use `/` delimiter while REST uses no delimiter

### (inferred) Stream Key Construction
- **Source Files**: `config/stream_registry.py:119`
- **Note**: Stream keys follow `{exchange}:{type}:{symbol}` pattern

## Summary

**Canonical Truth Sources**:
1. **Symbol Mappings**: `config/exchange_configs/kraken.yaml:86-105`
2. **Precision Settings**: `config/exchange_configs/kraken.yaml:116-122`
3. **Delimiter Conventions**: `config/exchange_configs/kraken.yaml:86-87,204-205`

**Key Exchange Quirks**:
- Kraken uses `XBT` instead of `BTC`
- WebSocket uses `/` delimiter, REST uses no delimiter
- Stream rendering uses `-` delimiter for display

**Validation Points**:
- Symbol format validation in data pipeline
- Bijective mapping validation in config
- Precision matching validation at startup
