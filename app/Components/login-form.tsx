import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useTransition , useActionState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signIn ,signInSocial } from "../actions"

const initialState = { message: '' };

export default function  LoginForm({ 
  className, 
  setIsLogin, 
  ...props 
}: React.ComponentPropsWithoutRef<"div"> & { 
  setIsLogin: (value: boolean) => void 
}) {
  // Define the State type
  type State = {
    message: string;
  };
  
    const [stateMessage, FormAction, pending] = useActionState(signIn as (prevState: State, formData: FormData) => Promise<State>,
    { message: '' }
  );
  const [isPending, startTransition] = useTransition();

  return (
    <>
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action = {FormAction}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name = "email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2 ">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" type="password" name = "password" required />
                {stateMessage.message && (<p className="text-sm text-red-500">{stateMessage.message}</p>)}
              </div>

              <Button disabled = {pending} type="submit" className="w-full">
                Login
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
              Don&apos;t have an account?{" "}
              <a
                href="#"
                className="underline underline-offset-4"
                onClick={(e) => {
                  e.preventDefault();
                  setIsLogin(false);
                }}
              >
                Sign up
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
    
    </>
  );
}