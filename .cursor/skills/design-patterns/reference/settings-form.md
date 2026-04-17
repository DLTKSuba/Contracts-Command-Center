---
name: Settings Form
product: cross-product
category: forms
status: draft
cross-product-candidate: true
created: "2025-02-11"
updated: "2025-02-11"
author: seed-patterns
source-component: ""
---

# Settings Form

> **Product**: cross-product | **Category**: forms | **Status**: draft

## Problem Statement

Users need to view and change application or entity settings in grouped sections (e.g. General, Notifications, Security). Changes should be saveable or cancelable with clear Save/Cancel actions.

## Solution

A page with ShellPageHeader and grouped form sections inside Cards. Each section uses Label, Input, Toggle, Checkbox, and related controls. Footer or header has Save and Cancel buttons.

## Anatomy

```
┌─────────────────────────────────────────────────────────────┐
│ ShellPageHeader   [Save] [Cancel]                            │
├─────────────────────────────────────────────────────────────┤
│ Card: General                                                │
│   Label: [Input                    ]                         │
│   Label: [Toggle]                                            │
├─────────────────────────────────────────────────────────────┤
│ Card: Notifications                                         │
│   Label: [Checkbox] Email alerts                            │
│   Label: [Input                    ]                         │
└─────────────────────────────────────────────────────────────┘
```

### Component Tree

```
ShellPageHeader
├── Title
└── Button (Save), Button (Cancel)
Card (per section)
├── Section title
├── Label, Input | Toggle | Checkbox
└── ...
```

### Key Elements

| Element | Required | Description |
|---------|----------|-------------|
| ShellPageHeader | Yes | Title and Save/Cancel |
| Card (sections) | Yes | Group related settings |
| Label + controls | Yes | Input, Toggle, Checkbox as needed |
| Save/Cancel | Yes | Explicit commit or discard |

## Usage Guidelines

### When to Use

- App or account settings
- Entity configuration (project settings, profile)
- Grouped preferences with save/cancel

### When NOT to Use

- Single field → Inline edit or single control
- Multi-step flow → Use Wizard or Stepper
- No persistence → Use filters or view options only

## Implementation

### Component Dependencies

```typescript
import { ShellPageHeader } from '@/components/ui/shell-page-header';
import { Card } from '@/components/ui/card';
import { Label, Input, Toggle, Checkbox } from '@/components/ui/...';
import { Button } from '@/components/ui/button';
// Verify from Harmony docs when available.
```

### Props/Configuration

*Verify against Harmony ShellPageHeader, Card, Label, Input, Toggle, Checkbox, Button when Harmony root is available.*

| Area | Notes |
|------|--------|
| Form state | Controlled inputs; dirty state for Save enable/disable. |
| Save | Validate, submit, then show Toast or redirect. |
| Cancel | Reset to last saved or navigate away. |

## Accessibility

- [ ] Labels associated with controls; fieldset for sections.
- [ ] Save/Cancel in tab order; focus management on success/error.

## Related Patterns

- **Multi-Section Form** — Similar; uses Accordion for collapsible sections.
- **Form Dialog** — Modal form for create/edit entity.

## Design Decisions

**Decision**: Card per section. **Rationale**: Clear grouping; matches settings UIs. **Alternatives**: Accordion; flat form with headings.

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-02-11 | seed-patterns | Initial pattern documentation |

---

## For AI Agents

### Checklist for New Implementation

- [ ] ShellPageHeader with Save/Cancel.
- [ ] Cards with Label + Input/Toggle/Checkbox per section.
- [ ] Wire Save/Cancel to state and persistence.
- [ ] Update registry if adding new instance.
