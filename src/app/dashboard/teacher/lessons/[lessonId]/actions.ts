
'use server';

import { z } from 'zod';
import { getDb } from '@/lib/db';
import { revalidatePath } from 'next/cache';

// Schemas for validation
const LessonStepSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Step title cannot be empty."),
  content: z.string().optional().default(""),
  image: z.string().optional().nullable(),
  videoUrl: z.string().optional().nullable(),
  'data-ai-hint': z.string().optional().nullable(),
});

const QuestionSchema = z.object({
  id: z.string(),
  text: z.string().min(1, "Question text cannot be empty."),
  type: z.enum(['multiple-choice', 'fill-in-the-blank']),
  options: z.array(z.string()),
  correctAnswer: z.string(),
  hint: z.string().optional().default(""),
  image: z.string().optional().nullable(),
  'data-ai-hint': z.string().optional().nullable(),
});

const LessonUpdateSchema = z.object({
    title: z.string().min(1, "Lesson title cannot be empty."),
    xp: z.coerce.number().min(0),
    steps: z.array(LessonStepSchema),
    questions: z.array(QuestionSchema),
});

export async function updateLesson(lessonId: string, lessonDataJSON: string) {
    const lessonData = JSON.parse(lessonDataJSON);
    const validatedFields = LessonUpdateSchema.safeParse(lessonData);

    if (!validatedFields.success) {
        console.error(validatedFields.error.flatten().fieldErrors);
        return { success: false, message: 'Invalid lesson data provided.' };
    }

    const { title, xp, steps, questions } = validatedFields.data;
    const db = await getDb();

    try {
        await db.run('BEGIN TRANSACTION');

        await db.run('UPDATE lessons SET title = ?, xp = ? WHERE id = ?', title, xp, lessonId);

        await db.run('DELETE FROM lesson_steps WHERE lessonId = ?', lessonId);
        for (const [index, step] of steps.entries()) {
            await db.run(
                'INSERT INTO lesson_steps (id, lessonId, title, content, image, videoUrl, "data-ai-hint", step_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                step.id, lessonId, step.title, step.content, step.image, step.videoUrl, step['data-ai-hint'], index
            );
        }

        await db.run('DELETE FROM questions WHERE lessonId = ?', lessonId);
        for (const [index, question] of questions.entries()) {
            await db.run(
                'INSERT INTO questions (id, lessonId, text, type, options, correctAnswer, hint, image, "data-ai-hint", question_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                question.id, lessonId, question.text, question.type, JSON.stringify(question.options), question.correctAnswer, question.hint, question.image, question['data-ai-hint'], index
            );
        }

        await db.run('COMMIT');

        revalidatePath(`/dashboard/teacher/lessons/${lessonId}`);
        revalidatePath('/dashboard/teacher');
        return { success: true, message: 'Lesson saved successfully!' };

    } catch (error) {
        await db.run('ROLLBACK');
        console.error("Failed to update lesson:", error);
        return { success: false, message: 'A database error occurred while saving.' };
    }
}
