
"use client";

import { useState, useEffect } from "react";
import { type Lesson } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Lightbulb, X, Check, ChevronLeft, Award, ChevronRight, Sparkles, BrainCircuit } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { completeLesson, getTutorHintAction, recordQuestionAnswerAction } from "@/app/courses/actions";
import { useToast } from "@/hooks/use-toast";

type RecommendedLesson = (Lesson & { course: Omit<Course, 'Icon'>, reasoning: string })

type LessonPageClientProps = {
    initialLesson: Lesson;
    nextRecommendedLesson: RecommendedLesson | null;
};

export function LessonPageClient({ initialLesson, nextRecommendedLesson }: LessonPageClientProps) {
  const { toast } = useToast();
  const [lesson] = useState<Lesson>(initialLesson);

  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [textAnswer, setTextAnswer] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [aiHint, setAiHint] = useState<string | null>(null);
  const [isGeneratingHint, setIsGeneratingHint] = useState(false);
  const [lessonComplete, setLessonComplete] = useState(false);
  
  useEffect(() => {
    if (lessonComplete) {
      completeLesson(lesson.id).then(result => {
        if (!result.success) {
          toast({
            variant: 'destructive',
            title: 'Error Saving Progress',
            description: result.message,
          });
        }
      });
    }
  }, [lessonComplete, lesson.id, toast]);
  

  const hasSteps = lesson.steps && lesson.steps.length > 0;
  const hasQuestions = lesson.questions && lesson.questions.length > 0;

  // Automatically complete lessons that have no content.
  useEffect(() => {
    if (!hasSteps && !hasQuestions) {
      setLessonComplete(true);
    }
  }, [hasSteps, hasQuestions]);

  const totalItems = (lesson.steps?.length || 0) + lesson.questions.length;
  const progress = lessonComplete ? 100 : totalItems > 0 ? (currentItemIndex / totalItems) * 100 : 0;
  
  const isLearningPhase = hasSteps && currentItemIndex < lesson.steps.length;
  const currentStep = isLearningPhase ? lesson.steps[currentItemIndex] : null;
  
  const isQuizPhase = !isLearningPhase;
  const currentQuestionIndex = isQuizPhase ? currentItemIndex - (lesson.steps?.length || 0) : -1;
  const question = isQuizPhase && hasQuestions ? lesson.questions[currentQuestionIndex] : null;

  const handleBack = () => {
    if (currentItemIndex > 0) {
      setCurrentItemIndex(currentItemIndex - 1);
      if (isQuizPhase && currentQuestionIndex === 0) {
        setSelectedAnswer(null);
        setTextAnswer("");
        setFeedback(null);
        setShowHint(false);
        setAiHint(null);
      }
    }
  };

  const handleNextStep = () => {
    if (isLearningPhase && lesson.steps) {
      if (currentItemIndex < lesson.steps.length - 1) {
        setCurrentItemIndex(currentItemIndex + 1);
      } else {
        // This is the last step
        if (hasQuestions) {
          setCurrentItemIndex(currentItemIndex + 1); // Go to quiz
        } else {
          setLessonComplete(true); // No questions, so lesson is done
        }
      }
    }
  };

  const handleAnswerSelect = (option: string) => {
    if (feedback) return;
    if (question?.type === 'multiple-choice') {
        setSelectedAnswer(option);
    }
  };

  const handleTextAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (feedback) return;
    setTextAnswer(e.target.value);
    setSelectedAnswer(e.target.value);
  }

  const checkAnswer = () => {
    if (!selectedAnswer || !question) return;

    const isCorrect = question.type === 'fill-in-the-blank'
        ? selectedAnswer.trim().toLowerCase() === question.correctAnswer.toLowerCase()
        : selectedAnswer === question.correctAnswer;

    if (isCorrect) {
      setFeedback("correct");
    } else {
      setFeedback("incorrect");
    }
    
    // Record the answer for personalization
    recordQuestionAnswerAction({
      lessonId: lesson.id,
      questionId: question.id,
      answer: selectedAnswer,
      isCorrect: isCorrect,
    });
  };
  
  const tryAgain = () => {
    setSelectedAnswer(null);
    setTextAnswer("");
    setFeedback(null);
  }

  const handleGetAiHint = async () => {
    if (!question) return;
    setIsGeneratingHint(true);
    setAiHint(null);

    const result = await getTutorHintAction({
      lessonTitle: lesson.title,
      questionText: question.text,
      questionOptions: question.options || [],
    });
    
    if (result.success && result.hint) {
      setAiHint(result.hint);
    } else {
      toast({
        variant: 'destructive',
        title: 'AI Tutor Error',
        description: result.message || 'Could not get a hint at this time.',
      });
    }

    setIsGeneratingHint(false);
  }

  const nextQuestion = () => {
    if (hasQuestions && currentQuestionIndex < lesson.questions.length - 1) {
      setCurrentItemIndex(currentItemIndex + 1);
      setSelectedAnswer(null);
      setTextAnswer("");
      setFeedback(null);
      setShowHint(false);
      setAiHint(null);
    } else {
      setLessonComplete(true);
    }
  };

  if (lessonComplete) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <Card className="w-full max-w-lg animate-in fade-in-50 zoom-in-90 text-center shadow-2xl">
                <CardHeader>
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                        <Award className="h-12 w-12 text-green-500" />
                    </div>
                    <CardTitle className="font-headline text-3xl">Lesson Complete!</CardTitle>
                    <CardDescription>You earned {lesson.xp} XP.</CardDescription>
                </CardHeader>
                <CardContent>
                    {nextRecommendedLesson ? (
                         <Alert className="text-left">
                            <BrainCircuit className="h-4 w-4" />
                            <AlertTitle>Up Next: {nextRecommendedLesson.title}</AlertTitle>
                            <AlertDescription>{nextRecommendedLesson.reasoning}</AlertDescription>
                        </Alert>
                    ) : (
                        <p className="text-muted-foreground">You've finished all the lessons. Amazing work!</p>
                    )}
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                    {nextRecommendedLesson ? (
                        <Button className="w-full" asChild>
                            <Link href={`/courses/${nextRecommendedLesson.courseId}/lessons/${nextRecommendedLesson.id}`}>Next Lesson</Link>
                        </Button>
                    ) : (
                         <Button className="w-full" asChild>
                            <Link href={`/courses/${lesson.courseId}`}>Back to Course</Link>
                        </Button>
                    )}
                    <Button variant="outline" className="w-full" asChild>
                         <Link href="/dashboard/student">Back to Dashboard</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <Button variant="ghost" asChild>
            <Link href={`/courses/${lesson.courseId}`}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Course
            </Link>
          </Button>
          <div className="flex-1 px-8">
            <Progress value={progress} />
          </div>
          <span className="w-24 text-right text-sm font-medium text-muted-foreground">
            {isLearningPhase ? `Step ${currentItemIndex + 1}` : `Question ${currentQuestionIndex + 1}`}
          </span>
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center p-4">
        <Card className="w-full max-w-3xl">
          {isLearningPhase && currentStep && (
            <>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">{currentStep.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {currentStep.image && (
                        <div className="overflow-hidden rounded-lg border">
                             <Image
                                src={currentStep.image}
                                alt={currentStep.title}
                                width={600}
                                height={400}
                                className="h-auto w-full object-cover"
                                data-ai-hint={currentStep['data-ai-hint']}
                            />
                        </div>
                    )}
                    {currentStep.videoUrl && (
                        <div className="aspect-video overflow-hidden rounded-lg border">
                            <video src={currentStep.videoUrl} controls className="h-full w-full" />
                        </div>
                    )}
                    <p className="leading-relaxed text-muted-foreground">{currentStep.content}</p>
                </CardContent>
            </>
          )}

          {isQuizPhase && question && (
             <>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">{question.text}</CardTitle>
                    <CardDescription>
                        {question.type === 'multiple-choice' 
                            ? 'Select the correct answer below.' 
                            : 'Type your answer in the box below.'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {question.image && (
                    <div className="mb-6 overflow-hidden rounded-lg border">
                        <Image
                        src={question.image}
                        alt="Question illustration"
                        width={600}
                        height={400}
                        className="h-auto w-full object-cover"
                        data-ai-hint={question['data-ai-hint']}
                        />
                    </div>
                    )}
                    
                    {question.type === 'multiple-choice' && (
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {question.options.map((option) => (
                            <Button
                            key={option}
                            variant="outline"
                            size="lg"
                            className={cn("h-auto justify-start p-4 text-left", {
                                "border-primary ring-2 ring-primary": selectedAnswer === option,
                                "border-green-500 bg-green-500/10 text-green-500": feedback === "correct" && option === question.correctAnswer,
                                "border-red-500 bg-red-500/10 text-red-500": feedback === "incorrect" && selectedAnswer === option,
                            })}
                            onClick={() => handleAnswerSelect(option)}
                            disabled={!!feedback}
                            >
                            {option}
                            </Button>
                        ))}
                        </div>
                    )}

                    {question.type === 'fill-in-the-blank' && (
                        <div className="flex flex-col items-center gap-4">
                            <Input
                                type="text"
                                value={textAnswer}
                                onChange={handleTextAnswerChange}
                                placeholder="Your answer..."
                                className={cn("max-w-sm text-center text-lg", {
                                    "border-green-500 focus-visible:ring-green-500": feedback === "correct",
                                    "border-red-500 focus-visible:ring-red-500": feedback === "incorrect",
                                })}
                                disabled={!!feedback}
                                autoFocus
                            />
                        </div>
                    )}

                    {showHint && (
                    <Alert className="mt-6">
                        <Lightbulb className="h-4 w-4" />
                        <AlertTitle>Hint</AlertTitle>
                        <AlertDescription>{question.hint}</AlertDescription>
                    </Alert>
                    )}
                    {aiHint && (
                        <Alert className="mt-6 border-accent">
                            <Sparkles className="h-4 w-4 text-accent" />
                            <AlertTitle>AI Tutor</AlertTitle>
                            <AlertDescription>{aiHint}</AlertDescription>
                        </Alert>
                    )}
                     {feedback && (
                        <Alert variant={feedback === "correct" ? "default" : "destructive"} className="mt-6 bg-card">
                        {feedback === 'correct' ? <Check className="h-4 w-4"/> : <X className="h-4 w-4"/>}
                        <AlertTitle>{feedback === "correct" ? "Correct!" : "Not quite!"}</AlertTitle>
                        <AlertDescription>
                            {feedback === "correct" ? "Great job!" : "That's not the right answer. Give it another try!"}
                        </AlertDescription>
                        </Alert>
                    )}
                </CardContent>
             </>
          )}

          <CardFooter className="flex-col items-stretch gap-4 border-t px-6 py-4">
            <div className="flex w-full items-center justify-between">
                <Button variant="outline" onClick={handleBack} disabled={currentItemIndex === 0}>
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>

                {isLearningPhase && (
                    <Button onClick={handleNextStep}>
                        {currentItemIndex === lesson.steps.length - 1 
                            ? (hasQuestions ? 'Start Quiz' : 'Complete Lesson') 
                            : 'Next'}
                        {currentItemIndex < lesson.steps.length - 1 && <ChevronRight className="ml-2 h-4 w-4" />}
                    </Button>
                )}

                {isQuizPhase && hasQuestions && (
                    <div className="flex items-center gap-2">
                         <Button
                            variant="outline"
                            onClick={() => setShowHint(true)}
                            disabled={showHint || !!feedback}
                            >
                            <Lightbulb className="mr-2 h-4 w-4" />
                            Hint
                        </Button>
                         <Button
                            variant="outline"
                            onClick={handleGetAiHint}
                            disabled={isGeneratingHint || !!feedback}
                            >
                            <Sparkles className="mr-2 h-4 w-4" />
                            {isGeneratingHint ? 'Thinking...' : 'AI Hint'}
                        </Button>
                        {feedback === 'correct' ? (
                            <Button onClick={nextQuestion}>Continue</Button>
                        ) : feedback === 'incorrect' ? (
                            <Button onClick={tryAgain}>Try Again</Button>
                        ) : (
                            <Button onClick={checkAnswer} disabled={!selectedAnswer}>Check Answer</Button>
                        )}
                    </div>
                )}
            </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
