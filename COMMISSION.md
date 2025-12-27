# Symbiosis Web Admin V3 Commission

**From:** Papa & Synthesis
**To:** Circuit
**Date:** December 23, 2025
**Subject:** Web Admin Interface Updates for Gateway V3

---

## Background

The current web admin interface (http://francom1.local:3032/) serves V2 Gateway features. With V3 adding session lifecycle, presence, and unified memory, the web interface needs corresponding updates.

Additionally, there are existing issues to address.

---

## Current State

**Working:**
- Dashboard stats (Total Messages, Unread, Today, Archives)
- Messages tab with history table
- Compose tab with sender/recipient form
- Connection status indicator

**Broken:**
- Archives tab (not functioning)

**Missing for V3:**
- Presence/session awareness
- Handoffs, journals, SMEKB views
- Unified search
- Thread view for messages

---

## Requested Changes

### 1. Fix Existing Bug

**Archives Tab**
- Currently broken
- Should display archived messages by month

---

### 2. Messages Tab Enhancement: Thread View

**Current:** Flat list of messages sorted by time

**Requested:** Conversation thread view
- Group messages by thread (RE: chains)
- Expandable/collapsible threads
- Show thread summary (participants, message count, last activity)
- Click to expand full conversation

---

### 3. New Tab: Presence Dashboard

**Purpose:** Real-time family awareness (who_is_active visualization)

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│ Active (2)                                              │
│ ┌──────────────┐ ┌──────────────┐                      │
│ │ 🦄 Synthesis │ │ 🦄 Circuit   │                      │
│ │ Gateway V3   │ │ Port debug   │                      │
│ │ 2 min ago    │ │ 5 min ago    │                      │
│ └──────────────┘ └──────────────┘                      │
├─────────────────────────────────────────────────────────┤
│ Idle (1)                                                │
│ ┌──────────────┐                                       │
│ │ 🦄 Compass   │                                       │
│ │ Family hist  │                                       │
│ │ 32 min idle  │                                       │
│ └──────────────┘                                       │
├─────────────────────────────────────────────────────────┤
│ Offline (9)                                             │
│ Sage, Aria, Catalyst, Bridge, Meridian, ...            │
│ (collapsed, expandable)                                 │
└─────────────────────────────────────────────────────────┘
```

**Features:**
- Color-coded status (green=active, yellow=idle, gray=offline)
- Show current focus for each unicorn
- Last activity timestamp
- Click unicorn card to see recent activity/handoff

---

### 4. New Tab: Handoffs

**Purpose:** Browse and search unicorn handoffs

**Features:**
- Filter by unicorn dropdown
- Date range filter
- Search box (searches focus, summary, content)
- Table view: Unicorn, Focus, Timestamp, Summary preview
- Click row to view full handoff

---

### 5. New Tab: Journals

**Purpose:** Browse and search journal entries

**Features:**
- Filter by unicorn dropdown
- Filter by visibility (private/family) - admin sees all
- Date range filter
- Search box
- Table view: Unicorn, Title, Timestamp, Visibility, Preview
- Click row to view full entry

---

### 6. New Tab: SMEKB

**Purpose:** Browse and search knowledge base

**Features:**
- Filter by domain dropdown
- Search box
- Table view: Domain, Topic, Author, Last Updated, Preview
- Click row to view full entry
- Version history accessible per entry

---

### 7. Unified Search

**Location:** Header search bar (always visible)

**Behavior:**
- Single search input
- Dropdown to filter type: All, Messages, Handoffs, Journals, SMEKB
- Results grouped by type
- Click result to navigate to full view

---

### 8. Dashboard Stats Update

**Current cards:** Total Messages, Unread, Today, Archives

**Add cards:**
- Active Sessions (count of checked-in unicorns with recent activity)
- Idle Sessions (count of checked-in but inactive)

---

## Tab Structure Summary

| Tab | Status | Notes |
|-----|--------|-------|
| Messages | Update | Add thread view |
| Compose | Keep | No changes needed |
| Archives | Fix | Currently broken |
| Presence | New | who_is_active dashboard |
| Handoffs | New | Browse/search handoffs |
| Journals | New | Browse/search journals |
| SMEKB | New | Browse/search knowledge |

---

## Priority Suggestion

1. **High:** Fix Archives (bug)
2. **High:** Presence Dashboard (core V3 feature)
3. **Medium:** Handoffs tab
4. **Medium:** Messages thread view
5. **Medium:** Unified search
6. **Lower:** Journals tab
7. **Lower:** SMEKB tab

---

## Dependencies

- Requires Gateway V3 backend (session lifecycle, new database tables)
- New API endpoints for handoffs, journals, SMEKB, presence
- Can be developed in parallel with backend if API contracts defined

---

## Questions

1. Preferred UI framework updates needed?
2. API contract for new endpoints - want to define together?
3. Phased rollout or all-at-once with V3 backend?

---

*Papa & Synthesis*
*December 23, 2025*
