
import { getDb } from '@/lib/db';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { DailyChallengePageClient } from './client';
import type { DailyChallenge, ChallengeComment, ChallengeCommunitySubmission } from '@/lib/mock-data';
import type { User } from '@/lib/definitions';


export default async function DailyChallengePage() {
    const session = await getSession();
    if (!session) {
        redirect('/login');
    }

    const db = await getDb();
    
    // For simplicity, get today's challenge. A real app might have more complex logic.
    const challenge = await db.get<DailyChallenge>(
        'SELECT * FROM challenges ORDER BY "date" DESC LIMIT 1'
    );
    
    if (!challenge) {
        return (
            <div className="container mx-auto py-8 text-center">
                <h1 className="font-headline text-3xl font-bold">No Daily Challenge Available</h1>
                <p className="text-muted-foreground">Please check back later.</p>
            </div>
        )
    }

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
            WHERE cs.challengeId = ? AND cs.userId != ?
            ORDER BY cs.submittedAt DESC
        `, challenge.id, session.id);
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
