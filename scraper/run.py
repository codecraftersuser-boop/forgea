#!/usr/bin/env python3
"""
CLI runner for Forgea scrapers.

Usage:
    python -m scraper.run                        # run all scrapers
    python -m scraper.run --sources freeCodeCamp kaggle  # specific sources
    python -m scraper.run --dry-run              # print counts, no DB writes
    python -m scraper.run --list                 # list available scrapers
"""
from __future__ import annotations
import argparse
import logging
import os
import sys
import time
from typing import TYPE_CHECKING

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s — %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger("forgea.scraper")


def main() -> None:
    parser = argparse.ArgumentParser(description="Forgea course scraper")
    parser.add_argument("--sources", nargs="+", metavar="NAME", help="Scrapers to run (default: all)")
    parser.add_argument("--dry-run", action="store_true", help="Fetch only, skip DB writes")
    parser.add_argument("--list", action="store_true", help="List available scrapers and exit")
    args = parser.parse_args()

    from scraper.scrapers import ALL_SCRAPERS, SCRAPER_MAP

    if args.list:
        print("Available scrapers:")
        for s in ALL_SCRAPERS:
            print(f"  {s.name:25s}  {s.source_url}")
        return

    selected = ALL_SCRAPERS
    if args.sources:
        selected = []
        for name in args.sources:
            if name not in SCRAPER_MAP:
                log.error("Unknown scraper %r. Use --list to see available scrapers.", name)
                sys.exit(1)
            selected.append(SCRAPER_MAP[name])

    database_url = os.getenv("DATABASE_URL", "postgresql://forgea:forgea@localhost:5432/forgea_db")

    if not args.dry_run:
        from scraper.pipeline import Pipeline
        pipeline = Pipeline(database_url)

    total_inserted = total_updated = 0
    start = time.time()

    for scraper_cls in selected:
        scraper = scraper_cls()
        log.info("▶ Running %s …", scraper.name)
        t0 = time.time()
        try:
            courses = scraper.scrape()
        except Exception as exc:
            log.error("✗ %s crashed: %s", scraper.name, exc)
            continue

        elapsed = time.time() - t0
        log.info("  fetched %d courses in %.1fs", len(courses), elapsed)

        if not args.dry_run and courses:
            inserted, updated = pipeline.run(courses, scraper.name)
            total_inserted += inserted
            total_updated += updated
            log.info("  ✓ inserted=%d updated=%d", inserted, updated)

    log.info(
        "Done in %.1fs — total inserted=%d updated=%d",
        time.time() - start,
        total_inserted,
        total_updated,
    )


if __name__ == "__main__":
    main()
