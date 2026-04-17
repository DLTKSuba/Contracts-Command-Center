---
name: Wizard Dialog
product: PPM
category: dialogs
status: approved
cross-product-candidate: true
created: 2025-12-18
updated: 2025-12-18
author: Design System Team
source-component: src/components/wizards/wizard-template.tsx
---

# Wizard Dialog

> **Product**: PPM | **Category**: dialogs | **Status**: approved

## Problem Statement

Users need to complete complex, multi-step configuration tasks (like replanning projects, updating totals, or spreading values) without losing context of what they're doing. These tasks require:
- Multiple related inputs organized logically
- Progress visibility across sections
- Ability to save partial work
- Clear entry and exit points

## Solution

A dialog-based wizard pattern with accordion sections, optional sidebar guidance, and clear action buttons. The wizard uses a modal overlay to focus user attention while maintaining the context of where they came from.

## Anatomy

```
┌─────────────────────────────────────────────────────────────────┐
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ [X]                                                      │    │
│  │ Wizard Title                                             │    │
│  │ Subtitle / Description                                   │    │
│  └─────────────────────────────────────────────────────────┘    │
│  ┌────────────┬────────────────────────────────────────────┐    │
│  │            │  [Expand All]  [Collapse All]              │    │
│  │  Sidebar   ├────────────────────────────────────────────┤    │
│  │            │  ▼ Section 1                    ◉ 2/3      │    │
│  │  "Let's    │    Description text                        │    │
│  │  get       │    ┌─────────────────────────────┐         │    │
│  │  started!" │    │ Field Label *               │         │    │
│  │            │    │ [Input field            ]   │         │    │
│  │  ☐ Show    │    └─────────────────────────────┘         │    │
│  │  required  │                                            │    │
│  │  only      │  ▶ Section 2                    ○ 0/2      │    │
│  │            │  ▶ Section 3                    ○ 0/4      │    │
│  └────────────┴────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ [Cancel]                    [Save config] [Run]         │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

### Key Elements

| Element | Required | Description |
|---------|----------|-------------|
| Dialog Container | Yes | Modal overlay with backdrop, traps focus |
| Dialog Header | Yes | Title, optional subtitle, close button (X) |
| Sidebar | No | Optional guidance panel with helper text/options |
| Expand/Collapse Controls | Yes | Quick access to expand or collapse all sections |
| Accordion Sections | Yes | Collapsible groups with completion indicators |
| Completion Chip | Yes | Shows progress (e.g., "2 of 3 completed") |
| Form Fields | Yes | Input controls appropriate to data type |
| Dialog Footer | Yes | Cancel, Save configuration, and Run buttons |

### Completion Chip States

| State | Visual | Description |
|-------|--------|-------------|
| In Progress | Red pill "X of Y completed" | Section has incomplete required fields |
| Complete | Green circle with checkmark | All required fields completed |

## Usage Guidelines

### When to Use

- Multi-step configuration tasks with 2+ logical sections
- Tasks that benefit from progress tracking
- Operations that can be saved as configurations and re-run
- Complex forms that would overwhelm a simple modal

### When NOT to Use

- Simple confirmations → Use `ConfirmationDialog` instead
- Single-field inputs → Use inline editing or simple modal
- Read-only information display → Use detail panels or drawers
- Wizards with strict linear flow → Consider step-by-step wizard

## Variants

### With Sidebar

**Use when**: Users benefit from persistent guidance or options that affect all sections.

```typescript
<WizardContent
  hasSidebar={true}
  sidebar={
    <WizardSidebar title="Let's get started!">
      {/* Helper content */}
    </WizardSidebar>
  }
>
```

### Without Sidebar

**Use when**: Wizard is simple enough that guidance isn't needed, or screen space is limited.

```typescript
<WizardContent hasSidebar={false}>
```

### Custom Width

**Default**: `max-w-4xl` (64rem / 1024px)

**Use when**: Content requires more or less horizontal space.

```typescript
<DialogContent className="max-w-[56rem]">  {/* 896px */}
<DialogContent className="max-w-5xl">       {/* 80rem / 1280px */}
```

## Implementation

### Component Dependencies

```typescript
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  WizardContent,
  WizardAccordion,
  WizardSidebar,
  useWizardState
} from '@/components/wizards/WizardComponents';
import { Button } from '@/components/ui/button';
```

### Props/Configuration

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | - | Controls dialog visibility |
| `onOpenChange` | `(open: boolean) => void` | - | Callback when dialog state changes |

### State Management Hook

```typescript
const {
  expandedSections,
  sectionCompletion,
  toggleSection,
  expandAll,
  collapseAll,
  updateCompletion
} = useWizardState({
  section1: { defaultExpanded: true, completed: 0, total: 3 },
  section2: { defaultExpanded: false, completed: 0, total: 2 },
});
```

### Integration with ActionsDrawer

```typescript
// 1. Import wizard
import MyWizard from '@/components/wizards/MyWizard';

// 2. Add dialog state
const [isMyWizardOpen, setIsMyWizardOpen] = useState(false);

// 3. Add to availableActions
{
  id: 'my-wizard',
  label: 'My Wizard',
  icon: PlusCircleIcon,
  action: () => setIsMyWizardOpen(true),
  contexts: ['Projects']
}

