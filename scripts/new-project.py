#!/usr/bin/env python3
"""Create an isolated Maestro project under projects/<slug>/, or list existing ones.

Usage:
  python scripts/new-project.py <slug> [--name "Nome do Produto"]
  python scripts/new-project.py --list
"""

from __future__ import annotations

import argparse
import re
import shutil
import sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PROJECT_TEMPLATE = ROOT / "templates" / "project"
KNOWLEDGE_TEMPLATE = ROOT / "templates" / "living-project-knowledge"
SLUG_RE = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
PHASE_RE = re.compile(r"^\|\s*Fase do fluxo\s*\|\s*(.*?)\s*\|", re.MULTILINE)


def list_projects(projects_dir: Path) -> int:
    found = sorted(p for p in projects_dir.iterdir() if p.is_dir()) if projects_dir.is_dir() else []
    if not found:
        print("No projects yet.")
        return 0
    for project in found:
        context = project / ".maestro" / "PROJECT_CONTEXT.md"
        phase = "?"
        if context.is_file():
            match = PHASE_RE.search(context.read_text(encoding="utf-8"))
            phase = match.group(1) if match and match.group(1) else "?"
        print(f"{project.name}\tphase: {phase}")
    return 0


def fill_placeholders(target: Path, values: dict[str, str]) -> None:
    for md in target.rglob("*.md"):
        text = md.read_text(encoding="utf-8")
        for key, value in values.items():
            text = text.replace(key, value)
        md.write_text(text, encoding="utf-8")


def create_project(slug: str, name: str, projects_dir: Path) -> int:
    if not SLUG_RE.match(slug):
        print(f"Invalid slug '{slug}': use kebab-case (e.g. gestao-clinica).", file=sys.stderr)
        return 1
    for template in (PROJECT_TEMPLATE, KNOWLEDGE_TEMPLATE):
        if not template.is_dir():
            print(f"Template missing: {template}", file=sys.stderr)
            return 1

    target = projects_dir / slug
    if target.exists():
        print(f"Project already exists: {target}. Continue it instead of recreating.", file=sys.stderr)
        return 2

    shutil.copytree(PROJECT_TEMPLATE, target)
    shutil.copytree(KNOWLEDGE_TEMPLATE, target / ".maestro")
    (target / ".maestro" / "README.md").unlink()

    today = date.today().isoformat()
    fill_placeholders(
        target,
        {
            "{{PROJECT_NAME}}": name,
            "{{PROJECT_SLUG}}": slug,
            "{{CREATED_AT}}": today,
            "| Nome do produto | |": f"| Nome do produto | {name} |",
            "| Repositório | |": f"| Repositório | `projects/{slug}/` |",
            "| Nome provisório | |": f"| Nome provisório | {name} |",
            "| Slug (`projects/<slug>`) | |": f"| Slug (`projects/<slug>`) | `{slug}` |",
            "| Fase do fluxo | (1 Discovery … 8 Entrega) |": "| Fase do fluxo | 1 Discovery |",
            "| YYYY-MM-DD | bootstrap `.maestro` | template inicial |": (
                f"| {today} | bootstrap `.maestro` | projeto criado por scripts/new-project.py |"
            ),
        },
    )

    try:
        shown = target.relative_to(ROOT)
    except ValueError:
        shown = target
    print(f"Created {shown}")
    print("Next: fill .maestro/PRODUCT_SPECIFICATION.md (Phase 2), then ARCHITECTURE/DATABASE/technical-decisions (Phase 3).")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("slug", nargs="?", help="kebab-case folder name under projects/")
    parser.add_argument("--name", help="provisional product name (default: derived from slug)")
    parser.add_argument("--list", action="store_true", help="list existing projects and their phase")
    parser.add_argument("--projects-dir", type=Path, default=ROOT / "projects", help=argparse.SUPPRESS)
    args = parser.parse_args()

    if args.list:
        return list_projects(args.projects_dir)
    if not args.slug:
        parser.error("slug is required (or use --list)")
    name = args.name or args.slug.replace("-", " ").title()
    args.projects_dir.mkdir(parents=True, exist_ok=True)
    return create_project(args.slug, name, args.projects_dir)


if __name__ == "__main__":
    raise SystemExit(main())
