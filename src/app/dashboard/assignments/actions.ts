
'use server';

import { getDb } from '@/lib/db';
import { getSession } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const SubmissionSchema = z.object({
    solution: z.string().min(10, { message: 'Submission must be at least 10 characters.' }),
    assignmentId: z.string(),
});

type FormState = {
  message: string;
  success: boolean;
  errors?: Record<string, string[] | undefined>;
};

export async function submitAssignment(prevState: FormState, formData: FormData): Promise<FormState> {
    const session = await getSession();
    if (!session) {
        return { success: false, message: 'You must be logged in to submit an assignment.' };
    }

    const validatedFields = SubmissionSchema.safeParse({
        solution: formData.get('solution'),
        assignmentId: formData.get('assignmentId'),
    });

    if (!validatedFields.success) {
        return { success: false, message: 'Invalid data provided.', errors: validatedFields.error.flatten().fieldErrors };
    }
    
    const { solution, assignmentId } = validatedFields.data;

    try {
        const db = await getDb();
        const id = `submission_${crypto.randomUUID()}`;
        const submittedAt = new Date().toISOString();

        await db.run(
            'INSERT INTO submissions (id, assignmentId, userId, content, submittedAt) VALUES (?, ?, ?, ?, ?)',
            id,
            assignmentId,
            session.id,
            solution,
            submittedAt
        );

        revalidatePath(`/dashboard/assignments/${assignmentId}`);
        return { success: true, message: 'Assignment submitted successfully!' };

    } catch (e: any) {
        console.error(e);
        if (e.code === 'SQLITE_CONSTRAINT') {
             return { success: false, message: 'You have already submitted this assignment.' };
        }
        return { success: false, message: 'Database error: Failed to submit assignment.' };
    }
}
