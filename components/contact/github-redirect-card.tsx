import Link from "next/link";

import { Icons } from "@/components/common/icons";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const CONNECT_LINKS = [
  {
    label: "Upwork",
    description: "Hire me for freelance projects",
    href: "https://www.upwork.com/freelancers/~01a0329d5969c58bc8",
    icon: Icons.upwork,
    external: true,
  },
  {
    label: "LinkedIn",
    description: "Connect professionally",
    href: "https://www.linkedin.com/in/anshul-jain99/",
    icon: Icons.linkedin,
    external: true,
  },
];

export default function ConnectCard() {
  return (
    <Card className="w-full h-fit max-w-sm shadow-sm border-border">
      <CardContent className="p-6 flex flex-col gap-5">
        <div>
          <h2 className="font-heading text-xl font-semibold text-foreground">
            Other ways to connect
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            I typically respond within 24 hours. For work inquiries, Upwork is
            the fastest route.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {CONNECT_LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.label}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer nofollow" : undefined}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "w-full justify-start gap-3 py-5 h-auto text-left"
                )}
              >
                <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium leading-none">
                    {link.label}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {link.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        <p className="text-xs text-muted-foreground text-center border-t border-border pt-4">
          Based in India · Available for remote work worldwide
        </p>
      </CardContent>
    </Card>
  );
}
