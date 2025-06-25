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
      {
        id: "q3",
        text: "Which of the following is a 'variable'?",
        type: 'multiple-choice',
        options: ["x", "5", "=", "+"],
        correctAnswer: "x",
        hint: "A variable is a symbol that represents a quantity that can change.",
        image: "https://placehold.co/600x400.png",
        "data-ai-hint": "algebra variable"
      },
      {
        id: "q4",
        text: "What are 'like terms' in the expression: 5y + 2x - 3y?",
        type: 'multiple-choice',
        options: ["5y and 2x", "2x and -3y", "5y and -3y", "5y, 2x, and -3y"],
        correctAnswer: "5y and -3y",
        hint: "Like terms are terms that have the same variables raised to the same power.",
        image: "https://placehold.co/600x400.png",
        "data-ai-hint": "algebra terms"
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
        {
            id: "q2",
            text: "What is the perimeter of a square with a side length of 7 units?",
            type: "multiple-choice",
            options: ["14 units", "28 units", "49 units", "21 units"],
            correctAnswer: "28 units",
            hint: "The perimeter is the total distance around the outside of a shape. A square has four equal sides.",
            image: "https://placehold.co/600x400.png",
            "data-ai-hint": "geometry square"
        },
        {
            id: "q3",
            text: "An angle that measures less than 90 degrees is called...",
            type: "multiple-choice",
            options: ["An obtuse angle", "A right angle", "A straight angle", "An acute angle"],
            correctAnswer: "An acute angle",
            hint: "Think 'acute little angle' for small angles.",
            image: "https://placehold.co/600x400.png",
            "data-ai-hint": "geometry angle"
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
      {
        id: "q2",
        text: "What is the largest planet in our solar system?",
        type: 'multiple-choice',
        options: ["Earth", "Saturn", "Jupiter", "Neptune"],
        correctAnswer: "Jupiter",
        hint: "This gas giant is so big that all other planets in the solar system could fit inside it.",
        image: "https://placehold.co/600x400.png",
        "data-ai-hint": "planet jupiter"
      },
      {
        id: "q3",
        text: "Which planet is famous for its prominent rings?",
        type: 'multiple-choice',
        options: ["Uranus", "Mars", "Venus", "Saturn"],
        correctAnswer: "Saturn",
        hint: "These rings are made of chunks of ice and rock.",
        image: "https://placehold.co/600x400.png",
        "data-ai-hint": "planet saturn"
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
      {
        id: "q2",
        text: "Which part of the cell contains its genetic material (DNA)?",
        type: 'multiple-choice',
        options: ["Cytoplasm", "Nucleus", "Vacuole", "Cell Membrane"],
        correctAnswer: "Nucleus",
        hint: "It's often called the 'control center' of the cell.",
        image: "https://placehold.co/600x400.png",
        "data-ai-hint": "cell nucleus"
      },
      {
        id: "q3",
        text: "What is the main function of the cell wall in plant cells?",
        type: 'multiple-choice',
        options: ["To produce energy", "To provide structural support and protection", "To control what enters and leaves the cell", "To store water"],
        correctAnswer: "To provide structural support and protection",
        hint: "This rigid outer layer is not found in animal cells.",
        image: "https://placehold.co/600x400.png",
        "data-ai-hint": "plant cell"
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
