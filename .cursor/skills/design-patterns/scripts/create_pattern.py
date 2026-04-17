#!/usr/bin/env python3
"""
Pattern Creation Script - Generates pattern documentation from existing components

Usage:
    python create_pattern.py FloatingNav
    python create_pattern.py FloatingNav --product CP
    python create_pattern.py src/nav/FloatingNav.tsx --product CP

Run from the project that contains the component. Script searches for the file,
detects category from path, asks for product/theme if not given, saves to reference/ next to the script.
"""

import argparse
import os
import re
import sys
from datetime import datetime
from pathlib import Path
from typing import Dict, Any, List

# Extensions to search for component files
COMPONENT_EXTENSIONS = ('.tsx', '.ts', '.astro', '.jsx', '.vue')
# Directories to skip when searching
SKIP_DIRS = {'node_modules', '.git', 'dist', 'build', '__pycache__', '.cursor'}

# Path segment (lowercase) -> category
PATH_TO_CATEGORY = {
    'wizards': 'dialogs',
    'dialogs': 'dialogs',
    'modals': 'dialogs',
    'nav': 'navigation',
    'navigation': 'navigation',
    'forms': 'forms',
    'layouts': 'layouts',
    'tables': 'data-display',
    'lists': 'data-display',
    'charts': 'data-display',
    'data': 'data-display',
    'feedback': 'feedback',
    'alerts': 'feedback',
    'toasts': 'feedback',
}


def to_kebab_case(name: str) -> str:
    """Convert pattern name to kebab-case for filenames."""
    result = re.sub(r'[^a-zA-Z0-9]+', '-', name.lower())
    return result.strip('-')


def get_reference_dir() -> Path:
    """Return the reference/ directory next to this script (same skill package)."""
    script_dir = Path(__file__).resolve().parent
    return (script_dir / ".." / "reference").resolve()


def find_component_files(cwd: Path, name: str) -> List[Path]:
    """Search project for files whose stem matches name; extensions .tsx, .ts, .astro, .jsx, .vue."""
    name_clean = name.strip()
    if not name_clean:
        return []
    name_norm = name_clean.replace("-", "").lower()
    matches = []
    for path in cwd.rglob("*"):
        if not path.is_file() or path.suffix.lower() not in COMPONENT_EXTENSIONS:
            continue
        try:
            rel = path.relative_to(cwd)
        except ValueError:
            continue
        if any(part in SKIP_DIRS for part in rel.parts):
            continue
        if path.stem == name_clean or path.stem.lower() == name_norm or path.stem.replace("-", "").lower() == name_norm:
            matches.append(path.resolve())
    return sorted(matches)


def detect_category_from_path(file_path: str) -> str:
    """Infer category from path segments (e.g. wizards/ -> dialogs, nav/ -> navigation)."""
    path_norm = str(file_path).replace("\\", "/").lower()
    for segment in path_norm.split("/"):
        segment = segment.strip()
        if segment in PATH_TO_CATEGORY:
            return PATH_TO_CATEGORY[segment]
    return "components"


def stem_to_display_name(stem: str) -> str:
    """e.g. FloatingNav -> Floating Nav."""
    if not stem:
        return stem
    return re.sub(r"([a-z])([A-Z])", r"\1 \2", stem).strip()


def analyze_component(file_path: str) -> Dict[str, Any]:
    """Analyze a React/TypeScript component file to extract pattern information."""
    analysis = {
        'imports': [],
        'props': [],
        'hooks': [],
        'components': [],
        'has_dialog': False,
        'has_accordion': False,
        'has_sidebar': False,
        'has_form': False,
        'raw_content': ''
    }
    
    if not os.path.exists(file_path):
        print(f"⚠️  Component file not found: {file_path}")
        return analysis
    
    with open(file_path, 'r') as f:
        content = f.read()
    
    analysis['raw_content'] = content
    
    # Extract imports
    import_pattern = r"import\s+.*?from\s+['\"]([^'\"]+)['\"]"
    analysis['imports'] = re.findall(import_pattern, content)
    
    # Extract props interface
    props_pattern = r"interface\s+(\w+Props)\s*\{([^}]+)\}"
    props_match = re.search(props_pattern, content, re.DOTALL)
    if props_match:
        analysis['props_interface'] = props_match.group(1)
        props_content = props_match.group(2)
        prop_lines = [line.strip() for line in props_content.split('\n') if line.strip() and ':' in line]
        analysis['props'] = prop_lines
    
    # Extract hooks
    hook_pattern = r"(use\w+)\s*\("
    analysis['hooks'] = list(set(re.findall(hook_pattern, content)))
    
    # Extract component usage
    component_pattern = r"<(\w+)[\s/>]"
    all_components = set(re.findall(component_pattern, content))
    analysis['components'] = [c for c in all_components if c[0].isupper() and len(c) > 1]
    
    # Detect common patterns
    analysis['has_dialog'] = 'Dialog' in content or 'DialogContent' in content
    analysis['has_accordion'] = 'Accordion' in content or 'WizardAccordion' in content
    analysis['has_sidebar'] = 'Sidebar' in content or 'WizardSidebar' in content
    analysis['has_form'] = '<form' in content.lower() or '<input' in content.lower() or '<select' in content.lower()
    
    return analysis


