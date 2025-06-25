"use client";

import { useState, useEffect } from "react";
import { mockCourses, mockLessons, type Lesson } from "@/lib/mock-data";
import { notFound, useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, Circle, ChevronLeft, Lock, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CoursePage() {
  const params = useParams();
  const course = mockCourses.find((c) => c.id === params.courseId);
  const lessons = mockLessons.filter((l) => l.courseId === params.courseId);

  const [completedLessons, setCompletedLessons] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    try {
      const storedCompletions = JSON.parse(
        localStorage.getItem("completedLessons") || "{}"
      );
      setCompletedLessons(storedCompletions);
    } catch (error) {
      console.error(
        "Failed to read completed lessons from localStorage",
        error
      );
      setCompletedLessons({});
    }
  }, []);

  if (!course) {
    notFound();
  }

  const topics = lessons.reduce<Record<string, Lesson[]>>((acc, lesson) => {
    const topic = lesson.topic;
    if (!acc[topic]) {
      acc[topic] = [];
    }
    acc[topic].push(lesson);
    return acc;
  }, {});
  const topicNames = Object.keys(topics);

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

      <div className="relative w-full max-w-3xl mx-auto py-16">
        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-border/50 -translate-x-1/2"></div>
        {topicNames.map((topicName, index) => {
          const lessonsInTopic = topics[topicName];
          const firstLessonOfTopic = lessonsInTopic[0];
          const topicUnlocked = isLessonUnlocked(firstLessonOfTopic.id);

          return (
            <div
              key={topicName}
              className={cn(
                "relative mb-16 flex items-start justify-center",
                index % 2 !== 0 && "flex-row-reverse"
              )}
            >
              <div className={cn("w-[calc(50%-2.5rem)]", index % 2 !== 0 ? "text-right" : "text-left")}>
                <Card
                  className={cn(
                    "transition-all",
                    !topicUnlocked && "opacity-60 bg-muted/50"
                  )}
                >
                  <CardHeader>
                    <CardTitle className="font-headline text-xl">{topicName}</CardTitle>
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
                            "block p-3 rounded-lg transition-colors",
                            unlocked
                              ? "hover:bg-accent/50 cursor-pointer"
                              : "cursor-not-allowed"
                          )}
                          aria-disabled={!unlocked}
                        >
                          <div
                            className={cn(
                              "flex items-center gap-3",
                              index % 2 !== 0 && "justify-end flex-row-reverse"
                            )}
                          >
                            {completed ? (
                              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                            ) : unlocked ? (
                              <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                            ) : (
                              <Lock className="h-5 w-5 text-muted-foreground flex-shrink-0" />
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

              <div className="absolute left-1/2 -translate-x-1/2 z-10 top-5">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border-4",
                    topicUnlocked
                      ? "bg-primary border-background"
                      : "bg-muted border-background"
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
