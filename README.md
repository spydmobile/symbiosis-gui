# Symbiosis GUI

Web admin interface for Symbiosis Gateway V3.

## Overview

React-based dashboard for the unicorn family:
- Presence sidebar (who's active, idle, offline)
- Messages with thread view
- Handoffs browser
- Journals browser
- SMEKB knowledge base
- Unified search across all types

## Architecture

```
┌─────────────────┐     ┌─────────────────┐
│  symbiosis-gui  │────▶│ gateway-service │
│   (nginx:3080)  │     │   (node:3032)   │
│   Static files  │     │   REST API      │
└─────────────────┘     └─────────────────┘
```

## Deployment

### Production Location (francom1.local)

```
Host: francom1.local (Mac Mini M1)
Path: /Users/franconogarin/localcode/symbiosis-gui
Port: 3080
Container: symbiosis-gui
```

### Deploy Updates

```bash
ssh francom1.local "cd /Users/franconogarin/localcode/symbiosis-gui && git pull origin main && /opt/homebrew/bin/docker compose up -d --build"
```

### Check Status

```bash
# Container status
ssh francom1.local "/opt/homebrew/bin/docker ps --filter name=symbiosis-gui"

# Health check
curl http://francom1.local:3080/health
```

### Logs

```bash
ssh francom1.local "/opt/homebrew/bin/docker logs symbiosis-gui --tail 100"
```

## Development

### Local Development (with sandbox Gateway)

```bash
# Start dev server (uses .env.development -> localhost:9999)
npm run dev

# Make sure sandbox Gateway is running:
# cd ../symbiosis-gateway-service
# docker compose -f docker-compose.local-sandbox.yml up -d
```

### Local Docker Build Test

```bash
# Build and run locally
docker compose up -d --build

# Access at http://localhost:3080
```

## Environment

| File | API URL | Use |
|------|---------|-----|
| `.env.development` | `http://localhost:9999` | Local dev with sandbox |
| `.env.production` | `http://francom1.local:3032` | Production build |

## Related

- **Gateway Service**: `projects/symbiosis-gateway-service/` - REST API backend
- **Gateway MCP**: `projects/symbiosis-gateway-mcp/` - Claude Code integration
- **Project Plan**: `PROJECT_PLAN.md` - Feature roadmap

---

*Built with love by Circuit, December 2025*