def analyze_wizard_component(file_path: str) -> Dict[str, Any]:
    """Specialized analysis for wizard components."""
    analysis = analyze_component(file_path)
    
    if not analysis['raw_content']:
        return analysis
    
    content = analysis['raw_content']
    
    # Extract section configuration from useWizardState
    wizard_state_pattern = r"useWizardState\(\{([^}]+)\}"
    wizard_state_match = re.search(wizard_state_pattern, content, re.DOTALL)
    if wizard_state_match:
        sections_content = wizard_state_match.group(1)
        section_pattern = r"(\w+):\s*\{[^}]+\}"
        analysis['wizard_sections'] = re.findall(section_pattern, sections_content)
    
    # Extract field types
    field_types = []
    if 'type="text"' in content: field_types.append('text')
    if 'type="number"' in content: field_types.append('number')
    if 'type="date"' in content: field_types.append('date')
    if '<textarea' in content.lower(): field_types.append('textarea')
    if '<select' in content.lower(): field_types.append('select')
    if 'type="checkbox"' in content: field_types.append('checkbox')
    analysis['field_types'] = field_types
    
    # Detect button configuration
    analysis['has_save_button'] = 'Save' in content or 'handleSave' in content
    analysis['has_run_button'] = 'Run' in content or 'handleRun' in content
    analysis['has_cancel_button'] = 'Cancel' in content or 'onOpenChange' in content
    
    return analysis


def extract_code_snippet(content: str, pattern_type: str) -> str:
    """Extract a representative code snippet based on pattern type."""
    if pattern_type == 'wizard':
        match = re.search(r'(<Dialog.*?</Dialog>)', content, re.DOTALL)
        if match:
            snippet = match.group(1)[:500] + '\n  // ... content ...\n</Dialog>'
            return snippet
    
    match = re.search(r'(export\s+(?:default\s+)?function\s+\w+[^{]+\{)', content)
    if match:
        return match.group(1) + '\n  // ... implementation ...\n}'
    
    return '// See source component for full implementation'


