
'use client';

import { useActionState, useEffect, useState, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { User } from "@/lib/definitions";
import { updateProfile, updateAvatar, updatePassword } from './actions';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Pencil } from 'lucide-react';

const initialFormState = { message: '', success: false, errors: {} };

function UpdateProfileButton() {
    const { pending } = useFormStatus();
    return <Button type="submit" disabled={pending}>{pending ? 'Updating...' : 'Update Profile'}</Button>
}
function UpdateAvatarButton() {
    const { pending } = useFormStatus();
    return <Button type="submit" disabled={pending}>{pending ? 'Saving Avatar...' : 'Save Avatar'}</Button>
}

function UpdatePasswordButton() {
    const { pending } = useFormStatus();
    return <Button type="submit" disabled={pending}>{pending ? 'Updating Password...' : 'Update Password'}</Button>
}

export function ProfilePageClient({ user }: { user: User }) {
    const { toast } = useToast();
    const [profileState, profileFormAction] = useActionState(updateProfile, initialFormState);
    const [avatarState, avatarFormAction] = useActionState(updateAvatar, initialFormState);
    const [passwordState, passwordFormAction] = useActionState(updatePassword, initialFormState);


    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const passwordFormRef = useRef<HTMLFormElement>(null);


    useEffect(() => {
        if (profileState.success) {
            toast({
                title: "Success!",
                description: profileState.message,
            });
        }
    }, [profileState, toast]);

    useEffect(() => {
        if (avatarState.success) {
            toast({
                title: "Success!",
                description: avatarState.message,
            });
            setAvatarPreview(null); // Clear preview on success
        }
    }, [avatarState, toast]);
    
    useEffect(() => {
        if (passwordState.success) {
            toast({
                title: "Success!",
                description: passwordState.message,
            });
            passwordFormRef.current?.reset();
        }
    }, [passwordState, toast]);


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };


    return (
        <div className="container mx-auto py-8">
            <h1 className="font-headline text-3xl font-bold mb-8">My Profile</h1>
            <div className="max-w-2xl mx-auto">
                <Card>
                    <CardHeader>
                        <div className="flex flex-col items-center gap-6 sm:flex-row">
                            <div className="relative group">
                                <Avatar className="h-24 w-24">
                                    <AvatarImage src={avatarPreview || user.avatarUrl} alt={user.name} data-ai-hint="person" />
                                    <AvatarFallback>
                                    {user.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                </Avatar>
                                <Label
                                    htmlFor="avatar-upload"
                                    className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Pencil className="h-6 w-6 text-white" />
                                    <span className="sr-only">Change avatar</span>
                                </Label>
                                <input
                                    type="file"
                                    id="avatar-upload"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept="image/png, image/jpeg, image/gif"
                                    className="sr-only"
                                />
                            </div>
                            <div>
                                <CardTitle className="text-2xl text-center sm:text-left">{user.name}</CardTitle>
                                <CardDescription className="capitalize text-center sm:text-left">{user.role}</CardDescription>
                            </div>
                        </div>
                    </CardHeader>

                    <form action={avatarFormAction}>
                        {avatarPreview && (
                            <CardContent>
                                <input type="hidden" name="avatarUrl" value={avatarPreview} />
                                {avatarState.errors?.avatarUrl && <p className="mb-2 text-sm text-destructive">{avatarState.errors.avatarUrl[0]}</p>}
                                <div className="flex justify-center gap-2">
                                    <UpdateAvatarButton />
                                    <Button variant="outline" onClick={() => {
                                        setAvatarPreview(null);
                                        if (fileInputRef.current) fileInputRef.current.value = "";
                                    }}>Cancel</Button>
                                </div>
                            </CardContent>
                        )}
                    </form>

                    <form action={profileFormAction}>
                        <CardContent className="space-y-6">
                            {!profileState.success && profileState.message && !profileState.errors && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Error</AlertTitle>
                                    <AlertDescription>{profileState.message}</AlertDescription>
                                </Alert>
                            )}
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" name="name" defaultValue={user.name} />
                                {profileState.errors?.name && <p className="mt-1 text-sm text-destructive">{profileState.errors.name[0]}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" defaultValue={user.email} disabled />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <UpdateProfileButton />
                        </CardFooter>
                    </form>
                </Card>

                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle>Change Password</CardTitle>
                        <CardDescription>Update your password here. Please use a strong, unique password.</CardDescription>
                    </CardHeader>
                     <form action={passwordFormAction} ref={passwordFormRef}>
                        <CardContent className="space-y-4">
                            {!passwordState.success && passwordState.message && !passwordState.errors && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Error</AlertTitle>
                                    <AlertDescription>{passwordState.message}</AlertDescription>
                                </Alert>
                            )}
                            <div className="space-y-2">
                                <Label htmlFor="currentPassword">Current Password</Label>
                                <Input id="currentPassword" name="currentPassword" type="password" required />
                                {passwordState.errors?.currentPassword && <p className="mt-1 text-sm text-destructive">{passwordState.errors.currentPassword[0]}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="newPassword">New Password</Label>
                                <Input id="newPassword" name="newPassword" type="password" required />
                                {passwordState.errors?.newPassword && <p className="mt-1 text-sm text-destructive">{passwordState.errors.newPassword[0]}</p>}
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                <Input id="confirmPassword" name="confirmPassword" type="password" required />
                                {passwordState.errors?.confirmPassword && <p className="mt-1 text-sm text-destructive">{passwordState.errors.confirmPassword[0]}</p>}
                            </div>
                        </CardContent>
                        <CardFooter>
                           <UpdatePasswordButton />
                        </CardFooter>
                     </form>
                </Card>
            </div>
        </div>
    );
}
