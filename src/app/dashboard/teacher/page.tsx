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
import { mockTeacherData } from "@/lib/mock-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function TeacherDashboard() {
  const classroom = mockTeacherData.classrooms[0];

  return (
    <div>
      <h1 className="mb-4 font-headline text-3xl font-bold">
        Teacher Dashboard
      </h1>
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
                          src={`https://placehold.co/100x100.png?text=${student.studentName[0]}`}
                          alt={student.studentName}
                        />
                        <AvatarFallback>{student.studentName.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                      </Avatar>
                      <div className="font-medium">{student.studentName}</div>
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
    </div>
  );
}
