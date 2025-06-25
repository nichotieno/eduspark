
'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { User } from "@/lib/definitions";
import { updateProfile } from './actions';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const initialFormState = { message: '', success: false, errors: {} };

function SubmitButton() {
    const { pending } = useFormStatus();
    return <Button type="submit" disabled={pending}>{pending ? 'Updating...' : 'Update Profile'}</Button>
}

export function ProfilePageClient({ user }: { user: User }) {
    const { toast } = useToast();
    const [state, formAction] = useActionState(updateProfile, initialFormState);

    useEffect(() => {
        if (state.success) {
            toast({
                title: "Success!",
                description: state.message,
            });
        }
    }, [state, toast]);

    return (
        <div className="container mx-auto py-8">
            <h1 className="font-headline text-3xl font-bold mb-8">My Profile</h1>
            <Card className="max-w-2xl mx-auto">
                <form action={formAction}>
                    <CardHeader>
                        <div className="flex items-center gap-6">
                            <Avatar className="h-24 w-24">
                                <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="person" />
                                <AvatarFallback>
                                {user.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <CardTitle className="text-2xl">{user.name}</CardTitle>
                                <CardDescription className="capitalize">{user.role}</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                         {!state.success && state.message && !state.errors && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{state.message}</AlertDescription>
                            </Alert>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" name="name" defaultValue={user.name} />
                            {state.errors?.name && <p className="mt-1 text-sm text-destructive">{state.errors.name[0]}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" defaultValue={user.email} disabled />
                        </div>
                        <p className="text-xs text-muted-foreground">Password and avatar updates are not yet implemented.</p>
                    </CardContent>
                    <CardFooter>
                        <SubmitButton />
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
