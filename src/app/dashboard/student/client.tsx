
"use client";

import {
  type DailyAssignment,
  type Course,
  type Lesson,
} from "@/lib/mock-data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flame, Medal, Sparkles, Clock, BookOpen, Calculator, FlaskConical, Trophy, ClipboardList } from "lucide-react";
import Link from "next/link";
import { type SessionPayload } from "@/lib/session";

type StudentDashboardClientProps = {
    user: SessionPayload;
    stats: {
        totalXp: number;
        dayStreak: number;
        badgesEarned: number;
    };
    courses: Omit<Course, 'Icon'>[];
    assignmentsToDo: number;
    nextLesson: (Lesson & { course: Omit<Course, 'Icon'> }) | null;
};

const StatCard = ({
  Icon,
  title,
  value,
  color,
}: {
  Icon: React.ElementType;
  title: string;
  value: string | number;
  color: string;
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className={`h-4 w-4 ${color}`} />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

const CourseCard = ({
  course,
}: {
  course: Omit<Course, 'Icon'>,
}) => {
  const Icon = course.id === "math" ? Calculator : course.id === "science" ? FlaskConical : BookOpen;
  return (
    <Card>
      <CardHeader>
          <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-primary/10 p-4">
                  <Icon className="h-8 w-8 text-primary" />
              </div>
          </div>
        <CardTitle className="text-center font-headline">{course.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center text-center">
        <p className="mb-4 text-sm text-muted-foreground">{course.description}</p>
        <Button asChild className="mt-auto">
          <Link href={`/courses/${course.id}`}>View Course</Link>
        </Button>
      </CardContent>
    </Card>
  )
};

export function StudentDashboardClient({
    user,
    stats,
    courses,
    assignmentsToDo,
    nextLesson
}: StudentDashboardClientProps) {

  const userBadges = stats.badgesEarned > 0 ? [{ id: 'b1', name: 'Math Beginner', Icon: Medal }] : [];
  
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="font-headline text-3xl font-bold">
          Welcome back, {user.name.split(" ")[0]}!
        </h1>
        <p className="text-muted-foreground">
          Let&apos;s continue your learning journey.
        </p>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <StatCard
          Icon={Sparkles}
          title="Total XP"
          value={stats.totalXp}
          color="text-accent"
        />
        <StatCard
          Icon={Flame}
          title="Day Streak"
          value={stats.dayStreak}
          color="text-red-500"
        />
        <StatCard
          Icon={Medal}
          title="Badges Earned"
          value={stats.badgesEarned}
          color="text-blue-500"
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-4 font-headline text-2xl font-bold">Courses</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>

        <div className="space-y-8">
            <div>
                <h2 className="mb-4 font-headline text-2xl font-bold">Continue Learning</h2>
                 {nextLesson ? (
                    <Card>
                        <CardHeader>
                            <CardTitle>{nextLesson.title}</CardTitle>
                            <CardDescription>{nextLesson.course.title}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">You're doing great, keep it up!</p>
                            <Button className="w-full" asChild>
                                <Link href={`/courses/${nextLesson.courseId}/lessons/${nextLesson.id}`}>
                                    Jump Back In
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center gap-4 p-6 text-center">
                        <Trophy className="h-10 w-10 text-amber-400" />
                        <div>
                            <h3 className="font-semibold">All Lessons Complete!</h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                                You've finished all available lessons. Great job!
                            </p>
                        </div>
                    </CardContent>
                  </Card>
                )}
            </div>

            <div>
              <h2 className="mb-4 font-headline text-2xl font-bold">My Assignments</h2>
              <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ClipboardList className="h-6 w-6" />
                        <span>Overview</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                    <p className="text-4xl font-bold">{assignmentsToDo}</p>
                    <p className="text-sm text-muted-foreground mt-1">Assignments to do</p>
                     <Button className="mt-4 w-full" asChild>
                        <Link href="/dashboard/assignments">View All Assignments</Link>
                    </Button>
                </CardContent>
              </Card>
            </div>

            <div>
            <h2 className="mb-4 font-headline text-2xl font-bold">My Badges</h2>
            <Card>
                <CardContent className="pt-6">
                <div className="flex flex-wrap justify-center gap-4">
                    {userBadges.map((badge) => (
                    <div key={badge.id} className="flex flex-col items-center text-center">
                        <div className="rounded-full border-2 border-accent p-3 bg-accent/10">
                            <badge.Icon className="h-8 w-8 text-accent" />
                        </div>
                        <p className="mt-2 text-xs font-semibold">{badge.name}</p>
                    </div>
                    ))}
                </div>
                </CardContent>
            </Card>
            </div>
        </div>
      </div>
    </div>
  );
}
