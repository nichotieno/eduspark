
import { getDb } from "@/lib/db";
import { type Course, type Lesson, type LessonStep, type Question } from "@/lib/mock-data";
import { notFound, redirect } from "next/navigation";
import { LessonPageClient } from "./client";
import { getSession } from "@/lib/session";
import { generateNextLessonRecommendation } from "@/ai/flows/generate-next-lesson-recommendation-flow";

async function getLessonData(lessonId: string) {
    const db = await getDb();
    
    const lessonData = await db.get<Lesson>('SELECT * FROM lessons WHERE id = ?', lessonId);
    if (!lessonData) {
        return null;
    }

    const stepsData = await db.all<LessonStep[]>('SELECT * FROM lesson_steps WHERE lessonId = ? ORDER BY step_order', lessonId);
    const questionsData = await db.all<any[]>('SELECT * FROM questions WHERE lessonId = ? ORDER BY question_order', lessonId);

    const lesson: Lesson = {
        ...lessonData,
        steps: stepsData,
        questions: questionsData.map(q => ({
            ...q,
            options: q.options ? JSON.parse(q.options) : [],
        }))
    }

    return { lesson };
}

type RecommendedLesson = (Lesson & { course: Omit<Course, 'Icon'>, reasoning: string })

export default async function LessonPage({ params }: { params: { lessonId: string }}) {
    const session = await getSession();
    if (!session) {
        redirect('/login');
    }

    const lessonData = await getLessonData(params.lessonId);
    
    if (!lessonData) {
        notFound();
    }
    
    let nextRecommendedLesson: RecommendedLesson | null = null;
    try {
        const recommendation = await generateNextLessonRecommendation({ userId: session.id });
        if (recommendation.lessonId && recommendation.courseId) {
            const db = await getDb();
            const recommendedLessonData = await db.get<Lesson>('SELECT * FROM lessons WHERE id = ?', recommendation.lessonId);
            const courseData = await db.get<Course>('SELECT * FROM courses WHERE id = ?', recommendation.courseId);

            if (recommendedLessonData && courseData) {
                 nextRecommendedLesson = {
                    ...recommendedLessonData,
                    course: courseData,
                    reasoning: recommendation.reasoning,
                    steps: [], // not needed for this view
                    questions: [], // not needed for this view
                }
            }
        }
    } catch (e) {
        console.error("Failed to generate next lesson recommendation:", e);
        // Fail gracefully, the user can still proceed without a recommendation.
    }


    return <LessonPageClient initialLesson={lessonData.lesson} nextRecommendedLesson={nextRecommendedLesson} />;
}
