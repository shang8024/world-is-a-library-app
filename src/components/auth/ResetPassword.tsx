"use client"
import React from 'react'
import { Button } from '../ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '../ui/input'
import { useRouter } from 'next/navigation'
import CardWrapper from '../CardWrapper'
import { FormError, FormSuccess } from '../FormMessage'
import { ResetPasswordSchema } from '@/utils/zod/reset-password-schema'
import { authClient } from '@/lib/auth/auth-client'
import { useAuthState } from '@/hooks/useAuthState'

const ResetPassword = () => {
    const router = useRouter()
    const { error, success, loading, setError, setLoading, setSuccess, resetState } = useAuthState()

    const form = useForm<z.infer<typeof ResetPasswordSchema>>({
        resolver: zodResolver(ResetPasswordSchema),
        defaultValues: {
            password: '',
            confirmPassword: ''
        }
    })

    const onSubmit = async (values: z.infer<typeof ResetPasswordSchema>) => {
        try {
            // Call the authClient's reset password method, passing the email and a redirect URL.
            await authClient.resetPassword({
                newPassword: values.password, // new password given by user
            }, {
                onResponse: () => {
                    setLoading(false)
                },
                onRequest: () => {
                    resetState()
                    setLoading(true)
                },
                onSuccess: () => {
                    setSuccess("New password has been created")
                    router.replace('/signin')
                },
                onError: (ctx) => {
                    setError(ctx.error.message);
                },
            });
        } catch (error) { // catches the error
            console.log(error)
            setError("Something went wrong")
        }
    }

    return (
        <CardWrapper
            cardTitle='Reset Password'
            cardDescription='create a new password'
            cardFooterLink='/signin'
            cardFooterDescription='Remember your password?'
            cardFooterLinkTitle='Signin'
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={loading}
                                        type="password"
                                        placeholder='************'
                                        required
                                        {...field} />
                                </FormControl>
                                <FormMessage>
                                    Password must be 8-20 characters long
                                </FormMessage>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={loading}
                                        type="password"
                                        placeholder='*************'
                                        {...field}
                                        required
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormError message={error} />
                    <FormSuccess message={success} />
                    <Button type="submit" className='w-full p-2 bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring focus-visible:ring-[3px] focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none' disabled={loading}>Submit</Button>
                </form>
            </Form>
        </CardWrapper>
    )
}

export default ResetPassword