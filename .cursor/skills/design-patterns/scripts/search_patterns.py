#!/usr/bin/env python3
"""
Pattern Search Script - Find and list patterns across products

Usage:
    python search_patterns.py --list                    # List all patterns
    python search_patterns.py --product "PPM"          # Filter by product
    python search_patterns.py --category "dialogs"    # Filter by category
    python search_patterns.py --query "wizard accordion" # Keyword search
    python search_patterns.py --query "sidebar" --full-text  # Full-text search

Requires PyYAML for frontmatter parsing: pip install pyyaml
Run with --patterns-dir pointing to your project's patterns/ folder (default: patterns).
"""

import argparse
import re
from pathlib import Path
from typing import List, Dict, Optional

try:
    import yaml
except ImportError:
    yaml = None


def parse_frontmatter(content: str) -> Dict:
    """Extract YAML frontmatter from markdown file."""
    match = re.match(r'^---\s*\n(.*?)\n---', content, re.DOTALL)
    if match and yaml:
        try:
            return yaml.safe_load(match.group(1)) or {}
        except Exception:
            return {}
    return {}


def load_patterns(patterns_dir: str) -> List[Dict]:
    """Load all pattern metadata from directory."""
    patterns = []
    patterns_path = Path(patterns_dir)
    if not patterns_path.exists():
        return patterns
    for md_file in patterns_path.rglob('*.md'):
        if md_file.name in ['registry.md', '_index.md', 'README.md']:
            continue
        try:
            content = md_file.read_text()
            metadata = parse_frontmatter(content)
            if metadata.get('name'):
                patterns.append({
                    'name': metadata.get('name', md_file.stem),
                    'product': metadata.get('product', 'unknown'),
                    'category': metadata.get('category', 'unknown'),
                    'status': metadata.get('status', 'unknown'),
                    'author': metadata.get('author', 'unknown'),
                    'created': metadata.get('created', ''),
                    'updated': metadata.get('updated', ''),
                    'source_component': metadata.get('source-component', ''),
                    'cross_product_candidate': metadata.get('cross-product-candidate', False),
                    'path': str(md_file),
                    'relative_path': str(md_file.relative_to(patterns_path)),
                    'content': content
                })
        except Exception as e:
            print(f"⚠️  Error reading {md_file}: {e}")
    return patterns


def filter_patterns(
    patterns: List[Dict],
    product: Optional[str] = None,
    category: Optional[str] = None,
    status: Optional[str] = None,
    query: Optional[str] = None,
    full_text: bool = False
) -> List[Dict]:
    results = patterns
    if product:
        results = [p for p in results if p['product'].lower() == product.lower()]
    if category:
        results = [p for p in results if p['category'].lower() == category.lower()]
    if status:
        results = [p for p in results if p['status'].lower() == status.lower()]
    if query:
        terms = query.lower().split()
        if full_text:
            results = [p for p in results if all(t in p['content'].lower() for t in terms)]
        else:
            results = [p for p in results if all(t in p['name'].lower() or t in p['category'].lower() for t in terms)]
    return results


def format_table(patterns: List[Dict]) -> str:
    if not patterns:
        return "No patterns found."
    lines = [
        "| Pattern | Product | Category | Status | Path |",
        "|---------|---------|----------|--------|------|"
    ]
    for p in patterns:
        lines.append(f"| {p['name']} | {p['product']} | {p['category']} | {p['status']} | {p['relative_path']} |")
    return '\n'.join(lines)


def format_detailed(patterns: List[Dict]) -> str:
    if not patterns:
        return "No patterns found."
    output = []
    for p in patterns:
        output.append(f"""
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 {p['name']}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Product:    {p['product']}
  Category:   {p['category']}
  Status:     {p['status']}
  Author:     {p['author']}
  Created:    {p['created']}
  Updated:    {p['updated']}
  Source:     {p['source_component']}
  Path:       {p['path']}
  Cross-product candidate: {'Yes' if p['cross_product_candidate'] else 'No'}
""")
    return '\n'.join(output)


def format_json(patterns: List[Dict]) -> str:
    import json
    clean = [{k: v for k, v in p.items() if k != 'content'} for p in patterns]
    return json.dumps(clean, indent=2)


def print_summary(patterns: List[Dict]):
    if not patterns:
        print("No patterns in registry.")
        return
    products = {}
    categories = {}
    statuses = {}
    for p in patterns:
        products[p['product']] = products.get(p['product'], 0) + 1
        categories[p['category']] = categories.get(p['category'], 0) + 1
        statuses[p['status']] = statuses.get(p['status'], 0) + 1
    print(f"\n📊 Pattern Registry Summary\n{'=' * 40}\nTotal patterns: {len(patterns)}")
    print("\nBy Product:")
    for prod, count in sorted(products.items()):
        print(f"  {prod}: {count}")
    print("\nBy Category:")
    for cat, count in sorted(categories.items()):
        print(f"  {cat}: {count}")
    print("\nBy Status:")
    for stat, count in sorted(statuses.items()):
        print(f"  {stat}: {count}")


def main():
    default_patterns = str(Path(__file__).resolve().parent.parent / 'reference')
    parser = argparse.ArgumentParser(description='Search and list design patterns')
    parser.add_argument(
        '--patterns-dir',
        default=default_patterns,
        help='Patterns directory (default: design-patterns/reference next to this script)',
    )
    parser.add_argument('--list', action='store_true', help='List all patterns')
    parser.add_argument('--product', help='Filter by product (PPM, CP, etc.)')
    parser.add_argument('--category', help='Filter by category')
    parser.add_argument('--status', help='Filter by status (draft, review, approved)')
    parser.add_argument('--query', help='Keyword search')
    parser.add_argument('--full-text', action='store_true', help='Search in full content')
    parser.add_argument('--format', choices=['table', 'detailed', 'json'], default='table', help='Output format')
    parser.add_argument('--summary', action='store_true', help='Show summary statistics')
    args = parser.parse_args()
    
    patterns = load_patterns(args.patterns_dir)
    if not patterns:
        print(f"No patterns found in {args.patterns_dir}/")
        print("\nTo create your first pattern, run:")
        print("  python scripts/create_pattern.py --interactive")
        return 0
    if args.summary:
        print_summary(patterns)
        return 0
    if args.list or args.product or args.category or args.status or args.query:
        results = filter_patterns(
            patterns, product=args.product, category=args.category,
            status=args.status, query=args.query, full_text=args.full_text
        )
        if args.format == 'detailed':
            print(format_detailed(results))
        elif args.format == 'json':
            print(format_json(results))
        else:
            print(format_table(results))
        print(f"\nFound {len(results)} pattern(s)")
    else:
        print_summary(patterns)
    return 0


if __name__ == "__main__":
    exit(main())
