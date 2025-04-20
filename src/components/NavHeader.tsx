"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"

export function NavHeader() {
  const pathname = usePathname()

  return (
    <NavigationMenu className="hidden sm:flex items-start justify-start w-full max-w-2xl">
      <NavigationMenuList className="gap-2 *:data-[slot=navigation-menu-item]:h-7 **:data-[slot=navigation-menu-link]:py-1 **:data-[slot=navigation-menu-link]:font-medium">
        <NavigationMenuItem>
          <NavigationMenuLink asChild data-active={pathname === "/"} className="text-md">
            <Link href="/">Home</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild data-active={pathname === "/books"} className="text-md">
            <Link href="/books">Library</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}