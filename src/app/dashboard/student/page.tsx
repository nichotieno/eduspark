import {
  mockUser,
  mockCourses,
  mockBadges,
} from "@/lib/mock-data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Flame, Medal, Sparkles, Star } from "lucide-react";
import Link from "next/link";

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
                <Card>
                    <CardHeader>
                        <CardTitle>Introduction to Algebra</CardTitle>
                        <CardDescription>Core Math</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Progress value={45} className="mb-2" />
                        <p className="text-sm text-muted-foreground mb-4">45% complete</p>
                        <Button className="w-full">
                            Jump Back In
                        </Button>
                    </CardContent>
                </Card>
            </div>
            <div>
            <h2 className="mb-4 font-headline text-2xl font-bold">My Badges</h2>
            <Card>
                <CardContent className="pt-6">
                <div className="flex flex-wrap gap-4">
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
