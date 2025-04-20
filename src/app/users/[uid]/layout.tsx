import React, { Suspense } from "react";
import { ReactNode } from "react";
import Link from "next/link";
import { UserProfileContextProvider } from "@/hooks/useUserProfileContext";
import Loading from "@/components/Loading";
import { fetchUserProfile } from "@/lib/user/fetchUserData";
import ErrorPage from "@/components/Error";

export default async function UserProfileLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ uid: string }>
}) {
  const { uid } = await params;
  try {
    const res = await fetchUserProfile(uid);
    if (res.status !== 200 || !res.data) {
        return <ErrorPage message={res.message} />;
    }
    const { user, serieslist, stats } = res.data;

    return (
      <div className="flex h-fit w-full min-h-[calc(100vh-56px)]">
        <Suspense fallback={<Loading />}>
          <UserProfileContextProvider
            user={user}
            serieslist={serieslist}
            stats={stats}
          >
            <aside className="hidden sm:w-32 lg:w-45 bg-gray-100 border-r px-4 py-6 sm:flex flex-col space-y-4 dark:bg-gray-800 dark:border-gray-700 pt-30">
              <h2 className="text-lg font-bold mb-2 lg:text-xl border-b-2">Dashboard</h2>
                <Link href="#" className="text-sm hover:underline lg:text-lg">Profile</Link>
                <Link href="#books" className="text-sm hover:underline lg:text-lg">Books & Series</Link>
                <Link href="#books" className="text-sm hover:underline lg:text-lg">Bookmarks</Link>
            </aside>
            <div className="flex-1 ">
              {children}
            </div>
          </UserProfileContextProvider>
        </Suspense>
      </div>
    );
  } catch {
    return <ErrorPage />;
  }


}
