
'use server';

import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { getDb } from '@/lib/db';
import { getSession, createSession } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import type { User } from '@/lib/definitions';

const ProfileUpdateSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
});

const AvatarUpdateSchema = z.object({
  avatarUrl: z.string().startsWith('data:image/', { message: "Invalid image format." }),
});

const PasswordUpdateSchema = z.object({
  currentPassword: z.string().min(1, { message: "Current password is required." }),
  newPassword: z.string().min(8, { message: "New password must be at least 8 characters." }),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "New passwords do not match.",
  path: ["confirmPassword"],
});


type FormState = {
  message: string;
  success: boolean;
  errors?: Record<string, string[] | undefined>;
};

export async function updateProfile(prevState: FormState, formData: FormData): Promise<FormState> {
  const session = await getSession();
  if (!session) {
    return { success: false, message: 'You must be logged in to update your profile.' };
  }

  const validatedFields = ProfileUpdateSchema.safeParse({
    name: formData.get('name'),
  });

  if (!validatedFields.success) {
    return { 
      success: false, 
      message: 'Invalid data provided.', 
      errors: validatedFields.error.flatten().fieldErrors 
    };
  }

  const { name } = validatedFields.data;

  try {
    const db = await getDb();
    
    await db.run('UPDATE users SET name = ? WHERE id = ?', name, session.id);

    const updatedUser: User = {
        ...session,
        name: name,
    };
    await createSession(updatedUser);

    revalidatePath('/dashboard/profile');
    revalidatePath('/dashboard/layout');

    return { success: true, message: 'Profile updated successfully!' };

  } catch (error) {
    console.error('Profile Update Error:', error);
    return { success: false, message: 'An unexpected error occurred. Please try again.' };
  }
}

export async function updateAvatar(prevState: FormState, formData: FormData): Promise<FormState> {
  const session = await getSession();
  if (!session) {
    return { success: false, message: 'You must be logged in to update your avatar.' };
  }

  const validatedFields = AvatarUpdateSchema.safeParse({
    avatarUrl: formData.get('avatarUrl'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Invalid data provided.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  const { avatarUrl } = validatedFields.data;

  try {
    const db = await getDb();
    await db.run('UPDATE users SET avatarUrl = ? WHERE id = ?', avatarUrl, session.id);

    const updatedUser: User = {
      ...session,
      avatarUrl,
    };
    await createSession(updatedUser);

    revalidatePath('/dashboard/profile');
    revalidatePath('/dashboard/layout'); // To update the header avatar

    return { success: true, message: 'Avatar updated successfully!' };
  } catch (error) {
    console.error('Avatar Update Error:', error);
    return { success: false, message: 'An unexpected error occurred while updating your avatar.' };
  }
}

export async function updatePassword(prevState: FormState, formData: FormData): Promise<FormState> {
  const session = await getSession();
  if (!session) {
    return { success: false, message: 'You must be logged in.' };
  }

  const validatedFields = PasswordUpdateSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return { success: false, message: 'Invalid data.', errors: validatedFields.error.flatten().fieldErrors };
  }

  const { currentPassword, newPassword } = validatedFields.data;

  try {
    const db = await getDb();
    const user = await db.get<{ password?: string }>('SELECT password FROM users WHERE id = ?', session.id);
    
    if (!user || !user.password) {
      return { success: false, message: 'User not found.' };
    }

    const passwordsMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordsMatch) {
      return { success: false, message: 'Your current password is not correct.' };
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await db.run('UPDATE users SET password = ? WHERE id = ?', hashedNewPassword, session.id);

    return { success: true, message: 'Password updated successfully.' };

  } catch (error) {
    console.error('Password Update Error:', error);
    return { success: false, message: 'An unexpected database error occurred.' };
  }
}
