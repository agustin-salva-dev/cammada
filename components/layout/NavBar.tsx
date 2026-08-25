"use client";

import { CammadaLogo } from "./CammadaLogo";
import {
  Calendar,
  Trophy,
  MessageSquare,
  TrendingUp,
  Globe,
  Users,
  Shield,
  ChevronDown,
  PenLine,
  Menu,
  Sun,
  Moon,
  Laptop,
} from "lucide-react";
import SpecularButton from "../SpecularButton";
import { ModeToggle } from "../ui/ModeToggle";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavLinkItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

interface NavDropdownItem {
  label: string;
  icon: React.ElementType;
  items: NavLinkItem[];
  isActive: (pathname: string) => boolean;
}

type NavEntry =
  | {
      type: "link";
      href: string;
      label: string;
      icon: React.ElementType;
      active: boolean;
    }
  | { type: "dropdown"; dropdown: NavDropdownItem; active: boolean };

function isRouteActive(href: string, currentPath: string): boolean {
  if (href === "/") {
    return currentPath === "/";
  }
  return currentPath === href || currentPath.startsWith(`${href}/`);
}

function NavLink({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex gap-2 items-center hover:scale-[102%] transition-all duration-200 cursor-pointer py-0.5 border-b border-transparent",
        active
          ? "text-foreground font-semibold border-primary"
          : "text-foreground/50 hover:text-foreground hover:opacity-100",
      )}
    >
      <Icon size={15} strokeWidth={1} />
      <span className="text-shadow-lg">{label}</span>
    </Link>
  );
}

