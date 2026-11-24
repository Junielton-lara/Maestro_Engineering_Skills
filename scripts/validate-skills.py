#!/usr/bin/env python3
"""Validate Maestro Engineering Skills frontmatter, structure, and sync integrity."""

from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "skills"
TARGETS = [ROOT / ".cursor" / "skills", ROOT / ".claude" / "skills"]

REQUIRED_SECTIONS = [
    "## Objetivo",
    "## Quando ativar",
    "## Quando NÃO ativar",
    "## Contexto técnico necessário",
    "## Regras obrigatórias",
    "## Processo de execução",
    "## Boas práticas",
    "## Erros comuns",
    "## Exemplos práticos",
    "## Critérios de qualidade",
    "## Checklist de validação",
    "## Skills relacionadas",
]

NAME_RE = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
EXPECTED = {
    # core
    "maestro-core",
    "maestro-orchestrator",
    "maestro-token-efficiency",
    "autonomous-project-builder",
    "project-foundation",
    "product-discovery",
    "prompt-master-generator",
    "software-architecture",
    "project-planning",
    # agents
    "development-agent",
    "code-review-agent",
    "qa-agent",
    "documentation-agent",
    "git-agent",
    "knowledge-agent",
    "infrastructure-agent",
    # efficiency
    "context-management",
    "prompt-optimization",
    "intelligent-code-analysis",
    "efficient-development",
    "agent-orchestration",
    "response-efficiency",
    # frontend
    "frontend-engineering",
    "ux-ui-design",
    "design-system",
    "mobile-first",
    "responsive-layout",
    "accessibility",
    "frontend-performance",
    # backend
    "backend-engineering",
    "api-design",
    "database-postgresql",
    "database-optimization",
    "multi-tenancy",
    "authentication-authorization",
    "integrations",
    # quality
    "security-engineering",
    "testing-qa",
    "automated-testing",
    "code-review",
    "performance-optimization",
    "error-handling",
    # infra
    "devops-infrastructure",
    "hostinger-deployment",
    "linux-server-management",
    "nginx-configuration",
    "docker-management",
    "ci-cd",
    "environment-configuration",
    "observability",
    "backup-recovery",
    # docs
    "technical-documentation",
    "project-handoff",
    "deployment-documentation",
}


def parse_frontmatter(text: str) -> dict[str, str]:
    if not text.startswith("---\n"):
        raise ValueError("missing opening frontmatter")
    end = text.find("\n---\n", 4)
    if end < 0:
        raise ValueError("missing closing frontmatter")
    block = text[4:end]
    data: dict[str, str] = {}
    key = None
    for line in block.splitlines():
        if not line.strip():
            continue
        if line.startswith("  ") and key == "description":
            data[key] = (data.get(key, "") + " " + line.strip()).strip()
            continue
        if ":" in line and not line.startswith(" "):
            k, v = line.split(":", 1)
            key = k.strip()
            data[key] = v.strip().strip("\"'")
            if data[key] == ">-":
                data[key] = ""
        elif key == "description" and line.startswith("  "):
            data[key] = (data.get(key, "") + " " + line.strip()).strip()
    return data


def validate_skill(path: Path, errors: list[str]) -> None:
    skill_md = path / "SKILL.md"
    if not skill_md.is_file():
        errors.append(f"{path.name}: missing SKILL.md")
        return
    text = skill_md.read_text(encoding="utf-8")
    try:
        meta = parse_frontmatter(text)
    except ValueError as exc:
        errors.append(f"{path.name}: {exc}")
        return

    name = meta.get("name", "")
    desc = meta.get("description", "")
    if name != path.name:
        errors.append(f"{path.name}: name '{name}' != directory")
    if not NAME_RE.match(name or ""):
        errors.append(f"{path.name}: invalid name '{name}'")
    if not desc or len(desc) > 1024:
        errors.append(f"{path.name}: description missing or >1024 chars ({len(desc)})")
    if "framework: maestro-engineering-skills" not in text.split("---", 2)[1]:
        # metadata block check via raw
        pass
    if "maestro-engineering-skills" not in text[:800]:
        errors.append(f"{path.name}: missing metadata.framework")
    for section in REQUIRED_SECTIONS:
        if section not in text:
            errors.append(f"{path.name}: missing section {section}")
    lines = text.count("\n") + 1
    if lines > 500:
        errors.append(f"{path.name}: SKILL.md too long ({lines} lines)")


def file_fingerprint(path: Path) -> str:
    return (path / "SKILL.md").read_text(encoding="utf-8")


def main() -> int:
    errors: list[str] = []
    if not SOURCE.is_dir():
        print("skills/ missing", file=sys.stderr)
        return 1

    found = {p.name for p in SOURCE.iterdir() if p.is_dir()}
    missing = EXPECTED - found
    extra = found - EXPECTED
    if missing:
        errors.append(f"missing skills: {sorted(missing)}")
    if extra:
        errors.append(f"unexpected skills: {sorted(extra)}")

    for skill in sorted(found):
        validate_skill(SOURCE / skill, errors)

    for target in TARGETS:
        if not target.is_dir():
            errors.append(f"target missing: {target}")
            continue
        tfound = {p.name for p in target.iterdir() if p.is_dir()}
        if tfound != found:
            errors.append(f"sync mismatch {target}: {sorted(found ^ tfound)}")
            continue
        for name in found:
            if file_fingerprint(SOURCE / name) != file_fingerprint(target / name):
                errors.append(f"content drift: {name} in {target}")

    templates = ROOT / "templates"
    expected_templates = [
        "project-context.md",
        "prompt-master.md",
        "architecture.md",
        "database-design.md",
        "security-checklist.md",
        "testing-plan.md",
        "deployment.md",
        "project-handoff.md",
        "frontend-structure.md",
        "backend-structure.md",
        "components-organization.md",
        "pages-organization.md",
        "publish-checklist.md",
    ]
    for t in expected_templates:
        if not (templates / t).is_file():
            errors.append(f"missing template: {t}")

    if not (ROOT / "MAESTRO_ENGINEERING_STANDARDS.md").is_file():
        errors.append("missing MAESTRO_ENGINEERING_STANDARDS.md")
    if not (templates / "living-project-knowledge" / "README.md").is_file():
        errors.append("missing templates/living-project-knowledge/README.md")
    if not (ROOT / "README.md").is_file():
        errors.append("missing README.md")
    if not (ROOT / "CONTRIBUTING.md").is_file():
        errors.append("missing CONTRIBUTING.md")
    if not (ROOT / "CHANGELOG.md").is_file():
        errors.append("missing CHANGELOG.md")

    if errors:
        print("VALIDATION FAILED")
        for e in errors:
            print(f" - {e}")
        return 1

    print(f"OK: {len(found)} skills valid; .cursor and .claude in sync; templates present.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
