"use client"
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
  } from "@/components/ui/popover"
import Link from "next/link"
import { signOut } from "@/lib/auth/auth-client"
import { useRouter } from "next/navigation"
export default function MobileBottomNavbar() {
    const router = useRouter()
    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center bg-gray-100 border-t sm:hidden dark:bg-gray-800 dark:border-gray-700">
            <div className="flex-1 flex items-center text-center">
                <Link href="/dashboard" className="text-md w-full h-full p-2 hover:bg-gray-200 rounded dark:hover:text-black">Dashboard</Link>
            </div>
            <div className="flex-1 flex items-center text-center">
                <Link href="/" className="text-md min-w-full w-full h-full p-2 hover:bg-gray-200 rounded dark:hover:text-black">Home</Link>
            </div>
            <Popover>
                <PopoverTrigger asChild>
                    <div className="flex-1 text-center cursor-pointer py-2 hover:bg-gray-200 rounded dark:hover:text-black">Account</div>
                </PopoverTrigger>
                <PopoverContent align="center" side="top" className="w-full px-2 py-1">
                  <div className="flex flex-col w-full">
                    <Link href="/dashboard/account" className="w-full text-sm py-2 px-2 hover:bg-muted rounded">
                      Account Settings
                    </Link>
                    <div className="w-full text-sm py-2 px-2 hover:bg-muted rounded cursor-pointer"
                        onClick={async() => {await signOut({
                            fetchOptions: {
                                onSuccess: () => {
                                    window.location.href = "/"
                                }
                          }
                        })}
                    }>
                        Logout
                    </div>
                </div>
                </PopoverContent>
           </Popover>
        </nav>
    )
}