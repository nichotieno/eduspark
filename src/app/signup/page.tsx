
"use client";

import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";

import { signup } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AlertCircle } from "lucide-react";
import { EduSparkLogo } from "@/components/icons";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Creating Account..." : "Create an account"}
    </Button>
  );
}

export default function SignupPage() {
  const [state, formAction] = useFormState(signup, undefined);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-sm">
         <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
                <Link href="/" className="flex items-center gap-2">
                    <EduSparkLogo className="h-10 w-10 text-primary" />
                </Link>
            </div>
          <CardTitle className="font-headline text-2xl">Sign Up</CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <form action={formAction}>
          <CardContent className="grid gap-4">
             {state?.error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{state.error}</AlertDescription>
              </Alert>
            )}
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" placeholder="Ada Lovelace" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" name="password" required />
            </div>
            <div className="grid gap-2">
                <Label>Role</Label>
                <RadioGroup name="role" defaultValue="student" className="flex gap-4">
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="student" id="role-student" />
                        <Label htmlFor="role-student">Student</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="teacher" id="role-teacher" />
                        <Label htmlFor="role-teacher">Teacher</Label>
                    </div>
                </RadioGroup>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <SubmitButton />
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="underline">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
