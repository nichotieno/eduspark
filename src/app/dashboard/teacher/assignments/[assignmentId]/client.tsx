
"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChevronLeft, Users } from "lucide-react";
import { format, formatDistanceToNow } from 'date-fns';
import type { DailyAssignment, AssignmentSubmission } from "@/lib/mock-data";

type PageProps = {
  assignment: DailyAssignment;
  submissions: AssignmentSubmission[];
};

export function TeacherAssignmentSubmissionsClient({ assignment, submissions }: PageProps) {
  return (
    <div className="container mx-auto max-w-4xl py-8">
      <Button variant="ghost" asChild className="mb-4">
        <Link href="/dashboard/teacher">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </Button>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">{assignment.title}</CardTitle>
          <CardDescription>
            Due: {format(new Date(assignment.dueDate), "PPP")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="leading-relaxed text-muted-foreground">{assignment.problem}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-6 w-6" />
            <span>Student Submissions ({submissions.length})</span>
          </CardTitle>
          <CardDescription>
            Review the solutions submitted by your students.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {submissions.length > 0 ? (
            <Accordion type="multiple" className="w-full space-y-2">
              {submissions.map((submission) => (
                <AccordionItem value={submission.id} key={submission.id} className="rounded-lg border bg-muted/50 px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={submission.studentAvatarUrl} alt={submission.studentName} data-ai-hint="person" />
                        <AvatarFallback>{submission.studentName.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                      </Avatar>
                      <div className="text-left">
                        <p className="font-semibold">{submission.studentName}</p>
                        <p className="text-sm text-muted-foreground">
                          Submitted {formatDistanceToNow(new Date(submission.submittedAt), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div
                      className="prose prose-sm dark:prose-invert max-w-none rounded-md border bg-background p-4"
                      dangerouslySetInnerHTML={{ __html: submission.content }}
                    />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
             <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20 p-12 text-center">
                <h3 className="text-lg font-semibold text-muted-foreground">
                  No Submissions Yet
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Check back after the due date to review submissions.
                </p>
              </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
