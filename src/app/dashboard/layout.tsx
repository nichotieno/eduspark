
"use client";

import {
  BookOpen,
  Home,
  Users,
  PanelLeft,
  Trophy,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { EduSparkLogo } from "@/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { logout } from "@/app/auth/actions";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { SessionProvider, useSession } from "@/contexts/session-context";


const NavItem = ({ href, icon: Icon, label, pathname }: { href: string, icon: React.ElementType, label: string, pathname: string }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Link
        href={href}
        className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:h-8 md:w-8 ${
          pathname.startsWith(href)
            ? "bg-accent text-accent-foreground"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Icon className="h-5 w-5" />
        <span className="sr-only">{label}</span>
      </Link>
    </TooltipTrigger>
    <TooltipContent side="right">{label}</TooltipContent>
  </Tooltip>
);

const MobileNavItem = ({ href, icon: Icon, label, pathname }: { href: string, icon: React.ElementType, label: string, pathname: string }) => (
  <Link
    href={href}
    className={`flex items-center gap-4 px-2.5 ${
      pathname.startsWith(href)
        ? "text-foreground"
        : "text-muted-foreground hover:text-foreground"
    }`}
  >
    <Icon className="h-5 w-5" />
    {label}
  </Link>
);

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { session, isLoading } = useSession();

    const studentNavItems = [
        { href: "/dashboard/student", icon: Home, label: "Dashboard" },
        { href: "/dashboard/courses", icon: BookOpen, label: "Courses" },
        { href: "/dashboard/challenge", icon: Trophy, label: "Daily Challenge" },
    ];

    const teacherNavItems = [
        { href: "/dashboard/teacher", icon: Users, label: "Teacher Dashboard" },
    ];

    const navItems = session?.role === 'teacher' ? teacherNavItems : studentNavItems;

    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
            <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
            <Link
                href="#"
                className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
            >
                <EduSparkLogo className="h-5 w-5 transition-all group-hover:scale-110" />
                <span className="sr-only">EduSpark</span>
            </Link>
            <TooltipProvider>
                {navItems.map((item) => (
                <NavItem key={item.href} {...item} pathname={pathname} />
                ))}
            </TooltipProvider>
            </nav>
            <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <form action={logout}>
                            <Button variant="ghost" size="icon" className="h-9 w-9 md:h-8 md:w-8 text-muted-foreground hover:text-foreground">
                                <LogOut className="h-5 w-5" />
                            </Button>
                        </form>
                    </TooltipTrigger>
                    <TooltipContent side="right">Logout</TooltipContent>
                </Tooltip>
            </TooltipProvider>
            </nav>
        </aside>
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
            <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <Sheet>
                <SheetTrigger asChild>
                <Button size="icon" variant="outline" className="sm:hidden">
                    <PanelLeft className="h-5 w-5" />
                    <span className="sr-only">Toggle Menu</span>
                </Button>
                </SheetTrigger>
                <SheetContent side="left" className="sm:max-w-xs">
                <nav className="grid gap-6 text-lg font-medium">
                    <Link
                    href="#"
                    className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                    >
                    <EduSparkLogo className="h-5 w-5 transition-all group-hover:scale-110" />
                    <span className="sr-only">EduSpark</span>
                    </Link>
                    {navItems.map((item) => (
                    <MobileNavItem key={item.href} {...item} pathname={pathname} />
                    ))}
                    <Separator className="my-2"/>
                    <form action={logout}>
                        <button className="w-full flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground">
                            <LogOut className="h-5 w-5" />
                            Logout
                        </button>
                    </form>
                </nav>
                </SheetContent>
            </Sheet>
            <div className="relative ml-auto flex-1 md:grow-0">
                {/* Can add a search bar here if needed */}
            </div>
            {isLoading ? (
                <Skeleton className="h-10 w-10 rounded-full" />
            ) : session ? (
                <Avatar>
                    <AvatarImage src={session.avatarUrl} alt={session.name} data-ai-hint="person" />
                    <AvatarFallback>
                    {session.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                </Avatar>
            ) : null}
            </header>
            <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                {isLoading ? <div className="text-center p-8">Loading...</div> : children}
            </main>
        </div>
        </div>
    )
}


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    return (
        <SessionProvider>
            <DashboardLayoutContent>{children}</DashboardLayoutContent>
        </SessionProvider>
    )
}
