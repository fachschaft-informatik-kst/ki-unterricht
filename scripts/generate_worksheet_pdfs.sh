#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
COURSE_DIR="$SCRIPT_DIR/../kurse/bok/4-klasse"

MARGIN="2.3cm"
INCLUDE_SOLUTIONS=1

usage() {
  cat <<'EOF'
Usage: scripts/generate_worksheet_pdfs.sh [--course <slug>] [--no-solutions] [--margin <value>]

Generates PDFs for all Markdown files in "md/" and writes them to "pdf/".

Options:
  --no-solutions      Skip solution files matching *_Lsg.md
  --course <slug>     Course source, e.g. irn/1-klasse (default: bok/4-klasse)
  --margin <value>    Pandoc geometry margin value (default: 2.3cm)
  -h, --help          Show this help
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --course)
      [[ "${2:-}" =~ ^[a-z][a-z0-9]*/(1|4)-klasse$ ]] || { echo "ERROR: Invalid course slug." >&2; exit 2; }
      COURSE_DIR="$SCRIPT_DIR/../kurse/$2"
      shift 2
      ;;
    --no-solutions)
      INCLUDE_SOLUTIONS=0
      shift
      ;;
    --margin)
      MARGIN="${2:-}"
      if [[ -z "$MARGIN" ]]; then
        echo "ERROR: --margin requires a value" >&2
        exit 2
      fi
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "ERROR: Unknown argument: $1" >&2
      usage >&2
      exit 2
      ;;
  esac
done
MD_DIR="$COURSE_DIR/worksheets/md"
PDF_DIR="$COURSE_DIR/worksheets/pdf"

if ! command -v pandoc >/dev/null 2>&1; then
  echo "ERROR: pandoc is not installed or not on PATH." >&2
  echo "Install from https://pandoc.org/ or via your package manager." >&2
  exit 1
fi

shopt -s nullglob

if [[ ! -d "$MD_DIR" ]]; then
  echo "ERROR: Markdown folder not found: $MD_DIR" >&2
  exit 1
fi

mkdir -p -- "$PDF_DIR"

mapfile -t files < <(cd -- "$MD_DIR" && printf '%s\n' *.md)

if [[ ${#files[@]} -eq 0 ]]; then
  echo "No markdown files found (*.md) in $MD_DIR" >&2
  exit 1
fi

cd -- "$MD_DIR"

count=0
for f in "${files[@]}"; do
  if [[ $INCLUDE_SOLUTIONS -eq 0 && "$f" == *_Lsg.md ]]; then
    continue
  fi

  base="${f%.md}"
  out="$PDF_DIR/${base}.pdf"

  echo "pandoc md/$f -> pdf/${base}.pdf"
  pandoc "$f" -V "geometry:margin=${MARGIN}" -H "$SCRIPT_DIR/../shared/worksheet-pdf/header.tex" -o "$out"
  count=$((count + 1))
done

echo "Done. Generated ${count} PDF(s) in $PDF_DIR"
