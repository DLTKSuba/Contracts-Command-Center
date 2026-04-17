---
name: Environment / System Switcher
product: cross-product
category: navigation
status: draft
cross-product-candidate: true
created: "2025-02-11"
updated: "2025-02-11"
author: seed-patterns
source-component: ""
---

# Environment / System Switcher

> **Product**: cross-product | **Category**: navigation | **Status**: draft

## Problem Statement

Users may need to switch company, environment, or system (e.g. dev, staging, prod) from the header. The control can be a single dropdown or separate dropdowns; visual options include gradient bar, middle dropdown, or no gradient/color dot. Reference: Harmony Functionality page 7.

## Solution

A Dropdown (or two: company + environment) in the top header. Optional gradient bar or color dot for environment. Options: gradient bar above/below, middle dropdown only, or minimal (no gradient, no dot). Icon and optional Avatar in trigger.

## Anatomy

```
  ──── gradient bar (optional) ────
  [Company ▼] [Environment ▼]   or   [Company • Environment ▼]
  Icon / Avatar in trigger optional
```

### Component Tree

```
Dropdown (company/environment)
├── Trigger — Icon, Avatar (optional), label
└── ListMenu — options
(optional) Gradient bar (top or bottom of header)
```

### Key Elements

| Element | Required | Description |
|---------|----------|-------------|
| Dropdown | Yes | Company and/or environment picker (Harmony 7) |
| Options | Yes | Separate or combined; gradient bar, middle dropdown, or minimal |
| Icon / Avatar | No | In trigger |
| Visual | No | Gradient bar or color dot per option |

## Usage Guidelines

### When to Use

- Multi-tenant or multi-environment (Harmony 7)
- When company or environment switch is in header
- Dev/staging/prod or tenant switch

### When NOT to Use

- Single tenant/environment → No switcher
- Switch in settings only → No header control
- App Switcher only → Use App Switcher pattern

## Implementation

### Component Dependencies

```typescript
import { Dropdown } from '@/components/ui/dropdown';
import { Icon } from '@/components/ui/icon';
import { Avatar } from '@/components/ui/avatar';
// Verify from Harmony docs when available.
```

### Props/Configuration

*Verify against Harmony Dropdown, Icon, Avatar when Harmony root is available.*

| Area | Notes |
|------|--------|
| Options | Gradient bar, middle dropdown, no gradient/no dot (Harmony 7). |
| Data | Company list, environment list; from API or config. |
| Trigger | Current selection; optional gradient/color. |

## Accessibility

- [ ] Dropdown keyboard operable; current value announced.
- [ ] Don't rely on color alone for environment.

## Related Patterns

- **App Switcher** — Product switch; often adjacent.
- **Contextual Toolbar** — Right toolbar; this is header center/left.

## Design Decisions

**Decision**: Header dropdown(s) with optional gradient/avatar. **Rationale**: Harmony Functionality page 7. **Alternatives**: Settings only; single combined dropdown.

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-02-11 | seed-patterns | Initial pattern documentation |

---

## For AI Agents

### Checklist for New Implementation

- [ ] Dropdown(s) for company/environment in header.
- [ ] Optional gradient bar or color; Icon/Avatar in trigger.
- [ ] Update registry if adding new instance.
