"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function Sidebar() {
  const pathname = usePathname()

  const navLinks = [
    {
      label: "Manage Delegates",
      href: `/admin/dashboard/delegates`,
    },
    {
      label: "Manage Election",
      href: `/admin/dashboard/elections`, // or change to correct route
    },
  ]

  return (
    <div className="flex">
      {/* Mobile menu button */}
      <div className="lg:hidden p-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64">
            <nav className="space-y-2 mt-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "block rounded-lg px-4 py-2 text-sm font-medium",
                    pathname === link.href
                      ? "bg-gray-200 text-gray-900"
                      : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 h-screen border-r px-4 py-6 bg-white">
        <nav className="space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "block rounded-lg px-4 py-2 text-sm font-medium",
                pathname === link.href
                  ? "bg-gray-200 text-gray-900"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>
    </div>
  )
}
