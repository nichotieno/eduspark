
"use client";

import { type Course, type Lesson, type Topic } from "@/lib/mock-data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Circle,
  ChevronLeft,
  Lock,
  Flag,
  Calculator,
  FlaskConical,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

type CoursePageClientProps = {
  course: Omit<Course, 'Icon'>;
  topics: Topic[];
  lessons: Lesson[];
  completedLessons: Record<string, boolean>;
};

export function CoursePageClient({
  course,
  topics,
  lessons,
  completedLessons,
}: CoursePageClientProps) {
  const Icon =
    course.id === "math"
      ? Calculator
      : course.id === "science"
      ? FlaskConical
      : BookOpen;
    
  const isLessonUnlocked = (lessonId: string): boolean => {
    const lessonIndex = lessons.findIndex((l) => l.id === lessonId);
    if (lessonIndex === -1) return false;
    if (lessonIndex === 0) return true; // First lesson is always unlocked
    const previousLesson = lessons[lessonIndex - 1];
    return !!completedLessons[previousLesson.id];
  };

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <Button variant="ghost" asChild className="mb-4">
        <Link href="/dashboard/student">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </Button>

      <div className="mb-8 flex items-center gap-4">
        <div className="rounded-full bg-primary/10 p-4">
          <Icon className="h-10 w-10 text-primary" />
        </div>
        <div>
          <h1 className="font-headline text-4xl font-bold">{course.title}</h1>
          <p className="text-muted-foreground">{course.description}</p>
        </div>
      </div>

      <div className="relative mx-auto max-w-2xl px-4 py-8">
        <div className="absolute left-5 top-0 h-full w-0.5 bg-border/80"></div>

        {topics.map((topic) => {
          const lessonsInTopic = lessons.filter((l) => l.topicId === topic.id);
          if (lessonsInTopic.length === 0) return null;

          const firstLessonOfTopic = lessonsInTopic[0];
          const topicUnlocked = isLessonUnlocked(firstLessonOfTopic.id);

          return (
            <div key={topic.id} className="relative mb-12 pl-14">
              <div className="absolute -left-1 top-1">
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-full border-4 bg-background",
                    topicUnlocked
                      ? "border-primary"
                      : "border-muted"
                  )}
                >
                  <Flag
                    className={cn(
                      "h-5 w-5",
                      topicUnlocked
                        ? "text-primary"
                        : "text-muted-foreground"
                    )}
                  />
                </div>
              </div>

              <div className={cn("transition-opacity", !topicUnlocked && "opacity-60")}>
                <h2 className="font-headline text-2xl font-bold text-primary">{topic.title}</h2>
                <div className="mt-4 space-y-4">
                  {lessonsInTopic.map((lesson) => {
                    const unlocked = isLessonUnlocked(lesson.id);
                    const completed = completedLessons[lesson.id];
                    const LessonLinkWrapper = unlocked ? Link : "div";

                    return (
                      <LessonLinkWrapper
                        key={lesson.id}
                        href={
                          unlocked
                            ? `/courses/${course.id}/lessons/${lesson.id}`
                            : "#"
                        }
                        aria-disabled={!unlocked}
                      >
                        <Card
                          className={cn(
                            "transition-all",
                            unlocked
                              ? "cursor-pointer hover:border-primary/50 hover:shadow-md"
                              : "cursor-not-allowed bg-muted/50"
                          )}
                        >
                          <CardContent className="flex items-center gap-4 p-4">
                            <div
                              className={cn(
                                "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full",
                                completed ? "bg-green-100 dark:bg-green-900" : unlocked ? "bg-primary/10" : "bg-muted"
                              )}
                            >
                              {completed ? (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              ) : unlocked ? (
                                <Circle className="h-5 w-5 text-primary/80" />
                              ) : (
                                <Lock className="h-5 w-5 text-muted-foreground" />
                              )}
                            </div>
                            <div className="flex-grow">
                              <p className="font-semibold">{lesson.title}</p>
                              <CardDescription>{lesson.xp} XP</CardDescription>
                            </div>
                          </CardContent>
                        </Card>
                      </LessonLinkWrapper>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
