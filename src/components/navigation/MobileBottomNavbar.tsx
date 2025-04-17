import {
    Popover,
    PopoverTrigger,
    PopoverContent,
  } from "@/components/ui/popover"
  import Link from "next/link"
export default function MobileBottomNavbar() {
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
                    <Link href="/dashboard/logout" className="w-full text-sm py-2 px-2 hover:bg-muted rounded">
                        Logout
                    </Link>
                </div>
                </PopoverContent>
           </Popover>
        </nav>
    )
}