# Reproducible local KI-Unterricht deployment (Linux/macOS/WSL).
SHELL := /bin/sh
.DEFAULT_GOAL := local

PYTHON ?= python3
HOST ?= 127.0.0.1
PORT ?= 8000
VENV := .venv
VENV_PY := $(VENV)/bin/python
PREVIEW_STAMP := $(VENV)/.preview-ready
FULL_STAMP := $(VENV)/.full-ready
NPM_STAMP := $(VENV)/.npm-ready
NODE_DIR := extensions/ki-autostart

.PHONY: help preview local full build serve install install-preview test clean new-chapter

help:
	@printf '%s\n' \
		'make / make local  Vollstaendige App erstellen und unter http://$(HOST):$(PORT)/projekt/ starten' \
		'make preview       Schnelle Inhaltsvorschau mit automatischem Neuaufbau (ohne Notebooks)' \
		'make build         Vollstaendige App inklusive JupyterLite nach dist/ bauen' \
		'make serve         Bereits gebaute App aus dist/ anzeigen' \
		'make test          Build und lokale Struktur-/Funktionstests (Browser-CI separat)' \
		'make new-chapter SECTION=einstieg NUMMER=3a TITLE="..." AFTER=030' \
		'make install       Alle lokalen Python- und npm-Abhaengigkeiten installieren' \
		'make clean         Lokale Build-Dateien und Umgebungen loeschen' \
		'PORT=8080 make     Alternativen lokalen Port verwenden'

$(VENV_PY):
	@command -v $(PYTHON) >/dev/null 2>&1 || { echo 'Python 3 ist nicht installiert.' >&2; exit 1; }
	$(PYTHON) -m venv $(VENV)

$(PREVIEW_STAMP): requirements-preview.txt | $(VENV_PY)
	$(VENV_PY) -m pip install -r requirements-preview.txt
	@touch $@

$(FULL_STAMP): requirements.txt requirements-preview.txt $(PREVIEW_STAMP)
	$(VENV_PY) -m pip install -r requirements.txt
	@touch $@

$(NPM_STAMP): $(NODE_DIR)/package.json $(NODE_DIR)/package-lock.json | $(VENV_PY)
	@command -v npm >/dev/null 2>&1 || { echo 'Node.js/npm fehlt (Node.js 22 empfohlen).' >&2; exit 1; }
	npm ci --prefix $(NODE_DIR)
	@touch $@

install-preview: $(PREVIEW_STAMP)

install: $(FULL_STAMP) $(NPM_STAMP)

# Optional authoring helper (no virtual environment needed).
new-chapter:
	@test -n "$(SECTION)" -a -n "$(NUMMER)" -a -n "$(TITLE)" || { echo 'Benutzung: make new-chapter SECTION=einstieg NUMMER=3a TITLE="..." [AFTER=030]' >&2; exit 2; }
	$(PYTHON) scripts/new_chapter.py $(SECTION) --nummer "$(NUMMER)" --title "$(TITLE)" $(if $(AFTER),--after $(AFTER),)

preview: install-preview
	@printf 'Schnellvorschau: http://$(HOST):$(PORT)/projekt/\n'
	$(VENV_PY) scripts/preview.py --host $(HOST) --port $(PORT)

build: install
	npm run build --prefix $(NODE_DIR)
	$(VENV_PY) scripts/build_portal.py
	$(VENV_PY) scripts/build_course.py
	$(VENV_PY) scripts/build_basis.py
	$(VENV_PY) scripts/build_portal_notebooks.py
	$(VENV)/bin/jupyter lite build --contents _build/content --output-dir dist
	$(VENV_PY) scripts/copy_portal.py dist
	@printf 'Vollstaendiger lokaler Build: dist/\n'

serve:
	@test -f dist/projekt/index.html || { echo 'Kein Build in dist/. Erst make build ausfuehren.' >&2; exit 1; }
	@printf 'Kursportal: http://$(HOST):$(PORT)/projekt/ (Ctrl+C zum Beenden)\n'
	$(PYTHON) -m http.server $(PORT) --bind $(HOST) --directory dist

local: build
	$(MAKE) --no-print-directory serve HOST=$(HOST) PORT=$(PORT) PYTHON=$(PYTHON)

full: local

test: build
	$(VENV_PY) tests/check_course_routes.py
	$(VENV_PY) tests/check_basis.py
	$(VENV_PY) tests/check_course.py
	$(VENV_PY) tests/check_generated_content.py
	$(VENV_PY) tests/check_new_chapter.py
	$(VENV_PY) tests/check_new_lessons.py
	$(VENV_PY) tests/check_new_lesson_cli.py
	$(VENV_PY) tests/check_materials.py
	$(VENV_PY) tests/check_admin.py
	$(VENV_PY) tests/check_course_model.py
	$(VENV_PY) tests/check_didactics.py
	$(VENV_PY) tests/check_portal_content.py
	$(VENV_PY) tests/check_solutions.py
	$(VENV_PY) tests/check_content_mvc.py
	$(VENV_PY) tests/check_ki_basis.py
	$(VENV_PY) tests/check_pyodide_lock.py
	node tests/check_autostart.cjs
	node tests/check_archive.cjs
	node tests/check_notebook_snapshot.cjs
	node tests/check_admin.mjs
	PYTHON=$(VENV_PY) node tests/check_course_model.mjs
	@echo 'Lokale Tests bestanden. Echte Notebook- und ZIP-Browsertests laufen in GitHub Actions.'

clean:
	rm -rf dist $(VENV) $(NODE_DIR)/node_modules
