"use client"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {User} from "@prisma/client"
import Link from "next/link"
import { signOut } from "@/lib/auth/auth-client"

export default function AvatarDropdownMenu({user}: {user:User}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="hidden sm:flex group/toggle align-items-center p-0 hover:bg-muted/50 cursor-pointer"         
        >
          <Avatar className="relative flex size-8 shrink-0 overflow-hidden rounded-md hover:opacity-70">
            <AvatarImage src={user.image ?? undefined} alt="User avater" />
            <AvatarFallback className="w-full bg-muted flex size-full items-center justify-center rounded-md text-3xl">{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-32 hidden sm:block">
        <DropdownMenuLabel className="p-2">My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer hover:bg-muted p-2">
            <Link href="/dashboard" className="w-full h-full flex items-center gap-2">
              Dashboard
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer p-2 hover:bg-muted">
            <Link href="/dashboard/account" className="w-full h-full flex items-center gap-2">
              Settings
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer p-2 hover:bg-muted"
          onClick={async() => {
            if (confirm("Are you sure you want to logout?")) {
              await signOut({
                fetchOptions: {
                  onSuccess: () => {
                   window.location.href = "/"
                }
              }
        })}}}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}