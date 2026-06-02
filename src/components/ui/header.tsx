"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { MenuToggleIcon } from "@/components/ui/menu-toggle-icon";
import { useScroll } from "@/components/ui/use-scroll";
import { LanguageSelector } from "@/components/ui/language-selector-dropdown";
import { FlowButton } from "@/components/ui/flow-button";

const serviceItems = [
  { key: "privateLabel", href: "/private-label" },
  { key: "customProduct", href: "/services/custom-product" },
  { key: "export", href: "/services/export" },
] as const;

const HOVER_CLOSE_DELAY = 150;

export function Header() {
  const t = useTranslations("nav");
  const [open, setOpen] = React.useState(false);
  const [servicesOpen, setServicesOpen] = React.useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = React.useState(false);
  const scrolled = useScroll(10);
  const servicesCloseTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = () => {
    if (servicesCloseTimer.current) {
      clearTimeout(servicesCloseTimer.current);
      servicesCloseTimer.current = null;
    }
  };

  const openServices = () => {
    cancelClose();
    setServicesOpen(true);
  };

  const scheduleCloseServices = () => {
    cancelClose();
    servicesCloseTimer.current = setTimeout(() => {
      setServicesOpen(false);
    }, HOVER_CLOSE_DELAY);
  };

  React.useEffect(() => {
    return () => {
      if (servicesCloseTimer.current) clearTimeout(servicesCloseTimer.current);
    };
  }, []);

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const closeMobile = () => {
    setOpen(false);
    setMobileServicesOpen(false);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 mx-auto w-full max-w-5xl border-b border-transparent md:rounded-md md:border md:transition-all md:ease-out",
        {
          "bg-background/95 supports-[backdrop-filter]:bg-background/50 border-border backdrop-blur-lg md:top-4 md:max-w-4xl md:shadow":
            scrolled && !open,
          "bg-background/90": open,
        }
      )}
    >
      <nav
        className={cn(
          "flex h-14 w-full items-center justify-between px-4 md:h-14 md:transition-all md:ease-out",
          {
            "md:px-2": scrolled,
          }
        )}
      >
        <Link href="/" className="flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/navbarLogo.svg"
            alt="KAG"
            className="h-7 w-auto md:h-8"
          />
        </Link>

        <div className="hidden items-center gap-5 md:flex">
          <Link href="/" className={cn(buttonVariants({ variant: "ghost" }), "text-primary hover:text-primary")}>
            {t("home")}
          </Link>

          <Link href="/products" className={cn(buttonVariants({ variant: "ghost" }), "text-primary hover:text-primary")}>
            {t("ourBrands")}
          </Link>

          <div
            className="relative"
            onMouseEnter={openServices}
            onMouseLeave={scheduleCloseServices}
          >
            <button
              onClick={() => setServicesOpen((s) => !s)}
              onFocus={openServices}
              className={cn(buttonVariants({ variant: "ghost" }), "gap-1 text-primary hover:text-primary")}
              aria-haspopup="menu"
              aria-expanded={servicesOpen}
            >
              {t("services.label")}
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  servicesOpen && "rotate-180"
                )}
              />
            </button>

            {servicesOpen && (
              <div className="absolute left-0 top-full pt-2 z-50">
                <div
                  role="menu"
                  className={cn(
                    "w-52 rounded-xl overflow-hidden",
                    "bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl",
                    "shadow-lg border border-gray-200 dark:border-neutral-700",
                    "animate-fade-in"
                  )}
                >
                  {serviceItems.map((s) => (
                    <Link
                      key={s.href}
                      href={s.href}
                      role="menuitem"
                      onClick={() => setServicesOpen(false)}
                      className="block px-3 py-2 text-sm text-primary hover:bg-primary/10 transition-colors"
                    >
                      {t(`services.${s.key}`)}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link href="/news" className={cn(buttonVariants({ variant: "ghost" }), "text-primary hover:text-primary")}>
            {t("news")}
          </Link>

          <FlowButton href="/contact" text={t("contact")} className="px-8 py-2.5" />

          <LanguageSelector />
        </div>

        <Button
          size="icon"
          variant="outline"
          onClick={() => setOpen(!open)}
          className="md:hidden"
        >
          <MenuToggleIcon open={open} className="size-5" duration={300} />
        </Button>
      </nav>

      <div
        className={cn(
          "bg-background/90 fixed top-14 right-0 bottom-0 left-0 z-50 flex flex-col overflow-hidden border-y md:hidden",
          open ? "block" : "hidden"
        )}
      >
        <div
          data-slot={open ? "open" : "closed"}
          className={cn(
            "data-[slot=open]:animate-in data-[slot=open]:zoom-in-95 data-[slot=closed]:animate-out data-[slot=closed]:zoom-out-95 ease-out",
            "flex h-full w-full flex-col justify-between gap-y-2 p-4"
          )}
        >
          <div className="grid gap-y-2">
            <Link
              href="/"
              onClick={closeMobile}
              className={buttonVariants({
                variant: "ghost",
                className: "justify-start text-primary hover:text-primary",
              })}
            >
              {t("home")}
            </Link>

            <Link
              href="/products"
              onClick={closeMobile}
              className={buttonVariants({
                variant: "ghost",
                className: "justify-start text-primary hover:text-primary",
              })}
            >
              {t("ourBrands")}
            </Link>

            <button
              onClick={() => setMobileServicesOpen((s) => !s)}
              className={cn(
                buttonVariants({
                  variant: "ghost",
                  className: "justify-start text-primary hover:text-primary",
                }),
                "w-full"
              )}
              aria-expanded={mobileServicesOpen}
            >
              <span className="flex-1 text-left">{t("services.label")}</span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  mobileServicesOpen && "rotate-180"
                )}
              />
            </button>

            {mobileServicesOpen && (
              <div className="ml-3 grid gap-y-1 border-l border-border pl-3">
                {serviceItems.map((s) => (
                  <Link
                    key={s.href}
                    href={s.href}
                    onClick={closeMobile}
                    className={buttonVariants({
                      variant: "ghost",
                      className: "justify-start text-primary hover:text-primary",
                    })}
                  >
                    {t(`services.${s.key}`)}
                  </Link>
                ))}
              </div>
            )}

            <Link
              href="/news"
              onClick={closeMobile}
              className={buttonVariants({
                variant: "ghost",
                className: "justify-start text-primary hover:text-primary",
              })}
            >
              {t("news")}
            </Link>

            <div className="pt-2">
              <FlowButton href="/contact" text={t("contact")} onClick={closeMobile} />
            </div>
          </div>

          <div className="pt-2">
            <LanguageSelector />
          </div>
        </div>
      </div>
    </header>
  );
}