function NavDropdown({
  dropdown,
  active,
}: {
  dropdown: NavDropdownItem;
  active: boolean;
}) {
  const pathname = usePathname();
  const Icon = dropdown.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "group flex gap-2 items-center hover:scale-[102%] transition-all duration-200 cursor-pointer py-0.5 border-b border-transparent outline-none",
          active
            ? "text-foreground font-semibold border-primary"
            : "text-foreground/50 hover:text-foreground hover:opacity-100",
        )}
        aria-label={`Menú ${dropdown.label}`}
      >
        <Icon size={15} strokeWidth={1} />
        <span className="text-shadow-lg">{dropdown.label}</span>
        <ChevronDown
          size={12}
          className="transition-transform duration-200 group-data-[state=open]:rotate-180"
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="w-48 gap-1 backdrop-blur-md bg-white/15 dark:bg-black/15 border border-border shadow-xl rounded-xl p-1.5 font-heading mt-2"
      >
        {dropdown.items.map((item) => {
          const ItemIcon = item.icon;
          const isItemActive = isRouteActive(item.href, pathname);
          return (
            <DropdownMenuItem
              key={item.href}
              asChild
              className={cn(
                "text-xs transition-colors cursor-pointer rounded-lg px-2.5 py-2",
                isItemActive
                  ? "bg-white/30 dark:bg-black/30 text-foreground font-semibold"
                  : "text-foreground/80 hover:text-foreground focus:bg-white/15 dark:focus:bg-black/15 focus:text-foreground",
              )}
            >
              <Link
                href={item.href}
                className="flex items-center gap-2.5 cursor-pointer w-full"
              >
                <ItemIcon
                  size={14}
                  strokeWidth={1.5}
                  className={cn(
                    "text-shadow-xl transition-colors shrink-0",
                    isItemActive ? "text-foreground" : "text-muted-foreground",
                  )}
                />
                <span className="text-shadow-lg">{item.label}</span>
              </Link>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const competicionItems: NavLinkItem[] = [
    { href: ROUTES.LUCHADORES, label: "Luchadores", icon: Users },
    { href: ROUTES.EQUIPOS, label: "Equipos", icon: Shield },
    { href: ROUTES.TALENTO_EXPORTADO, label: "Talento Exportado", icon: Globe },
  ];

  const comunidadItems: NavLinkItem[] = [
    { href: ROUTES.OPINIONES, label: "Opiniones", icon: MessageSquare },
    { href: ROUTES.OPINAR, label: "Deja tu opinión", icon: PenLine },
    { href: ROUTES.PREDICCIONES, label: "Predicciones", icon: TrendingUp },
  ];

  const isCompeticionActive = competicionItems.some((i) =>
    isRouteActive(i.href, pathname),
  );
  const isComunidadActive = comunidadItems.some((i) =>
    isRouteActive(i.href, pathname),
  );

  const navEntries: NavEntry[] = [
    {
      type: "link",
      href: ROUTES.EVENTOS,
      label: "Eventos",
      icon: Calendar,
      active: isRouteActive(ROUTES.EVENTOS, pathname),
    },
    {
      type: "link",
      href: ROUTES.RANKINGS,
      label: "Rankings",
      icon: Trophy,
      active: isRouteActive(ROUTES.RANKINGS, pathname),
    },
    {
      type: "dropdown",
      active: isCompeticionActive,
      dropdown: {
        label: "Competición",
        icon: Users,
        items: competicionItems,
        isActive: (p) => competicionItems.some((i) => isRouteActive(i.href, p)),
      },
    },
    {
      type: "dropdown",
      active: isComunidadActive,
      dropdown: {
        label: "Comunidad",
        icon: MessageSquare,
        items: comunidadItems,
        isActive: (p) => comunidadItems.some((i) => isRouteActive(i.href, p)),
      },
    },
  ];

  return (
    <nav
      role="navigation"
      aria-label="Navegación principal"
      className="fixed top-0 left-0 w-full flex items-center justify-between px-4 md:px-8 2xl:px-42 py-4 z-50 backdrop-blur-lg bg-background/15 md:bg-transparent lg:backdrop-blur-none"
    >
      <CammadaLogo />

      <section className="transition-colors duration-200 font-heading animate-fade-in hidden md:flex bg-white/15 dark:bg-black/15 backdrop-blur-md border border-border/30 hover:border-border rounded-xl drop-shadow-lg gap-5 font-normal text-xs 2xl:text-sm px-6 py-1.5 items-center">
        {navEntries.map((entry) =>
          entry.type === "link" ? (
            <NavLink
              key={entry.href}
              href={entry.href}
              label={entry.label}
              icon={entry.icon}
              active={entry.active}
            />
          ) : (
            <NavDropdown
              key={entry.dropdown.label}
              dropdown={entry.dropdown}
              active={entry.active}
            />
          ),
        )}
      </section>

      <div className="flex items-center gap-2 md:gap-4">
        <SpecularButton
          size="sm"
          radius={13}
          tint="#c970f5"
          tintOpacity={0}
          blur={10}
          textColor="#a51fe8"
          lineColor="#a51fe8"
          baseColor="#805197"
          intensity={1.5}
          shineSize={12}
          shineFade={26}
          thickness={0.8}
          speed={0.2}
          followMouse
          proximity={250}
          autoAnimate={false}
          onClick={() => console.log("clicked")}
          className="font-semibold text-shadow-md font-heading! text-xs md:text-sm"
        >
          Compra tus entradas!
        </SpecularButton>

        <div className="hidden md:flex">
          <ModeToggle />
        </div>

        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="bg-transparent backdrop-blur-lg border border-border cursor-pointer"
                aria-label="Abrir menú de navegación"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 max-h-[85vh] overflow-y-auto backdrop-blur-2xl bg-background/95 border border-border shadow-2xl rounded-xl p-2 font-heading"
            >
              <DropdownMenuItem asChild>
                <Link
                  href={ROUTES.EVENTOS}
                  className={cn(
                    "flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer",
                    isRouteActive(ROUTES.EVENTOS, pathname)
                      ? "bg-primary/15 text-primary font-semibold"
                      : "text-foreground/80 hover:text-foreground hover:bg-accent",
                  )}
                >
                  <Calendar
                    className={cn(
                      "h-4 w-4 shrink-0 transition-colors",
                      isRouteActive(ROUTES.EVENTOS, pathname)
                        ? "text-primary"
                        : "text-muted-foreground",
                    )}
                  />
                  <span>Eventos</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link
                  href={ROUTES.RANKINGS}
                  className={cn(
                    "flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer",
                    isRouteActive(ROUTES.RANKINGS, pathname)
                      ? "bg-primary/15 text-primary font-semibold"
                      : "text-foreground/80 hover:text-foreground hover:bg-accent",
                  )}
                >
                  <Trophy
                    className={cn(
                      "h-4 w-4 shrink-0 transition-colors",
                      isRouteActive(ROUTES.RANKINGS, pathname)
                        ? "text-primary"
                        : "text-muted-foreground",
                    )}
                  />
                  <span>Rankings</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="my-1.5" />

              <DropdownMenuLabel
                className={cn(
                  "text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 transition-colors",
                  isCompeticionActive
                    ? "text-primary font-bold"
                    : "text-muted-foreground",
                )}
              >
                Competición
              </DropdownMenuLabel>
              {competicionItems.map((item) => {
                const ItemIcon = item.icon;
                const isItemActive = isRouteActive(item.href, pathname);
                return (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer",
                        isItemActive
                          ? "bg-primary/15 text-primary font-semibold"
                          : "text-foreground/80 hover:text-foreground hover:bg-accent",
                      )}
                    >
                      <ItemIcon
                        className={cn(
                          "h-4 w-4 shrink-0 transition-colors",
                          isItemActive
                            ? "text-primary"
                            : "text-muted-foreground",
                        )}
                      />
                      <span>{item.label}</span>
                    </Link>
                  </DropdownMenuItem>
                );
              })}

              <DropdownMenuSeparator className="my-1.5" />

              <DropdownMenuLabel
                className={cn(
                  "text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 transition-colors",
                  isComunidadActive
                    ? "text-primary font-bold"
                    : "text-muted-foreground",
                )}
              >
                Comunidad
              </DropdownMenuLabel>
              {comunidadItems.map((item) => {
                const ItemIcon = item.icon;
                const isItemActive = isRouteActive(item.href, pathname);
                return (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer",
                        isItemActive
                          ? "bg-primary/15 text-primary font-semibold"
                          : "text-foreground/80 hover:text-foreground hover:bg-accent",
                      )}
                    >
                      <ItemIcon
                        className={cn(
                          "h-4 w-4 shrink-0 transition-colors",
                          isItemActive
                            ? "text-primary"
                            : "text-muted-foreground",
                        )}
                      />
                      <span>{item.label}</span>
                    </Link>
                  </DropdownMenuItem>
                );
              })}

              <DropdownMenuSeparator className="my-1.5" />

              <DropdownMenuLabel className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-2.5 py-1">
                Tema
              </DropdownMenuLabel>
              <div className="grid grid-cols-3 gap-1 px-1 py-1">
                <button
                  type="button"
                  onClick={() => setTheme("light")}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1 py-1.5 px-2 rounded-md text-[11px] font-medium transition-colors border cursor-pointer",
                    theme === "light"
                      ? "bg-primary/15 text-primary border-primary/40 font-semibold"
                      : "text-muted-foreground hover:text-foreground border-transparent hover:bg-accent",
                  )}
                  aria-label="Tema claro"
                >
                  <Sun className="h-3.5 w-3.5" />
                  <span>Claro</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTheme("dark")}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1 py-1.5 px-2 rounded-md text-[11px] font-medium transition-colors border cursor-pointer",
                    theme === "dark"
                      ? "bg-primary/15 text-primary border-primary/40 font-semibold"
                      : "text-muted-foreground hover:text-foreground border-transparent hover:bg-accent",
                  )}
                  aria-label="Tema oscuro"
                >
                  <Moon className="h-3.5 w-3.5" />
                  <span>Oscuro</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTheme("system")}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1 py-1.5 px-2 rounded-md text-[11px] font-medium transition-colors border cursor-pointer",
                    theme === "system"
                      ? "bg-primary/15 text-primary border-primary/40 font-semibold"
                      : "text-muted-foreground hover:text-foreground border-transparent hover:bg-accent",
                  )}
                  aria-label="Tema del sistema"
                >
                  <Laptop className="h-3.5 w-3.5" />
                  <span>Sistema</span>
                </button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
