"use client"
import React from 'react'
import { Button } from '../ui/button'
import { signOut } from '@/lib/auth/auth-client'
import { useRouter } from 'next/navigation'

const SignOut = () => {
    const router = useRouter()
  return (
    <Button
    onClick={async() => {await signOut({
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