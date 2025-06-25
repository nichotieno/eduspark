
"use client";

import React, { useState, useActionState, useEffect, useMemo } from "react";
import { useFormStatus } from "react-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  mockTeacherData,
  type Course,
  type Topic,
  type Lesson,
  type DailyAssignment,
} from "@/lib/mock-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  PlusCircle,
  Pencil,
  Trash2,
  BookCopy,
  BookMarked,
  FilePenLine,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  createCourse,
  updateCourse,
  createTopic,
  updateTopic,
  createLesson,
  createAssignment,
  updateAssignment,
} from './actions';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


type TeacherDashboardClientProps = {
    initialCourses: Course[];
    initialTopics: Topic[];
    initialLessons: Lesson[];
    initialAssignments: DailyAssignment[];
};

type FormState = {
  message: string;
  success: boolean;
  errors?: Record<string, string[] | undefined>;
};

const initialFormState: FormState = { message: '', success: false, errors: {} };

function SubmitButton({ children }: { children: React.ReactNode }) {
    const { pending } = useFormStatus();
    return <Button type="submit" disabled={pending} className="w-full sm:w-auto">{pending ? 'Saving...' : children}</Button>;
}

export function TeacherDashboardClient({
  initialCourses,
  initialTopics,
  initialLessons,
  initialAssignments,
}: TeacherDashboardClientProps) {
  const classroom = mockTeacherData.classrooms[0];
  const { toast } = useToast();

  const courses = initialCourses;
  const topics = initialTopics;
  const lessons = initialLessons;
  const assignments = initialAssignments;

  // Dialog states
  const [isCourseDialogOpen, setIsCourseDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const [isTopicDialogOpen, setIsTopicDialogOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [currentCourseIdForTopic, setCurrentCourseIdForTopic] = useState<string | null>(null);

  const [isLessonDialogOpen, setIsLessonDialogOpen] = useState(false);
  const [currentTopicId, setCurrentTopicId] = useState<string | null>(null);

  const [isAssignmentDialogOpen, setIsAssignmentDialogOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<DailyAssignment | null>(null);

  // Action states
  const [courseFormState, courseFormAction] = useActionState(
      editingCourse ? updateCourse.bind(null, editingCourse.id) : createCourse,
      initialFormState
  );
  const [topicFormState, topicFormAction] = useActionState(
      editingTopic ? updateTopic.bind(null, editingTopic.id) : createTopic.bind(null, currentCourseIdForTopic!),
      initialFormState
  );
  const [lessonFormState, lessonFormAction] = useActionState(
    currentTopicId ? createLesson.bind(null, currentTopicId) : (_: any, fd: FormData) => fd,
    initialFormState
  );
  const [assignmentFormState, assignmentFormAction] = useActionState(
    editingAssignment ? updateAssignment.bind(null, editingAssignment.id) : createAssignment,
    initialFormState
  );

  // Effects to close dialogs on success
  useEffect(() => {
    if (courseFormState.success) {
      toast({ title: "Success!", description: courseFormState.message });
      setIsCourseDialogOpen(false);
    }
  }, [courseFormState, toast]);

  useEffect(() => {
    if (topicFormState.success) {
      toast({ title: "Success!", description: topicFormState.message });
      setIsTopicDialogOpen(false);
    }
  }, [topicFormState, toast]);
  
  useEffect(() => {
    // Redirect is handled by server action, so we just close the dialog
    if (lessonFormState.success) {
      setIsLessonDialogOpen(false);
    }
  }, [lessonFormState]);

  useEffect(() => {
    if (assignmentFormState.success) {
      toast({ title: "Success!", description: assignmentFormState.message });
      setIsAssignmentDialogOpen(false);
    }
  }, [assignmentFormState, toast]);

  // Course Handlers
  const handleCreateNewCourse = () => {
    setEditingCourse(null);
    setIsCourseDialogOpen(true);
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setIsCourseDialogOpen(true);
  };

  const handleDeleteCourse = (courseId: string) => {
     toast({
        variant: 'destructive',
        title: "Action Disabled",
        description: "Delete functionality is not yet implemented.",
    });
  };

  // Topic Handlers
  const handleCreateNewTopic = (courseId: string) => {
    setEditingTopic(null);
    setCurrentCourseIdForTopic(courseId);
    setIsTopicDialogOpen(true);
  };

  const handleEditTopic = (topic: Topic) => {
    setEditingTopic(topic);
    setCurrentCourseIdForTopic(topic.courseId);
    setIsTopicDialogOpen(true);
  };

  const handleDeleteTopic = (topicId: string) => {
    toast({
        variant: 'destructive',
        title: "Action Disabled",
        description: "Delete functionality is not yet implemented.",
    });
  };

  // Lesson Handlers
  const handleCreateNewLesson = (topicId: string) => {
    setCurrentTopicId(topicId);
    setIsLessonDialogOpen(true);
  };

  const handleDeleteLesson = (lessonId: string) => {
    toast({
        variant: 'destructive',
        title: "Action Disabled",
        description: "Database modifications are not yet implemented.",
    });
  };

  // Assignment Handlers
  const handleCreateNewAssignment = () => {
    setEditingAssignment(null);
    setIsAssignmentDialogOpen(true);
  };

  const handleEditAssignment = (assignment: DailyAssignment) => {
    setEditingAssignment(assignment);
    setIsAssignmentDialogOpen(true);
  };

  const handleDeleteAssignment = (assignmentId: string) => {
    toast({
        variant: 'destructive',
        title: "Action Disabled",
        description: "Database modifications are not yet implemented.",
    });
  };

  const assignmentKey = useMemo(() => editingAssignment?.id || 'new-assignment', [editingAssignment]);
  const courseKey = useMemo(() => editingCourse?.id || 'new-course', [editingCourse]);
  const topicKey = useMemo(() => editingTopic?.id || 'new-topic', [editingTopic]);

  return (
    <div>
      <div className="mb-4">
        <h1 className="font-headline text-3xl font-bold">Teacher Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your classroom and content.
        </p>
      </div>

      <Tabs defaultValue="students" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="students">Student Progress</TabsTrigger>
          <TabsTrigger value="courses">Course Management</TabsTrigger>
          <TabsTrigger value="assignments">Daily Assignments</TabsTrigger>
        </TabsList>
        <TabsContent value="students">
          <Card>
            <CardHeader>
              <CardTitle>{classroom.name}</CardTitle>
              <CardDescription>
                Overview of your students' progress.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead className="text-center">Progress</TableHead>
                    <TableHead className="text-right">Last Active</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classroom.students.map((student) => (
                    <TableRow key={student.studentId}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage
                              src="https://placehold.co/100x100.png"
                              alt={student.studentName}
                              data-ai-hint="person"
                            />
                            <AvatarFallback>
                              {student.studentName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="font-medium">
                            {student.studentName}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <Progress value={student.progress} className="w-24" />
                          <span>{student.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline">{student.lastActive}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="courses">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Manage Courses</CardTitle>
                <CardDescription>
                    Create new courses and manage topics for existing ones.
                </CardDescription>
              </div>
               <Button onClick={handleCreateNewCourse}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New Course
              </Button>
            </CardHeader>
            <CardContent>
               <Accordion type="single" collapsible className="w-full">
                {courses.map((course) => (
                    <AccordionItem value={course.id} key={course.id}>
                        <Card className="mb-2 border-0 shadow-none">
                             <div className="flex items-center p-4">
                                <AccordionTrigger className="flex-1 hover:no-underline">
                                    <div className="flex items-center gap-4">
                                        <div className="rounded-full bg-primary/10 p-3">
                                            <course.Icon className="h-6 w-6 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-left">{course.title}</p>
                                            <p className="text-sm text-muted-foreground text-left">
                                                {course.description}
                                            </p>
                                        </div>
                                    </div>
                                </AccordionTrigger>
                                <div className="ml-4 flex shrink-0">
                                    <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={(e) => { e.stopPropagation(); handleEditCourse(course); }}
                                    >
                                    <Pencil className="h-4 w-4" />
                                    <span className="sr-only">Edit Course</span>
                                    </Button>
                                    <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-destructive hover:text-destructive"
                                    onClick={(e) => { e.stopPropagation(); handleDeleteCourse(course.id);}}
                                    >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Delete Course</span>
                                    </Button>
                                </div>
                             </div>
                        </Card>
                        <AccordionContent className="p-2 pl-8 pr-4">
                            <div className="border-l pl-6 space-y-4">
                                <div className="flex justify-between items-center">
                                    <h4 className="font-semibold">Topics</h4>
                                    <Button variant="outline" size="sm" onClick={() => handleCreateNewTopic(course.id)}>
                                        <PlusCircle className="mr-2 h-4 w-4" />
                                        Add New Topic
                                    </Button>
                                </div>
                                <div className="space-y-4">
                                {topics.filter(t => t.courseId === course.id).map(topic => (
                                    <Card key={topic.id} className="bg-muted/50">
                                        <CardHeader className="p-3 flex flex-row items-center justify-between">
                                             <div className="flex items-center gap-3">
                                               <BookCopy className="h-5 w-5 text-muted-foreground" />
                                               <p className="font-semibold">{topic.title}</p>
                                            </div>
                                             <div className="flex shrink-0">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleEditTopic(topic)}
                                                    >
                                                    <Pencil className="h-4 w-4" />
                                                    <span className="sr-only">Edit Topic</span>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-destructive hover:text-destructive"
                                                    onClick={() => handleDeleteTopic(topic.id)}
                                                    >
                                                    <Trash2 className="h-4 w-4" />
                                                    <span className="sr-only">Delete Topic</span>
                                                </Button>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-3 pt-0 space-y-2">
                                            <h5 className="text-sm font-medium text-muted-foreground">Lessons</h5>
                                            {lessons.filter(l => l.topicId === topic.id).map(lesson => (
                                                <div key={lesson.id} className="flex items-center justify-between p-2 rounded-md bg-background/70">
                                                   <div className="flex items-center gap-2">
                                                        <BookMarked className="h-4 w-4 text-muted-foreground" />
                                                        <span className="font-medium">{lesson.title}</span>
                                                        <Badge variant="secondary">{lesson.xp} XP</Badge>
                                                   </div>
                                                   <div className="flex shrink-0">
                                                        <Button variant="ghost" size="icon" asChild>
                                                            <Link href={`/dashboard/teacher/lessons/${lesson.id}`}>
                                                                <FilePenLine className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDeleteLesson(lesson.id)}><Trash2 className="h-4 w-4" /></Button>
                                                   </div>
                                                </div>
                                            ))}
                                            {lessons.filter(l => l.topicId === topic.id).length === 0 && (
                                                <p className="text-xs text-muted-foreground text-center py-2">No lessons in this topic yet.</p>
                                            )}
                                        </CardContent>
                                        <CardFooter className="p-3 pt-0">
                                            <Button variant="outline" size="sm" className="w-full" onClick={() => handleCreateNewLesson(topic.id)}>
                                                <PlusCircle className="mr-2 h-4 w-4" />
                                                Add New Lesson
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                ))}
                                {topics.filter(t => t.courseId === course.id).length === 0 && (
                                    <p className="text-sm text-muted-foreground text-center py-4">No topics yet. Add one to get started!</p>
                                )}
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="assignments">
          <Card>
            <CardHeader>
              <CardTitle>Daily Assignments</CardTitle>
              <CardDescription>
                Create and manage daily assignments for your students.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleCreateNewAssignment}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New Assignment
              </Button>
              <div className="mt-6 space-y-4">
                {assignments.length > 0 ? (
                  assignments.map((assignment) => (
                    <Card
                      key={assignment.id}
                      className="transition-all hover:shadow-md"
                    >
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>{assignment.title}</span>
                          <div className="flex shrink-0">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditAssignment(assignment)}
                            >
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Edit Assignment</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                              onClick={() =>
                                handleDeleteAssignment(assignment.id)
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete Assignment</span>
                            </Button>
                          </div>
                        </CardTitle>
                        <CardDescription>
                          Due: {format(new Date(assignment.dueDate), "PPP")}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          {assignment.problem}
                        </p>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20 p-12 text-center">
                    <h3 className="text-lg font-semibold text-muted-foreground">
                      No assignments yet
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Create your first assignment to get started.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Course Dialog */}
      <Dialog open={isCourseDialogOpen} onOpenChange={setIsCourseDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingCourse ? "Edit Course" : "Create New Course"}
            </DialogTitle>
            <DialogDescription>
              {editingCourse
                ? "Update the details for your course."
                : "Fill in the details for your new course."}
            </DialogDescription>
          </DialogHeader>
          <form key={courseKey} action={courseFormAction} className="space-y-4">
            {!courseFormState.success && courseFormState.message && !courseFormState.errors && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{courseFormState.message}</AlertDescription>
                </Alert>
              )}
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                defaultValue={editingCourse?.title}
                placeholder="e.g., Introduction to Physics"
              />
               {courseFormState.errors?.title && <p className="text-sm text-destructive mt-1">{courseFormState.errors.title[0]}</p>}
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={editingCourse?.description}
                placeholder="A brief summary of the course."
              />
              {courseFormState.errors?.description && <p className="text-sm text-destructive mt-1">{courseFormState.errors.description[0]}</p>}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
              <SubmitButton>{editingCourse ? "Save Changes" : "Create Course"}</SubmitButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Topic Dialog */}
      <Dialog open={isTopicDialogOpen} onOpenChange={setIsTopicDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingTopic ? "Edit Topic" : "Create New Topic"}
            </DialogTitle>
            <DialogDescription>
              {editingTopic
                ? "Update the topic title."
                : "Enter the title for the new topic."}
            </DialogDescription>
          </DialogHeader>
          <form key={topicKey} action={topicFormAction} className="space-y-4">
             {!topicFormState.success && topicFormState.message && !topicFormState.errors &&(
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{topicFormState.message}</AlertDescription>
                </Alert>
              )}
            <div>
              <Label htmlFor="topic-title">Title</Label>
              <Input
                id="topic-title"
                name="title"
                defaultValue={editingTopic?.title}
                placeholder="e.g., Kinematics"
              />
              {topicFormState.errors?.title && <p className="text-sm text-destructive mt-1">{topicFormState.errors.title[0]}</p>}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
              <SubmitButton>{editingTopic ? "Save Changes" : "Create Topic"}</SubmitButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Lesson Dialog */}
      <Dialog open={isLessonDialogOpen} onOpenChange={setIsLessonDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Lesson</DialogTitle>
            <DialogDescription>
             Fill in the details for your new lesson. You can add content after creation.
            </DialogDescription>
          </DialogHeader>
          <form action={lessonFormAction} className="space-y-4">
            {!lessonFormState.success && lessonFormState.message && !lessonFormState.errors &&(
                  <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{lessonFormState.message}</AlertDescription>
                  </Alert>
              )}
            <div>
              <Label htmlFor="lesson-title">Title</Label>
              <Input
                id="lesson-title"
                name="title"
                placeholder="e.g., Introduction to Variables"
              />
               {lessonFormState.errors?.title && <p className="text-sm text-destructive mt-1">{lessonFormState.errors.title[0]}</p>}
            </div>
            <div>
              <Label htmlFor="lesson-xp">XP Value</Label>
              <Input
                id="lesson-xp"
                name="xp"
                type="number"
                defaultValue={100}
              />
              {lessonFormState.errors?.xp && <p className="text-sm text-destructive mt-1">{lessonFormState.errors.xp[0]}</p>}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
              <SubmitButton>Create & Edit Lesson</SubmitButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Assignment Dialog */}
      <Dialog
        open={isAssignmentDialogOpen}
        onOpenChange={setIsAssignmentDialogOpen}
      >
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>
              {editingAssignment ? "Edit Assignment" : "Create New Assignment"}
            </DialogTitle>
            <DialogDescription>
              {editingAssignment
                ? "Update the details for this assignment."
                : "Fill in the details for your new assignment."}
            </DialogDescription>
          </DialogHeader>
          <form key={assignmentKey} action={assignmentFormAction} className="space-y-4">
            {!assignmentFormState.success && assignmentFormState.message && !assignmentFormState.errors && (
                  <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{assignmentFormState.message}</AlertDescription>
                  </Alert>
              )}
            <div>
              <Label htmlFor="assignment-title">Title</Label>
              <Input
                id="assignment-title"
                name="title"
                defaultValue={editingAssignment?.title}
                placeholder="e.g., Solving Equations"
              />
               {assignmentFormState.errors?.title && <p className="text-sm text-destructive mt-1">{assignmentFormState.errors.title[0]}</p>}
            </div>
            <div>
              <Label htmlFor="assignment-problem">Problem</Label>
              <Textarea
                id="assignment-problem"
                name="problem"
                defaultValue={editingAssignment?.problem}
                placeholder="Describe the assignment problem..."
              />
              {assignmentFormState.errors?.problem && <p className="text-sm text-destructive mt-1">{assignmentFormState.errors.problem[0]}</p>}
            </div>
            <div>
                <Label htmlFor="assignment-course">Course</Label>
                <Select name="courseId" defaultValue={editingAssignment?.courseId}>
                  <SelectTrigger id="assignment-course">
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map(course => (
                      <SelectItem key={course.id} value={course.id}>{course.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                 {assignmentFormState.errors?.courseId && <p className="text-sm text-destructive mt-1">{assignmentFormState.errors.courseId[0]}</p>}
            </div>
            <div>
              <Label htmlFor="assignment-due-date">Due Date</Label>
              <Input 
                type="date"
                name="dueDate"
                id="assignment-due-date"
                defaultValue={editingAssignment?.dueDate ? format(new Date(editingAssignment.dueDate), 'yyyy-MM-dd') : ''}
                className="w-full"
              />
               {assignmentFormState.errors?.dueDate && <p className="text-sm text-destructive mt-1">{assignmentFormState.errors.dueDate[0]}</p>}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
              <SubmitButton>{editingAssignment ? "Save Changes" : "Create Assignment"}</SubmitButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
