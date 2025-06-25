
"use client";

import React, { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { ChevronLeft, Users, AlertCircle, Edit } from "lucide-react";
import { format, formatDistanceToNow } from 'date-fns';
import type { DailyAssignment, AssignmentSubmission } from "@/lib/mock-data";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { gradeSubmission } from "../../actions";

type PageProps = {
  assignment: DailyAssignment;
  submissions: AssignmentSubmission[];
};

type GradingFormState = {
  message: string;
  success: boolean;
  errors?: Record<string, string[] | undefined>;
};

const initialGradingFormState: GradingFormState = { message: '', success: false, errors: {} };

function GradeSubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? 'Saving...' : 'Save Grade'}
        </Button>
    );
}

function GradingForm({ submission }: { submission: AssignmentSubmission }) {
    const { toast } = useToast();
    const [state, formAction] = useActionState(gradeSubmission, initialGradingFormState);
    
    useEffect(() => {
        if (state.success) {
            toast({
                title: "Success",
                description: state.message,
            });
        }
    }, [state, toast]);

    return (
        <form action={formAction} className="space-y-4">
            <input type="hidden" name="submissionId" value={submission.id} />
             {!state.success && state.message && !state.errors && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{state.message}</AlertDescription>
                </Alert>
            )}
            <div className="grid grid-cols-3 items-end gap-4">
                <div className="col-span-1">
                    <Label htmlFor={`grade-${submission.id}`}>Grade (/100)</Label>
                    <Input
                        id={`grade-${submission.id}`}
                        name="grade"
                        type="number"
                        defaultValue={submission.grade ?? ''}
                        placeholder="e.g., 85"
                    />
                </div>
            </div>
             {state.errors?.grade && <p className="text-sm text-destructive -mt-2">{state.errors.grade[0]}</p>}
            <div>
                <Label htmlFor={`feedback-${submission.id}`}>Feedback</Label>
                <Textarea
                    id={`feedback-${submission.id}`}
                    name="feedback"
                    defaultValue={submission.feedback ?? ''}
                    placeholder="Provide constructive feedback..."
                    rows={4}
                />
                 {state.errors?.feedback && <p className="text-sm text-destructive mt-1">{state.errors.feedback[0]}</p>}
            </div>
            <div className="flex justify-end">
                <GradeSubmitButton />
            </div>
        </form>
    )
}

export function TeacherAssignmentSubmissionsClient({ assignment, submissions }: PageProps) {
  return (
    <div className="container mx-auto max-w-4xl py-8">
      <Button variant="ghost" asChild className="mb-4">
        <Link href="/dashboard/teacher?tab=assignments">
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
            Review the solutions submitted by your students and provide feedback.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {submissions.length > 0 ? (
            <Accordion type="multiple" className="w-full space-y-2">
              {submissions.map((submission) => (
                <AccordionItem value={submission.id} key={submission.id} className="rounded-lg border bg-muted/50 px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex w-full items-center justify-between">
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
                        <div className="text-right">
                             {submission.grade !== null ? (
                                <>
                                    <p className="font-semibold">{submission.grade} / 100</p>
                                    <p className="text-sm text-green-600">Graded</p>
                                </>
                             ) : (
                                <p className="text-sm text-yellow-600">Awaiting Grade</p>
                             )}
                        </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    <div>
                        <h4 className="font-semibold mb-2">Student's Solution:</h4>
                        <div
                        className="prose prose-sm dark:prose-invert max-w-none rounded-md border bg-background p-4"
                        dangerouslySetInnerHTML={{ __html: submission.content }}
                        />
                    </div>
                    <Separator />
                    <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <Edit className="h-5 w-5" />
                            Grade and Feedback
                        </h4>
                        <GradingForm submission={submission} />
                    </div>
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
