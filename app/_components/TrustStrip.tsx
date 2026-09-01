"use client";

import { Sprout, CheckCircle2, Clock, Factory } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";

const iconos = [Sprout, CheckCircle2, Clock, Factory];

export default function TrustStrip() {
  const { t } = useLocale();

  return (
    <div className="border-y border-brand-line-2 py-[30px]">
      <div className="mx-auto flex max-w-[1180px] flex-wrap justify-center gap-5 px-7 sm:justify-between">
        {t.home.trust.map((texto, i) => {
          const Icon = iconos[i];
          return (
            <div
              key={texto}
              className="flex items-center gap-[.6rem] text-[0.94rem] font-medium text-brand-ink"
            >
              <Icon className="h-6 w-6 stroke-[1.5] text-brand-green" />
              {texto}
            </div>
          );
        })}
      </div>
    </div>
  );
}
