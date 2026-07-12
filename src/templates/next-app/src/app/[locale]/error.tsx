"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void; }) {
  const t = useTranslations("errors");
  const common = useTranslations("common");

  useEffect(() => {
    console.error("Application error:", error);
    document.title = `${t("internal.title")} | ${common("meta.site-name")}`;
  }, [error]);

  return (
    <div>
      <h1>{t("internal.title")}</h1>
      <p>{t("internal.description")}</p>
      <a onClick={() => reset()} className="text-blue-500 cursor-pointer hover:underline">
        {t("internal.try-again")}
      </a>
    </div>
  );
}