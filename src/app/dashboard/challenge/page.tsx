
import { getDb } from '@/lib/db';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { DailyChallengePageClient } from './client';
import type { DailyChallenge, ChallengeComment, ChallengeCommunitySubmission } from '@/lib/mock-data';
import type { User } from '@/lib/definitions';
import { generatePersonalizedChallenge } from '@/ai/flows/generate-personalized-challenge-flow';
import crypto from 'crypto';

export default async function DailyChallengePage() {
    const session = await getSession();
    if (!session) {
        redirect('/login');
    }

    const db = await getDb();
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

    // Check if a challenge for this user and date already exists.
    let challenge = await db.get<DailyChallenge>(
        'SELECT * FROM user_challenges WHERE userId = ? AND "date" = ?',
        session.id,
        today
    );
    
    if (!challenge) {
        // If no challenge exists for today, generate a new one.
        try {
            const generatedContent = await generatePersonalizedChallenge({ userId: session.id });
            const challengeId = `challenge_${crypto.randomUUID()}`;

            await db.run(
                'INSERT INTO user_challenges (id, userId, title, problem, topic, "date") VALUES (?, ?, ?, ?, ?, ?)',
                challengeId,
                session.id,
                generatedContent.title,
                generatedContent.problem,
                generatedContent.topic,
                today
            );
            
            // Fetch the newly created challenge to ensure we have the correct object.
            challenge = await db.get<DailyChallenge>(
                'SELECT * FROM user_challenges WHERE id = ?',
                challengeId
            );

        } catch (error) {
            console.error("Failed to generate or save personalized challenge:", error);
            return (
                <div className="container mx-auto py-8 text-center">
                    <h1 className="font-headline text-3xl font-bold text-destructive">Could Not Generate Challenge</h1>
                    <p className="text-muted-foreground">An AI error occurred. Please try again later.</p>
                </div>
            )
        }
    }
    
    if (!challenge) {
        return (
            <div className="container mx-auto py-8 text-center">
                <h1 className="font-headline text-3xl font-bold">No Daily Challenge Available</h1>
                <p className="text-muted-foreground">Please check back later.</p>
            </div>
        )
    }

    // Fetch comments and user's submission for this specific challenge.
    const comments = await db.all<ChallengeComment[]>(`
        SELECT cc.id, cc.challengeId, cc.comment, cc.timestamp, u.name as userName, u.avatarUrl as userAvatarUrl
        FROM challenge_comments cc
        JOIN users u ON cc.userId = u.id
        WHERE cc.challengeId = ?
        ORDER BY cc.timestamp DESC
    `, challenge.id);

    const submission = await db.get(
        'SELECT id FROM challenge_submissions WHERE challengeId = ? AND userId = ?',
        challenge.id,
        session.id
    );

    // If the user has submitted, fetch other community submissions for the same challenge.
    // NOTE: In a real-world scenario with many users and challenges, you might fetch submissions
    // for a global "challenge of the day" concept, but for this personalized model, we'll keep it simple
    // and show other users who happened to get the same problem (unlikely, but good for demo).
    // For now, let's fetch submissions from other users for ANY of their challenges today.
    let communitySubmissions: ChallengeCommunitySubmission[] = [];
    if (submission) {
        communitySubmissions = await db.all<ChallengeCommunitySubmission[]>(`
            SELECT
                cs.id,
                cs.content,
                cs.submittedAt,
                u.name as studentName,
                u.avatarUrl as studentAvatarUrl
            FROM challenge_submissions cs
            JOIN users u ON cs.userId = u.id
            JOIN user_challenges uc ON cs.challengeId = uc.id
            WHERE uc.date = ? AND cs.userId != ?
            ORDER BY cs.submittedAt DESC
            LIMIT 10
        `, today, session.id);
    }

    return (
        <DailyChallengePageClient
            challenge={challenge}
            initialComments={comments}
            hasSubmitted={!!submission}
            communitySubmissions={communitySubmissions}
            session={session}
        />
    );
}
