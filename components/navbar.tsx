"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, ClipboardList, Menu, Package } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"

export function Navbar() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="mr-2 md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <nav className="grid gap-6 text-lg font-medium">
              <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
                <Package className="h-5 w-5" />
                <span className="font-bold">Inventory System</span>
              </Link>
              <Link
                href="/dashboard"
                className={`flex items-center gap-2 ${
                  pathname === "/dashboard" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <BarChart3 className="h-5 w-5" />
                Dashboard
              </Link>
              <Link
                href="/inventory"
                className={`flex items-center gap-2 ${
                  pathname === "/inventory" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <ClipboardList className="h-5 w-5" />
                Inventory
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Package className="h-5 w-5" />
          <span className="hidden font-bold sm:inline-block">Inventory System</span>
        </Link>
        <nav className="hidden md:flex md:gap-6">
          <Link
            href="/dashboard"
            className={`flex items-center gap-2 text-sm font-medium ${
              pathname === "/dashboard" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            href="/inventory"
            className={`flex items-center gap-2 text-sm font-medium ${
              pathname === "/inventory" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <ClipboardList className="h-4 w-4" />
            Inventory
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
