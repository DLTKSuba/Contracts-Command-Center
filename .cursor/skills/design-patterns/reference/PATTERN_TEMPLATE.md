---
name: {{PATTERN_NAME}}
product: {{PRODUCT}}  # PPM | CP | cross-product
category: {{CATEGORY}}  # dialogs | navigation | forms | layouts | data-display | feedback
status: draft  # draft | review | approved | deprecated
cross-product-candidate: false
created: {{DATE}}
updated: {{DATE}}
author: {{AUTHOR}}
source-component: {{COMPONENT_PATH}}
---

# {{PATTERN_NAME}}

> **Product**: {{PRODUCT}} | **Category**: {{CATEGORY}} | **Status**: {{STATUS}}

## Problem Statement

<!-- What problem does this pattern solve? Be specific about the user need or design challenge. -->

{{PROBLEM_DESCRIPTION}}

## Solution

<!-- How does this pattern solve the problem? Describe the approach at a high level. -->

{{SOLUTION_DESCRIPTION}}

## Anatomy

<!-- Visual breakdown of the pattern's structure. Use ASCII art, mermaid diagrams, or reference images. -->

```
┌─────────────────────────────────────────────────────────────┐
│  [Header Section]                                            │
│  ├── Title                                                   │
│  └── Subtitle/Description                                    │
├─────────────────────────────────────────────────────────────┤
│  [Content Section]                                           │
│  ├── Sidebar (optional)                                      │
│  └── Main Content Area                                       │
│      └── Accordion Sections                                  │
├─────────────────────────────────────────────────────────────┤
│  [Footer Section]                                            │
│  ├── Cancel Action                                           │
│  └── Primary Actions                                        │
└─────────────────────────────────────────────────────────────┘
```

### Key Elements

| Element | Required | Description |
|---------|----------|-------------|
| {{ELEMENT_1}} | Yes/No | {{DESCRIPTION}} |
| {{ELEMENT_2}} | Yes/No | {{DESCRIPTION}} |
| {{ELEMENT_3}} | Yes/No | {{DESCRIPTION}} |

## Usage Guidelines

### When to Use

<!-- List specific scenarios where this pattern is appropriate -->

- {{USE_CASE_1}}
- {{USE_CASE_2}}
- {{USE_CASE_3}}

### When NOT to Use

<!-- List scenarios where a different pattern would be better -->

- {{ANTI_USE_CASE_1}} → Use {{ALTERNATIVE}} instead
- {{ANTI_USE_CASE_2}} → Use {{ALTERNATIVE}} instead

## Variants

<!-- If this pattern has variations, document each one -->

### {{VARIANT_1_NAME}}

**Use when**: {{VARIANT_1_CONDITION}}

**Differences from base**:
- {{DIFFERENCE_1}}
- {{DIFFERENCE_2}}

### {{VARIANT_2_NAME}}

**Use when**: {{VARIANT_2_CONDITION}}

**Differences from base**:
- {{DIFFERENCE_1}}
- {{DIFFERENCE_2}}

## Implementation

### Component Dependencies

```typescript
// Required imports
import { ComponentA } from '@/components/ui/component-a';
import { ComponentB } from '@/components/ui/component-b';
```

### Props/Configuration

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `{{PROP_1}}` | `{{TYPE}}` | `{{DEFAULT}}` | {{DESCRIPTION}} |
| `{{PROP_2}}` | `{{TYPE}}` | `{{DEFAULT}}` | {{DESCRIPTION}} |

### Integration Points

<!-- Where does this pattern connect to the rest of the application? -->

**Entry Point**: {{HOW_PATTERN_IS_TRIGGERED}}

**State Management**: {{HOW_STATE_IS_MANAGED}}

**Data Flow**: {{HOW_DATA_FLOWS}}

### Reference Implementation

**Primary Example**: `{{COMPONENT_PATH}}`

```typescript
// Key code snippet showing the pattern's core structure
{{CODE_SNIPPET}}
```

## Accessibility

<!-- Document accessibility requirements and considerations -->

- [ ] Keyboard navigation: {{KEYBOARD_REQUIREMENTS}}
- [ ] Screen reader: {{SCREEN_READER_REQUIREMENTS}}
- [ ] Focus management: {{FOCUS_REQUIREMENTS}}
- [ ] Color contrast: {{COLOR_REQUIREMENTS}}

## Related Patterns

<!-- Link to other patterns that work with or are similar to this one -->

- **{{RELATED_PATTERN_1}}** - {{RELATIONSHIP_DESCRIPTION}}
- **{{RELATED_PATTERN_2}}** - {{RELATIONSHIP_DESCRIPTION}}

## Design Decisions

<!-- Document key design decisions and their rationale -->

### Decision: {{DECISION_1_TITLE}}

**Context**: {{CONTEXT}}

**Decision**: {{WHAT_WAS_DECIDED}}

**Rationale**: {{WHY}}

**Alternatives Considered**: {{WHAT_ELSE_WAS_CONSIDERED}}

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | {{DATE}} | {{AUTHOR}} | Initial pattern documentation |

---

## For AI Agents

<!-- This section helps AI agents understand how to use this pattern -->

### Quick Reference

**File to copy**: `{{COMPONENT_PATH}}`

**Key modifications needed**:
1. {{MODIFICATION_1}}
2. {{MODIFICATION_2}}
3. {{MODIFICATION_3}}

### Checklist for New Implementation

- [ ] Follow anatomy structure
- [ ] Include all required elements
- [ ] Apply variant if conditions match
- [ ] Verify accessibility requirements
- [ ] Test integration points
- [ ] Update registry with new instance
