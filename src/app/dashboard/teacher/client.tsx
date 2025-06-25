
"use client";

import { useState } from "react";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  PlusCircle,
  Pencil,
  Trash2,
  CalendarIcon,
  BookCopy,
  BookMarked,
  FilePenLine,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Link from "next/link";


type TeacherDashboardClientProps = {
    initialCourses: Course[];
    initialTopics: Topic[];
    initialLessons: Lesson[];
    initialAssignments: DailyAssignment[];
};


export function TeacherDashboardClient({
  initialCourses,
  initialTopics,
  initialLessons,
  initialAssignments,
}: TeacherDashboardClientProps) {
  const classroom = mockTeacherData.classrooms[0];
  const { toast } = useToast();

  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [topics, setTopics] = useState<Topic[]>(initialTopics);
  const [lessons, setLessons] = useState<Lesson[]>(initialLessons);
  const [assignments, setAssignments] = useState<DailyAssignment[]>(initialAssignments);


  // Dialog states
  const [isCourseDialogOpen, setIsCourseDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDescription, setCourseDescription] = useState("");

  const [isTopicDialogOpen, setIsTopicDialogOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [topicTitle, setTopicTitle] = useState("");
  const [currentCourseIdForTopic, setCurrentCourseIdForTopic] = useState<string | null>(null);

  const [isLessonDialogOpen, setIsLessonDialogOpen] = useState(false);
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonXp, setLessonXp] = useState(100);
  const [currentTopicIdForLesson, setCurrentTopicIdForLesson] = useState<string | null>(null);

  const [isAssignmentDialogOpen, setIsAssignmentDialogOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<DailyAssignment | null>(null);
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [assignmentProblem, setAssignmentProblem] = useState("");
  const [assignmentDueDate, setAssignmentDueDate] = useState<Date | undefined>();

  // Course Handlers
  const handleCreateNewCourse = () => {
    setEditingCourse(null);
    setCourseTitle("");
    setCourseDescription("");
    setIsCourseDialogOpen(true);
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setCourseTitle(course.title);
    setCourseDescription(course.description);
    setIsCourseDialogOpen(true);
  };

  const handleDeleteCourse = (courseId: string) => {
     toast({
        variant: 'destructive',
        title: "Action Disabled",
        description: "Database modifications are not yet implemented.",
    });
  };

  const handleCourseFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
        variant: 'destructive',
        title: "Action Disabled",
        description: "Database modifications are not yet implemented.",
    });
  };

  // Topic Handlers
  const handleCreateNewTopic = (courseId: string) => {
    setEditingTopic(null);
    setTopicTitle("");
    setCurrentCourseIdForTopic(courseId);
    setIsTopicDialogOpen(true);
  };

  const handleEditTopic = (topic: Topic) => {
    setEditingTopic(topic);
    setTopicTitle(topic.title);
    setCurrentCourseIdForTopic(topic.courseId);
    setIsTopicDialogOpen(true);
  };

  const handleDeleteTopic = (topicId: string) => {
    toast({
        variant: 'destructive',
        title: "Action Disabled",
        description: "Database modifications are not yet implemented.",
    });
  };

  const handleTopicFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
        variant: 'destructive',
        title: "Action Disabled",
        description: "Database modifications are not yet implemented.",
    });
  };

  // Lesson Handlers
  const handleCreateNewLesson = (topicId: string) => {
    setLessonTitle("");
    setLessonXp(100);
    setCurrentTopicIdForLesson(topicId);
    setIsLessonDialogOpen(true);
  };

  const handleDeleteLesson = (lessonId: string) => {
    toast({
        variant: 'destructive',
        title: "Action Disabled",
        description: "Database modifications are not yet implemented.",
    });
  };

  const handleLessonFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
        variant: 'destructive',
        title: "Action Disabled",
        description: "Database modifications are not yet implemented.",
    });
  };

  // Assignment Handlers
  const handleCreateNewAssignment = () => {
    setEditingAssignment(null);
    setAssignmentTitle("");
    setAssignmentProblem("");
    setAssignmentDueDate(undefined);
    setIsAssignmentDialogOpen(true);
  };

  const handleEditAssignment = (assignment: DailyAssignment) => {
    setEditingAssignment(assignment);
    setAssignmentTitle(assignment.title);
    setAssignmentProblem(assignment.problem);
    setAssignmentDueDate(new Date(assignment.dueDate));
    setIsAssignmentDialogOpen(true);
  };

  const handleDeleteAssignment = (assignmentId: string) => {
    toast({
        variant: 'destructive',
        title: "Action Disabled",
        description: "Database modifications are not yet implemented.",
    });
  };

  const handleAssignmentFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
        variant: 'destructive',
        title: "Action Disabled",
        description: "Database modifications are not yet implemented.",
    });
  };

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
          <form onSubmit={handleCourseFormSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  id="title"
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  className="col-span-3"
                  placeholder="e.g., Introduction to Physics"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={courseDescription}
                  onChange={(e) => setCourseDescription(e.target.value)}
                  className="col-span-3"
                  placeholder="A brief summary of the course."
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">
                {editingCourse ? "Save Changes" : "Create Course"}
              </Button>
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
          <form onSubmit={handleTopicFormSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="topic-title" className="text-right">
                  Title
                </Label>
                <Input
                  id="topic-title"
                  value={topicTitle}
                  onChange={(e) => setTopicTitle(e.target.value)}
                  className="col-span-3"
                  placeholder="e.g., Kinematics"
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">
                {editingTopic ? "Save Changes" : "Create Topic"}
              </Button>
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
          <form onSubmit={handleLessonFormSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="lesson-title" className="text-right">
                  Title
                </Label>
                <Input
                  id="lesson-title"
                  value={lessonTitle}
                  onChange={(e) => setLessonTitle(e.target.value)}
                  className="col-span-3"
                  placeholder="e.g., Introduction to Variables"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="lesson-xp" className="text-right">
                  XP Value
                </Label>
                <Input
                  id="lesson-xp"
                  type="number"
                  value={lessonXp}
                  onChange={(e) => setLessonXp(parseInt(e.target.value, 10))}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">
                Create Lesson
              </Button>
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
          <form onSubmit={handleAssignmentFormSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="assignment-title" className="text-right">
                  Title
                </Label>
                <Input
                  id="assignment-title"
                  value={assignmentTitle}
                  onChange={(e) => setAssignmentTitle(e.target.value)}
                  className="col-span-3"
                  placeholder="e.g., Solving Equations"
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="assignment-problem" className="pt-2 text-right">
                  Problem
                </Label>
                <Textarea
                  id="assignment-problem"
                  value={assignmentProblem}
                  onChange={(e) => setAssignmentProblem(e.target.value)}
                  className="col-span-3"
                  placeholder="Describe the assignment problem..."
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="assignment-due-date" className="text-right">
                  Due Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "col-span-3 justify-start text-left font-normal",
                        !assignmentDueDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {assignmentDueDate ? (
                        format(assignmentDueDate, "PPP")
                      ) : (
                        <span>Pick a due date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={assignmentDueDate}
                      onSelect={setAssignmentDueDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">
                {editingAssignment ? "Save Changes" : "Create Assignment"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
