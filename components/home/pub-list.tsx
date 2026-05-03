"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { cn } from "@/lib/utils";

interface Pub {
  id: string;
  name: string;
  niche: string;
  url: string;
  domain: string;
  logoSrc?: string;
}

export function PubList({
  pubs,
  logoToken,
}: {
  pubs: Pub[];
  logoToken?: string;
}) {
  const [failed, setFailed] = useState<Record<string, boolean>>({});

  const getFallbackMark = (name: string) => {
    const parts = name.match(/[A-Za-z0-9]+/g) ?? [];
    if (parts.length === 0) return "?";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return parts
      .slice(0, 3)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-5 md:grid-cols-6">
      {pubs.map((pub) => {
        const logoSrc = pub.logoSrc
          ? pub.logoSrc
          : logoToken && !failed[pub.id]
            ? `https://img.logo.dev/${pub.domain}?token=${logoToken}&size=64&format=png`
            : null;
        const rowClass =
          pubs.length === 5
            ? pub.id === pubs[3]?.id
              ? "md:col-start-2 md:col-span-2"
              : pub.id === pubs[4]?.id
                ? "md:col-start-4 md:col-span-2"
                : "md:col-span-2"
            : "md:col-span-2";

        return (
          <Link
            key={pub.id}
            href={pub.url}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className={cn(
              "group flex flex-col items-center justify-start gap-2 px-1 py-1 text-center transition-opacity duration-200 hover:opacity-80",
              rowClass
            )}
          >
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden flex-shrink-0">
              {logoSrc ? (
                <Image
                  src={logoSrc}
                  alt=""
                  width={36}
                  height={36}
                  className="h-9 w-9 object-contain"
                  onError={() =>
                    setFailed((prev) => ({ ...prev, [pub.id]: true }))
                  }
                  unoptimized={Boolean(pub.logoSrc)}
                />
              ) : (
                <span className="font-calsans text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  {getFallbackMark(pub.name)}
                </span>
              )}
            </div>
            <span className="text-[11px] font-medium leading-tight text-foreground text-balance">
              {pub.name}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
