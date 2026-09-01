"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

/**
 * Replica el "reveal on scroll" de Emma_web_v2_minimalista_SEO.html:
 * IntersectionObserver con threshold .12 que agrega la clase "in" una
 * sola vez (luego deja de observar), combinada con la transición
 * definida en globals.css (.reveal / .reveal.in).
 */
export default function Reveal({
  children,
  className,
  style,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      id={id}
      className={clsx("reveal", visible && "in", className)}
      style={style}
    >
      {children}
    </div>
  );
}
