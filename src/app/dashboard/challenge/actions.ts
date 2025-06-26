
'use server';

import { z } from 'zod';
import { getDb } from '@/lib/db';
import { getSession } from '@/lib/session';
import { revalidatePath } from 'next/cache';

const CommentSchema = z.object({
  comment: z.string().min(3, 'Comment must be at least 3 characters.'),
  challengeId: z.string(),
});

const SolutionSchema = z.object({
    solution: z.string().min(10, 'Solution must be at least 10 characters.'),
    challengeId: z.string(),
});

type FormState = {
  message: string;
  success: boolean;
  errors?: Record<string, string[] | undefined>;
};

export async function postComment(prevState: FormState, formData: FormData): Promise<FormState> {
    const session = await getSession();
    if (!session) {
        return { success: false, message: 'You must be logged in to comment.' };
    }

    const validatedFields = CommentSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return { success: false, message: 'Invalid data.', errors: validatedFields.error.flatten().fieldErrors };
    }

    const { comment, challengeId } = validatedFields.data;

    try {
        const db = await getDb();
        await db.run(
            'INSERT INTO challenge_comments (id, challengeId, userId, comment, timestamp) VALUES (?, ?, ?, ?, ?)',
            `comment_${crypto.randomUUID()}`,
            challengeId,
            session.id,
            comment,
            new Date().toISOString()
        );
        revalidatePath('/dashboard/challenge');
        return { success: true, message: 'Comment posted.' };
    } catch (e) {
        console.error(e);
        return { success: false, message: 'Database error: Failed to post comment.' };
    }
}

export async function submitSolution(prevState: FormState, formData: FormData): Promise<FormState> {
     const session = await getSession();
    if (!session) {
        return { success: false, message: 'You must be logged in to submit a solution.' };
    }

    const validatedFields = SolutionSchema.safeParse(Object.fromEntries(formData.entries()));

     if (!validatedFields.success) {
        return { success: false, message: 'Invalid data.', errors: validatedFields.error.flatten().fieldErrors };
    }

    const { solution, challengeId } = validatedFields.data;

    try {
        const db = await getDb();
        await db.run(
            'INSERT INTO challenge_submissions (id, challengeId, userId, content, submittedAt) VALUES (?, ?, ?, ?, ?)',
            `sub_${crypto.randomUUID()}`,
            challengeId,
            session.id,
            solution,
            new Date().toISOString()
        );
        revalidatePath('/dashboard/challenge');
        return { success: true, message: 'Solution submitted successfully!' };
    } catch (e: any) {
        console.error(e);
        if (e.code === 'SQLITE_CONSTRAINT') {
             return { success: false, message: 'You have already submitted a solution for this challenge.' };
        }
        return { success: false, message: 'Database error: Failed to submit solution.' };
    }
}
