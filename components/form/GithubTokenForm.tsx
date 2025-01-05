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
import { storeGithubToken } from "@/actions/storeGithubToken"
import { useSession } from "next-auth/react"

const schema = z.object({
  githubToken: z.string().min(1, "Github Token is required")
})

type FormValues = z.infer<typeof schema>

export default function GithubTokenForm() {

  const { toast } = useToast()
  const { data: session } = useSession()

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      githubToken: '',
    }
  })

  const onSubmit = async (values: FormValues) => {
    console.log(values)
    const formData = new FormData()
    formData.append('githubToken', values.githubToken)
    console.log(formData)

    const result = await storeGithubToken(formData, session?.user?.id!)

    //Toast message
    if (result.success) {
      toast({
        title: 'Success !',
        description: result.message,
      })
      form.reset()
    } else {
      toast({
        title: 'Error !',
        description: result.error,
        variant: 'destructive'
      })
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="githubToken"
          render={({ field }) => (
            <FormItem className="flex-grow">
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter you Github Access Token"
                  className="h-12 bg-gray-900/50 border-2 border-gray-800 focus:border-gray-300 text-white placeholder:text-gray-500"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500 text-sm mt-1 text-left" />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="py-6 px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? 'Submitting...' : 'Submit Token'}
        </Button>
      </form>
    </Form>
  )
}
