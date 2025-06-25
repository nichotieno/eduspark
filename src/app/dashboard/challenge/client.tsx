
"use client";

import React, { useState, useEffect, useActionState } from "react";
import { useFormStatus } from "react-dom";
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
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { type DailyChallenge, type ChallengeComment, type ChallengeCommunitySubmission } from "@/lib/mock-data";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { type SessionPayload } from "@/lib/session";
import { postComment, submitSolution } from './actions';
import { formatDistanceToNow } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

type DailyChallengePageClientProps = {
    challenge: DailyChallenge;
    initialComments: ChallengeComment[];
    hasSubmitted: boolean;
    communitySubmissions: ChallengeCommunitySubmission[];
    session: SessionPayload;
}

const initialFormState = { message: '', success: false, errors: {} };

function CommentSubmitButton() {
    const { pending } = useFormStatus();
    return <Button type="submit" size="sm" disabled={pending} className="mt-2">{pending ? 'Posting...' : 'Post Comment'}</Button>;
}

function SolutionSubmitButton() {
    const { pending } = useFormStatus();
    return <Button type="submit" className="w-full" disabled={pending}>{pending ? 'Submitting...' : 'Submit Solution'}</Button>
}


export function DailyChallengePageClient({ challenge, initialComments, hasSubmitted, communitySubmissions, session }: DailyChallengePageClientProps) {
  const [solution, setSolution] = useState("");
  const [comment, setComment] = useState("");
  const { toast } = useToast();
  
  const [commentState, commentAction] = useActionState(postComment, initialFormState);
  const [solutionState, solutionAction] = useActionState(submitSolution, initialFormState);

  const solutionSubmitted = hasSubmitted || solutionState.success;

  useEffect(() => {
    if (commentState.success) {
      setComment(""); // Clear input on successful post
      toast({ title: "Comment Posted!", description: "Your thoughts have been added to the discussion." });
    }
  }, [commentState, toast]);

  useEffect(() => {
    if (solutionState.success) {
      toast({ title: "Solution Submitted!", description: "Thanks for tackling the daily challenge." });
      setSolution("");
    }
  }, [solutionState, toast]);

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="font-headline text-3xl font-bold">Daily Challenge</h1>
        <p className="text-muted-foreground">
          A new STEM problem every day to test your skills.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="font-headline text-2xl">
                  {challenge.title}
                </CardTitle>
                <Badge variant="secondary">{challenge.topic}</Badge>
              </div>
              <CardDescription>
                Posted: {new Date(challenge.date).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {challenge.problem}
              </p>
            </CardContent>
          </Card>

          {solutionSubmitted && communitySubmissions.length > 0 && (
             <Card className="mt-8">
                <CardHeader>
                  <CardTitle>Community Solutions</CardTitle>
                  <CardDescription>
                    See how other students approached the problem.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                   <Accordion type="multiple" className="w-full space-y-2">
                    {communitySubmissions.map((sub) => (
                      <AccordionItem value={sub.id} key={sub.id} className="rounded-lg border bg-muted/50 px-4">
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center gap-4">
                            <Avatar>
                              <AvatarImage src={sub.studentAvatarUrl} alt={sub.studentName} data-ai-hint="person" />
                              <AvatarFallback>{sub.studentName.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                            </Avatar>
                            <div className="text-left">
                              <p className="font-semibold">{sub.studentName}</p>
                              <p className="text-sm text-muted-foreground">
                                Submitted {formatDistanceToNow(new Date(sub.submittedAt), { addSuffix: true })}
                              </p>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div
                            className="prose prose-sm dark:prose-invert max-w-none rounded-md border bg-background p-4"
                            dangerouslySetInnerHTML={{ __html: sub.content }}
                          />
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
          )}

          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="font-headline text-xl">
                Community Discussion
              </CardTitle>
              <CardDescription>
                See what others are saying and share your thoughts.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form action={commentAction} className="mb-6 flex gap-4">
                 <input type="hidden" name="challengeId" value={challenge.id} />
                <Avatar>
                  <AvatarImage src={session?.avatarUrl} alt={session?.name} data-ai-hint="person" />
                  <AvatarFallback>
                    {session?.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="w-full">
                   <RichTextEditor name="comment" value={comment} onChange={setComment} />
                   {commentState?.errors?.comment && <p className="mt-1 text-sm text-destructive">{commentState.errors.comment[0]}</p>}
                  <CommentSubmitButton />
                </div>
              </form>
              <Separator />
              <div className="mt-6 space-y-6">
                {initialComments.map((c) => (
                  <div key={c.id} className="flex gap-4">
                    <Avatar>
                      <AvatarImage src={c.userAvatarUrl} alt={c.userName} data-ai-hint="person" />
                      <AvatarFallback>
                        {c.userName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="w-full">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold">{c.userName}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(c.timestamp), { addSuffix: true })}
                        </p>
                      </div>
                      <div
                        className="text-muted-foreground prose prose-sm dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: c.comment }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card>
             <form action={solutionAction}>
                <CardHeader>
                    <CardTitle className="font-headline text-xl">
                        {solutionSubmitted ? 'Solution Submitted' : 'Submit Your Solution'}
                    </CardTitle>
                    <CardDescription>
                        {solutionSubmitted 
                            ? "You've already submitted a solution for this challenge. Good job!" 
                            : "Once you think you have the answer, submit it here."
                        }
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <input type="hidden" name="challengeId" value={challenge.id} />
                    {!solutionState.success && solutionState.message && !solutionState.errors && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Submission Error</AlertTitle>
                            <AlertDescription>{solutionState.message}</AlertDescription>
                        </Alert>
                    )}
                    <RichTextEditor
                        name="solution"
                        value={solution}
                        onChange={setSolution}
                        disabled={solutionSubmitted}
                    />
                    {solutionState?.errors?.solution && <p className="mt-1 text-sm text-destructive">{solutionState.errors.solution[0]}</p>}
                </CardContent>
                {!solutionSubmitted && (
                    <CardFooter>
                       <SolutionSubmitButton />
                    </CardFooter>
                )}
             </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
