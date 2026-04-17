---
name: Contextual Toolbar
product: cross-product
category: navigation
status: draft
cross-product-candidate: true
created: "2025-02-11"
updated: "2025-02-11"
author: seed-patterns
source-component: ""
---

# Contextual Toolbar

> **Product**: cross-product | **Category**: navigation | **Status**: draft

## Problem Statement

Users need a right-side icon toolbar where items change by context (page or selection): Dela AI, Edit page, Search/Filter, Actions, Related content, Templates, Import, Export, Notifications, Help, Share. Some items are always present: Accessibility, Language, Dark mode. Reference: Harmony Functionality page 19.

## Solution

A RightSidebar (or toolbar strip) with Icon and Button (and Tooltip per item). Contextual items vary by page/selection; static items (Accessibility, Language, Dark mode) always visible. Each icon opens a panel, dialog, or action.

## Anatomy

```
                    │ 🔍 │ ✏️ │ ⋮ │ 📋 │ 📥 │ 🔔 │ ? │ ♿ │ 🌐 │ ◐ │
                    │    │    │   │    │    │    │   │    │    │   │
                    Contextual ─────────────────── Static
```

### Component Tree

```
RightSidebar (icon toolbar)
├── Icon + Button (contextual: Dela AI, Edit, Search, Actions, Related, Templates, Import, Export, Notifications, Help, Share)
└── Icon + Button (static: Accessibility, Language, Dark mode)
Tooltip per icon
```

### Key Elements

| Element | Required | Description |
|---------|----------|-------------|
| RightSidebar / toolbar | Yes | Right-side icon bar (Harmony 19) |
| Contextual items | Yes | Vary by page: Edit, Search, Actions, Templates, Import, Export, Notifications, Help, Share, etc. |
| Static items | Yes | Accessibility, Language, Dark mode |
| Tooltip | Yes | Per icon for label |
| Icon, Button | Yes | Per action |

## Usage Guidelines

### When to Use

- Shell right toolbar (Harmony 19)
- When actions are context-sensitive and some global
- Icon-first compact toolbar

### When NOT to Use

- Left nav → Use LeftSidebar patterns
- Single action → Single button
- No context variation → Simpler toolbar

## Implementation

### Component Dependencies

```typescript
import { RightSidebar } from '@/components/ui/right-sidebar';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Tooltip } from '@/components/ui/tooltip';
// Verify from Harmony docs when available.
```

### Props/Configuration

*Verify against Harmony RightSidebar, Icon, Button, Tooltip when Harmony root is available.*

| Area | Notes |
|------|--------|
| Contextual | Items from route/page/selection (Dela AI, Edit, Search, Actions, Related, Templates, Import, Export, Notifications, Help, Share). |
| Static | Accessibility, Language, Dark mode always. |
| Click | Open panel, dialog, or run action. |

## Accessibility

- [ ] Every icon has Tooltip and accessible name.
- [ ] Keyboard: all buttons focusable; order logical.

## Related Patterns

- **Floating Navigation** — Different purpose (section links).
- **Actions / Related Content Panel** — One of the toolbar actions opens this.
- **Help Panel** — Help icon may open Help Panel.

## Design Decisions

**Decision**: Contextual + static items in right toolbar. **Rationale**: Harmony Functionality page 19. **Alternatives**: All static; dropdown instead of icons.

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-02-11 | seed-patterns | Initial pattern documentation |

---

## For AI Agents

### Checklist for New Implementation

- [ ] Right-side icon toolbar; contextual items by page/selection.
- [ ] Static: Accessibility, Language, Dark mode.
- [ ] Tooltip per icon; wire to panel/dialog/action.
- [ ] Update registry if adding new instance.
