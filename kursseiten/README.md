# Kanonische Kursquellen und alte BOK-Kompatibilität

**Dieses Verzeichnis ist nicht mehr die bevorzugte Quelle zur Bearbeitung.** Alle Kursseiten stehen getrennt unter `kurse/<lehrperson>/<klasse>/kursseiten/`. Die vollständigen Ausgangsvorlagen liegen unter `templates/{1-klasse,4-klasse}/`. Die bisherigen BOK-Quellen hier werden durch `python scripts/sync_course_sources.py` aus `kurse/bok/` gespiegelt, um bestehende BOK-Builds und historische Links stabil zu halten.

AVIVA-Phasen werden unter `kurse/<kurs>/kursseiten/<bereich>/planung.json`, Materialkoffer unter `.../materialien.md`, Kapitel unter `.../NNN-*.md`, Glossar unter `.../glossar.json` bearbeitet. Der Lehrpersonen-Editor bietet die Kursauswahl, Kapitelvorschau, AVIVA-Bearbeitung und Material- und Glossarauswahl. Antwort- und Kapitel-IDs bestehender Kurse dürfen nicht unüberlegt verändert werden.

Mehr Details: [Vollständige Kursvorlagen und Isolation](../docs/KURSVORLAGEN.md) und [Haupt-README](../README.md).
