"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Icons } from "@/components/common/icons";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FeaturedPublication {
  id: string;
  name: string;
  niche: string;
  url: string;
  image?: string;
  domain: string;
  logoSrc?: string;
}

export function FeaturedPublicationCard({
  pub,
  logoToken,
}: {
  pub: FeaturedPublication;
  logoToken?: string;
}) {
  const [logoFailed, setLogoFailed] = useState(false);

  const logoSrc = pub.logoSrc
    ? pub.logoSrc
    : logoToken && !logoFailed
      ? `https://img.logo.dev/${pub.domain}?token=${logoToken}&size=64&format=png`
      : null;
  const fallbackMark = (() => {
    const parts = pub.name.match(/[A-Za-z0-9]+/g) ?? [];
    if (parts.length === 0) return "?";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return parts
      .slice(0, 3)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  })();

  return (
    <Link
      href={pub.url}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className="group flex flex-col rounded-2xl border border-border bg-card overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
    >
      {/* Image — only rendered when a banner is available */}
      {pub.image ? (
        <div className="relative h-56 w-full overflow-hidden bg-muted">
          <Image
            src={pub.image}
            alt={pub.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
        </div>
      ) : (
        <div className="flex h-32 w-full flex-col items-center justify-center gap-3 bg-muted px-4 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-background ring-1 ring-border/70 overflow-hidden">
            {logoSrc ? (
              <Image
                src={logoSrc}
                alt=""
                width={36}
                height={36}
                className="h-9 w-9 object-contain"
                onError={() => setLogoFailed(true)}
                unoptimized={Boolean(pub.logoSrc)}
              />
            ) : (
              <span className="font-calsans text-xs uppercase tracking-[0.18em] text-muted-foreground">
                {fallbackMark}
              </span>
            )}
          </div>
          <p className="text-sm font-medium text-foreground leading-tight">
            {pub.name}
          </p>
        </div>
      )}

      {/* Text area */}
      <div className="flex flex-col gap-1.5 p-4">
        {/* Logo + name row */}
        <div className="flex items-center gap-2">
          {logoSrc && (
            <Image
              src={logoSrc}
              alt=""
              width={22}
              height={22}
              className="rounded-md object-contain flex-shrink-0"
              onError={() => setLogoFailed(true)}
              unoptimized={Boolean(pub.logoSrc)}
            />
          )}
          <p className="font-semibold text-sm text-foreground leading-snug">
            {pub.name}
          </p>
        </div>
        <p className="text-xs text-muted-foreground">{pub.niche}</p>
        <span
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "self-start px-0 mt-1 text-ring hover:text-ring hover:bg-transparent text-xs font-medium"
          )}
        >
          View Articles{" "}
          <Icons.externalLink className="ml-1.5 h-3 w-3" />
        </span>
      </div>
    </Link>
  );
}
