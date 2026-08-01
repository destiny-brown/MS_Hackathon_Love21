#!/usr/bin/env node
/**
 * Extracts translatable strings from data files into locale JSON skeletons.
 * Run: node scripts/extract-i18n-keys.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function writeJson(file, data) {
  fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
  fs.writeFileSync(path.join(root, file), JSON.stringify(data, null, 2) + "\n");
}

// --- Quiz ---
const quizSrc = read("lib/learn-quiz-data.ts");
const quizQuestions = {};
for (const m of quizSrc.matchAll(/id: "(q\d+)"[\s\S]*?statement: "([^"]+)"[\s\S]*?explanation:\s*"([^"]+)"[\s\S]*?topic: "([^"]+)"/g)) {
  const [, id, statement, explanation, topic] = m;
  quizQuestions[id] = { statement, explanation, topic };
}
writeJson("locales/en/learn.json", { quiz: { questions: quizQuestions } });

// --- Community quotes ---
const quotesSrc = read("lib/community-quotes.ts");
const quotes = {};
for (const m of quotesSrc.matchAll(/id: "([^"]+)"[\s\S]*?quote: "([^"]+)"[\s\S]*?programmeLabel: "([^"]+)"/g)) {
  const [, id, quote, programmeLabel] = m;
  quotes[id] = { quote, programmeLabel };
}

const existingLearn = JSON.parse(read("locales/en/learn.json"));
existingLearn.quotes = quotes;
writeJson("locales/en/learn.json", existingLearn);

console.log("Extracted quiz:", Object.keys(quizQuestions).length, "quotes:", Object.keys(quotes).length);
