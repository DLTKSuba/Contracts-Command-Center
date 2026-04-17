---
name: Notification Center
product: cross-product
category: feedback
status: draft
cross-product-candidate: true
created: "2025-02-11"
updated: "2025-02-11"
author: seed-patterns
source-component: ""
---

# Notification Center

> **Product**: cross-product | **Category**: feedback | **Status**: draft

## Problem Statement

Users need a central place to see notifications: system, workflow, and team. They need tabs, search, read/unread count, "Clear all", and grouped notifications with "Show all" and inline actions. Reference: Harmony Functionality page 26.

## Solution

A ShellPanel on the right with TabStrip (System / Workflow / Team). Search Input; Badge or count for read/unread. "Clear all" button. Categorized notification groups with "Show all" expansion. Inline actions on each notification.

## Anatomy

```
┌──────────────────────────────────┬─────────────────────┐
│ Main content                      │ Notification Center │
│                                   │ [System][Workflow][Team] │
│                                   │ [🔍 Search...]     │
│                                   │ 3 unread [Clear all] │
│                                   │ ─────────────────  │
│                                   │ Group 1 [Show all]  │
│                                   │   • Notification 1  │
│                                   │   • Notification 2  │
└──────────────────────────────────┴─────────────────────┘
```

### Component Tree

```
ShellPanel (right)
├── TabStrip (System, Workflow, Team)
├── Input (search)
├── Badge / count, Button (Clear all)
└── Notification groups
    ├── Group header, "Show all" expansion
    └── Card or list item per notification (inline actions)
```

### Key Elements

| Element | Required | Description |
|---------|----------|-------------|
| ShellPanel | Yes | Right panel (Harmony 26) |
| Tabs | Yes | System, Workflow, Team |
| Search | Yes | Filter notifications |
| Read/unread | Yes | Count and "Clear all" |
| Groups | Yes | Categorized; "Show all" to expand |
| Inline actions | Yes | Per notification (e.g. View, Dismiss) |

## Usage Guidelines

### When to Use

- Global notification center (Harmony 26)
- When notifications are system, workflow, and team
- Need search, clear all, and grouping

### When NOT to Use

- Single toast only → Toast / Notification
- No panel space → Dropdown list from header icon
- One category only → Simpler list

## Implementation

### Component Dependencies

```typescript
import { ShellPanel } from '@/components/ui/shell-panel';
import { TabStrip } from '@/components/ui/tab-strip';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
// Verify from Harmony docs when available.
```

### Props/Configuration

*Verify against Harmony ShellPanel, TabStrip, Input, Badge, Card, Button when Harmony root is available.*

| Area | Notes |
|------|--------|
| Tabs | Filter by System/Workflow/Team. |
| Search | Filter list by text. |
| Clear all | Mark all as read in current tab. |
| Groups | Collapse/expand; "Show all" expands group. |

## Accessibility

- [ ] Panel focus trap; tabs and list keyboard accessible.
- [ ] Unread count announced; new notifications in live region if real-time.

## Related Patterns

- **Toast / Notification** — Transient; Notification Center is persistent.
- **Contextual Notification** — Inline near toolbar.
- **Status Indicator** — Badge/count on bell icon opening this panel.

## Design Decisions

**Decision**: Right panel with tabs, search, clear all, groups. **Rationale**: Harmony Functionality page 26. **Alternatives**: Dropdown only; left panel.

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-02-11 | seed-patterns | Initial pattern documentation |

---

## For AI Agents

### Checklist for New Implementation

- [ ] ShellPanel with System/Workflow/Team tabs, search, Clear all.
- [ ] Grouped notifications with "Show all"; inline actions.
- [ ] Update registry if adding new instance.
