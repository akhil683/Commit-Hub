'use client'

import { useForm } from "react-hook-form"
import { z } from "zod"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { useToast } from "@/hooks/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"

import {
  Form,
  FormItem,
  FormField,
  FormControl,
  FormMessage
} from "../ui/form"
import { joinWaitlist } from "@/actions/waitlist"

const schema = z.object({
  email: z.string().email("Please enter a valid email address")
})

type FormValues = z.infer<typeof schema>

export default function WaitListForm() {

  const { toast } = useToast()

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
    }
  })

  const onSubmit = async (values: FormValues) => {
    const formData = new FormData()
    formData.append('email', values.email)

    const result = await joinWaitlist(formData)

    //Toast message
    if (result.success) {
      toast({
        title: 'Success!',
        description: result.message,
      })
      form.reset()
    } else {
      toast({
        title: 'Error',
        description: result.error,
        variant: 'destructive'
      })
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="flex-grow">
              <FormControl>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="h-12 md:w-72 bg-gray-900/50 border-2 border-gray-800 focus:border-gray-300 text-white placeholder:text-gray-500"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500 text-sm mt-1 text-left" />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="h-12 px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? 'Joining...' : 'Join Waitlist'}
        </Button>
      </form>
    </Form>
  )
}
