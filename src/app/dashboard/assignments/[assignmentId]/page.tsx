
import { getDb } from "@/lib/db";
import { getSession } from "@/lib/session";
import { notFound, redirect } from "next/navigation";
import { type DailyAssignment } from "@/lib/mock-data";
import { AssignmentPageClient } from "./client";


export default async function AssignmentPage({ params }: { params: { assignmentId: string } }) {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }

  const db = await getDb();
  const assignmentId = params.assignmentId;
  
  const assignmentData = await db.get('SELECT * FROM assignments WHERE id = ?', assignmentId);

  if (!assignmentData) {
    notFound();
  }

  const assignment: DailyAssignment = {
    ...assignmentData,
    dueDate: new Date(assignmentData.dueDate),
  };
  
  const submission = await db.get<{ content: string, grade: number | null, feedback: string | null }>(
      'SELECT content, grade, feedback FROM submissions WHERE assignmentId = ? AND userId = ?',
      assignmentId,
      session.id
  );

  return (
    <AssignmentPageClient
        assignment={assignment}
        submission={submission}
    />
  );
}
