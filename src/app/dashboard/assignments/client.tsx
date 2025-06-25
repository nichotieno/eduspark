
"use client";

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { format, formatDistanceToNow } from 'date-fns';
import type { StudentAssignment } from "@/lib/mock-data";
import { cn } from '@/lib/utils';

type PageProps = {
  toDoAssignments: StudentAssignment[];
  submittedAssignments: StudentAssignment[];
  gradedAssignments: StudentAssignment[];
};

function AssignmentCard({ assignment }: { assignment: StudentAssignment }) {
    const isPastDue = assignment.dueDate < new Date() && assignment.status === 'To Do';
    return (
        <Link href={`/dashboard/assignments/${assignment.id}`}>
            <Card className="transition-all hover:shadow-md hover:border-primary/30">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-lg">{assignment.title}</CardTitle>
                            <CardDescription>{assignment.courseTitle}</CardDescription>
                        </div>
                        {assignment.status === 'Graded' && assignment.grade !== null ? (
                            <Badge className={cn(
                                assignment.grade >= 80 ? 'bg-green-600' :
                                assignment.grade >= 60 ? 'bg-yellow-500' :
                                'bg-red-500',
                                'text-white'
                            )}>
                                Grade: {assignment.grade}/100
                            </Badge>
                        ) : (
                             <Badge variant={isPastDue ? "destructive" : "secondary"}>
                                {isPastDue ? "Past Due" : assignment.status}
                            </Badge>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Due: {format(assignment.dueDate, 'PPP')} ({formatDistanceToNow(assignment.dueDate, { addSuffix: true })})
                    </p>
                </CardContent>
            </Card>
        </Link>
    )
}

function AssignmentList({ assignments, emptyMessage }: { assignments: StudentAssignment[], emptyMessage: string }) {
    if (assignments.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20 p-12 text-center h-64">
                <h3 className="text-lg font-semibold text-muted-foreground">
                  {emptyMessage}
                </h3>
              </div>
        )
    }
    return (
        <div className="space-y-4">
            {assignments.map(assignment => (
                <AssignmentCard key={assignment.id} assignment={assignment} />
            ))}
        </div>
    )
}


export function StudentAssignmentsClient({
  toDoAssignments,
  submittedAssignments,
  gradedAssignments,
}: PageProps) {
  return (
    <div className="container mx-auto py-8">
      <h1 className="font-headline text-3xl font-bold mb-8">My Assignments</h1>
      
      <Tabs defaultValue="todo" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="todo">To Do</TabsTrigger>
          <TabsTrigger value="submitted">Submitted</TabsTrigger>
          <TabsTrigger value="graded">Graded</TabsTrigger>
        </TabsList>
        <TabsContent value="todo">
            <AssignmentList assignments={toDoAssignments} emptyMessage="No assignments to do. Great job!" />
        </TabsContent>
        <TabsContent value="submitted">
             <AssignmentList assignments={submittedAssignments} emptyMessage="No assignments awaiting grades." />
        </TabsContent>
        <TabsContent value="graded">
             <AssignmentList assignments={gradedAssignments} emptyMessage="No graded assignments to show yet." />
        </TabsContent>
      </Tabs>
    </div>
  );
}
