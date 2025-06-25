import { mockCourses, mockLessons } from "@/lib/mock-data";
import { notFound } from "next/navigation";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, Circle, ChevronLeft } from "lucide-react";

export default function CoursePage({
  params,
}: {
  params: { courseId: string };
}) {
  const course = mockCourses.find((c) => c.id === params.courseId);
  const lessons = mockLessons.filter((l) => l.courseId === params.courseId);

  if (!course) {
    notFound();
  }

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

      <div className="space-y-4">
        {lessons.map((lesson, index) => (
          <Link key={lesson.id} href={`/courses/${course.id}/lessons/${lesson.id}`}>
            <Card className="transition-all hover:shadow-md hover:border-primary">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-4">
                  {index === 0 ? (
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  ) : (
                    <Circle className="h-6 w-6 text-muted-foreground" />
                  )}
                  <div>
                    <CardTitle>{lesson.title}</CardTitle>
                    <CardDescription>{lesson.xp} XP</CardDescription>
                  </div>
                </div>
                <Button variant="ghost">Start Lesson</Button>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
