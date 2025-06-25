
import { getDb } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import type { DailyAssignment, AssignmentSubmission } from "@/lib/mock-data";
import { TeacherAssignmentSubmissionsClient } from "./client";

async function getAssignmentData(assignmentId: string) {
  const db = await getDb();
  const assignmentData = await db.get(
    'SELECT * FROM assignments WHERE id = ?', assignmentId
  );

  if (!assignmentData) {
    return null;
  }
    
  const assignment = {
      ...assignmentData,
      dueDate: new Date(assignmentData.dueDate)
  }

  const submissions = await db.all<AssignmentSubmission[]>(`
    SELECT
      s.id,
      s.assignmentId,
      s.content,
      s.submittedAt,
      s.grade,
      s.feedback,
      u.name as studentName,
      u.avatarUrl as studentAvatarUrl
    FROM submissions s
    JOIN users u ON s.userId = u.id
    WHERE s.assignmentId = ?
    ORDER BY s.submittedAt DESC
  `, assignmentId);

  return { assignment, submissions };
}

export default async function TeacherAssignmentSubmissionsPage({ params }: { params: { assignmentId: string }}) {
  const session = await getSession();
  if (!session || session.role !== 'teacher') {
    redirect('/login');
  }

  const data = await getAssignmentData(params.assignmentId);

  if (!data) {
    notFound();
  }

  return (
    <TeacherAssignmentSubmissionsClient
      assignment={data.assignment}
      submissions={data.submissions}
    />
  );
}
