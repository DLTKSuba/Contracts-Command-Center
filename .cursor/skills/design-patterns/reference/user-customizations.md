---
name: User Customizations
product: cross-product
category: navigation
status: draft
cross-product-candidate: true
created: "2025-02-11"
updated: "2025-02-11"
author: seed-patterns
source-component: ""
---

# User Customizations

> **Product**: cross-product | **Category**: navigation | **Status**: draft

## Problem Statement

Users need to add internal menu items to the left menu (if allowed, up to a limit) and add external URLs to the left menu for quick launch in a browser tab. Customizations are managed from a right-hand menu. Reference: Harmony Functionality page 14.

## Solution

LeftSidebar shows standard items plus user-added items (internal links and external URLs). Management is via a menu (e.g. from right toolbar or settings): add internal menu item (from allowed list) or add external URL. ListMenu and Button for add; Icon for edit/remove. Cap at left menu limit.

## Anatomy

```
┌─────────────────────┐     Add from right menu:
│ Standard items      │     • Internal item (from list)
│ • Item 1            │     • External URL
│ • Item 2            │
│ ─────────────────── │     (up to left menu limit)
│ My items            │
│ • Custom internal   │
│ • External link 🌐  │
└─────────────────────┘
```

### Component Tree

```
LeftSidebar
├── ListMenu (standard + custom items)
│   ├── Standard items
│   └── User-added (internal + external URLs)
└── (Add/edit from Button + menu or modal)
```

### Key Elements

| Element | Required | Description |
|---------|----------|-------------|
| LeftSidebar | Yes | Contains standard + custom items (Harmony 14) |
| Add internal | Yes | From allowed list; up to limit |
| Add external | Yes | URL + label; opens in tab |
| Limit | Yes | Max items (left menu limit) |
| Edit/remove | Yes | Per custom item |

## Usage Guidelines

### When to Use

- User-customizable left nav (Harmony 14)
- When internal shortcuts and external links are allowed
- Need to enforce menu item limit

### When NOT to Use

- No customization → Fixed ListMenu
- External only → Single "Links" section
- No limit → Document if unlimited

## Implementation

### Component Dependencies

```typescript
import { LeftSidebar } from '@/components/ui/left-sidebar';
import { ListMenu } from '@/components/ui/list-menu';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
// Verify from Harmony docs when available.
```

### Props/Configuration

*Verify against Harmony LeftSidebar, ListMenu, Button, Icon when Harmony root is available.*

| Area | Notes |
|------|--------|
| Custom items | Stored per user (API or local); merge with standard. |
| Add internal | Modal or dropdown with allowed items; add to list. |
| Add external | Form: URL + label; open in new tab on click. |
| Limit | Enforce when adding; disable add or show message at limit. |

## Accessibility

- [ ] Add/edit controls keyboard accessible; list has clear structure.
- [ ] External links indicate new tab (aria or label).

## Related Patterns

- **Tree Menu** — Left nav structure; custom items may be at bottom.
- **Secondary / Tertiary Menu** — Nested nav; custom can be top-level.
- **Contextual Toolbar** — May host "Customize menu" action.

## Design Decisions

**Decision**: Add internal (from list) + add external URL; cap at limit. **Rationale**: Harmony Functionality page 14. **Alternatives**: No external; no limit.

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-02-11 | seed-patterns | Initial pattern documentation |

---

## For AI Agents

### Checklist for New Implementation

- [ ] LeftSidebar with standard + user-added items.
- [ ] Add internal (from allowed list) and add external URL.
- [ ] Enforce left menu limit; edit/remove per item.
- [ ] Update registry if adding new instance.
