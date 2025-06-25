import { Book, Calculator, FlaskConical, Medal, Shield, Star } from "lucide-react";

export type User = {
  id: string;
  name: string;
  avatarUrl: string;
  stats: {
    xp: number;
    streak: number;
    badges: number;
  };
};

export type Badge = {
  id: string;
  name: string;
  description: string;
  Icon: React.ElementType;
};

export type Course = {
  id: string;
  title: string;
  description: string;
  Icon: React.ElementType;
};

export type Lesson = {
  id: string;
  courseId: string;
  title: string;
  xp: number;
  questions: Question[];
};

export type Question = {
  id: string;
  text: string;
  type: 'multiple-choice';
  options: string[];
  correctAnswer: string;
  hint: string;
  image?: string;
  "data-ai-hint"?: string;
};

export type StudentProgress = {
  studentId: string;
  studentName: string;
  courseId: string;
  progress: number;
  lastActive: string;
};

// Mock Data
export const mockUser: User = {
  id: "user_1",
  name: "Alex Doe",
  avatarUrl: "https://placehold.co/100x100.png",
  stats: {
    xp: 1250,
    streak: 14,
    badges: 3,
  },
};

export const mockBadges: Badge[] = [
  { id: 'b1', name: 'Math Beginner', description: 'Complete your first math lesson.', Icon: Star },
  { id: 'b2', name: 'Science Explorer', description: 'Complete your first science lesson.', Icon: Star },
  { id: 'b3', name: 'Course Champion', description: 'Complete an entire course.', Icon: Medal },
  { id: 'b4', name: 'Topic Master', description: 'Master a full topic.', Icon: Shield },
  { id: 'b5', name: 'Perfect Score', description: 'Get a perfect score on a lesson.', Icon: Book },
];

export const mockCourses: Course[] = [
  {
    id: "math",
    title: "Core Math",
    description: "Build your foundational math skills from the ground up.",
    Icon: Calculator,
  },
  {
    id: "science",
    title: "Core Science",
    description: "Explore the fundamental principles of the natural world.",
    Icon: FlaskConical,
  },
];

export const mockLessons: Lesson[] = [
  // Math Lessons
  {
    id: "m1",
    courseId: "math",
    title: "Introduction to Algebra",
    xp: 100,
    questions: [
      {
        id: "q1",
        text: "What is the value of 'x' in the equation: 2x + 3 = 11?",
        type: 'multiple-choice',
        options: ["3", "4", "5", "6"],
        correctAnswer: "4",
        hint: "Try subtracting 3 from both sides of the equation first.",
        image: "https://placehold.co/600x400.png",
        "data-ai-hint": "equation algebra"
      },
      {
        id: "q2",
        text: "Simplify the expression: 3(x + 4) - 2",
        type: 'multiple-choice',
        options: ["3x + 10", "3x + 12", "x + 10", "3x + 2"],
        correctAnswer: "3x + 10",
        hint: "Use the distributive property to multiply 3 by both x and 4.",
        image: "https://placehold.co/600x400.png",
        "data-ai-hint": "algebra expression"
      },
    ],
  },
  {
    id: "m2",
    courseId: "math",
    title: "Basics of Geometry",
    xp: 100,
    questions: [
        {
            id: "q1",
            text: "What is the area of a rectangle with a width of 5 units and a height of 8 units?",
            type: "multiple-choice",
            options: ["13 units²", "40 units²", "26 units²", "30 units²"],
            correctAnswer: "40 units²",
            hint: "The area of a rectangle is calculated by multiplying its width by its height.",
            image: "https://placehold.co/600x400.png",
            "data-ai-hint": "geometry rectangle"
        },
    ],
  },
  // Science Lessons
  {
    id: "s1",
    courseId: "science",
    title: "The Solar System",
    xp: 100,
    questions: [
      {
        id: "q1",
        text: "Which planet is known as the Red Planet?",
        type: 'multiple-choice',
        options: ["Earth", "Mars", "Jupiter", "Saturn"],
        correctAnswer: "Mars",
        hint: "This planet gets its color from iron oxide on its surface.",
        image: "https://placehold.co/600x400.png",
        "data-ai-hint": "planet mars"
      },
    ],
  },
  {
    id: "s2",
    courseId: "science",
    title: "Introduction to Cells",
    xp: 100,
    questions: [
      {
        id: "q1",
        text: "What is the powerhouse of the cell?",
        type: 'multiple-choice',
        options: ["Nucleus", "Ribosome", "Mitochondria", "Cell Wall"],
        correctAnswer: "Mitochondria",
        hint: "This organelle is responsible for generating most of the cell's supply of adenosine triphosphate (ATP).",
        image: "https://placehold.co/600x400.png",
        "data-ai-hint": "cell biology"
      },
    ],
  },
];


export const mockTeacherData = {
    classrooms: [
        {
            id: 'c1',
            name: 'Period 3 - Algebra',
            students: [
                { studentId: 'stu_1', studentName: 'Alice Johnson', progress: 85, lastActive: '2h ago' },
                { studentId: 'stu_2', studentName: 'Bob Williams', progress: 42, lastActive: '1d ago' },
                { studentId: 'stu_3', studentName: 'Charlie Brown', progress: 100, lastActive: '5m ago' },
                { studentId: 'stu_4', studentName: 'Diana Miller', progress: 20, lastActive: '3d ago' },
            ]
        }
    ]
}
