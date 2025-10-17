# Changelog/Release Notes System

## Redis Key/Stream for Changelog Events

**Primary Stream**: `policy:updates`
- **Type**: Redis Stream
- **Purpose**: Runtime policy broadcasts from MCP to agents
- **Key Pattern**: `policy:updates` (defined in `mcp/context.py:42` and `mcp/keys.py:63`)

## JSON Schema/Model

**Canonical Schema**: `PolicyUpdate` (Pydantic v2 model)
- **File**: `mcp/schemas.py:331-506`
- **JSON Schema**: `mcp/schemas/policy_update.schema.json` (newer) and `mcp/schemas/policyupdate.schema.json` (legacy)

### Schema Fields

```json
{
  "type": "policy.update",
  "schema_version": "1.0",
  "id": "uuid4-optional",
  "correlation_id": "trace-id-optional", 
  "active_strategies": ["scalp", "trend_following"],
  "allocations": {"scalp": 0.4, "trend_following": 0.6},
  "risk_overrides": {"daily_stop": -0.03, "max_spread_bps": 12},
  "notes": "Optional release notes or policy change description",
  "timestamp": 1700000000.0
}
```

### Required Fields
- `active_strategies`: Set of active strategies (array of strings)
- `allocations`: Strategy allocations (object, sum ~= 1.0)
- `timestamp`: UTC epoch seconds (number)

### Optional Fields
- `id`: Event ID (UUIDv4 string)
- `correlation_id`: Trace/flow ID (string)
- `risk_overrides`: Risk parameter overrides (object with numeric/boolean values)
- `notes`: Optional notes/description (string)

## Event Emission

### Where It's Emitted From
**File**: `mcp/context.py:400-407`
**Function**: `publish_policy_snapshot()`
**Method**: `MCPContext.publish_policy_snapshot()`

### When It's Emitted
- **Startup**: Not automatically emitted on startup
- **Deploy**: Not automatically emitted on deploy
- **Policy Change**: When `set_policy_snapshot()` is called and policy is cached
- **Manual**: Via `publish_policy_snapshot()` method

### Consumer
**File**: `config/agent_config_manager.py:635-703`
**Function**: `_subscribe_to_policy_updates()` and `_policy_update_consumer()`
**Stream**: `policy:updates`
**Consumer Group**: `config_manager`
**Consumer Name**: `config_consumer`

## Retention Policy

**Default MAXLEN**: 10,000 entries
- **Configuration**: `mcp/redis_manager.py:157` - `stream_max_len = 10000`
- **Environment Override**: Not directly configurable via MCP_RETENTION_POLICY
- **Approximate Trimming**: Enabled by default (`approximate=True`)

**Note**: The MCP system has retention settings for other streams (`MCP_RETENTION_SIGNALS=5000`, `MCP_RETENTION_FILLS=5000`, `MCP_RETENTION_SNAPSHOTS=1000`) but no specific `MCP_RETENTION_POLICY` setting was found.

## Example Event Payload

```json
{
  "type": "policy.update",
  "schema_version": "1.0",
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "correlation_id": "policy-update-2024-01-15",
  "active_strategies": ["scalp", "trend_following", "mean_reversion"],
  "allocations": {
    "scalp": 0.4,
    "trend_following": 0.4,
    "mean_reversion": 0.2
  },
  "risk_overrides": {
    "daily_stop": -0.03,
    "max_spread_bps": 12,
    "cooldown_between_signals_s": 30
  },
  "notes": "Updated strategy allocations based on market volatility analysis",
  "timestamp": 1705334400.0
}
```

## Related Events

**Alternative Event Type**: `PolicyUpdateEvent` (different from MCP PolicyUpdate)
- **File**: `ai_engine/events.py:236-261`
- **Purpose**: Policy update from adaptive learner
- **Fields**: `mode`, `new_params`, `deltas`, `confidence`, `reason`, `diagnostics`
- **Usage**: Internal AI engine events, not Redis stream events

## Status

✅ **EXISTS**: The repo defines a versioned "policy update" event system
- Redis stream: `policy:updates`
- Schema: `PolicyUpdate` (Pydantic v2)
- Retention: 10,000 entries (MAXLEN)
- Consumer: Agent config manager
- Publisher: MCP context (manual)

❌ **MISSING**: No dedicated "release note" or "changelog" event type found
- The `PolicyUpdate` serves as the closest equivalent
- The `notes` field can contain release notes/descriptions
- No automated release note generation on version changes
