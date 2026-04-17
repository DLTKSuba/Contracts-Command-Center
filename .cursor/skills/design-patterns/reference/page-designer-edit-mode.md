---
name: Page Designer / Edit Mode
product: cross-product
category: layouts
status: draft
cross-product-candidate: true
created: "2025-02-11"
updated: "2025-02-11"
author: seed-patterns
source-component: ""
---

# Page Designer / Edit Mode

> **Product**: cross-product | **Category**: layouts | **Status**: draft

## Problem Statement

Users need to customize a page or dashboard: add widgets, drag-drop, resize, and save as template. Edit mode is an overlay or distinct state; the page uses a column-based layout grid. Reference: Harmony Functionality pages 34-37.

## Solution

ShellPageHeader with Edit mode indicator and actions (e.g. Save as template, Exit edit). Content area shows a column-based layout grid; user can add widgets (from Template Picker), drag to reorder, and resize. Buttons and Icons for add, resize handles, save.

## Anatomy

```
┌─────────────────────────────────────────────────────────────┐
│ ShellPageHeader   [Edit mode] [Save as template] [Exit]      │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────┐ ┌─────────────┐                             │
│ │ Widget 1  ⋮ │ │ Widget 2  ⋮ │  (drag, resize)             │
│ └─────────────┘ └─────────────┘                             │
│ ┌─────────────────────────────┐                             │
│ │ Widget 3                  ⋮ │                             │
│ └─────────────────────────────┘                             │
└─────────────────────────────────────────────────────────────┘
```

### Component Tree

```
ShellPageHeader
├── Title / "Edit mode"
├── Button (Save as template)
├── Button (Exit edit)
└── (optional) Icon (add widget)
Content — column grid
├── Card/Widget (each draggable, resizable)
└── Drop zones / columns
```

### Key Elements

| Element | Required | Description |
|---------|----------|-------------|
| ShellPageHeader | Yes | Edit actions: Save as template, Exit |
| Layout grid | Yes | Column-based; widgets in cells |
| Add widget | Yes | Open Template Picker or inline add |
| Drag/resize | Yes | Reorder and resize widgets |
| Save as template | Yes | Persist layout as template (Harmony 34-37) |

## Usage Guidelines

### When to Use

- Dashboard or page customization (Harmony 34-37)
- When users add, remove, reorder, resize widgets
- Save layout as template for reuse

### When NOT to Use

- Read-only dashboard → No edit mode
- Fixed layout only → No drag/resize
- Single widget → No grid needed

## Implementation

### Component Dependencies

```typescript
import { ShellPageHeader } from '@/components/ui/shell-page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
// Grid layout + drag-drop library or custom; verify from Harmony/docs.
// Verify from Harmony docs when available.
```

### Props/Configuration

*Verify against Harmony ShellPageHeader, Card, Button, Icon when Harmony root is available.*

| Area | Notes |
|------|--------|
| Edit state | isEditMode; toggle from header or route. |
| Grid | Column definitions; widget positions/sizes stored. |
| Drag/resize | Update layout state; persist on "Save as template". |
| Template Picker | Open from Add; on drop add widget to grid. |

## Accessibility

- [ ] Edit mode and actions keyboard accessible; resize handles focusable.
- [ ] Announce enter/exit edit mode; drag-drop keyboard alternative.

## Related Patterns

- **Widget Dashboard** — Dashboard that can enter edit mode.
- **Template Picker** — Source of widgets to add.
- **Card Grid** — Layout variants; edit mode changes layout.

## Design Decisions

**Decision**: Edit mode overlay with grid, drag, resize, save as template. **Rationale**: Harmony Functionality 34-37. **Alternatives**: Inline edit only; no save template.

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-02-11 | seed-patterns | Initial pattern documentation |

---

## For AI Agents

### Checklist for New Implementation

- [ ] ShellPageHeader with Edit, Save as template, Exit.
- [ ] Column grid with draggable/resizable widgets.
- [ ] Add widget (Template Picker); persist layout.
- [ ] Update registry if adding new instance.
