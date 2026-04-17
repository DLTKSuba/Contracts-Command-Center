---
name: Help Panel
product: cross-product
category: feedback
status: draft
cross-product-candidate: true
created: "2025-02-11"
updated: "2025-02-11"
author: seed-patterns
source-component: ""
---

# Help Panel

> **Product**: cross-product | **Category**: feedback | **Status**: draft

## Problem Statement

Users need in-context help: search for articles, context-sensitive content, and support links (Ask the Community, Chat, Product Tutorials, Video Tutorials, Submit Ticket). Optional "Next steps" create/assign buttons. Reference: Harmony Functionality page 27.

## Solution

A ShellPanel on the right with Input for help search, context-sensitive articles or links, and support links (Ask the Community, Chat, Product Tutorials, Video Tutorials, Submit Ticket). Optional Card for "Next steps" with Create/Assign buttons.

## Anatomy

```
┌──────────────────────────────────┬─────────────────────┐
│ Main content                      │ Help               │
│                                   │ [🔍 Search...]     │
│                                   │ ─────────────────  │
│                                   │ Context articles   │
│                                   │ • Article 1        │
│                                   │ • Article 2        │
│                                   │ ─────────────────  │
│                                   │ Ask the Community  │
│                                   │ Chat | Tutorials   │
│                                   │ Submit Ticket      │
│                                   │ [Next steps]       │
│                                   │ [Create][Assign]   │
└──────────────────────────────────┴─────────────────────┘
```

### Component Tree

```
ShellPanel (right)
├── Input (search)
├── Link / Card (context-sensitive articles)
├── Link (Ask the Community, Chat, Product Tutorials, Video Tutorials, Submit Ticket)
├── Card (Next steps, optional)
└── Button (Create, Assign)
```

### Key Elements

| Element | Required | Description |
|---------|----------|-------------|
| ShellPanel | Yes | Right panel (Harmony 27) |
| Search | Yes | Help search input |
| Context content | Yes | Articles/links for current page |
| Support links | Yes | Community, Chat, Tutorials, Video, Submit Ticket |
| Next steps | No | Card with Create/Assign buttons |

## Usage Guidelines

### When to Use

- In-app help (Harmony 27)
- When context-sensitive help and support links are needed
- Optional next steps for onboarding or workflow

### When NOT to Use

- External help only → Link in header
- No panel space → Modal or link to docs
- No context help → Simple link list

## Implementation

### Component Dependencies

```typescript
import { ShellPanel } from '@/components/ui/shell-panel';
import { Input } from '@/components/ui/input';
import { Link } from '@/components/ui/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
// Verify from Harmony docs when available.
```

### Props/Configuration

*Verify against Harmony ShellPanel, Input, Link, Card, Button when Harmony root is available.*

| Area | Notes |
|------|--------|
| Search | Query help KB; show results in panel. |
| Context | Articles keyed by route or page. |
| Links | URLs for Community, Chat, Tutorials, Video, Ticket. |
| Next steps | Optional; from config or page. |

## Accessibility

- [ ] Panel and links keyboard accessible.
- [ ] Search results announced; panel has label.

## Related Patterns

- **Contextual Toolbar** — Help icon opens this panel.
- **Notification Center** — Different panel content.
- **Empty State** — Optional use for "No help for this page".

## Design Decisions

**Decision**: Right panel with search, context, support links, optional next steps. **Rationale**: Harmony Functionality page 27. **Alternatives**: Modal; inline only.

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-02-11 | seed-patterns | Initial pattern documentation |

---

## For AI Agents

### Checklist for New Implementation

- [ ] ShellPanel with help search and context articles.
- [ ] Support links: Community, Chat, Tutorials, Video, Submit Ticket.
- [ ] Optional Next steps Card with Create/Assign.
- [ ] Update registry if adding new instance.
