---
name: Import Dialog
product: cross-product
category: dialogs
status: draft
cross-product-candidate: true
created: "2025-02-11"
updated: "2025-02-11"
author: seed-patterns
source-component: ""
---

# Import Dialog

> **Product**: cross-product | **Category**: dialogs | **Status**: draft

## Problem Statement

Users need to upload files for import (e.g. tasks, data). They need a drag-drop area, folder/tab structure (Upload, My Folders, All uploaded files), and a file list with progress. Reference: Harmony Functionality page 24.

## Solution

A Dialog with drag-drop upload area, TabStrip for Upload / My Folders / All uploaded files, Card or list for file list, Icon and ProgressBar for upload progress. Buttons for Add/Select and Start import.

## Anatomy

```
┌─────────────────────────────────────────────────────────────┐
│ [X]  Import                                                 │
│ [Upload] [My Folders] [All uploaded files]                  │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────┐ │
│ │  Drop files here or [Browse]                            │ │
│ │  (drag-drop area)                                       │ │
│ └─────────────────────────────────────────────────────────┘ │
│ File 1.xlsx  [=========>    ] 60%   [×]                     │
│ File 2.csv   [====================] 100%                    │
├─────────────────────────────────────────────────────────────┤
│                    [Cancel]  [Import]                        │
└─────────────────────────────────────────────────────────────┘
```

### Component Tree

```
Dialog
├── DialogHeader
├── TabStrip (Upload, My Folders, All uploaded files)
├── Card or area — drag-drop zone, file list
│   ├── Icon (upload/file)
│   ├── ProgressBar (per file)
│   └── Button (remove)
└── DialogFooter — Cancel, Import
```

### Key Elements

| Element | Required | Description |
|---------|----------|-------------|
| Upload area | Yes | Drag-drop zone; optional Browse button |
| File list | Yes | List of queued/uploaded files with ProgressBar |
| Tabs | Yes | Upload / My Folders / All uploaded (Harmony 24) |
| Import/Cancel | Yes | Start import or close |

## Usage Guidelines

### When to Use

- File import (tasks, CSV, etc.) with upload and optional folder tabs
- When users need to see upload progress and file list
- Harmony-style import (page 24)

### When NOT to Use

- Single file only → Simpler upload dialog
- No folders → Single upload area and list
- Inline upload only → No dialog

## Implementation

### Component Dependencies

```typescript
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { ProgressBar } from '@/components/ui/progress-bar';
// TabStrip for Upload/My Folders/All — verify from Harmony.
// Verify from Harmony docs when available.
```

### Props/Configuration

*Verify against Harmony Dialog, Button, Card, Icon, ProgressBar, TabStrip when Harmony root is available.*

| Area | Notes |
|------|--------|
| Drag-drop | Handle drop and file input; add to file list. |
| Tabs | Upload (current), My Folders, All uploaded; content per tab. |
| Progress | ProgressBar per file; update on upload progress. |
| Import | When all uploaded or user confirms; run import API. |

## Accessibility

- [ ] Drag-drop area keyboard accessible (e.g. Browse).
- [ ] Progress and file names announced.

## Related Patterns

- **Stepper Wizard** — Import may have steps: upload → map → confirm.
- **Form Dialog** — If import is form-based (e.g. URL only).

## Design Decisions

**Decision**: Tabs for Upload / My Folders / All. **Rationale**: Harmony Functionality page 24. **Alternatives**: Single upload view.

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-02-11 | seed-patterns | Initial pattern documentation |

---

## For AI Agents

### Checklist for New Implementation

- [ ] Dialog with drag-drop, tabs, file list, ProgressBar.
- [ ] Cancel and Import buttons; wire to upload/import API.
- [ ] Update registry if adding new instance.
