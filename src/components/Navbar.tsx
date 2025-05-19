"use client"

import { Logo, LogoMobile, ThemeSwitcherBtn } from "@/components"
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button, buttonVariants } from "./ui/button";
import { UserButton } from "@clerk/nextjs";
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Menu } from "lucide-react";

export function Navbar() {
  return (
    <>
      <DesktopNavbar />
      <MobileNavbar />
    </>
  )
}

const items = [
  { label: "Dashboard", link: "/" },
  { label: "Transações", link: "/transactions" },
  { label: "Gerenciar", link: "/manage" },
]

function MobileNavbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="block border-separate bg-background md:hidden">
      <nav className="container flex items-center justify-between px-8">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant={"ghost"} size="icon">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[400px] sm:w-[540px]" side="left">
            <div className="pt-4 px-4">
              <Logo />
            </div>
            <div className="flex flex-col gap-1 pt-4 px-6">
              {items.map(item => (
                <NavbarItem
                  key={item.label}
                  label={item.label}
                  link={item.link}
                  clickCallback={() => setIsOpen((prev) => !prev)}
                />
              ))}
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex h-[80px] min-h-[60px] items-center gap-x-4">
          <LogoMobile />
        </div>
        <div className="flex items-center gap-2">
          <ThemeSwitcherBtn />
          <UserButton afterSwitchSessionUrl="/sign-in" />
        </div>
      </nav>
    </div>
  )
}

function DesktopNavbar() {
  return (
    <div className="hidden border-separate border-b bg-background md:block">
      <nav className="container flex items-center justify-between px-8">
        <div className="flex h-[80px] min-h-[60px] items-center gap-x-4">
          <Logo />
          <div className="flex h-full">
            {items.map(item => (
              <NavbarItem key={item.label} label={item.label} link={item.link} />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeSwitcherBtn />
          <UserButton afterSwitchSessionUrl="/sign-in" />
        </div>
      </nav>
    </div>
  )
}

function NavbarItem({ label, link, clickCallback }: { label: string; link: string; clickCallback?: () => void }) {
  const pathname = usePathname()
  const isActive = pathname === link

  return (
    <div className="relative flex items-center">
      <Link
        href={link}
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "w-full justify-start text-lg text-muted-foreground hover:text-foreground",
          isActive && "text-foreground"
        )}
        onClick={() => {
          if (clickCallback) clickCallback()
        }}
      >
        {label}
      </Link>
      {isActive && (
        <div className="absolute -bottom-[2px] left-1/2 hidden h-[2px] w-[80%] -translate-x-1/2 rounded-xl bg-foreground md:block" />
      )}
    </div>
  )
}