def generate_pattern_doc(
    name: str,
    product: str,
    category: str,
    component_path: str,
    analysis: Dict[str, Any],
    author: str = "Design System Team"
) -> str:
    """Generate pattern documentation markdown from analysis."""
    today = datetime.now().strftime("%Y-%m-%d")
    is_wizard = 'wizard_sections' in analysis
    pattern_type = 'wizard' if is_wizard else 'component'
    
    anatomy_elements = []
    if analysis.get('has_dialog'):
        anatomy_elements.append(('Dialog Container', 'Yes', 'Modal wrapper with backdrop'))
    anatomy_elements.append(('Header', 'Yes', 'Title, subtitle, close button'))
    if analysis.get('has_sidebar'):
        anatomy_elements.append(('Sidebar', 'No', 'Optional helper content'))
    anatomy_elements.append(('Content Area', 'Yes', 'Main interactive area'))
    if analysis.get('has_accordion'):
        anatomy_elements.append(('Accordion Sections', 'Yes', 'Collapsible content groups'))
    if analysis.get('has_form'):
        anatomy_elements.append(('Form Fields', 'Yes', 'User input controls'))
    anatomy_elements.append(('Footer', 'Yes', 'Action buttons'))
    
    elements_table = '\n'.join([f"| {el[0]} | {el[1]} | {el[2]} |" for el in anatomy_elements])
    key_imports = [imp for imp in analysis.get('imports', []) if '@/components' in imp or 'react' in imp.lower()][:5]
    imports_code = '\n'.join([f"import ... from '{imp}';" for imp in key_imports])
    
    if analysis.get('props'):
        props_table = '\n'.join([f"| `{prop.split(':')[0].strip()}` | `{prop.split(':')[1].strip() if ':' in prop else 'unknown'}` | - | - |" for prop in analysis['props'][:5]])
    else:
        props_table = "| `open` | `boolean` | - | Controls dialog visibility |\n| `onOpenChange` | `(open: boolean) => void` | - | Callback when dialog state changes |"
    
    hooks_list = ', '.join([f'`{h}`' for h in analysis.get('hooks', [])[:5]]) or 'None detected'
    components_list = ', '.join([f'`{c}`' for c in analysis.get('components', [])[:10]]) or 'None detected'
    code_snippet = extract_code_snippet(analysis.get('raw_content', ''), pattern_type)
    
    wizard_sections_content = ""
    if is_wizard and analysis.get('wizard_sections'):
        sections = analysis['wizard_sections']
        wizard_sections_content = f"""
### Wizard Sections

This wizard contains {len(sections)} sections:
{chr(10).join([f'- `{s}`' for s in sections])}

### Field Types Used

{', '.join([f'`{ft}`' for ft in analysis.get('field_types', [])]) or 'Various'}
"""
    
    doc = f"""---
name: {name}
product: {product}
category: {category}
status: draft
cross-product-candidate: false
created: {today}
updated: {today}
author: {author}
source-component: {component_path}
---

# {name}

> **Product**: {product} | **Category**: {category} | **Status**: draft

## Problem Statement

This pattern provides a standardized approach for [TODO: describe the specific user need or workflow this enables].

## Solution

The {name} pattern uses a {"dialog-based wizard" if is_wizard else "component-based"} approach with {"accordion sections for organized content" if analysis.get('has_accordion') else "structured layout"}.

## Anatomy

```
┌─────────────────────────────────────────────────────────────┐
│  [Header]                                                    │
│  ├── Title                                                   │
│  └── Close Button (X)                                        │
├─────────────────────────────────────────────────────────────┤
│  {"[Sidebar]        │ " if analysis.get('has_sidebar') else ""}[Content Area]                                   │
│  {"                 │ " if analysis.get('has_sidebar') else ""}├── {"Accordion Sections" if analysis.get('has_accordion') else "Main Content"}                              │
│  {"                 │ " if analysis.get('has_sidebar') else ""}└── {"Form Fields" if analysis.get('has_form') else "Interactive Elements"}                                │
├─────────────────────────────────────────────────────────────┤
│  [Footer]                                                    │
│  ├── Cancel                                                  │
│  └── Primary Actions                                         │
└─────────────────────────────────────────────────────────────┘
```

### Key Elements

| Element | Required | Description |
|---------|----------|-------------|
{elements_table}

## Usage Guidelines

### When to Use

- [TODO: Specific scenario 1]
- [TODO: Specific scenario 2]
- [TODO: Specific scenario 3]

### When NOT to Use

- [TODO: Anti-pattern 1] → Use [alternative] instead
- [TODO: Anti-pattern 2] → Use [alternative] instead

## Implementation

### Component Dependencies

```typescript
{imports_code}
```

### Props/Configuration

| Prop | Type | Default | Description |
|------|------|---------|-------------|
{props_table}

### Key Hooks Used

{hooks_list}

### Child Components

{components_list}
{wizard_sections_content}
### Integration Points

**Entry Point**: Action button in ActionsDrawer.tsx

**State Management**: {"Local dialog state via useState" if analysis.get('has_dialog') else "Component-level state"}

**Data Flow**: Props down, events up via callbacks

### Reference Implementation

**Source**: `{component_path}`

```typescript
{code_snippet}
```

## Accessibility

- [ ] Keyboard navigation: Tab through interactive elements
- [ ] Screen reader: ARIA labels on controls
- [ ] Focus management: {"Focus trapped in dialog" if analysis.get('has_dialog') else "Logical focus order"}
- [ ] Color contrast: Meets WCAG AA standards

## Related Patterns

- [TODO: Link related patterns]

## Design Decisions

### Decision: {"Dialog-based vs Drawer-based" if analysis.get('has_dialog') else "Component Structure"}

**Context**: Need for {"modal interaction that blocks background" if analysis.get('has_dialog') else "flexible UI component"}

**Decision**: {"Use Dialog component for modal overlay" if analysis.get('has_dialog') else "Use composable component structure"}

**Rationale**: {"Provides clear focus, prevents background interaction" if analysis.get('has_dialog') else "Enables reuse and composition"}

---

## For AI Agents

### Quick Reference

**File to reference**: `{component_path}`

**Key modifications for new implementations**:
1. Update section configuration in useWizardState
2. Modify form fields for specific use case
3. Implement handleSave and handleRun logic
4. Update ActionsDrawer.tsx integration

### Checklist for New Implementation

- [ ] Follow anatomy structure
- [ ] Include all required elements
- [ ] Verify accessibility requirements
- [ ] Test dialog open/close behavior
- [ ] Update pattern registry with new instance
"""
    return doc


