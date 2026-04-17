---
name: Bottom Tab Navigation
product: cross-product
category: navigation
status: draft
cross-product-candidate: true
created: "2025-02-11"
updated: "2025-02-11"
author: seed-patterns
source-component: ""
---

# Bottom Tab Navigation

> **Product**: cross-product | **Category**: navigation | **Status**: draft

## Problem Statement

Users need to see open tabs (e.g. documents, pages) and switch between them, with overflow handled by a "More (N)" menu and an Add Tab button. Tab context menu: Open in new window, Close tab, Set as default. Reference: Harmony Functionality pages 32-33.

## Solution

A bottom bar with TabStrip showing open tabs, ListMenu or dropdown for overflow ("More (N)"), and an Add Tab button. Each tab has an ellipsis menu with: Open in new window, Close tab, Set as default. Icon for tab type or close.

## Anatomy

```
┌─────────────────────────────────────────────────────────────┐
│ [Tab 1] [Tab 2] [Tab 3] ... [More (2) ▾] [+ Add Tab]        │
└─────────────────────────────────────────────────────────────┘
Tab ellipsis: Open in new window | Close tab | Set as default
```

### Component Tree

```
Bottom bar
├── TabStrip (visible tabs)
├── Dropdown/ListMenu — "More (N)" overflow
├── Button — Add Tab
└── Per-tab: Icon, label, menu (Open in new window, Close, Set default)
```

### Key Elements

| Element | Required | Description |
|---------|----------|-------------|
| TabStrip | Yes | Renders open tabs |
| Overflow menu | Yes | "More (N)" when tabs don't fit |
| Add Tab | Yes | Button to open new tab |
| Tab menu | Yes | Open in new window, Close tab, Set as default (Harmony 32-33) |

## Usage Guidelines

### When to Use

- Multiple open documents or views (tabs)
- When tab bar is at bottom of shell (Harmony 32-33)
- Need overflow and tab actions (new window, close, default)

### When NOT to Use

- Single view → No tab bar
- Tabs at top only → Use Tabbed Content or top TabStrip
- No "open in new window" → Simpler tab list

## Implementation

### Component Dependencies

```typescript
import { TabStrip } from '@/components/ui/tab-strip';
import { ListMenu } from '@/components/ui/list-menu';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
// Verify from Harmony docs when available.
```

### Props/Configuration

*Verify against Harmony TabStrip, ListMenu, Icon, Button when Harmony root is available.*

| Area | Notes |
|------|--------|
| Tabs | Array of { id, label, href or content }; active tab. |
| Overflow | When tabs.length > N, show "More (N)" with dropdown. |
| Tab menu | Context menu per tab; actions: new window, close, set default. |

## Accessibility

- [ ] Tabs in tablist; arrow keys switch; menu keyboard accessible.
- [ ] "Add Tab" and "More" focusable.

## Related Patterns

- **Tabbed Content** — In-page tabs; not bottom bar.
- **Contextual Toolbar** — Right toolbar; different from tab bar.

## Design Decisions

**Decision**: Bottom bar with tabs, More, Add. **Rationale**: Harmony Functionality 32-33. **Alternatives**: Top tabs; sidebar tab list.

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-02-11 | seed-patterns | Initial pattern documentation |

---

## For AI Agents

### Checklist for New Implementation

- [ ] Bottom TabStrip with overflow "More (N)" and Add Tab.
- [ ] Per-tab menu: Open in new window, Close, Set as default.
- [ ] Update registry if adding new instance.
