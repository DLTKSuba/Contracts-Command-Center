---
name: Form Dialog
product: cross-product
category: dialogs
status: draft
cross-product-candidate: true
created: "2025-02-11"
updated: "2025-02-11"
author: seed-patterns
source-component: ""
---

# Form Dialog

> **Product**: cross-product | **Category**: dialogs | **Status**: draft

## Problem Statement

Users need to create or edit an entity (project, task, user) in a modal form without leaving the current page. The form should have clear fields (Label, Input, Textarea, Dropdown) and Cancel/Submit buttons.

## Solution

A Dialog containing a form: Label, Input, Textarea, Dropdown, and other controls as needed, with footer buttons for Cancel and Submit. Submit validates and saves; Cancel closes without saving.

## Anatomy

```
┌─────────────────────────────────────────────────────────────┐
│ [X]  New Project                                            │
├─────────────────────────────────────────────────────────────┤
│ Name *    [Input                              ]              │
│ Owner     [Dropdown ▼                        ]              │
│ Notes     [Textarea                          ]              │
│           [                                  ]              │
├─────────────────────────────────────────────────────────────┤
│                    [Cancel]  [Save]                          │
└─────────────────────────────────────────────────────────────┘
```

### Component Tree

```
Dialog
├── DialogHeader (title, close)
├── DialogContent
│   ├── Label, Input | Textarea | Dropdown (form fields)
│   └── DialogFooter — Button (Cancel), Button (Submit)
└── (backdrop)
```

### Key Elements

| Element | Required | Description |
|---------|----------|-------------|
| Dialog | Yes | Modal container |
| Form fields | Yes | Label + Input/Textarea/Dropdown |
| Cancel | Yes | Closes without saving |
| Submit | Yes | Validates and saves; then closes |

## Usage Guidelines

### When to Use

- Create or edit single entity with a small-to-medium form
- When context (current list/page) should stay visible behind modal
- Quick add/edit without full-page form

### When NOT to Use

- Many sections or steps → Use Stepper Wizard or Wizard Dialog
- Simple yes/no → Use Confirmation Dialog
- View-only detail → Use Detail Drawer or inline

## Implementation

### Component Dependencies

```typescript
import { Dialog } from '@/components/ui/dialog';
import { Label, Input, Textarea, Dropdown } from '@/components/ui/...';
import { Button } from '@/components/ui/button';
// Verify from Harmony docs when available.
```

### Props/Configuration

*Verify against Harmony Dialog, Label, Input, Textarea, Dropdown, Button when Harmony root is available.*

| Area | Notes |
|------|--------|
| Dialog | open, onOpenChange. |
| Form | Controlled fields; validation on submit. |
| Submit | Validate → save (API) → onSuccess close dialog and refresh list. |

## Accessibility

- [ ] Focus trap in dialog; Escape closes (Cancel).
- [ ] Labels for all inputs; errors announced.

## Related Patterns

- **Confirmation Dialog** — Yes/no only.
- **Stepper Wizard** — Multi-step in dialog.
- **Detail Drawer** — Detail in panel instead of modal.

## Design Decisions

**Decision**: Modal form for create/edit. **Rationale**: Keeps user on page; clear commit/cancel. **Alternatives**: Full-page form; drawer.

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-02-11 | seed-patterns | Initial pattern documentation |

---

## For AI Agents

### Checklist for New Implementation

- [ ] Dialog with form fields and Cancel/Submit.
- [ ] Validation and save; close on success.
- [ ] Update registry if adding new instance.
