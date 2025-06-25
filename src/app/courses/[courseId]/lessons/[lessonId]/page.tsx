"use client";

import { useState, useEffect } from "react";
import { mockLessons } from "@/lib/mock-data";
import { notFound, useParams } from "next/navigation";
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
import { Lightbulb, X, Check, ChevronLeft, Award, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

export default function LessonPage() {
  const params = useParams();
  const lesson = mockLessons.find((l) => l.id === params.lessonId);

  if (!lesson) {
    notFound();
  }

  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [lessonComplete, setLessonComplete] = useState(false);
  
  const totalItems = (lesson.steps?.length || 0) + lesson.questions.length;
  const progress = ((currentItemIndex + 1) / totalItems) * 100;
  
  const isLearningPhase = currentItemIndex < (lesson.steps?.length || 0);
  const currentStep = isLearningPhase ? lesson.steps[currentItemIndex] : null;
  
  const isQuizPhase = currentItemIndex >= (lesson.steps?.length || 0);
  const currentQuestionIndex = isQuizPhase ? currentItemIndex - (lesson.steps?.length || 0) : -1;
  const question = isQuizPhase ? lesson.questions[currentQuestionIndex] : null;

  useEffect(() => {
    if (lessonComplete) {
      try {
        const completedLessons = JSON.parse(localStorage.getItem('completedLessons') || '{}');
        completedLessons[lesson.id] = true;
        localStorage.setItem('completedLessons', JSON.stringify(completedLessons));
      } catch (error) {
        console.error("Failed to update completed lessons in localStorage", error);
      }
    }
  }, [lessonComplete, lesson.id]);


  const handleBack = () => {
    if (currentItemIndex > 0) {
      setCurrentItemIndex(currentItemIndex - 1);
      // Reset quiz state if we're moving from the first question back to the learning phase
      if (isQuizPhase && currentQuestionIndex === 0) {
        setSelectedAnswer(null);
        setFeedback(null);
        setShowHint(false);
      }
    }
  };

  const handleNextStep = () => {
    if (isLearningPhase && currentItemIndex < lesson.steps.length) {
      setCurrentItemIndex(currentItemIndex + 1);
    }
  };

  const handleAnswerSelect = (option: string) => {
    if (feedback) return;
    setSelectedAnswer(option);
  };

  const checkAnswer = () => {
    if (!selectedAnswer || !question) return;
    if (selectedAnswer === question.correctAnswer) {
      setFeedback("correct");
    } else {
      setFeedback("incorrect");
    }
  };
  
  const tryAgain = () => {
    setSelectedAnswer(null);
    setFeedback(null);
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < lesson.questions.length - 1) {
      setCurrentItemIndex(currentItemIndex + 1);
      setSelectedAnswer(null);
      setFeedback(null);
      setShowHint(false);
    } else {
      setLessonComplete(true);
    }
  };

  if (lessonComplete) {
    const courseLessons = mockLessons.filter(l => l.courseId === lesson.courseId);
    const currentLessonIndexInCourse = courseLessons.findIndex(l => l.id === lesson.id);
    const nextLesson = currentLessonIndexInCourse !== -1 && currentLessonIndexInCourse < courseLessons.length - 1 ? courseLessons[currentLessonIndexInCourse + 1] : null;

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md text-center shadow-2xl animate-in fade-in-50 zoom-in-90">
                <CardHeader>
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900 mb-4">
                        <Award className="h-12 w-12 text-green-500" />
                    </div>
                    <CardTitle className="font-headline text-3xl">Lesson Complete!</CardTitle>
                    <CardDescription>You earned {lesson.xp} XP.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Great job on finishing "{lesson.title}". Keep up the momentum!</p>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                    {nextLesson ? (
                        <Button className="w-full" asChild>
                            <Link href={`/courses/${nextLesson.courseId}/lessons/${nextLesson.id}`}>Next Lesson</Link>
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
                    <p className="text-muted-foreground leading-relaxed">{currentStep.content}</p>
                </CardContent>
            </>
          )}

          {isQuizPhase && question && (
             <>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">{question.text}</CardTitle>
                    <CardDescription>Select the correct answer below.</CardDescription>
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
                    {showHint && (
                    <Alert className="mt-6">
                        <Lightbulb className="h-4 w-4" />
                        <AlertTitle>Hint</AlertTitle>
                        <AlertDescription>{question.hint}</AlertDescription>
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
                        {currentItemIndex === lesson.steps.length - 1 ? 'Start Quiz' : 'Next'}
                        {currentItemIndex < lesson.steps.length - 1 && <ChevronRight className="mr-2 h-4 w-4" />}
                    </Button>
                )}

                {isQuizPhase && (
                    <div className="flex items-center gap-2">
                         <Button
                            variant="outline"
                            onClick={() => setShowHint(true)}
                            disabled={showHint || !!feedback}
                            >
                            <Lightbulb className="mr-2 h-4 w-4" />
                            Hint
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
