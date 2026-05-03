"use client";

import Link from "next/link";
import { useState } from "react";

interface CompactPub {
  id: string;
  name: string;
  niche: string;
  url: string;
  domain: string;
}

export function CompactPubCard({
  pub,
  logoToken,
}: {
  pub: CompactPub;
  logoToken?: string;
}) {
  const [logoFailed, setLogoFailed] = useState(false);

  const logoSrc =
    logoToken && !logoFailed
      ? `https://img.logo.dev/${pub.domain}?token=${logoToken}&size=64&format=png`
      : null;

  return (
    <Link
      href={pub.url}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className="group flex flex-col items-center gap-2 rounded-xl border border-border bg-background p-3 text-center transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
    >
      {/* Logo */}
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted overflow-hidden flex-shrink-0">
        {logoSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logoSrc}
            alt=""
            aria-hidden="true"
            width={32}
            height={32}
            className="rounded-md object-contain"
            onError={() => setLogoFailed(true)}
          />
        ) : (
          <span className="text-xs font-bold text-muted-foreground">
            {pub.name.charAt(0)}
          </span>
        )}
      </div>

      {/* Text */}
      <div className="space-y-0.5">
        <p className="text-[11px] font-semibold text-foreground leading-tight line-clamp-2">
          {pub.name}
        </p>
        <p className="text-[10px] text-muted-foreground leading-tight">
          {pub.niche}
        </p>
      </div>
    </Link>
  );
}
