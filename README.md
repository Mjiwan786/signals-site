# Signals Site

A minimal crypto signals streaming application with Redis backend and Next.js frontend.

## Quick Start

1. Copy environment variables:
   ```bash
   cp .env.example .env
   ```

2. Update `.env` with your Redis credentials and Discord OAuth settings.

3. Run with Docker:
   ```bash
   docker compose up -d --build
   ```

4. Check health:
   ```bash
   curl http://localhost:8000/healthz
   ```

## Health Checks

- API: `curl http://localhost:8000/healthz`
- Web: Open http://localhost:3000

## Development

### API (Python 3.10)
```bash
pip install -r api/requirements.txt -c api/constraints.txt
uvicorn api.main:app --port 8000
```

### Web (Node 20)
```bash
cd web
npm install
npm run dev
```

### Test Signal
```bash
python scripts/publish_test_signal.py
```

## Architecture

- **API**: FastAPI with Redis Streams
- **Web**: Next.js 14 with Server-Sent Events
- **Auth**: NextAuth.js with Discord provider
- **Streaming**: Redis XREAD with SSE