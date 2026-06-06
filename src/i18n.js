import fs from "fs";
import path from "path";

const localesDir = path.join(process.cwd(), "src", "locales");

const translations = {
  en: JSON.parse(fs.readFileSync(path.join(localesDir, "en.json"), "utf8")),
  es: JSON.parse(fs.readFileSync(path.join(localesDir, "es.json"), "utf8")),
  it: JSON.parse(fs.readFileSync(path.join(localesDir, "it.json"), "utf8"))
};

export function t(key, lang = "en") {
  const dict = translations[lang] || translations["en"];
  return dict[key] || key;
}
