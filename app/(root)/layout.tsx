"use client";

import { motion } from "framer-motion";
import { Norican } from "next/font/google";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import { Icons } from "@/components/common/icons";
import { MobileNav } from "@/components/common/mobile-nav";
import { ModeToggle } from "@/components/common/mode-toggle";
import { SiteFooter } from "@/components/common/site-footer";
import { buttonVariants } from "@/components/ui/button";
import { routesConfig } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const norican = Norican({
  weight: ["400"],
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
});

const navItemVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.1 * i, duration: 0.5, ease: "easeOut" as const },
  }),
};

/** Scroll-direction threshold in px — prevents flicker from micro-scrolls */
const SCROLL_DEADZONE = 10;

function SiteHeader() {
  const pathname = usePathname();
  const [showMobileMenu, setShowMobileMenu] = React.useState(false);

  // ── Scroll-triggered sticky nav state ──────────────────────────────────
  const [headerVisible, setHeaderVisible] = React.useState(true);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const lastScrollY = React.useRef(0);

  React.useEffect(() => {
    setShowMobileMenu(false);
  }, [pathname]);

  React.useEffect(() => {
    function onScroll() {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;

      // Show/hide based on scroll direction (with deadzone)
      if (delta > SCROLL_DEADZONE) {
        // Scrolling DOWN — hide header (but not if mobile menu is open)
        if (!showMobileMenu) setHeaderVisible(false);
      } else if (delta < -SCROLL_DEADZONE) {
        // Scrolling UP — show header
        setHeaderVisible(true);
      }

      // At the very top of the page, always show + no blur bg
      if (currentY <= 0) {
        setHeaderVisible(true);
        setIsScrolled(false);
      } else {
        setIsScrolled(true);
      }

      lastScrollY.current = currentY;
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [showMobileMenu]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out",
        isScrolled
          ? "bg-background/60 md:bg-background/80 backdrop-blur-md border-b border-border/40 shadow-sm"
          : "bg-background",
        headerVisible ? "translate-y-0" : "-translate-y-full"
      )}
    >
      <div className="container flex h-14 md:h-20 items-center justify-between py-3 md:py-6 px-6 md:px-8">

        {/* Logo — left */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/" className="flex items-center">
            <span className={cn(norican.className, "text-xl md:text-2xl")}>
              {siteConfig.authorName}
            </span>
          </Link>
        </motion.div>

        {/* Desktop nav — right */}
        <nav className="hidden md:flex items-center gap-6">
          {routesConfig.mainNav.map((item: any, index: number) => (
            <motion.div
              key={index}
              custom={index}
              initial="hidden"
              animate="visible"
              variants={navItemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href={item.disabled ? "#" : item.href}
                className={cn(
                  "flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm",
                  (item.href === "/" ? pathname === "/" : pathname?.startsWith(item.href))
                    ? "text-ring font-semibold"
                    : "text-foreground/60",
                  item.disabled && "cursor-not-allowed opacity-80"
                )}
              >
                {item.title}
              </Link>
            </motion.div>
          ))}
          <Link
            href="/contact"
            className={cn(buttonVariants({ size: "sm" }))}
            aria-label="Get in touch with Anshul Jain"
          >
            Get in Touch
          </Link>
          <ModeToggle />
        </nav>

        {/* Mobile hamburger */}
        <motion.button
          className="flex items-center space-x-2 md:hidden"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {showMobileMenu ? <Icons.close /> : <Icons.menu />}
          <span className="text-base font-bold">Menu</span>
        </motion.button>
        {showMobileMenu && (
          <MobileNav
            items={routesConfig.mainNav}
            onClose={() => setShowMobileMenu(false)}
          />
        )}
      </div>
    </header>
  );
}

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      {/* Spacer — compensates for the fixed-position header */}
      <div className="h-14 md:h-20" />
      <main className="container flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
