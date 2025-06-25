
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { ProfilePageClient } from "./client";
import { getDb } from "@/lib/db";
import type { User } from "@/lib/definitions";

export default async function ProfilePage() {
    const session = await getSession();
    if (!session) {
        redirect('/login');
    }

    const db = await getDb();
    // Re-fetch user from DB to ensure data is fresh
    const user = await db.get<User>('SELECT id, name, email, role, avatarUrl FROM users WHERE id = ?', session.id);

    if (!user) {
        // This should not happen if a session exists, but it's a good safeguard
        redirect('/login');
    }

    return <ProfilePageClient user={user} />;
}
