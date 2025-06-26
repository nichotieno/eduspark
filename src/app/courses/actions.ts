
'use server';

import { getDb } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/session';
import type { Lesson } from '@/lib/mock-data';
import { getTutorHint, type GetTutorHintInput } from '@/ai/flows/get-tutor-hint-flow';

export async function completeLesson(lessonId: string) {
    const session = await getSession();
    if (!session) {
        return { success: false, message: 'Not authenticated.' };
    }

    const db = await getDb();
    const now = new Date();
    const today = now.toISOString().split('T')[0]; // YYYY-MM-DD

    try {
        await db.run('BEGIN TRANSACTION');

        const lesson = await db.get<Lesson>('SELECT * FROM lessons WHERE id = ?', lessonId);
        if (!lesson) {
            await db.run('ROLLBACK');
            return { success: false, message: 'Lesson not found.' };
        }
        
        // 1. Record lesson completion
        await db.run(
            'INSERT OR IGNORE INTO user_progress (userId, lessonId, completedAt, xpEarned) VALUES (?, ?, ?, ?)',
            session.id,
            lessonId,
            now.toISOString(),
            lesson.xp
        );

        // 2. Update streak
        await db.run(
            'INSERT OR IGNORE INTO user_streaks (userId, "date") VALUES (?, ?)',
            session.id,
            today
        );

        // 3. Check for and award badges
        const completedMathLessons = await db.get('SELECT COUNT(*) as count FROM user_progress up JOIN lessons l ON up.lessonId = l.id WHERE up.userId = ? AND l.courseId = ?', session.id, 'math');
        const completedScienceLessons = await db.get('SELECT COUNT(*) as count FROM user_progress up JOIN lessons l ON up.lessonId = l.id WHERE up.userId = ? AND l.courseId = ?', session.id, 'science');
        
        if (completedMathLessons.count > 0) {
             await db.run('INSERT OR IGNORE INTO user_badges (userId, badgeId, earnedAt) VALUES (?, ?, ?)', session.id, 'b1', now.toISOString());
        }
        if (completedScienceLessons.count > 0) {
             await db.run('INSERT OR IGNORE INTO user_badges (userId, badgeId, earnedAt) VALUES (?, ?, ?)', session.id, 'b2', now.toISOString());
        }
        
        // You can add more badge logic here for course completion, etc.

        await db.run('COMMIT');

        revalidatePath('/dashboard/student');
        revalidatePath(`/courses/${lesson.courseId}`);
        return { success: true, message: 'Lesson completed!' };

    } catch (error) {
        await db.run('ROLLBACK');
        console.error('Failed to complete lesson:', error);
        return { success: false, message: 'An error occurred while saving progress.' };
    }
}

export async function getTutorHintAction(input: GetTutorHintInput) {
    const session = await getSession();
    if (!session) {
        return { success: false, message: 'Not authenticated.' };
    }

    try {
        const result = await getTutorHint(input);
        return { success: true, hint: result.hintText };
    } catch (error) {
        console.error("Failed to get AI Tutor hint:", error);
        return { success: false, message: 'An AI error occurred.' };
    }
}

export async function recordQuestionAnswerAction(data: {
    lessonId: string;
    questionId: string;
    answer: string;
    isCorrect: boolean;
}) {
    const session = await getSession();
    if (!session) {
        return { success: false, message: 'Not authenticated.' };
    }

    const { lessonId, questionId, answer, isCorrect } = data;
    
    try {
        const db = await getDb();
        await db.run(
            'INSERT INTO user_question_answers (id, userId, lessonId, questionId, answer, isCorrect, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?)',
            `ans_${crypto.randomUUID()}`,
            session.id,
            lessonId,
            questionId,
            answer,
            isCorrect,
            new Date().toISOString()
        );
        return { success: true };
    } catch (error) {
        console.error('Failed to record question answer:', error);
        return { success: false, message: 'Database error.' };
    }
}
