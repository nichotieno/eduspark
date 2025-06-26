
"use client";

import React, { useEffect, useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { type DailyAssignment } from "@/lib/mock-data";
import { format } from 'date-fns';
import { ChevronLeft, Clock, AlertCircle, Award, MessageSquareQuote } from 'lucide-react';
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { submitAssignment } from "../actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type Submission = {
  content: string;
  grade: number | null;
  feedback: string | null;
};

type AssignmentPageClientProps = {
    assignment: DailyAssignment;
    submission: Submission | null;
}

const initialFormState = { message: '', success: false, errors: {} };

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button
            type="submit"
            className="w-full"
            disabled={pending}
        >
            {pending ? 'Submitting...' : 'Submit Assignment'}
        </Button>
    );
}

export function AssignmentPageClient({ assignment, submission }: AssignmentPageClientProps) {
  const { toast } = useToast();
  
  const [state, formAction] = useActionState(submitAssignment, initialFormState);
  const [isPastDue, setIsPastDue] = useState(false);

  useEffect(() => {
    // Calculate isPastDue on the client to avoid hydration mismatch
    setIsPastDue(new Date(assignment.dueDate) < new Date());
  }, [assignment.dueDate]);
  
  const isSubmitted = !!submission || state.success;
  const isGraded = isSubmitted && submission?.grade !== null;

  useEffect(() => {
    if (state.success) {
      toast({
        title: "Solution Submitted!",
        description: state.message,
      });
    }
  }, [state, toast]);


  return (
    <div className="container mx-auto max-w-3xl py-8">
      <Button variant="ghost" asChild className="mb-4">
        <Link href="/dashboard/student">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </Button>

      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-3xl">{assignment.title}</CardTitle>
            <CardDescription className="flex items-center gap-2 pt-2 text-base">
                <Clock className="h-4 w-4" />
                <span>Due: {format(new Date(assignment.dueDate), 'PPP')}</span>
                 {isPastDue && !isSubmitted && <span className="ml-4 font-semibold text-destructive">(Past Due)</span>}
                 {isSubmitted && !isGraded && <span className="ml-4 font-semibold text-yellow-600">(Submitted, Awaiting Grade)</span>}
                 {isGraded && <span className="ml-4 font-semibold text-green-600">(Graded)</span>}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <h3 className="mb-2 text-lg font-semibold">Assignment Details</h3>
            <p className="leading-relaxed text-muted-foreground">
              {assignment.problem}
            </p>
          </CardContent>
        </Card>
        
        {isGraded && (
            <Card className="border-primary bg-primary/5">
                <CardHeader>
                    <CardTitle className="font-headline text-xl flex items-center gap-2">
                        <Award className="h-6 w-6 text-primary" />
                        Teacher Feedback
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h4 className="font-semibold text-lg">Grade: {submission?.grade}/100</h4>
                    </div>
                     {submission?.feedback && (
                        <div>
                            <h4 className="font-semibold flex items-center gap-2 mb-2">
                                <MessageSquareQuote className="h-5 w-5" />
                                Comments
                            </h4>
                            <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground" dangerouslySetInnerHTML={{ __html: submission.feedback }} />
                        </div>
                    )}
                </CardContent>
            </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-xl">
              {isSubmitted ? 'Your Submission' : 'Submit Your Answer'}
            </CardTitle>
            <CardDescription>
                {isGraded && "This assignment has been graded. No further edits are possible."}
                {!isGraded && isSubmitted && "You have already submitted your answer. You can see teacher feedback here once it's graded."}
                {!isGraded && !isSubmitted && isPastDue && "The due date has passed. Submissions are no longer accepted."}
                {!isGraded && !isSubmitted && !isPastDue && "Complete your work and submit it here. You cannot edit after submitting."}
            </CardDescription>
          </CardHeader>
           <form action={formAction}>
            <CardContent>
                <input type="hidden" name="assignmentId" value={assignment.id} />
                {!state.success && state.message && !state.errors && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Submission Error</AlertTitle>
                        <AlertDescription>{state.message}</AlertDescription>
                    </Alert>
                )}
                <RichTextEditor
                    name="solution"
                    value={submission?.content}
                    disabled={isPastDue || isSubmitted}
                />
                 {state.errors?.solution && <p className="mt-1 text-sm text-destructive">{state.errors.solution[0]}</p>}
            </CardContent>
            {!isSubmitted && (
                <CardFooter>
                    <SubmitButton />
                </CardFooter>
            )}
          </form>
        </Card>
      </div>
    </div>
  );
}
