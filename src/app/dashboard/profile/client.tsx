
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { User } from "@/lib/definitions";

export function ProfilePageClient({ user }: { user: User }) {
    return (
        <div className="container mx-auto py-8">
            <h1 className="font-headline text-3xl font-bold mb-8">My Profile</h1>
            <Card className="max-w-2xl mx-auto">
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
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" defaultValue={user.name} disabled />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue={user.email} disabled />
                    </div>
                    <Button disabled>Update Profile</Button>
                    <p className="text-xs text-muted-foreground">Profile editing is not yet implemented.</p>
                </CardContent>
            </Card>
        </div>
    );
}
