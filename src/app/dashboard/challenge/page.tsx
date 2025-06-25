"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  mockDailyChallenge,
  mockChallengeComments,
  mockUser,
  type ChallengeComment,
} from "@/lib/mock-data";

export default function DailyChallengePage() {
  const [solution, setSolution] = useState("");
  const [comment, setComment] = useState("");
  const [comments, setComments] =
    useState<ChallengeComment[]>(mockChallengeComments);
  const { toast } = useToast();

  const handleSolutionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!solution.trim()) return;
    console.log("Solution Submitted:", solution);
    toast({
      title: "Solution Submitted!",
      description: "Thanks for tackling the daily challenge.",
    });
    setSolution("");
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const newComment: ChallengeComment = {
      id: `c_${Date.now()}`,
      challengeId: mockDailyChallenge.id,
      userName: mockUser.name,
      userAvatarUrl: mockUser.avatarUrl,
      comment: comment.trim(),
      timestamp: "Just now",
    };

    setComments([newComment, ...comments]);
    setComment("");
    toast({
      title: "Comment Posted!",
      description: "Your thoughts have been added to the discussion.",
    });
  };

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
                  {mockDailyChallenge.title}
                </CardTitle>
                <Badge variant="secondary">{mockDailyChallenge.topic}</Badge>
              </div>
              <CardDescription>
                Posted: {new Date(mockDailyChallenge.date).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {mockDailyChallenge.problem}
              </p>
            </CardContent>
          </Card>

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
              <form onSubmit={handleCommentSubmit} className="mb-6 flex gap-4">
                <Avatar>
                  <AvatarImage src={mockUser.avatarUrl} alt={mockUser.name} data-ai-hint="person" />
                  <AvatarFallback>
                    {mockUser.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="w-full">
                  <Textarea
                    placeholder="Add to the discussion..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="mb-2"
                  />
                  <Button type="submit" size="sm" disabled={!comment.trim()}>
                    Post Comment
                  </Button>
                </div>
              </form>
              <Separator />
              <div className="mt-6 space-y-6">
                {comments.map((c) => (
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
                          {c.timestamp}
                        </p>
                      </div>
                      <p className="text-muted-foreground">{c.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl">
                Submit Your Solution
              </CardTitle>
              <CardDescription>
                Once you think you have the answer, submit it here.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSolutionSubmit}>
                <Textarea
                  placeholder="Describe your solution process and the final answer here..."
                  className="min-h-[150px]"
                  value={solution}
                  onChange={(e) => setSolution(e.target.value)}
                />
              </form>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full"
                onClick={handleSolutionSubmit}
                disabled={!solution.trim()}
              >
                Submit
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