// 4. Render dialog
<MyWizard open={isMyWizardOpen} onOpenChange={setIsMyWizardOpen} />
```

### Reference Implementation

**Primary Example**: `src/components/wizards/wizard-template.tsx`

```typescript
export default function MyWizard({ open, onOpenChange }: MyWizardProps) {
  const { expandedSections, toggleSection, expandAll, collapseAll } = useWizardState({
    section1: { defaultExpanded: true, completed: 0, total: 3 },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b border-gray-200">
          <DialogTitle>Wizard Title</DialogTitle>
          <DialogDescription>Subtitle text</DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden flex">
          <WizardContent hasSidebar={true} sidebar={<WizardSidebar />}>
            <WizardAccordion
              title="Section 1"
              isExpanded={expandedSections.section1}
              onToggle={() => toggleSection('section1')}
              completed={0}
              total={3}
            >
              {/* Form fields */}
            </WizardAccordion>
          </WizardContent>
        </div>
        
        <DialogFooter className="px-6 py-4 border-t border-gray-200">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleRun}>Run</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

### Harmony sizing note

Harmony's `.dialog__body` defaults to `max-height: 600px` with no min-height, so the wizard dialog collapses to ~200px when content is sparse and caps at 600px when content is long. Fix: add a modifier class (e.g. `.dialog--wizard`) with `min-height: 80vh` / `max-height: 90vh` on the dialog and `min-height: 60vh` / `max-height: 80vh` on `.dialog__body`. This ensures the wizard always looks intentionally sized regardless of content amount.

## Field Types

### Text Input

```typescript
<div className="mb-5">
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Field Label<span className="text-red-500 ml-1">*</span>
  </label>
  <input
    type="text"
    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
    placeholder="Enter value..."
  />
</div>
```

### Select/Dropdown

```typescript
<div className="mb-5">
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Field Label<span className="text-red-500 ml-1">*</span>
  </label>
  <select className="w-full px-3 py-2 border border-gray-300 rounded text-sm">
    <option value="">Select an option...</option>
    <option value="opt1">Option 1</option>
    <option value="opt2">Option 2</option>
  </select>
</div>
```

### Checkbox

```typescript
<div className="mb-5">
  <label className="flex items-center gap-2">
    <input type="checkbox" className="w-4 h-4" />
    <span className="text-sm text-gray-700">Checkbox label</span>
  </label>
</div>
```

## Accessibility

- [x] **Keyboard navigation**: Tab through all interactive elements, Enter to toggle accordions
- [x] **Focus management**: Focus trapped within dialog, returns to trigger on close
- [x] **Screen reader**: Dialog has role="dialog", aria-labelledby for title
- [x] **Color contrast**: All text meets WCAG AA (4.5:1 for normal text)
- [x] **Required fields**: Marked with asterisk (*) and aria-required

## Related Patterns

- **Confirmation Dialog** - Simple yes/no confirmations
- **Drawer Panel** - Side panel for secondary content
- **Form Layout** - Standard form field arrangements
- **Accordion** - Standalone collapsible sections

## Design Decisions

### Decision: Dialog vs Drawer

**Context**: Need modal interaction for complex configuration tasks.

**Decision**: Use Dialog (centered modal) instead of Drawer (side panel).

**Rationale**: 
- Dialogs provide clearer focus for task completion
- Wider content area for forms with multiple columns
- Better mobile experience (full-screen capability)

**Alternatives Considered**: 
- Drawer: Would work but less focused, content width limited
- Full page: Too disruptive, loses context

### Decision: Accordion Sections vs Tabs

**Context**: Need to organize multiple form sections.

**Decision**: Use accordion sections instead of tabs.

**Rationale**:
- Users can see all section titles at once
- Easier to understand overall progress
- Can have multiple sections expanded simultaneously
- Better for variable-height content

### Decision: Local State vs Context

**Context**: Managing dialog open/close state.

**Decision**: Local state in ActionsDrawer.tsx, not MenuContext.

**Rationale**:
- Simpler implementation
- No global state pollution
- Dialog lifecycle contained to one file

---

## For AI Agents

### Quick Reference

**Template file**: `wizard-template.tsx`
**Components library**: `src/components/wizards/WizardComponents.tsx`
**Integration point**: `src/components/layout/ActionsDrawer.tsx`

**With Harmony**: When the project uses the Harmony design system, use Harmony Dialog, Button, Accordion, and form components (Input, Label, etc.). Use the harmony-component skill for props and API; keep this pattern’s anatomy and flow.

### Key Modifications for New Implementations

1. Copy wizard-template.tsx to new file
2. Update component name and props interface
3. Configure sections in useWizardState
4. Add form fields to each WizardAccordion
5. Implement handleSave and handleRun logic
6. Add to ActionsDrawer.tsx (import, state, action, render)

### Checklist for New Implementation

- [ ] Component file created in `src/components/wizards/`
- [ ] Uses Dialog, DialogContent, DialogHeader, DialogFooter
- [ ] Uses WizardContent and WizardAccordion from WizardComponents
- [ ] Accepts `open` and `onOpenChange` props
- [ ] Has useWizardState with section configuration
- [ ] Footer has Cancel, Save, and Run buttons
- [ ] ActionsDrawer.tsx updated with import
- [ ] ActionsDrawer.tsx has dialog state useState
- [ ] ActionsDrawer.tsx has action in availableActions
- [ ] ActionsDrawer.tsx renders dialog component
- [ ] All required fields marked with asterisk (*)
- [ ] Tested: dialog opens from Actions drawer
- [ ] Tested: dialog closes on Cancel and X
- [ ] Tested: accordions expand/collapse correctly
