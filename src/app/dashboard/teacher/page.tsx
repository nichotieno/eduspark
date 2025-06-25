
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
  type Course,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Pencil, Trash2, BookOpen } from "lucide-react";

export default function TeacherDashboard() {
  const classroom = mockTeacherData.classrooms[0];
  const { toast } = useToast();

  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDescription, setCourseDescription] = useState("");

  const handleCreateNew = () => {
    setEditingCourse(null);
    setCourseTitle("");
    setCourseDescription("");
    setIsDialogOpen(true);
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setCourseTitle(course.title);
    setCourseDescription(course.description);
    setIsDialogOpen(true);
  };

  const handleDelete = (courseId: string) => {
    setCourses(courses.filter((c) => c.id !== courseId));
    toast({
      title: "Course Deleted",
      description: "The course has been successfully removed.",
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
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
      // Update existing course
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
      // Create new course
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
    setIsDialogOpen(false);
    setEditingCourse(null);
  };

  return (
    <div>
      <div className="mb-4">
        <h1 className="font-headline text-3xl font-bold">Teacher Dashboard</h1>
        <p className="text-muted-foreground">Manage your classroom and content.</p>
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
              <Button onClick={handleCreateNew}>
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
                          onClick={() => handleEdit(course)}
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(course.id)}
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
                    <CardDescription>Create and manage daily assignments for your students.</CardDescription>
                </CardHeader>
                <CardContent>
                   <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20 p-12 text-center">
                       <h3 className="text-lg font-semibold text-muted-foreground">Feature Coming Soon</h3>
                       <p className="mt-2 text-sm text-muted-foreground">This section will allow you to create and post daily problems for your class.</p>
                   </div>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
          <form onSubmit={handleFormSubmit}>
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
    </div>
  );
}
