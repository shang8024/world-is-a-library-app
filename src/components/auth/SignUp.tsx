"use client"
import React from 'react'
import CardWrapper from '../CardWrapper'
import { FormError, FormSuccess} from '../FormMessage'
import { useAuthState } from '@/hooks/useAuthState'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { SignupSchema } from '@/utils/zod/signup-schema'
import { signUp } from '@/lib/auth/auth-client'

const SignUp = () => {
    const { error, success, loading, setLoading, setError, setSuccess, resetState } = useAuthState();

    const form = useForm<z.infer<typeof SignupSchema>>({
        resolver: zodResolver(SignupSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
        }
    })

    const onSubmit = async (values: z.infer<typeof SignupSchema>) => {
        try {
            await signUp.email({
                name: values.name,
                email: values.email,
                password: values.password,
                callbackURL:'/' // redirect the user after email is verified
            }, {
                onResponse: () => {
                    setLoading(false)
                },
                onRequest: () => {
                    resetState()
                    setLoading(true)
                },
                onSuccess: () => {
                    setSuccess("Verification link has been sent to your mail")
                },
                onError: (ctx) => {
                    setError(ctx.error.message);
                },
            });
        } catch (error) {
            console.error(error)
            setError("Something went wrong")
        }

    }

    return (
        <CardWrapper
        cardTitle='SignUp'
        cardDescription='Create an new account'
        cardFooterLink='/login'
        cardFooterDescription='Already have an account?'
        cardFooterLinkTitle='Login'
        >
            <Form {...form}>
                <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={loading}
                                        type="text"
                                        required
                                        min={2}
                                        max={20}
                                        placeholder='john'
                                        {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
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
                                        required
                                        placeholder='example@gmail.com'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
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
                                        required
                                        placeholder='********'
                                        min={8}
                                        max={20}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>

                        )}
                    />
                    <FormError message={error} />
                    <FormSuccess message={success} />
                    <Button disabled={loading} type="submit" className='w-full'>Submit</Button>
                     {/* //ignore this if your not adding Oauth
                    <div className='flex gap-x-2'>
                        <SocialButton provider="google" icon={<FcGoogle />} label="Sign in with Google" />
                        <SocialButton provider="github" icon={<FaGithub />} label="Sign in with GitHub" />
                    </div> */}
                </form>
            </Form>
        </CardWrapper>
    )
}

export default SignUp