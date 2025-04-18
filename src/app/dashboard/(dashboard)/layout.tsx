"use client"
import React from "react";
import { ReactNode } from "react";
import Link from "next/link";
import { signOut } from "@/lib/auth/auth-client";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex h-fit w-full min-h-[calc(100vh-56px)]">
      <aside className="hidden sm:w-32 lg:w-45 bg-gray-100 border-r px-4 py-6 sm:flex flex-col space-y-4 dark:bg-gray-800 dark:border-gray-700">
        <h2 className="text-lg font-bold mb-2 lg:text-xl border-b-2">Navigation</h2>
          <Link href="/dashboard#" className="text-sm hover:underline lg:text-lg">Dashboard</Link>
          <Link href="/dashboard#books" className="text-sm hover:underline lg:text-lg">Manage Works</Link>
          <Link href="/dashboard/create-book" className="text-sm hover:underline lg:text-lg">Create Book</Link>
        <h2 className="text-lg font-bold mb-2 lg:text-xl border-b-2">Account</h2>
        <Link href="/dashboard/account" className="text-sm hover:underline lg:text-lg">Account Settings</Link>
        <div
          className="text-sm hover:underline cursor-pointer lg:text-lg"
          onClick={async() => {
            if (confirm("Are you sure you want to logout?")) {
              await signOut({
                fetchOptions: {
                  onSuccess: () => {
                    window.location.href = "/"
                  }
                }
        })}}}>
          Logoout
        </div>
      </aside>
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}
