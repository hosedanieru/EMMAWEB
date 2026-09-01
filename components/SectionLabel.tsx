import type { ReactNode } from "react";

export default function SectionLabel({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: string;
}) {
  return (
    <div className="mx-auto mb-[66px] flex max-w-[640px] flex-col items-center gap-3.5 text-center">
      <span className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-brand-orange-d">
        {eyebrow}
      </span>
      <h2 className="text-[clamp(1.9rem,3.6vw,2.9rem)] text-brand-green">
        {title}
      </h2>
      {description ? (
        <p className="text-[1.05rem] text-brand-muted">{description}</p>
      ) : null}
    </div>
  );
}
