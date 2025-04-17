"use client";

import { createContext, useContext } from "react";
import {User} from "@prisma/client"
import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth/auth-client"
import Loading from "@/components/Loading";
interface SessionContextProps {
    user: User | null
}
const SessionContext = createContext<SessionContextProps | null>(null);
export function SessionContextProvider({
    children,
    }: {
    children: React.ReactNode;
    user: User | null;
    }) {

        const {data: session, error: sessionError, isPending} = authClient.useSession()
        const [user, setUser] = useState<User | null>(null);
        const [isLoading, setIsLoading] = useState(isPending)
        useEffect(() => {
            if (session) {
                setUser(session.user as User)
            } else if (sessionError) {
                setUser(null)
            }
            setIsLoading(false)
        }
        , [session, sessionError])
        if (isLoading) {
            return <Loading />
        }
        if (sessionError|| !user) {
            return (
                <div className="flex flex-col items-center justify-center h-screen">
                    <p className="mt-4 text-lg">Session expired. Please sign in again.</p>
                </div>
            )
        }
    return (
        <SessionContext.Provider value={{ user }}>
        {children}
        </SessionContext.Provider>
    );
    }

export function useSessionContext() {
    const context = useContext(SessionContext);
    if (!context) {
        throw new Error("useSessionContext must be used within a SessionContextProvider");
    }
    return context;
}