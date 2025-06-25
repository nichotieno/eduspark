
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
    let status: StudentAssignment['status'] = 'To Do';
    const isPastDue = new Date(a.dueDate) < new Date();

    if (a.submissionId) {
        status = a.grade !== null ? 'Graded' : 'Submitted';
    } else if (isPastDue) {
        status = 'Past Due';
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

  const toDo = allAssignments.filter(a => a.status === 'To Do');
  const submitted = allAssignments.filter(a => a.status === 'Submitted');
  const graded = allAssignments.filter(a => a.status === 'Graded');
  const pastDue = allAssignments.filter(a => a.status === 'Past Due');

  return (
    <StudentAssignmentsClient 
        toDoAssignments={toDo}
        submittedAssignments={submitted}
        gradedAssignments={graded}
        pastDueAssignments={pastDue}
    />
  );
}
