"use client"
import { useForm } from 'react-hook-form'
import CardWrapper from '../CardWrapper'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { FormError, FormSuccess } from '../FormMessage'
import { useAuthState } from '@/hooks/useAuthState'
import { authClient } from '@/lib/auth/auth-client'
import { ForgotPasswordSchema } from '@/utils/zod/forgot-password-schema'

const ForgotPassword = () => {
  const { error, success, loading, setError, setSuccess, setLoading, resetState } = useAuthState()

  const form = useForm<z.infer<typeof ForgotPasswordSchema>>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: '',
    }
  })

  const onSubmit = async (values: z.infer<typeof ForgotPasswordSchema>) => {
    try {
        // Call the authClient's forgetPassword method, passing the email and a redirect URL.
        await authClient.forgetPassword({
        email: values.email, // Email to which the reset password link should be sent.
        redirectTo: "/reset-password" // URL to redirect the user after resetting the password.
      }, {
        // Lifecycle hooks to handle different stages of the request.
        onResponse: () => {
          setLoading(false)
        },
        onRequest: () => {
          resetState()
          setLoading(true)
        },
        onSuccess: () => {
          setSuccess("Reset password link has been sent")
        },
        onError: (ctx) => {
          setError(ctx.error.message);
        },
      });

    } catch (error) { // catch the error
      console.log(error)
      setError("Something went wrong")
    }
  }

  return (
    <CardWrapper
      cardTitle='Forgot Password'
      cardDescription='Enter your email to send link to reset password'
      cardFooterDescription="Remember your password?"
      cardFooterLink='/login'
      cardFooterLinkTitle='Login'
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                    required
                    {...field}
                    className='p-2'
                  />
                </FormControl>
                <FormMessage className='text-sm'/>
              </FormItem>
            )}
          />
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button disabled={loading} type="submit" className='w-full p-2 bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring focus-visible:ring-[3px] focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'>Submit</Button>
        </form>
      </Form>

    </CardWrapper>
  )
}

export default ForgotPassword