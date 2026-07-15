import { existsSync } from "node:fs";
import config from "../../sleeke.json";
import fs from "node:fs/promises";
import path from "node:path";

type Messages = Record<string, unknown>;

const cache = new Map<string, Messages>();
const isProd = process.env.NODE_ENV === "production";

export async function loadMessages(locale: string): Promise<Messages> {
  return isProd
    ? loadProductionMessages(locale)
    : loadDevelopmentMessages(locale);
}

async function loadProductionMessages(locale: string): Promise<Messages> {
  const cached = cache.get(locale);
  if (cached) return cached;

  const filePath = path.join(process.cwd(), "dist/i18n", `${locale}.json`);

  try {
    const messages = await readJson(filePath);
    cache.set(locale, messages);
    return messages;
  } catch (error) {
    throw new Error(
      `Failed to initialize application in production.\nMissing localization bundles — run the build before starting the production server.`,
      { cause: error }
    );
  }
}

async function loadDevelopmentMessages(locale: string): Promise<Messages> {
  const localeDirectory = config.i18n?.localeDirectory ?? "src/locales";
  const dir = path.join(process.cwd(), localeDirectory, locale);

  if (!existsSync(dir)) {
    throw new Error(`[sleeke] locale "${locale}" is not available.`);
  }
  
  const messages: Messages = {};
  await collectJsonFiles(dir, messages);
  return messages;
}

async function collectJsonFiles(dir: string, target: Messages): Promise<void> {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      await collectJsonFiles(fullPath, target);
    } else if (entry.name.endsWith(".json")) {
      const content = await readJson(fullPath);
      Object.assign(target, content);
    }
  }
}

async function readJson(filePath: string): Promise<Messages> {
  const raw = await fs.readFile(filePath, "utf-8");
  if (!raw.trim()) return {};
  return JSON.parse(raw);
}