import SignIn from '@/components/auth/SignIn'
import React from 'react'

const SignInPage = () => {
  return (
    <div className="flex min-h-svh items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignIn/>
      </div>
    </div>
  )
}



export default SignInPage