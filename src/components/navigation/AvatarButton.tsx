"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {User} from "@prisma/client"
import { useRouter } from "next/navigation"

export default function AvatarDropdownMenu({user}: {user:User}) {
  const router = useRouter()
  return (
    <Button
      variant="outline"
      className="hidden size-8 sm:flex group/toggle align-items-center p-0 hover:bg-muted/50 cursor-pointer"
      onClick={() => router.push("/dashboard")}
    >
      <Avatar className="relative flex size-8 shrink-0 overflow-hidden rounded-md hover:opacity-70">
        <AvatarImage src={user.image ?? undefined} alt="User avater"/>
        <AvatarFallback className="w-full bg-muted flex size-full items-center justify-center rounded-md text-3xl">{user.name.charAt(0)}</AvatarFallback>
      </Avatar>
    </Button>
  );
}