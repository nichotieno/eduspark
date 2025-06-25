
import { getDb } from "@/lib/db";
import { getSession } from "@/lib/session";
import { notFound, redirect } from "next/navigation";
import { StudentAssignmentsClient } from "./client";
import type { StudentAssignment } from "@/lib/mock-data";


export default async function StudentAssignmentsPage() {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }

  const db = await getDb();
  
  // Fetch all assignments and join with submissions to get status
  const assignmentsData = await db.all<any[]>(`
    SELECT
        a.id,
        a.title,
        a.dueDate,
        c.title as courseTitle,
        s.id as submissionId,
        s.grade
    FROM assignments a
    JOIN courses c ON a.courseId = c.id
    LEFT JOIN submissions s ON a.id = s.assignmentId AND s.userId = ?
    ORDER BY a.dueDate DESC
  `, session.id);

  if (!assignmentsData) {
    notFound();
  }

  const allAssignments: StudentAssignment[] = assignmentsData.map(a => {
    let status: 'To Do' | 'Submitted' | 'Graded' = 'To Do';
    if (a.submissionId) {
        status = a.grade !== null ? 'Graded' : 'Submitted';
    } else if (new Date(a.dueDate) < new Date()) {
        // You could add a 'Past Due' status here if desired
    }
    
    return {
        id: a.id,
        title: a.title,
        courseTitle: a.courseTitle,
        dueDate: new Date(a.dueDate),
        status: status,
        grade: a.grade
    }
  });

  const toDo = allAssignments.filter(a => a.status === 'To Do' && a.dueDate >= new Date());
  const submitted = allAssignments.filter(a => a.status === 'Submitted');
  const graded = allAssignments.filter(a => a.status === 'Graded');

  return (
    <StudentAssignmentsClient 
        toDoAssignments={toDo}
        submittedAssignments={submitted}
        gradedAssignments={graded}
    />
  );
}
