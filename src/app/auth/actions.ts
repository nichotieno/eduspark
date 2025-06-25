
'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

import { getDb } from '@/lib/db';
import { createSession } from '@/lib/session';
import { type User } from '@/lib/definitions';

// Zod schemas for validation
const LoginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

const SignupSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  role: z.enum(['student', 'teacher'], { message: "Please select a role." }),
});

type FormState = { error?: string } | undefined;

export async function login(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = LoginSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors.toString() };
  }

  const { email, password } = validatedFields.data;

  try {
    const db = await getDb();
    const user = await db.get<User>('SELECT * FROM users WHERE email = ?', email);

    if (!user) {
      return { error: 'Invalid email or password.' };
    }

    const passwordsMatch = await bcrypt.compare(password, (user as any).password);

    if (!passwordsMatch) {
      return { error: 'Invalid email or password.' };
    }

    // Create session
    await createSession(user);

  } catch (error) {
    console.error(error);
    return { error: 'An unexpected error occurred. Please try again.' };
  }
  
  // Redirect based on role
  const db = await getDb();
  const user = await db.get<User>('SELECT * FROM users WHERE email = ?', email);
  if (user?.role === 'teacher') {
      redirect('/dashboard/teacher');
  }
  redirect('/dashboard/student');
}


export async function signup(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
   const validatedFields = SignupSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    const firstError = Object.values(validatedFields.error.flatten().fieldErrors)[0];
    return { error: firstError ? firstError[0] : "Invalid input." };
  }

  const { name, email, password, role } = validatedFields.data;

  try {
    const db = await getDb();

    // Check if user already exists
    const existingUser = await db.get('SELECT id FROM users WHERE email = ?', email);
    if (existingUser) {
      return { error: 'A user with this email already exists.' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = crypto.randomUUID();
    const avatarUrl = `https://placehold.co/100x100.png`;

    await db.run(
      'INSERT INTO users (id, name, email, password, role, avatarUrl) VALUES (?, ?, ?, ?, ?, ?)',
      userId, name, email, hashedPassword, role, avatarUrl
    );
    
    const newUser: User = { id: userId, name, email, role, avatarUrl };
    await createSession(newUser);

  } catch (error) {
    console.error(error);
    return { error: 'An unexpected error occurred. Please try again.' };
  }

  if (role === 'teacher') {
      redirect('/dashboard/teacher');
  }
  redirect('/dashboard/student');
}

export async function logout() {
  // Destroy the session
  const { deleteSession } = await import('@/lib/session');
  await deleteSession();
  redirect('/login');
}
