"use client";

import React, { useState, useEffect } from "react";
import { useParams, notFound, useRouter } from "next/navigation";
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
import { ChevronLeft, Clock } from 'lucide-react';
import { RichTextEditor } from "@/components/ui/rich-text-editor";

const getFromLocalStorage = (key: string, defaultValue: any) => {
    if (typeof window === 'undefined') return defaultValue;
    const saved = localStorage.getItem(key);
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
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

export default function AssignmentPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const assignmentId = params.assignmentId as string;

  const [assignment, setAssignment] = useState<DailyAssignment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [solution, setSolution] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const allAssignments = getFromLocalStorage('assignments', []);
    const currentAssignment = allAssignments.find((a: DailyAssignment) => a.id === assignmentId);
    
    if (currentAssignment) {
        setAssignment(currentAssignment);
    }
    
    const submissions = JSON.parse(localStorage.getItem('assignmentSubmissions') || '{}');
    if (submissions[assignmentId]) {
        setSolution(submissions[assignmentId]);
        setIsSubmitted(true);
    }

    setIsLoading(false);
  }, [assignmentId]);

  const handleSolutionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!solution.trim()) return;

    // Save submission to local storage
    const submissions = JSON.parse(localStorage.getItem('assignmentSubmissions') || '{}');
    submissions[assignmentId] = solution;
    localStorage.setItem('assignmentSubmissions', JSON.stringify(submissions));

    setIsSubmitted(true);

    toast({
      title: "Solution Submitted!",
      description: "Your teacher has received your submission. Good luck!",
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading assignment...</p>
      </div>
    );
  }

  if (!assignment) {
    return notFound();
  }
  
  const isPastDue = new Date(assignment.dueDate) < new Date();

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
                 {isPastDue && !isSubmitted && <span className="text-destructive font-semibold ml-4">(Past Due)</span>}
                 {isSubmitted && <span className="text-green-600 font-semibold ml-4">(Submitted)</span>}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <h3 className="mb-2 font-semibold text-lg">Assignment Details</h3>
            <p className="text-muted-foreground leading-relaxed">
              {assignment.problem}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-xl">
              {isSubmitted ? 'Your Submission' : 'Submit Your Answer'}
            </CardTitle>
            <CardDescription>
                {isSubmitted 
                    ? "You have already submitted your answer for this assignment."
                    : isPastDue 
                        ? "The due date has passed. Submissions are no longer accepted."
                        : "Complete your work and submit it here. You cannot edit after submitting."
                }
            </CardDescription>
          </CardHeader>
           <form onSubmit={handleSolutionSubmit}>
            <CardContent>
              <RichTextEditor
                value={solution}
                onChange={setSolution}
                disabled={isPastDue || isSubmitted}
              />
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full"
                disabled={!solution.trim() || isPastDue || isSubmitted}
              >
                {isSubmitted ? 'Submitted' : 'Submit Assignment'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