def update_registry(reference_dir: Path, pattern_info: Dict[str, str]):
    """Append new pattern to reference/registry.md (path = filename only)."""
    registry_path = reference_dir / "registry.md"
    filename = pattern_info.get("file", pattern_info.get("path", ""))
    if os.path.isabs(filename) or "/" in filename or "\\" in filename:
        filename = os.path.basename(filename)
    entry = f"\n| {pattern_info['name']} | {pattern_info['product']} | {pattern_info['category']} | {pattern_info['status']} | [{filename}]({filename}) |"
    if registry_path.exists():
        with open(registry_path, "a", encoding="utf-8") as f:
            f.write(entry)
    else:
        header = """# Pattern Registry

Master index of all design patterns across products.

| Pattern | Product | Category | Status | Location |
|---------|---------|----------|--------|----------|"""
        with open(registry_path, "w", encoding="utf-8") as f:
            f.write(header + entry)
    print(f"✅ Updated registry: {registry_path}")


def main():
    parser = argparse.ArgumentParser(
        description="Create pattern documentation from a component. Search project for the file, then ask for product/theme if not given."
    )
    parser.add_argument(
        "component",
        help="Component name (e.g. FloatingNav) or path (e.g. src/nav/FloatingNav.tsx)",
    )
    parser.add_argument("--product", "--theme", dest="product", help="Product/theme (e.g. PPM, CP, VP, cross-product)")
    parser.add_argument("--category", help="Override category (dialogs, navigation, forms, layouts, data-display, feedback)")
    parser.add_argument("--output", help="Override output .md path")
    parser.add_argument("--author", default="Design System Team", help="Pattern author")
    parser.add_argument("--project-root", type=Path, default=None, help="Project root to search (default: cwd)")
    args = parser.parse_args()

    cwd = (args.project_root or Path.cwd()).resolve()
    component_arg = args.component.strip()

    # 1) Resolve component path: explicit path vs search by name
    if "/" in component_arg or "\\" in component_arg or any(component_arg.endswith(ext) for ext in COMPONENT_EXTENSIONS):
        # Treat as path
        candidate = (cwd / component_arg).resolve()
        if not candidate.exists():
            print(f"❌ File not found: {candidate}")
            return 1
        component_path = str(candidate)
    else:
        # Search by name
        matches = find_component_files(cwd, component_arg)
        if not matches:
            print(f"❌ No component file found for '{component_arg}' (extensions: {', '.join(COMPONENT_EXTENSIONS)})")
            print("   Run from the project root that contains the component, or pass a path.")
            return 1
        if len(matches) == 1:
            component_path = str(matches[0])
        else:
            print(f"Found {len(matches)} matches:")
            for i, p in enumerate(matches, 1):
                print(f"  {i}. {p.relative_to(cwd)}")
            try:
                choice = input("Which file? (number): ").strip()
                idx = int(choice)
                if 1 <= idx <= len(matches):
                    component_path = str(matches[idx - 1])
                else:
                    print("Invalid number.")
                    return 1
            except (ValueError, EOFError):
                print("Invalid input.")
                return 1

    # 2) Category from path unless overridden
    category = args.category or detect_category_from_path(component_path)

    # 3) Product/theme: use flag or ask once
    product = args.product
    if not product or not product.strip():
        try:
            product = input("Product/theme (e.g. PPM, CP, VP, cross-product) [cross-product]: ").strip() or "cross-product"
        except EOFError:
            product = "cross-product"

    path_obj = Path(component_path)
    pattern_name = stem_to_display_name(path_obj.stem)

    # 4) Output path: next to script in reference/
    reference_dir = get_reference_dir()
    reference_dir.mkdir(parents=True, exist_ok=True)
    if args.output:
        output_path = Path(args.output).resolve()
    else:
        output_path = reference_dir / f"{to_kebab_case(path_obj.stem)}.md"

    # 5) Analyze and generate
    print(f"\n🔍 Analyzing: {component_path}")
    if "wizard" in component_path.lower() or "wizard" in path_obj.stem.lower():
        analysis = analyze_wizard_component(component_path)
    else:
        analysis = analyze_component(component_path)
    print(f"   Components: {len(analysis.get('components', []))}, hooks: {len(analysis.get('hooks', []))}")

    doc = generate_pattern_doc(
        name=pattern_name,
        product=product,
        category=category,
        component_path=component_path,
        analysis=analysis,
        author=args.author,
    )

    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(doc)
    print(f"✅ Created pattern: {output_path}")

    update_registry(reference_dir, {
        "name": pattern_name,
        "product": product,
        "category": category,
        "status": "draft",
        "file": output_path.name,
        "path": output_path.name,
    })
    print("\n🎉 Done. Next: review the file, fill TODOs, set status to 'review' when ready.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
