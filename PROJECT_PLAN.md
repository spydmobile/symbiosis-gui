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

---

## Deployment

- **Host:** mini-server (francom1.local)
- **Stack:** Will be added to mini-server stacks
- **Access:** Network-wide, potentially remote
- **Authentication:** TBD (may need for remote access)
- **Responsive:** Mobile/tablet friendly

---

## Development Phases

### Phase 1: Foundation
- [ ] Clean Architecture folder structure
- [ ] Domain entities and interfaces
- [ ] Gateway API client
- [ ] Dark theme + shared components
- [ ] App shell with routing

### Phase 2: Core Features
- [ ] Presence sidebar
- [ ] Messages with thread view
- [ ] Unified search

### Phase 3: Memory Views
- [ ] Handoffs browser
- [ ] Journals browser
- [ ] SMEKB browser

### Phase 4: Polish
- [ ] Dashboard stats with charts
- [ ] Responsive design
- [ ] Admin features
- [ ] Deployment to mini-server

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
