'use server';

import { z } from 'zod';
import { getDb } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import crypto from 'crypto';
import type { Topic } from '@/lib/mock-data';

// Schemas
const CourseSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
});

const TopicSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
});

const LessonSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters.'),
    xp: z.coerce.number().min(0, 'XP must be a positive number.'),
});

const AssignmentSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  problem: z.string().min(10, 'Problem description must be at least 10 characters.'),
  courseId: z.string(),
  dueDate: z.string().refine((d) => !isNaN(Date.parse(d)), 'Invalid date format.'),
});

type FormState = {
  message: string;
  success: boolean;
  errors?: Record<string, string[] | undefined>;
};

// Course Actions
export async function createCourse(prevState: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = CourseSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return { success: false, message: "Invalid data provided.", errors: validatedFields.error.flatten().fieldErrors };
  }

  try {
    const db = await getDb();
    const id = `course_${crypto.randomUUID()}`;
    await db.run('INSERT INTO courses (id, title, description) VALUES (?, ?, ?)', id, validatedFields.data.title, validatedFields.data.description);
    revalidatePath('/dashboard/teacher');
    return { success: true, message: 'Course created successfully.' };
  } catch (e) {
    console.error(e);
    return { success: false, message: 'Database error: Failed to create course.' };
  }
}

export async function updateCourse(courseId: string, prevState: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = CourseSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return { success: false, message: "Invalid data provided.", errors: validatedFields.error.flatten().fieldErrors };
  }

  try {
    const db = await getDb();
    await db.run('UPDATE courses SET title = ?, description = ? WHERE id = ?', validatedFields.data.title, validatedFields.data.description, courseId);
    revalidatePath('/dashboard/teacher');
    return { success: true, message: 'Course updated successfully.' };
  } catch (e) {
    console.error(e);
    return { success: false, message: 'Database error: Failed to update course.' };
  }
}

// Topic Actions
export async function createTopic(courseId: string, prevState: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = TopicSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return { success: false, message: 'Invalid data provided.', errors: validatedFields.error.flatten().fieldErrors };
  }
  
  try {
    const db = await getDb();
    const id = `topic_${crypto.randomUUID()}`;
    await db.run('INSERT INTO topics (id, courseId, title) VALUES (?, ?, ?)', id, courseId, validatedFields.data.title);
    revalidatePath('/dashboard/teacher');
    return { success: true, message: 'Topic created successfully.' };
  } catch (e) {
    console.error(e);
    return { success: false, message: 'Database error: Failed to create topic.' };
  }
}

export async function updateTopic(topicId: string, prevState: FormState, formData: FormData): Promise<FormState> {
    const validatedFields = TopicSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
      return { success: false, message: 'Invalid data provided.', errors: validatedFields.error.flatten().fieldErrors };
    }
  
    try {
      const db = await getDb();
      await db.run('UPDATE topics SET title = ? WHERE id = ?', validatedFields.data.title, topicId);
      revalidatePath('/dashboard/teacher');
      return { success: true, message: 'Topic updated successfully.' };
    } catch (e) {
      console.error(e);
      return { success: false, message: 'Database error: Failed to update topic.' };
    }
}

// Lesson Action
export async function createLesson(topicId: string, prevState: any, formData: FormData) {
    const validatedFields = LessonSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
      return { success: false, message: 'Invalid data provided.', errors: validatedFields.error.flatten().fieldErrors };
    }

    let lessonId;
    try {
        const db = await getDb();
        const topic = await db.get<Topic>('SELECT courseId FROM topics WHERE id = ?', topicId);
        if (!topic) {
            return { success: false, message: 'Could not find the associated course for this topic.' };
        }

        lessonId = `lesson_${crypto.randomUUID()}`;
        await db.run('INSERT INTO lessons (id, courseId, topicId, title, xp) VALUES (?, ?, ?, ?, ?)',
            lessonId,
            topic.courseId,
            topicId,
            validatedFields.data.title,
            validatedFields.data.xp
        );
    } catch (e) {
        console.error(e);
        return { success: false, message: 'Database error: Failed to create lesson.' };
    }

    revalidatePath('/dashboard/teacher');
    redirect(`/dashboard/teacher/lessons/${lessonId}`);
}

// Assignment Actions
export async function createAssignment(prevState: FormState, formData: FormData): Promise<FormState> {
    const validatedFields = AssignmentSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return { success: false, message: "Invalid data provided.", errors: validatedFields.error.flatten().fieldErrors };
    }

    try {
        const db = await getDb();
        const id = `assignment_${crypto.randomUUID()}`;
        await db.run('INSERT INTO assignments (id, title, problem, courseId, dueDate) VALUES (?, ?, ?, ?, ?)',
            id,
            validatedFields.data.title,
            validatedFields.data.problem,
            validatedFields.data.courseId,
            new Date(validatedFields.data.dueDate).toISOString()
        );
        revalidatePath('/dashboard/teacher');
        return { success: true, message: 'Assignment created successfully.' };
    } catch (e) {
        console.error(e);
        return { success: false, message: 'Database error: Failed to create assignment.' };
    }
}

export async function updateAssignment(assignmentId: string, prevState: FormState, formData: FormData): Promise<FormState> {
    const validatedFields = AssignmentSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return { success: false, message: "Invalid data provided.", errors: validatedFields.error.flatten().fieldErrors };
    }

    try {
        const db = await getDb();
        await db.run('UPDATE assignments SET title = ?, problem = ?, courseId = ?, dueDate = ? WHERE id = ?',
            validatedFields.data.title,
            validatedFields.data.problem,
            validatedFields.data.courseId,
            new Date(validatedFields.data.dueDate).toISOString(),
            assignmentId
        );
        revalidatePath('/dashboard/teacher');
        return { success: true, message: 'Assignment updated successfully.' };
    } catch (e) {
        console.error(e);
        return { success: false, message: 'Database error: Failed to update assignment.' };
    }
}
