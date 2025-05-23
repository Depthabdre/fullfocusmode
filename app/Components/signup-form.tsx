'use client'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {signUp , signInSocial  } from "../actions";
import { useTransition , useActionState } from "react";

export default function SignUpForm({
  className,
  setIsLogin,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & { setIsLogin: (value: boolean) => void }) {

   type State = {
      message: string;
    };
    
  const [stateMessage, FormAction, pending] = useActionState(signUp as (prevState: State, formData: FormData) => Promise<State>,{ message: '' });
  const [isPending, startTransition] = useTransition();
  

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>
            Enter your details below to create a new account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action = {FormAction} >
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  name = "name"
                  placeholder="Your full name"
                  required
                  autoComplete="name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name = "email"
                  placeholder="m@example.com"
                  autoComplete="email"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" name = "password" required />
                {stateMessage.message && (<p className="text-sm text-red-500">{stateMessage.message}</p>)}
              </div>
              <Button type="submit" className="w-full" disabled={pending}>
                  {pending ? "Signing Up…" : "Sign Up"}
              </Button>
              <Button type = 'button' variant="outline" className="w-full" onClick = {() =>
                  startTransition(() => {
                  // Calls the server action, which responds with a 303 → OAuth provider
                  signInSocial();})}  
                  disabled={isPending}>
                {isPending ? "Redirecting…" : "Login with Google"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <a
                href="#"
                className="underline underline-offset-4"
                onClick={(e) => {
                  e.preventDefault()
                  setIsLogin(true)
                }}
              >
                Login
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
