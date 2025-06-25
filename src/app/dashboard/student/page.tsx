import {
  mockUser,
  mockCourses,
  mockBadges,
  mockLessons,
  mockDailyAssignments,
} from "@/lib/mock-data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flame, Medal, Sparkles, Clock } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from 'date-fns';

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
  course: {
    id: string;
    title: string;
    description: string;
    Icon: React.ElementType;
  };
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
  const userBadges = mockBadges.slice(0, mockUser.stats.badges);
  const firstLesson = mockLessons[0];
  const firstCourse = mockCourses.find(c => c.id === firstLesson.courseId);

  const now = new Date();
  const activeAssignments = mockDailyAssignments.filter(
    (assignment) => assignment.dueDate > now
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
            {mockCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>

        <div className="space-y-8">
            <div>
                <h2 className="mb-4 font-headline text-2xl font-bold">Continue Learning</h2>
                 {firstLesson && firstCourse && (
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
                )}
            </div>

            <div>
              <h2 className="mb-4 font-headline text-2xl font-bold">Active Assignments</h2>
              <Card>
                <CardContent className="pt-6">
                  {activeAssignments.length > 0 ? (
                    <div className="space-y-4">
                      {activeAssignments.map((assignment) => (
                        <div key={assignment.id} className="rounded-lg border bg-card p-4 transition-shadow hover:shadow-md">
                           <h3 className="font-semibold">{assignment.title}</h3>
                           <p className="mt-1 mb-3 text-sm text-muted-foreground">{assignment.problem}</p>
                           <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Clock className="h-3.5 w-3.5" />
                                <span>Due {formatDistanceToNow(assignment.dueDate, { addSuffix: true })}</span>
                           </div>
                        </div>
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
