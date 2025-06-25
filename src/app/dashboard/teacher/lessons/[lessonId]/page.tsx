import { getDb } from "@/lib/db";
import type { Lesson, LessonStep, Question } from "@/lib/mock-data";
import { notFound } from "next/navigation";
import { LessonBuilderClient } from "./client";

type LessonWithRelations = Lesson & {
    steps: LessonStep[];
    questions: Question[];
}

export default async function LessonBuilderPage({ params }: { params: { lessonId: string }}) {
    const db = await getDb();
    const lessonId = params.lessonId;

    let lesson: LessonWithRelations | null = null;
    try {
        const lessonData = await db.get<Lesson>('SELECT * FROM lessons WHERE id = ?', lessonId);
        if (!lessonData) {
            notFound();
        }

        const stepsData = await db.all<LessonStep[]>('SELECT * FROM lesson_steps WHERE lessonId = ? ORDER BY step_order', lessonId);
        const questionsData = await db.all<any[]>('SELECT * FROM questions WHERE lessonId = ? ORDER BY question_order', lessonId);

        lesson = {
            ...lessonData,
            steps: stepsData,
            questions: questionsData.map(q => ({
                ...q,
                // Options are stored as a JSON string in the DB, so we parse it back
                options: q.options ? JSON.parse(q.options) : [],
            }))
        }

    } catch (error) {
        console.error("Database query failed", error);
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-2xl font-bold text-destructive mb-4">Database Error</h1>
                <p>Could not load lesson data from the database.</p>
            </div>
        )
    }

    if (!lesson) {
        notFound();
    }
    
    return <LessonBuilderClient initialLesson={lesson} />;
}
