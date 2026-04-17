---
name: App Switcher
product: cross-product
category: navigation
status: draft
cross-product-candidate: true
created: "2025-02-11"
updated: "2025-02-11"
author: seed-patterns
source-component: ""
---

# App Switcher

> **Product**: cross-product | **Category**: navigation | **Status**: draft

## Problem Statement

Users with access to multiple products (e.g. PPM, CP, VP) need to switch between them from a single entry point. The list should be role-based (only products the user can access). Reference: Harmony Functionality page 6.

## Solution

A Dropdown in the top-left of the shell that lists products the user has access to. Uses ListMenu (or menu items) and Icon per product. Selecting an item navigates to that product or launches it.

## Anatomy

```
┌─────────────┐
│ 🏠 Product ▼│  →  [PPM] [CP] [VP] ...
└─────────────┘
```

### Component Tree

```
Dropdown (trigger: product name/icon)
└── ListMenu
    ├── Item (Product A)
    ├── Item (Product B)
    └── ...
```

### Key Elements

| Element | Required | Description |
|---------|----------|-------------|
| Dropdown | Yes | Trigger in top-left (Harmony 6) |
| ListMenu / items | Yes | One per product; role-based |
| Icon | No | Per product or single app icon |
| Navigation | Yes | Select navigates or launches product |

## Usage Guidelines

### When to Use

- Multi-product suite with single sign-on or shared shell
- When users need to switch products from header (Harmony 6)
- Role-based product list

### When NOT to Use

- Single product → No switcher
- Products in separate tabs/windows → Link list or external nav
- No roles → Show all products

## Implementation

### Component Dependencies

```typescript
import { Dropdown } from '@/components/ui/dropdown';
import { ListMenu } from '@/components/ui/list-menu';
import { Icon } from '@/components/ui/icon';
// Verify from Harmony docs when available.
```

### Props/Configuration

*Verify against Harmony Dropdown, ListMenu, Icon when Harmony root is available.*

| Area | Notes |
|------|--------|
| Items | From API or config; filter by user role. |
| Trigger | Current product name/icon. |
| Select | Navigate to product URL or launch. |

## Accessibility

- [ ] Dropdown keyboard operable; list has role="menu" or equivalent.
- [ ] Current product indicated (aria-current or label).

## Related Patterns

- **Environment / System Switcher** — Company/environment picker; often next to App Switcher.
- **Contextual Toolbar** — Right toolbar; App Switcher is left.

## Design Decisions

**Decision**: Top-left Dropdown with role-based list. **Rationale**: Harmony Functionality page 6. **Alternatives**: Sidebar list; separate product launcher page.

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-02-11 | seed-patterns | Initial pattern documentation |

---

## For AI Agents

### Checklist for New Implementation

- [ ] Dropdown in top-left with product list (role-based).
- [ ] ListMenu or menu items; select navigates.
- [ ] Update registry if adding new instance.
