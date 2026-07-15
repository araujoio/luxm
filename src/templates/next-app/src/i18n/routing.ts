import { defineRouting } from "next-intl/routing";
import sleeke from "../../sleeke.json";

export const routing = defineRouting({
  locales: sleeke.i18n.locales as [string, ...string[]],
  defaultLocale: sleeke.i18n.defaultLocale,
  localePrefix: "always",
  pathnames: {
    "/": "/"
  },
});