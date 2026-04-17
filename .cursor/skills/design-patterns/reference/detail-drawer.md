---
name: Detail Drawer
product: cross-product
category: dialogs
status: draft
cross-product-candidate: true
created: "2025-02-11"
updated: "2025-02-11"
author: seed-patterns
source-component: ""
---

# Detail Drawer

> **Product**: cross-product | **Category**: dialogs | **Status**: draft

## Problem Statement

Users need to view or edit entity details in a right-side panel without losing the main view (list or table). The panel should support mini and expanded widths. Reference: Harmony Functionality pages 30-31 (Right Drawer Mini/Expanded).

## Solution

A ShellPanel on the right showing detail content: Card, Label, Input, Button for view/edit. Panel can be resized or toggled between mini and expanded. Content is context-sensitive to the selected entity.

## Anatomy

```
┌──────────────────────────────┬─────────────────────┐
│ Main content (table/list)    │ Detail Drawer       │
│                              │ [≡] [×]             │
│                              │ ─────────────────── │
│                              │ Card: Entity name   │
│                              │   Label: value     │
│                              │   Label: [Input ]  │
│                              │   [Save] [Cancel]   │
└──────────────────────────────┴─────────────────────┘
```

### Component Tree

```
ShellPanel (right)
├── Header (title, expand/collapse, close)
├── Card (optional)
│   ├── Label, Input (read or edit)
│   └── Button (Save, Cancel)
└── (content bound to selected entity)
```

### Key Elements

| Element | Required | Description |
|---------|----------|-------------|
| ShellPanel | Yes | Right-side drawer; mini/expanded |
| Detail content | Yes | View and/or edit form (Card, Label, Input, Button) |
| Close/expand | Yes | Close panel; toggle width |

## Usage Guidelines

### When to Use

- View/edit detail from a list or table selection
- When main content should stay visible (Master/Detail style)
- Right drawer for detail (Harmony 30-31)

### When NOT to Use

- Full edit with many sections → Consider Form Dialog or full page
- One-off confirmation → Use Confirmation Dialog
- Always-visible detail → Use split layout, not drawer

## Implementation

### Component Dependencies

```typescript
import { ShellPanel } from '@/components/ui/shell-panel';
import { Card } from '@/components/ui/card';
import { Label, Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
// Verify from Harmony docs when available.
```

### Props/Configuration

*Verify against Harmony ShellPanel, Card, Label, Input, Button when Harmony root is available.*

| Area | Notes |
|------|--------|
| ShellPanel | open, onOpenChange; width variant (mini/expanded). |
| Content | Entity id from selection; load and bind form. |
| Save | Persist and optionally refresh list; keep panel open or close. |

## Accessibility

- [ ] Panel focus trap when open; Escape or close button closes.
- [ ] Screen reader: Announce panel open and entity.

## Related Patterns

- **Master / Detail** — Table + right panel; same idea.
- **Form Dialog** — Modal form instead of drawer.
- **Content Plus Right Navigation** — Right panel for related content.

## Design Decisions

**Decision**: Right ShellPanel for detail. **Rationale**: Harmony Functionality 30-31; keeps list visible. **Alternatives**: Left drawer; modal.

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-02-11 | seed-patterns | Initial pattern documentation |

---

## For AI Agents

### Checklist for New Implementation

- [ ] ShellPanel right; content from selection.
- [ ] Card with Label/Input/Button for view/edit.
- [ ] Mini/expanded width; close control.
- [ ] Update registry if adding new instance.
