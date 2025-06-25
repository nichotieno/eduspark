
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
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";

type CoursePageClientProps = {
  course: Course & { Icon: React.ElementType };
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
          <course.Icon className="h-10 w-10 text-primary" />
        </div>
        <div>
          <h1 className="font-headline text-4xl font-bold">{course.title}</h1>
          <p className="text-muted-foreground">{course.description}</p>
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-3xl py-16">
        <div className="absolute left-1/2 top-0 bottom-0 w-1 -translate-x-1/2 bg-border/50"></div>
        {topics.map((topic, index) => {
          const lessonsInTopic = lessons.filter((l) => l.topicId === topic.id);
          if (lessonsInTopic.length === 0) return null;

          const firstLessonOfTopic = lessonsInTopic[0];
          const topicUnlocked = isLessonUnlocked(firstLessonOfTopic.id);

          return (
            <div
              key={topic.id}
              className={cn(
                "relative mb-16 flex items-start justify-center",
                index % 2 !== 0 && "flex-row-reverse"
              )}
            >
              <div
                className={cn(
                  "w-[calc(50%-2.5rem)]",
                  index % 2 !== 0 ? "text-right" : "text-left"
                )}
              >
                <Card
                  className={cn(
                    "transition-all",
                    !topicUnlocked && "bg-muted/50 opacity-60"
                  )}
                >
                  <CardHeader>
                    <CardTitle className="font-headline text-xl">
                      {topic.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
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
                          className={cn(
                            "block rounded-lg p-3 transition-colors",
                            unlocked
                              ? "cursor-pointer hover:bg-accent/50"
                              : "cursor-not-allowed"
                          )}
                          aria-disabled={!unlocked}
                        >
                          <div
                            className={cn(
                              "flex items-center gap-3",
                              index % 2 !== 0 && "flex-row-reverse justify-end"
                            )}
                          >
                            {completed ? (
                              <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-500" />
                            ) : unlocked ? (
                              <Circle className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                            ) : (
                              <Lock className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                            )}
                            <div className="flex flex-col">
                              <span className="font-semibold">
                                {lesson.title}
                              </span>
                              <CardDescription>{lesson.xp} XP</CardDescription>
                            </div>
                          </div>
                        </LessonLinkWrapper>
                      );
                    })}
                  </CardContent>
                </Card>
              </div>

              <div className="absolute left-1/2 top-5 z-10 -translate-x-1/2">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border-4",
                    topicUnlocked
                      ? "border-background bg-primary"
                      : "border-background bg-muted"
                  )}
                >
                  <MapPin
                    className={cn(
                      "h-5 w-5",
                      topicUnlocked
                        ? "text-primary-foreground"
                        : "text-muted-foreground"
                    )}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
