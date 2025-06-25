'use server';

import { z } from 'zod';
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
