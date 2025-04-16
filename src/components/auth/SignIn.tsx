"use client"
import React from 'react'
import CardWrapper from '../CardWrapper'
import { FormError, FormSuccess} from '../FormMessage'
import { useAuthState } from '@/hooks/useAuthState'
import LoginSchema from '@/utils/zod/login-schema'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { signIn } from '@/lib/auth/auth-client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const SignIn = () => {
    const router = useRouter()
    const { error, success, loading, setSuccess, setError, setLoading, resetState } = useAuthState();

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: '',
            password: '',
        }
    })

    const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
        try {
          await signIn.email({
            email: values.email,
            password: values.password
          }, {
            onResponse: () => {
              setLoading(false)
            },
            onRequest: () => {
              resetState()
              setLoading(true)
            },
            onSuccess: () => {
                setSuccess("LoggedIn successfully")
                setTimeout(() => {
                    router.push('/')
                }, 2000)
            },
            onError: (ctx) => {
                /* Whenever user tried to signin but email is not verified it catches the error and display the error */
                if(ctx.error.status === 403) {
                    setError("Please verify your email address")
                }
                /* handles other error */
              setError(ctx.error.message);
            },
          });
        } catch (error) {
          console.log(error)
          setError("Something went wrong")
        }
      }

    return (
        <CardWrapper
            cardTitle='Sign In'
            cardDescription='Enter your email below to login to your account'
            cardFooterDescription="Don't have an account?"
            cardFooterLink='/signup'
            cardFooterLinkTitle='Sign up'
        >
            <Form {...form}>
                <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={loading}
                                        type="email"
                                        placeholder='example@gmail.com'
                                        className='p-2'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className='text-sm'/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password
                                    <Link href="/forgot-password" className="ml-auto inline-block text-sm underline-offset-4 hover:underline text-muted-foreground">
                                        Forgot Password?
                                    </Link>
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={loading}
                                        type="password"
                                        placeholder='********'
                                        className='p-2'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className='text-sm'/>
                            </FormItem>
                        )}
                    />
                    <FormError message={error} />
                    <FormSuccess message={success} />
                    <Button disabled={loading} type="submit" className='w-full p-2 bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring focus-visible:ring-[3px] focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'>Login</Button>
                </form>
            </Form>
        </CardWrapper>
    )
}

export default SignIn