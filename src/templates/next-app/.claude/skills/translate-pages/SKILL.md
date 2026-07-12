---
name: translate-pages
description: It's used to bulk translate all pages of the website, from the default language to other languages defined in `luxm.json`.
---

# Translate Pages

This skill translates all route pages from the default locale to other locales defined in `luxm.json`.

## Workflow

1. Read `luxm.json` to identify `defaultLocale` and target `locales`
2. For each locale (except default), create a cloned directory structure under `src/locales/<locale>/routes/`
3. Translate all JSON locale files using the AI model

