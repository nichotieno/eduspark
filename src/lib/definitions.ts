
// This file contains type definitions for the data models.

export type User = {
    id: string;
    name: string;
    email: string;
    role: 'student' | 'teacher';
    avatarUrl?: string;
};
