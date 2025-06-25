
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  mockLessons,
  type Lesson,
  type LessonStep,
  type Question,
} from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, Trash2, PlusCircle } from "lucide-react";
import Link from "next/link";

export default function LessonBuilderPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const lessonId = params.lessonId as string;

  const [allLessons, setAllLessons] = useState<Lesson[]>([]);
  const [lesson, setLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedLessons = localStorage.getItem("lessons");
      const lessonsData = storedLessons
        ? JSON.parse(storedLessons)
        : mockLessons;
      setAllLessons(lessonsData);
      const lessonToEdit = lessonsData.find((l: Lesson) => l.id === lessonId);
      setLesson(lessonToEdit ? JSON.parse(JSON.stringify(lessonToEdit)) : null);
    }
  }, [lessonId]);

  const updateLessonField = (field: keyof Lesson, value: any) => {
    if (!lesson) return;
    setLesson({ ...lesson, [field]: value });
  };

  // Step Handlers
  const handleStepChange = (
    index: number,
    field: keyof LessonStep,
    value: string
  ) => {
    if (!lesson) return;
    const newSteps = [...lesson.steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setLesson({ ...lesson, steps: newSteps });
  };

  const addStep = () => {
    if (!lesson) return;
    const newStep: LessonStep = {
      id: `step_${Date.now()}`,
      title: "New Step",
      content: "",
    };
    setLesson({ ...lesson, steps: [...lesson.steps, newStep] });
  };

  const deleteStep = (index: number) => {
    if (!lesson) return;
    const newSteps = lesson.steps.filter((_, i) => i !== index);
    setLesson({ ...lesson, steps: newSteps });
  };

  // Question Handlers
  const handleQuestionChange = (
    qIndex: number,
    field: keyof Question,
    value: string
  ) => {
    if (!lesson) return;
    const newQuestions = [...lesson.questions];
    newQuestions[qIndex] = { ...newQuestions[qIndex], [field]: value };
    setLesson({ ...lesson, questions: newQuestions });
  };

  const handleOptionChange = (qIndex: number, oIndex: number, value: string) => {
    if (!lesson) return;
    const newQuestions = [...lesson.questions];
    newQuestions[qIndex].options[oIndex] = value;
    setLesson({ ...lesson, questions: newQuestions });
  };
  
  const handleCorrectAnswerChange = (qIndex: number, oIndex: number) => {
    if (!lesson) return;
    const newQuestions = [...lesson.questions];
    newQuestions[qIndex].correctAnswer = newQuestions[qIndex].options[oIndex];
    setLesson({ ...lesson, questions: newQuestions });
  }
  
  const addOption = (qIndex: number) => {
    if (!lesson) return;
    const newQuestions = [...lesson.questions];
    newQuestions[qIndex].options.push("New Option");
    setLesson({ ...lesson, questions: newQuestions });
  };

  const deleteOption = (qIndex: number, oIndex: number) => {
    if (!lesson) return;
    const newQuestions = [...lesson.questions];
    const question = newQuestions[qIndex];
    // Prevent deleting the correct answer if it's the last one
    if (question.options[oIndex] === question.correctAnswer && question.options.length > 1) {
        toast({variant: 'destructive', title: "Cannot delete the correct answer."})
        return;
    }
    question.options = question.options.filter((_, i) => i !== oIndex);
    if (question.options.length > 0 && !question.options.includes(question.correctAnswer)) {
        question.correctAnswer = question.options[0];
    }

    setLesson({ ...lesson, questions: newQuestions });
  };

  const addQuestion = () => {
    if (!lesson) return;
    const newQuestion: Question = {
      id: `q_${Date.now()}`,
      text: "New Question",
      type: "multiple-choice",
      options: ["Option 1", "Option 2"],
      correctAnswer: "Option 1",
      hint: "",
    };
    setLesson({ ...lesson, questions: [...lesson.questions, newQuestion] });
  };

  const deleteQuestion = (index: number) => {
    if (!lesson) return;
    const newQuestions = lesson.questions.filter((_, i) => i !== index);
    setLesson({ ...lesson, questions: newQuestions });
  };

  // Save handler
  const handleSaveChanges = () => {
    if (!lesson) return;
    const lessonIndex = allLessons.findIndex((l) => l.id === lessonId);
    if (lessonIndex !== -1) {
      const updatedLessons = [...allLessons];
      updatedLessons[lessonIndex] = lesson;
      localStorage.setItem("lessons", JSON.stringify(updatedLessons));
      toast({
        title: "Lesson Saved!",
        description: "Your changes have been saved successfully.",
      });
      router.push("/dashboard/teacher");
    }
  };

  if (!lesson) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading lesson...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <div className="mb-6 flex items-center justify-between">
        <Button variant="ghost" asChild>
          <Link href="/dashboard/teacher">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
        <Button onClick={handleSaveChanges}>Save Changes</Button>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Lesson Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="lesson-title">Lesson Title</Label>
            <Input
              id="lesson-title"
              value={lesson.title}
              onChange={(e) => updateLessonField("title", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="lesson-xp">XP Value</Label>
            <Input
              id="lesson-xp"
              type="number"
              value={lesson.xp}
              onChange={(e) =>
                updateLessonField("xp", parseInt(e.target.value, 10) || 0)
              }
            />
          </div>
        </CardContent>
      </Card>

      <Separator className="my-8" />

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Learning Steps</CardTitle>
          <CardDescription>
            The content students will learn from, step-by-step.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="w-full space-y-4">
            {lesson.steps.map((step, index) => (
              <AccordionItem value={`step-${index}`} key={step.id} className="rounded-lg border bg-background px-4">
                <div className="flex items-center">
                    <AccordionTrigger className="flex-1 text-lg font-semibold">{step.title || "New Step"}</AccordionTrigger>
                    <Button variant="ghost" size="icon" onClick={() => deleteStep(index)} className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
                <AccordionContent className="space-y-4 pt-4">
                  <div>
                    <Label htmlFor={`step-title-${index}`}>Step Title</Label>
                    <Input
                      id={`step-title-${index}`}
                      value={step.title}
                      onChange={(e) =>
                        handleStepChange(index, "title", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor={`step-content-${index}`}>Content (Text)</Label>
                    <Textarea
                      id={`step-content-${index}`}
                      value={step.content}
                      onChange={(e) =>
                        handleStepChange(index, "content", e.target.value)
                      }
                      rows={5}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`step-image-${index}`}>Image URL</Label>
                    <Input
                      id={`step-image-${index}`}
                      value={step.image || ""}
                      onChange={(e) =>
                        handleStepChange(index, "image", e.target.value)
                      }
                       placeholder="https://placehold.co/600x400.png"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`step-video-${index}`}>Video URL</Label>
                    <Input
                      id={`step-video-${index}`}
                      value={step.videoUrl || ""}
                      onChange={(e) =>
                        handleStepChange(index, "videoUrl", e.target.value)
                      }
                      placeholder="https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <Button onClick={addStep} variant="outline" className="mt-6 w-full">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Learning Step
          </Button>
        </CardContent>
      </Card>
      
      <Separator className="my-8" />
      
      <Card>
        <CardHeader>
          <CardTitle>Quiz Questions</CardTitle>
          <CardDescription>
            Questions to test the student's understanding.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="w-full space-y-4">
            {lesson.questions.map((question, qIndex) => (
              <AccordionItem value={`question-${qIndex}`} key={question.id} className="rounded-lg border bg-background px-4">
                 <div className="flex items-center">
                    <AccordionTrigger className="flex-1 font-semibold">{question.text || "New Question"}</AccordionTrigger>
                    <Button variant="ghost" size="icon" onClick={() => deleteQuestion(qIndex)} className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
                <AccordionContent className="space-y-4 pt-4">
                  <div>
                    <Label htmlFor={`q-text-${qIndex}`}>Question Text</Label>
                    <Textarea
                      id={`q-text-${qIndex}`}
                      value={question.text}
                      onChange={(e) =>
                        handleQuestionChange(qIndex, "text", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label>Options & Correct Answer</Label>
                    <RadioGroup value={question.correctAnswer} onValueChange={() => { /* Handled by RadioItem click */ }}>
                      {question.options.map((option, oIndex) => (
                        <div key={oIndex} className="flex items-center gap-2">
                           <RadioGroupItem value={option} id={`q-${qIndex}-o-${oIndex}`} onClick={() => handleCorrectAnswerChange(qIndex, oIndex)} />
                          <Input
                            value={option}
                            onChange={(e) =>
                              handleOptionChange(qIndex, oIndex, e.target.value)
                            }
                            className="flex-1"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteOption(qIndex, oIndex)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </RadioGroup>
                    <Button onClick={() => addOption(qIndex)} variant="outline" size="sm" className="mt-2">
                        Add Option
                    </Button>
                  </div>
                  <div>
                    <Label htmlFor={`q-hint-${qIndex}`}>Hint</Label>
                    <Input
                      id={`q-hint-${qIndex}`}
                      value={question.hint}
                      onChange={(e) =>
                        handleQuestionChange(qIndex, "hint", e.target.value)
                      }
                    />
                  </div>
                   <div>
                    <Label htmlFor={`q-image-${qIndex}`}>Image URL</Label>
                    <Input
                      id={`q-image-${qIndex}`}
                      value={question.image || ""}
                      onChange={(e) =>
                        handleQuestionChange(qIndex, "image", e.target.value)
                      }
                       placeholder="https://placehold.co/600x400.png"
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <Button onClick={addQuestion} variant="outline" className="mt-6 w-full">
             <PlusCircle className="mr-2 h-4 w-4" />
            Add Quiz Question
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
