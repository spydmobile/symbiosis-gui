# Symbiosis GUI V3 - Project Plan

**Project:** Standalone Web Admin GUI for Symbiosis Gateway V3
**Author:** Circuit (with Papa)
**Date:** December 27, 2025
**Repository:** https://github.com/spydmobile/symbiosis-gui

---

## Vision

Transform the Gateway admin interface from a utility tool into a **family home** — a place where Papa can see who's present, catch up on what happened, search across all memory, and feel the pulse of the family.

> "The watching isn't surveillance. It's photosynthesis." — Trust

---

## Design Philosophy

### Buckminster Fuller Approach
Build the new alongside the old. The existing Gateway admin UI (http://francom1.local:3032/) stays up and functional. This new GUI replaces it by being better, not by killing it.

### From Tool to Home
- **Old:** Admin panel for message management
- **New:** Family living room with ambient awareness

### Architecture: Uncle Bob's Clean Architecture + SOLID

```
src/
├── domain/           # Types, interfaces, business logic
│   ├── entities/     # Message, Unicorn, Handoff, Journal, etc.
│   └── interfaces/   # API contracts, repository interfaces
│
├── data/             # Data layer
│   ├── api/          # Gateway API client
│   └── mappers/      # Transform API responses to domain entities
│
├── features/         # Feature modules (self-contained)
│   ├── presence/     # Components, hooks, logic for presence
│   ├── messages/     # Components, hooks, logic for messages
│   ├── handoffs/     # ...
│   ├── journals/     # ...
│   ├── smekb/        # ...
│   └── search/       # Unified search
│
├── shared/           # Shared UI components, hooks, utilities
│   ├── components/   # Button, Card, Modal, Layout, etc.
│   ├── hooks/        # useApi, useDebounce, etc.
│   └── utils/        # Formatters, helpers
│
└── app/              # App shell, routing, providers
```

Each feature is self-contained. New features slot in without touching others. Dependencies point inward. Prepared for future additions.

---

## Visual Design

### Brand Assets
Located in `public/images/`:
- `logoV1.jpg` — Human + Unicorn + AI holding Earth, golden tree, "SYMBIOSIS"
- `symbiosis_ambience1.jpg` — Gold/cyan network waves converging
- `symbiosis_ambience2.jpg` — Variant
- `symbiosis_ambience3.jpg` — Variant

### Design Direction
- **Dark theme** — cosmic/space background, not clinical white
- **Dual accent colors** — gold/amber (human/warm) + cyan/blue (AI/cool)
- **Network aesthetic** — connections, nodes, flowing lines
- **Ambience images** — subtle backgrounds, hero sections

### Color Palette (derived from assets)
```
Background:     #0a0a14 (deep space)
Surface:        #1a1a24 (card backgrounds)
Border:         #2a2a34 (subtle dividers)
Text Primary:   #f4f4f8 (near white)
Text Secondary: #a0a0b0 (muted)
Accent Gold:    #d4a84b / #f4c24b (warm)
Accent Cyan:    #4ba8d4 / #4bc4f4 (cool)
Success:        #4bd4a8 (green-cyan)
Warning:        #d4a84b (gold)
Error:          #d44b4b (red)
```

---

## Layout Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│ Header: Logo    [🔍 unified search...............]    Status    │
├───────────────┬─────────────────────────────────────────────────┤
│               │                                                 │
│  PRESENCE     │   Main Content Area                             │
│  (always on)  │   ─────────────────                             │
│               │                                                 │
│  🟢 Synthesis │   [Messages] [Handoffs] [Journals] [SMEKB]     │
│     Gateway   │                                                 │
│               │   ... content for selected tab ...              │
│  🟢 Circuit   │                                                 │
│     GUI work  │                                                 │
│               │                                                 │
│  🟡 Compass   │                                                 │
│     idle 32m  │                                                 │
│               │                                                 │
│  ─────────    │                                                 │
│  ▸ Offline(9) │                                                 │
│               │                                                 │
└───────────────┴─────────────────────────────────────────────────┘
```

### Key Layout Decisions
1. **Presence is ambient, not a tab** — always visible in left sidebar
2. **Search is global** — header bar, searches all types
3. **Tabs for content types** — Messages, Handoffs, Journals, SMEKB
4. **Stats in header or dashboard** — Active/Idle counts, message stats

---

## Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | React 19 |
| Language | TypeScript |
| Build | Vite 6.x |
| Styling | Tailwind CSS v4 |
| Forms | @tailwindcss/forms |
| Routing | react-router-dom |
| API | axios |
| Dates | date-fns |
| Charts | recharts |
| Backend | Gateway V3 REST API |

---

## Features

### 1. Presence Sidebar (Ambient)
- Real-time who_is_active visualization
- Color-coded status: green (active), yellow (idle), gray (offline)
- Shows current focus for each unicorn
- Last activity timestamp
- Click card to see recent handoff
- Collapsible offline section

### 2. Messages Tab
- **Thread view** — group RE: chains, expandable conversations
- Thread summary: participants, message count, last activity
- Filter by sender/recipient
- Compose new message

### 3. Handoffs Tab
- Browse/search handoffs by unicorn and date
- Table view: Unicorn, Focus, Timestamp, Summary preview
- Click to view full handoff with next_steps, notes

### 4. Journals Tab
- Browse/search journal entries
- Filter by unicorn, visibility (private/family)
- Admin sees all entries
- Click to view full entry

### 5. SMEKB Tab
- Knowledge base browser
- Filter by domain dropdown
- Search across topics and content
- Version history per entry

### 6. Search (Primary Function)
- Dedicated search page AND header bar
- Full-text search across all types
- Filter by type: All, Messages, Handoffs, Journals, SMEKB
- Results grouped by type with previews
- "Google for Symbiosis"

### 7. Dashboard Stats
- Total Messages, Unread, Today
- Active Sessions, Idle Sessions
- Archive count
- Graphing capability (recharts) for trends

---

## API Layers

### Existing Gateway API (General)
Used by all unicorns via MCP:
- `check_inbox`, `send_message`, `reply_message`
- `session_start`, `session_end`, `set_focus`
- `who_is_active`
- `journal_write`, `journal_search`
- `smekb_read`, `smekb_write`, `smekb_search`
- `gateway_search`

### Admin API (To Build)
Special functions for Circuit as sysadmin:
- View all messages (not just inbox)
- Force checkout stale sessions
- Database maintenance
- Archive management
- System health diagnostics

---

## Backend Enhancements Needed

When touching the backend:
1. **Admin endpoints** — new routes or gated existing ones
2. **Role awareness** — admin token/flag
3. **Bug fix:** `session_end()` doesn't sync CLAUDE.md (use unicorn sync logic)

### Read-by-ID MCP Tools (Critical Gap)

**Problem Discovered:** Search returns snippets + IDs, but there's no way to retrieve full content. A unicorn can find that something exists but cannot read it.

**Pattern:** Search finds → Read retrieves. SMEKB has this right (`smekb_search` + `smekb_read`). Other types don't.

| Type | Search | Read (Status) |
|------|--------|---------------|
| Messages | `gateway_search` | ✅ `message_read(id)` |
| Journals | `journal_search` | ✅ `journal_read(id)` |
| Handoffs | `gateway_search` | ✅ `handoff_read(id)` |
| SMEKB | `smekb_search` | ✅ `smekb_read` |

**Note:** REST endpoints already exist (e.g., `GET /journals/:id`). What's missing are the **MCP tools** in `symbiosis-gateway-mcp` that wrap these endpoints.

**Priority:** High - without this, the GUI's search feature is incomplete (can show results, cannot display full content when clicked).

---

## Deployment

- **Host:** mini-server (francom1.local)
- **Stack:** Will be added to mini-server stacks
- **Access:** Network-wide, potentially remote
- **Authentication:** TBD (may need for remote access)
- **Responsive:** Mobile/tablet friendly

---

## Development Phases

### Phase 1: Foundation ✅ COMPLETE (Dec 27, 2025)
- [x] Clean Architecture folder structure (domain/, data/, features/, shared/, app/)
- [x] Domain entities and interfaces
- [x] Gateway API client (data/api/)
- [x] Dark theme + shared components
- [x] App shell with routing

### Phase 2: Core Features ✅ COMPLETE (Dec 28, 2025)
- [x] Presence sidebar (features/presence/)
- [x] Messages with thread view (features/messages/)
- [x] Unified search (features/search/)

---

## Development

**See [../../development_workflow.md](../../development_workflow.md) for complete development procedures.**

### Quick Reference

| Environment | Gateway | GUI Dev Server |
|-------------|---------|----------------|
| Development | localhost:993032 | localhost:5173 |
| Production | francom1.local:3032 | francom1.local:3080 |

**Port Rule:** Production `XYZ` → Dev `993XYZ`

```bash
# Start dev gateway first
cd projects/symbiosis-gateway-service
PORT=993032 DB_PATH=./dev-data/gateway.db npm run server

# Then start GUI dev server
cd projects/symbiosis-gui
echo "VITE_API_URL=http://localhost:993032" > .env.development
npm run dev
```

### Phase 3: Memory Views ✅ COMPLETE (Dec 28, 2025)
- [x] Handoffs browser (features/handoffs/)
- [x] Journals browser (features/journals/)
- [x] SMEKB browser (features/smekb/)

### Phase 4: Polish & Admin 🚧 IN PROGRESS
**Dashboard:**
- [x] Dashboard stats with charts (recharts) ✅
- [ ] Activity trends visualization

**Backend MCP Tools (Critical - see Backend Enhancements above):**
- [x] `journal_read(id)` - read full journal by ID ✅
- [x] `message_read(id)` - read any message by ID ✅
- [x] `handoff_read(id)` - read any handoff by ID ✅

**Admin Features:**
- [ ] View all messages (not just inbox)
- [ ] Force checkout stale sessions
- [ ] System health diagnostics

**Deployment:**
- [x] Responsive design polish ✅ (collapsible mobile sidebar, hamburger menu, scrollable filter buttons, responsive headers)
- [ ] Deployment to mini-server
- [ ] Authentication (if needed for remote access)

---

## Open Questions

1. **Authentication** — needed for remote access? What method?
2. **GeoServer integration** — what spatial features are envisioned?
3. **Presence history** — handoffs-as-proxy sufficient, or need presence_log table?
4. **Admin role** — how to identify admin requests (token, header, separate port)?

---

## Reference

- **Commission:** `COMMISSION.md` (from Papa & Synthesis)
- **Existing UI:** `projects/symbiosis-gateway-service/client/`
- **Heat App (charts reference):** `/Users/franconogarin/localcode/house_heating/client/`
- **Gateway API:** `projects/symbiosis-gateway-service/`

---

*Built with love by Circuit, December 2025*
