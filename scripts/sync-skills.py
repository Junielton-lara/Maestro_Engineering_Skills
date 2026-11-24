#!/usr/bin/env python3
"""Sync canonical skills/ and agents/ -> .cursor and .claude."""

from __future__ import annotations

import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "skills"
TARGETS = [ROOT / ".cursor" / "skills", ROOT / ".claude" / "skills"]
AGENTS_SOURCE = ROOT / "agents"
AGENT_TARGETS = [ROOT / ".cursor" / "agents", ROOT / ".claude" / "agents"]


def main() -> int:
    if not SOURCE.is_dir():
        print(f"Canonical skills folder not found: {SOURCE}", file=sys.stderr)
        return 1

    skill_dirs = sorted(p for p in SOURCE.iterdir() if p.is_dir())
    if not skill_dirs:
        print(f"No skills found under {SOURCE}", file=sys.stderr)
        return 1

    for target in TARGETS:
        target.mkdir(parents=True, exist_ok=True)
        for skill in skill_dirs:
            dest = target / skill.name
            if dest.exists():
                shutil.rmtree(dest)
            shutil.copytree(skill, dest)
        print(f"Synced {len(skill_dirs)} skills -> {target}")

    agent_files = sorted(AGENTS_SOURCE.glob("*.md")) if AGENTS_SOURCE.is_dir() else []
    for target in AGENT_TARGETS:
        target.mkdir(parents=True, exist_ok=True)
        for agent in agent_files:
            shutil.copy2(agent, target / agent.name)
        print(f"Synced {len(agent_files)} agents -> {target}")

    print("Done.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
