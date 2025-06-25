import { Book, Calculator, FlaskConical, Medal, Shield, Star, Trophy } from "lucide-react";

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

export type LessonStep = {
  id: string;
  title: string;
  content: string;
  image?: string;
  "data-ai-hint"?: string;
};

export type Lesson = {
  id: string;
  courseId: string;
  topic: string;
  title: string;
  xp: number;
  steps: LessonStep[];
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

export type DailyChallenge = {
  id: string;
  date: string; // e.g., '2024-07-29'
  title: string;
  problem: string;
  topic: 'Math' | 'Science' | 'CS';
};

export type ChallengeComment = {
  id: string;
  challengeId: string;
  userName: string;
  userAvatarUrl: string;
  comment: string;
  timestamp: string;
};

export type DailyAssignment = {
  id: string;
  title: string;
  problem: string;
  courseId: string;
  dueDate: Date;
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
  { id: 'b6', name: 'Challenge Solver', description: 'Solve your first daily challenge.', Icon: Trophy },
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
    topic: "Algebra Foundations",
    title: "Introduction to Algebra",
    xp: 100,
    steps: [
        {
            id: 's1',
            title: 'What is Algebra?',
            content: "Algebra is a branch of mathematics that uses letters and symbols to represent numbers and quantities in formulas and equations. It's like a puzzle where you find the missing piece.",
            image: 'https://placehold.co/600x400.png',
            'data-ai-hint': 'abstract math'
        },
        {
            id: 's2',
            title: 'Understanding Variables',
            content: "A variable, like 'x' or 'y', is a symbol that stands for a number we don't know yet. The goal is often to figure out the value of that variable.",
            image: 'https://placehold.co/600x400.png',
            'data-ai-hint': 'letter x'
        },
        {
            id: 's3',
            title: 'The Golden Rule of Equations',
            content: "An equation is a statement that two things are equal. The most important rule is: whatever you do to one side of the equation, you must do to the other side. This keeps the equation balanced.",
            image: 'https://placehold.co/600x400.png',
            'data-ai-hint': 'balanced scale'
        },
    ],
    questions: [
      {
        id: "q1",
        text: "What is the value of 'x' in the equation: 2x + 3 = 11?",
        type: 'multiple-choice',
        options: ["3", "4", "5", "6"],
        correctAnswer: "4",
        hint: "To find 'x', first subtract 3 from both sides of the equation to isolate the term with 'x'.",
      },
      {
        id: "q2",
        text: "Simplify the expression: 3(x + 4) - 2",
        type: 'multiple-choice',
        options: ["3x + 10", "3x + 12", "x + 10", "3x + 2"],
        correctAnswer: "3x + 10",
        hint: "Use the distributive property to multiply 3 by both x and 4.",
      },
      {
        id: "m1q3",
        text: "If y = 2, what is the value of the expression 5y - 3?",
        type: 'multiple-choice',
        options: ["7", "10", "13", "2"],
        correctAnswer: "7",
        hint: "Substitute the value of y into the expression and perform the calculation.",
      }
    ],
  },
  {
    id: "m2",
    courseId: "math",
    topic: "Geometric Principles",
    title: "Basics of Geometry",
    xp: 100,
    steps: [
        {
            id: 's1',
            title: 'What is Geometry?',
            content: "Geometry is the branch of mathematics concerned with properties of space such as the distance, shape, size, and relative position of figures. It's all about shapes and their properties!",
            image: 'https://placehold.co/600x400.png',
            'data-ai-hint': 'geometric shapes'
        },
        {
            id: 's2',
            title: 'Area vs. Perimeter',
            content: "Perimeter is the distance around a two-dimensional shape. Area is the amount of space inside a two-dimensional shape. For a rectangle, Perimeter = 2(width + height) and Area = width × height.",
            image: 'https://placehold.co/600x400.png',
            'data-ai-hint': 'rectangle diagram'
        },
        {
            id: 's3',
            title: 'Understanding Angles',
            content: "An angle is the figure formed by two rays sharing a common endpoint. Angles are measured in degrees. An acute angle is < 90°, a right angle is exactly 90°, and an obtuse angle is > 90°.",
            image: 'https://placehold.co/600x400.png',
            'data-ai-hint': 'angles geometry'
        },
    ],
    questions: [
        {
            id: "q1",
            text: "What is the area of a rectangle with a width of 5 units and a height of 8 units?",
            type: "multiple-choice",
            options: ["13 units²", "40 units²", "26 units²", "30 units²"],
            correctAnswer: "40 units²",
            hint: "The area of a rectangle is calculated by multiplying its width by its height.",
        },
        {
            id: "q2",
            text: "What is the perimeter of a square with a side length of 7 units?",
            type: "multiple-choice",
            options: ["14 units", "28 units", "49 units", "21 units"],
            correctAnswer: "28 units",
            hint: "The perimeter is the total distance around the outside of a shape. A square has four equal sides.",
        },
        {
            id: "q3",
            text: "An angle that measures less than 90 degrees is called...",
            type: "multiple-choice",
            options: ["An obtuse angle", "A right angle", "A straight angle", "An acute angle"],
            correctAnswer: "An acute angle",
            hint: "Think 'a-cute little angle' for small angles.",
        },
        {
            id: "m2q4",
            text: "The three angles of a triangle always add up to how many degrees?",
            type: 'multiple-choice',
            options: ["90°", "180°", "270°", "360°"],
            correctAnswer: "180°",
            hint: "This is a fundamental theorem in Euclidean geometry.",
          }
    ],
  },
  // Science Lessons
  {
    id: "s1",
    courseId: "science",
    topic: "Our Cosmic Neighborhood",
    title: "The Solar System",
    xp: 100,
    steps: [
        {
            id: 's1',
            title: 'Our Star: The Sun',
            content: "The Sun is the star at the center of our Solar System. It is a nearly perfect sphere of hot plasma, with its gravity holding the solar system together, from the largest planets to the smallest debris.",
            image: 'https://placehold.co/600x400.png',
            'data-ai-hint': 'sun space'
        },
        {
            id: 's2',
            title: 'The Rocky Planets',
            content: "The inner planets—Mercury, Venus, Earth, and Mars—are called terrestrial or rocky planets because they have solid, rocky surfaces. Earth is unique for having liquid water and supporting life.",
            image: 'https://placehold.co/600x400.png',
            'data-ai-hint': 'earth from space'
        },
        {
            id: 's3',
            title: 'The Gas Giants',
            content: "The outer planets—Jupiter, Saturn, Uranus, and Neptune—are known as gas giants. They are much larger than the inner planets and are composed mostly of gases like hydrogen, helium, and methane.",
            image: 'https://placehold.co/600x400.png',
            'data-ai-hint': 'jupiter planet'
        },
    ],
    questions: [
      {
        id: "q1",
        text: "Which planet is known as the Red Planet?",
        type: 'multiple-choice',
        options: ["Earth", "Mars", "Jupiter", "Saturn"],
        correctAnswer: "Mars",
        hint: "This planet gets its color from iron oxide on its surface.",
      },
      {
        id: "q2",
        text: "What is the largest planet in our solar system?",
        type: 'multiple-choice',
        options: ["Earth", "Saturn", "Jupiter", "Neptune"],
        correctAnswer: "Jupiter",
        hint: "This gas giant is so big that all other planets in the solar system could fit inside it.",
      },
      {
        id: "q3",
        text: "Which planet is famous for its prominent rings?",
        type: 'multiple-choice',
        options: ["Uranus", "Mars", "Venus", "Saturn"],
        correctAnswer: "Saturn",
        hint: "These rings are made of chunks of ice and rock.",
      },
      {
        id: "s1q4",
        text: "What force holds the planets in orbit around the Sun?",
        type: 'multiple-choice',
        options: ["Magnetism", "Gravity", "Friction", "Nuclear Force"],
        correctAnswer: "Gravity",
        hint: "This fundamental force of nature attracts any two objects with mass.",
      }
    ],
  },
  {
    id: "s2",
    courseId: "science",
    topic: "The Cellular World",
    title: "Introduction to Cells",
    xp: 100,
    steps: [
        {
            id: 's1',
            title: 'The Building Blocks of Life',
            content: "Cells are the basic structural, functional, and biological units of all known living organisms. They are the smallest units of life. Everything from bacteria to humans is made of cells.",
            image: 'https://placehold.co/600x400.png',
            'data-ai-hint': 'biology cells'
        },
        {
            id: 's2',
            title: 'Key Organelles: The Nucleus',
            content: "The nucleus is like the cell's brain. It contains the cell's genetic material, DNA, which holds the instructions for how the cell should grow, function, and reproduce.",
            image: 'https://placehold.co/600x400.png',
            'data-ai-hint': 'cell nucleus'
        },
        {
            id: 's3',
            title: 'Key Organelles: The Mitochondria',
            content: "Mitochondria are known as the 'powerhouses' of the cell. They take in nutrients from the cell, break them down, and turn them into energy. This energy is then used by the cell to carry out various functions.",
            image: 'https://placehold.co/600x400.png',
            'data-ai-hint': 'mitochondria illustration'
        },
    ],
    questions: [
      {
        id: "q1",
        text: "What is the powerhouse of the cell?",
        type: 'multiple-choice',
        options: ["Nucleus", "Ribosome", "Mitochondria", "Cell Wall"],
        correctAnswer: "Mitochondria",
        hint: "This organelle is responsible for generating most of the cell's supply of adenosine triphosphate (ATP).",
      },
      {
        id: "q2",
        text: "Which part of the cell contains its genetic material (DNA)?",
        type: 'multiple-choice',
        options: ["Cytoplasm", "Nucleus", "Vacuole", "Cell Membrane"],
        correctAnswer: "Nucleus",
        hint: "It's often called the 'control center' of the cell.",
      },
      {
        id: "q3",
        text: "What is the main function of the cell wall in plant cells?",
        type: 'multiple-choice',
        options: ["To produce energy", "To provide structural support and protection", "To control what enters and leaves the cell", "To store water"],
        correctAnswer: "To provide structural support and protection",
        hint: "This rigid outer layer is not found in animal cells.",
      },
      {
        id: "s2q4",
        text: "Which of these is NOT found in an animal cell?",
        type: 'multiple-choice',
        options: ["Cell Membrane", "Mitochondria", "Nucleus", "Cell Wall"],
        correctAnswer: "Cell Wall",
        hint: "This rigid outer layer provides structural support to plant cells, fungi, and bacteria.",
      }
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
};

export const mockDailyChallenge: DailyChallenge = {
    id: 'dc1',
    date: '2024-07-29',
    title: "The Traveling Salesperson's Lunch",
    problem: 'A salesperson starts at city A, needs to visit cities B, C, and D exactly once, and then return to city A. The distances between the cities are as follows: A-B=10km, A-C=15km, A-D=20km, B-C=35km, B-D=25km, C-D=30km. What is the shortest possible route the salesperson can take?',
    topic: 'Math',
};

export const mockChallengeComments: ChallengeComment[] = [
    { id: 'cc1', challengeId: 'dc1', userName: 'Isaac N.', userAvatarUrl: 'https://placehold.co/100x100.png', comment: "This is a classic Traveling Salesperson Problem! You can list out all the possible paths and calculate the total distance for each.", timestamp: '2 hours ago' },
    { id: 'cc2', challengeId: 'dc1', userName: 'Marie C.', userAvatarUrl: 'https://placehold.co/100x100.png', comment: 'I found a path that is 80km. Can anyone beat that? A -> B -> D -> C -> A.', timestamp: '1 hour ago' },
    { id: 'cc3', challengeId: 'dc1', userName: 'Albert E.', userAvatarUrl: 'https://placehold.co/100x100.png', comment: 'Ah, I see! A -> D -> B -> C -> A is 100km. The order really matters!', timestamp: '30 mins ago' },
];

export const mockDailyAssignments: DailyAssignment[] = [
    {
      id: 'da1',
      title: 'Solving Linear Equations',
      problem: 'Solve for x in the following equation: 3x - 7 = 14. Show your work.',
      courseId: 'math',
      dueDate: new Date(new Date().setDate(new Date().getDate() + 2)),
    },
    {
      id: 'da2',
      title: 'Planetary Orbits',
      problem: 'Explain Kepler\'s First Law of Planetary Motion. Why are planetary orbits elliptical and not perfect circles?',
      courseId: 'science',
      dueDate: new Date(new Date().setDate(new Date().getDate() + 5)),
    },
    {
        id: 'da3',
        title: 'Past Due: Pythagorean Theorem',
        problem: 'This assignment was due yesterday and should not be visible to students.',
        courseId: 'math',
        dueDate: new Date(new Date().setDate(new Date().getDate() - 1)),
    },
  ];
