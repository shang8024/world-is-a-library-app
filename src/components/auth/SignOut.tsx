"use client"
import React from 'react'
import { Button } from '../ui/button'
import { signOut } from '@/lib/auth/auth-client'
import { useRouter } from 'next/navigation'

const SignOut = () => {
    const router = useRouter()
  return (
    <Button
    className='p-2 bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring focus-visible:ring-[3px] focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'
    onClick={async(e) => {await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/")
        }
      }
    })}}
    >Logout</Button>
  )
}

export default SignOut