
"use client";

import { useState, useEffect } from "react";
import {
  mockUser,
  mockCourses as initialCourses,
  mockBadges,
  mockLessons as initialLessons,
  mockDailyAssignments as initialAssignments,
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
import { Flame, Medal, Sparkles, Clock, Calculator, FlaskConical, BookOpen, ChevronRight } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from 'date-fns';

const getFromLocalStorage = (key: string, defaultValue: any) => {
  if (typeof window === 'undefined') return defaultValue;
  const saved = localStorage.getItem(key);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      // When loading assignments, ensure the dueDate string is converted back to a Date object.
      if (key === 'assignments') {
        return parsed.map((a: any) => ({ ...a, dueDate: new Date(a.dueDate) }));
      }
      return parsed;
    } catch (e) {
      console.error(`Parsing error from localStorage for key "${key}"`, e);
      return defaultValue;
    }
  }
  return defaultValue;
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
  course: Course,
}) => (
  <Card>
    <CardHeader>
        <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-primary/10 p-4">
                <course.Icon className="h-8 w-8 text-primary" />
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
);

export default function StudentDashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [assignments, setAssignments] = useState<DailyAssignment[]>([]);

  useEffect(() => {
    const savedCourses = getFromLocalStorage('courses', initialCourses).map((c: any) => {
        let IconComponent = BookOpen;
        if (c.id === "math") IconComponent = Calculator;
        else if (c.id === "science") IconComponent = FlaskConical;
        return { ...c, Icon: IconComponent };
    });
    setCourses(savedCourses);
    setLessons(getFromLocalStorage('lessons', initialLessons));
    setAssignments(getFromLocalStorage('assignments', initialAssignments));
  }, []);


  const userBadges = mockBadges.slice(0, mockUser.stats.badges);
  const firstLesson = lessons.length > 0 ? lessons[0] : null;
  const firstCourse = firstLesson ? courses.find(c => c.id === firstLesson.courseId) : null;

  const now = new Date();
  const activeAssignments = assignments.filter(
    (assignment) => new Date(assignment.dueDate) > now
  );

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="font-headline text-3xl font-bold">
          Welcome back, {mockUser.name.split(" ")[0]}!
        </h1>
        <p className="text-muted-foreground">
          Let&apos;s continue your learning journey.
        </p>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <StatCard
          Icon={Sparkles}
          title="Total XP"
          value={mockUser.stats.xp}
          color="text-accent"
        />
        <StatCard
          Icon={Flame}
          title="Day Streak"
          value={mockUser.stats.streak}
          color="text-red-500"
        />
        <StatCard
          Icon={Medal}
          title="Badges Earned"
          value={mockUser.stats.badges}
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
                 {firstLesson && firstCourse ? (
                    <Card>
                        <CardHeader>
                            <CardTitle>{firstLesson.title}</CardTitle>
                            <CardDescription>{firstCourse.title}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">You're doing great, keep it up!</p>
                            <Button className="w-full" asChild>
                                <Link href={`/courses/${firstLesson.courseId}/lessons/${firstLesson.id}`}>
                                    Jump Back In
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                  <Card>
                    <CardContent className="flex items-center justify-center p-6 text-center">
                      <p className="text-sm text-muted-foreground">Start a course to begin your journey!</p>
                    </CardContent>
                  </Card>
                )}
            </div>

            <div>
              <h2 className="mb-4 font-headline text-2xl font-bold">Active Assignments</h2>
              <Card>
                <CardContent className="pt-6">
                  {activeAssignments.length > 0 ? (
                    <div className="space-y-4">
                      {activeAssignments.map((assignment) => (
                        <Link href={`/dashboard/assignments/${assignment.id}`} key={assignment.id} className="block rounded-lg border bg-background p-4 transition-shadow hover:shadow-md hover:border-primary/50">
                           <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold">{assignment.title}</h3>
                              <p className="mt-1 mb-2 text-sm text-muted-foreground">{assignment.problem}</p>
                            </div>
                             <ChevronRight className="h-5 w-5 text-muted-foreground mt-1 ml-4 flex-shrink-0" />
                           </div>
                           <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Clock className="h-3.5 w-3.5" />
                                <span>Due {formatDistanceToNow(new Date(assignment.dueDate), { addSuffix: true })}</span>
                           </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-6 text-center">
                        <p className="text-sm text-muted-foreground">No active assignments. Well done!</p>
                    </div>
                  )}
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
