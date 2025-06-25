import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BrainCircuit,
  Medal,
  Users,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import { EduSparkLogo } from "@/components/icons";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="container mx-auto flex h-20 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <EduSparkLogo className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold font-headline">EduSpark</span>
        </Link>
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">
              Sign Up <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        <section className="container mx-auto flex flex-col items-center justify-center px-4 py-20 text-center md:py-32">
          <div className="mb-4 rounded-full border bg-card px-4 py-1.5 text-sm font-medium">
            An interactive way to learn
          </div>
          <h1 className="max-w-3xl font-headline text-4xl font-bold tracking-tighter md:text-6xl">
            Spark Your Brilliance
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Master math and science concepts through engaging, interactive
            lessons. Build problem-solving skills and deepen your understanding.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/signup">
                Start Learning Now <BookOpen className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>

        <section id="features" className="w-full bg-card py-20 md:py-32">
          <div className="container mx-auto px-4">
            <h2 className="mb-2 text-center font-headline text-3xl font-bold tracking-tighter md:text-4xl">
              A Better Way to Learn
            </h2>
            <p className="mb-12 text-center text-lg text-muted-foreground">
              Our platform is designed to make learning active and rewarding.
            </p>
            <div className="grid gap-8 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <BrainCircuit className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="font-headline">
                    Interactive Lessons
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Go beyond videos. Solve problems, get hints, and build
                    confidence with hands-on learning.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Medal className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="font-headline">
                    Gamified Learning
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Earn XP, maintain streaks, and unlock badges. Turn learning
                    into a rewarding adventure.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="font-headline">
                    Teacher Dashboards
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Track student progress, identify learning gaps, and manage
                    your classrooms with ease.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="container mx-auto flex items-center justify-between px-4 py-6">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} EduSpark. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <Link
            href="#"
            className="text-sm text-muted-foreground hover:text-primary"
          >
            Terms
          </Link>
          <Link
            href="#"
            className="text-sm text-muted-foreground hover:text-primary"
          >
            Privacy
          </Link>
        </div>
      </footer>
    </div>
  );
}
