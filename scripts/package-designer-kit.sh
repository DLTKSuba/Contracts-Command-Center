#!/usr/bin/env bash
# Package the Harmony Designer Starter for distribution.
# Run from the harmony-designer-starter directory (repository root of this kit).
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT_DIR="${ROOT}/dist-kit"
ZIP_NAME="harmony-designer-starter.zip"
mkdir -p "${OUT_DIR}"

TMP="$(mktemp -d)"
cleanup() { rm -rf "${TMP}"; }
trap cleanup EXIT

# Copy tree excluding heavy or generated dirs
rsync -a \
  --exclude 'node_modules' \
  --exclude 'dist' \
  --exclude '.git' \
  --exclude 'dist-kit' \
  --exclude '.DS_Store' \
  "${ROOT}/" "${TMP}/harmony-designer-starter/"

( cd "${TMP}" && zip -r -q "${OUT_DIR}/${ZIP_NAME}" "harmony-designer-starter" )

echo "Wrote ${OUT_DIR}/${ZIP_NAME}"
