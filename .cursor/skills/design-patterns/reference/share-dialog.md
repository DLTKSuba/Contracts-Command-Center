---
name: Share Dialog
product: cross-product
category: dialogs
status: draft
cross-product-candidate: true
created: "2025-02-11"
updated: "2025-02-11"
author: seed-patterns
source-component: ""
---

# Share Dialog

> **Product**: cross-product | **Category**: dialogs | **Status**: draft

## Problem Statement

Users need to share an item (project, document, view) with team members. They must select recipients, optionally add a message, and see what is being shared (item badges). Reference: Harmony Functionality page 28.

## Solution

A Dialog with recipient selector (Input or Dropdown), optional message (Textarea), Chips for the item(s) being shared, and Share/Cancel buttons.

## Anatomy

```
┌─────────────────────────────────────────────────────────────┐
│ [X]  Share                                                  │
├─────────────────────────────────────────────────────────────┤
│ Share with   [Dropdown / Input - recipients        ]         │
│ Message      [Textarea optional                   ]         │
│              [Project Alpha] [Document 1]  (item chips)        │
├─────────────────────────────────────────────────────────────┤
│                    [Cancel]  [Share]                          │
└─────────────────────────────────────────────────────────────┘
```

### Component Tree

```
Dialog
├── DialogHeader
├── DialogContent
│   ├── Input or Dropdown (recipients)
│   ├── Textarea (message, optional)
│   ├── Chip (per item being shared)
│   └── DialogFooter — Cancel, Share
└── (backdrop)
```

### Key Elements

| Element | Required | Description |
|---------|----------|-------------|
| Recipient selector | Yes | Input or Dropdown for people/teams |
| Item chips | Yes | Chips showing what is shared |
| Message | No | Optional Textarea |
| Share/Cancel | Yes | Share sends; Cancel closes |

## Usage Guidelines

### When to Use

- Share project, document, or view with others
- When recipient list and optional message are needed
- In-context share (Harmony 28)

### When NOT to Use

- Copy link only → Use simple dialog with copy link
- No recipient selection → Use notification or export
- Bulk share different items → May need list + share action per item

## Implementation

### Component Dependencies

```typescript
import { Dialog } from '@/components/ui/dialog';
import { Input, Dropdown, Textarea } from '@/components/ui/...';
import { Chip } from '@/components/ui/chip';
import { Button } from '@/components/ui/button';
// Verify from Harmony docs when available.
```

### Props/Configuration

*Verify against Harmony Dialog, Input, Dropdown, Textarea, Chip, Button when Harmony root is available.*

| Area | Notes |
|------|--------|
| Recipients | Multi-select dropdown or tag input; resolve to user/team ids. |
| Items | Array of shared items; render as Chips. |
| Share | Submit recipients + message + item ids to API. |

## Accessibility

- [ ] Focus trap; labels for recipient and message.
- [ ] Item chips readable by screen reader.

## Related Patterns

- **Form Dialog** — Generic modal form.
- **Confirmation Dialog** — Simple confirm after share success optional.

## Design Decisions

**Decision**: Dialog with recipients, message, item chips. **Rationale**: Harmony Functionality page 28. **Alternatives**: Inline share bar; email-only.

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-02-11 | seed-patterns | Initial pattern documentation |

---

## For AI Agents

### Checklist for New Implementation

- [ ] Dialog with recipient selector, optional message, item Chips.
- [ ] Share and Cancel buttons; wire to share API.
- [ ] Update registry if adding new instance.
