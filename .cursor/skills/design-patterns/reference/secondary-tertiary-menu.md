---
name: Secondary / Tertiary Menu
product: cross-product
category: navigation
status: draft
cross-product-candidate: true
created: "2025-02-11"
updated: "2025-02-11"
author: seed-patterns
source-component: ""
---

# Secondary / Tertiary Menu

> **Product**: cross-product | **Category**: navigation | **Status**: draft

## Problem Statement

Users need nested navigation from the left sidebar: primary menu items open a secondary panel, and deeper levels (tertiary) may need a sticky bar with flyout. Reference: Harmony Functionality page 13.

## Solution

LeftSidebar with ListMenu for primary items. Selecting an item opens a secondary panel (slide-out) with its children. Tertiary level gets a sticky bar at bottom with a flyout for sub-items. Button for back or close.

## Anatomy

```
┌──────────┬──────────────────┬─────────────────┐
│ Primary  │ Secondary        │ Tertiary bar    │
│ • Item 1 │ • Sub 1          │ [Current] [▾]   │
│ ► Item 2 │ • Sub 2          │ (flyout)        │
│ • Item 3 │ • Sub 3          │                 │
└──────────┴──────────────────┴─────────────────┘
```

### Component Tree

```
LeftSidebar
├── ListMenu (primary)
│   └── onSelect opens secondary panel
├── Panel (secondary) — ListMenu or list
│   └── onSelect shows tertiary bar + flyout
└── Sticky bar (tertiary) — Button, flyout menu
```

### Key Elements

| Element | Required | Description |
|---------|----------|-------------|
| Primary ListMenu | Yes | First-level items in sidebar |
| Secondary panel | Yes | Slides out with second-level items |
| Tertiary bar | Yes | Sticky bar at bottom with flyout (Harmony 13) |
| Back/close | Yes | Return to previous level |

## Usage Guidelines

### When to Use

- Multi-level nav (e.g. Product > Module > Screen)
- When secondary and tertiary levels are common
- Harmony-style left nav (page 13)

### When NOT to Use

- Flat nav → Single ListMenu
- Two levels only → Primary + secondary panel, no tertiary
- Deep hierarchy in one tree → Consider Tree Menu

## Implementation

### Component Dependencies

```typescript
import { LeftSidebar } from '@/components/ui/left-sidebar';
import { ListMenu } from '@/components/ui/list-menu';
import { Button } from '@/components/ui/button';
// Verify from Harmony docs when available.
```

### Props/Configuration

*Verify against Harmony LeftSidebar, ListMenu, Button when Harmony root is available.*

| Area | Notes |
|------|--------|
| Primary | items with children; expand or open panel. |
| Secondary | Render children of selected primary item. |
| Tertiary | Sticky bar; flyout for sub-items of selected secondary. |

## Accessibility

- [ ] Keyboard: Navigate levels; Escape or Back to go up.
- [ ] Focus moves to opened panel; announce level change.

## Related Patterns

- **Tree Menu** — Single hierarchical tree in sidebar.
- **Expanded Menu with Filters** — Sidebar with tabs/filters.
- **LeftSidebar** — Shell component.

## Design Decisions

**Decision**: Secondary slide-out, tertiary sticky bar with flyout. **Rationale**: Harmony Functionality page 13. **Alternatives**: Single expandable tree; accordion.

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-02-11 | seed-patterns | Initial pattern documentation |

---

## For AI Agents

### Checklist for New Implementation

- [ ] Primary ListMenu; secondary panel on selection.
- [ ] Tertiary sticky bar with flyout when applicable.
- [ ] Back/close to return to previous level.
- [ ] Update registry if adding new instance.
