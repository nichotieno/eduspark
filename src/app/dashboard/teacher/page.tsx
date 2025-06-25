
"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
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
  mockCourses as initialCourses,
  mockDailyAssignments,
  type Course,
  type DailyAssignment,
} from "@/lib/mock-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  BookOpen,
  CalendarIcon,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function TeacherDashboard() {
  const classroom = mockTeacherData.classrooms[0];
  const { toast } = useToast();

  // Course State
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [isCourseDialogOpen, setIsCourseDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDescription, setCourseDescription] = useState("");

  // Assignment State
  const [assignments, setAssignments] =
    useState<DailyAssignment[]>(mockDailyAssignments);
  const [isAssignmentDialogOpen, setIsAssignmentDialogOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] =
    useState<DailyAssignment | null>(null);
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
    setCourses(courses.filter((c) => c.id !== courseId));
    toast({
      title: "Course Deleted",
      description: "The course has been successfully removed.",
    });
  };

  const handleCourseFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseTitle.trim() || !courseDescription.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill out all fields.",
      });
      return;
    }

    if (editingCourse) {
      setCourses(
        courses.map((c) =>
          c.id === editingCourse.id
            ? { ...c, title: courseTitle, description: courseDescription }
            : c
        )
      );
      toast({
        title: "Course Updated",
        description: "Your course has been successfully updated.",
      });
    } else {
      const newCourse: Course = {
        id: `course_${Date.now()}`,
        title: courseTitle,
        description: courseDescription,
        Icon: BookOpen,
      };
      setCourses([newCourse, ...courses]);
      toast({
        title: "Course Created",
        description: "Your new course is ready.",
      });
    }
    setIsCourseDialogOpen(false);
    setEditingCourse(null);
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
    setAssignmentDueDate(assignment.dueDate);
    setIsAssignmentDialogOpen(true);
  };

  const handleDeleteAssignment = (assignmentId: string) => {
    setAssignments(assignments.filter((a) => a.id !== assignmentId));
    toast({
      title: "Assignment Deleted",
      description: "The assignment has been successfully removed.",
    });
  };

  const handleAssignmentFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !assignmentTitle.trim() ||
      !assignmentProblem.trim() ||
      !assignmentDueDate
    ) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill out all fields, including the due date.",
      });
      return;
    }

    if (editingAssignment) {
      setAssignments(
        assignments.map((a) =>
          a.id === editingAssignment.id
            ? {
                ...a,
                title: assignmentTitle,
                problem: assignmentProblem,
                dueDate: assignmentDueDate,
              }
            : a
        )
      );
      toast({
        title: "Assignment Updated",
        description: "The assignment has been successfully updated.",
      });
    } else {
      const newAssignment: DailyAssignment = {
        id: `assignment_${Date.now()}`,
        title: assignmentTitle,
        problem: assignmentProblem,
        courseId: classroom.id, // Or make this selectable
        dueDate: assignmentDueDate,
      };
      setAssignments([newAssignment, ...assignments]);
      toast({
        title: "Assignment Created",
        description: "Your new assignment is ready for students.",
      });
    }
    setIsAssignmentDialogOpen(false);
    setEditingAssignment(null);
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
            <CardHeader>
              <CardTitle>Manage Courses</CardTitle>
              <CardDescription>
                Here you can create, edit, and delete your courses.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleCreateNewCourse}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New Course
              </Button>
              <div className="mt-6 space-y-4">
                {courses.map((course) => (
                  <Card
                    key={course.id}
                    className="transition-all hover:shadow-md"
                  >
                    <CardContent className="flex items-start justify-between p-4 md:items-center">
                      <div className="flex flex-col gap-4 md:flex-row md:items-center">
                        <div className="rounded-full bg-primary/10 p-3">
                          <course.Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">{course.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {course.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditCourse(course)}
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteCourse(course.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
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
                          Due: {format(assignment.dueDate, "PPP")}
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
