# EduSpark: Spark Your Brilliance

**An interactive, gamified learning platform designed to make STEM education engaging, effective, and accessible for everyone.**

---

## Table of Contents

- [Overview](#overview)
- [For Our Users: Quick Start Guides](#for-our-users-quick-start-guides)
  - [Student Quick Start Guide](#student-quick-start-guide)
  - [Instructor Quick Start Guide](#instructor-quick-start-guide)
- [For Developers & Maintainers](#for-developers--maintainers)
  - [Tech Stack](#tech-stack)
  - [Project Structure](#project-structure)
  - [Getting Started](#getting-started-for-development)
  - [Architectural Concepts](#architectural-concepts)
- [For DevOps & Deployment](#for-devops--deployment)
  - [Configuration](#configuration)
  - [Deployment](#deployment)
  - [Database in Production](#database-in-production)
- [For Investors & Stakeholders](#for-investors--stakeholders)
  - [Mission & Vision](#mission--vision)
  - [Market Opportunity](#market-opportunity)
  - [Key Differentiators](#key-differentiators)
  - [Future Roadmap](#future-roadmap)

---

## Overview

EduSpark is a modern web application that reimagines how students learn and teachers create content for Science, Technology, Engineering, and Math (STEM) subjects. Our platform replaces passive learning with hands-on, interactive lessons, quizzes, and challenges. By incorporating gamification elements like experience points (XP), learning streaks, and badges, we make the educational journey fun and motivating.

For instructors, EduSpark provides a powerful yet intuitive suite of tools to create, manage, and deploy custom course content, track student progress, and identify areas where students may be struggling.

---

## For Our Users: Quick Start Guides

### Student Quick Start Guide

Welcome to a new way to learn! Here’s how to get started.

#### 1. Signing Up
- Visit the [Sign Up](/signup) page.
- Enter your name, email, and a password.
- **Crucially, select the "Student" role.**
- You'll be automatically logged in and redirected to your personal dashboard.

#### 2. Your Dashboard: Your Learning Hub
Your dashboard is your central hub. Here you'll find:
*   **Stats:** See your total Experience Points (XP), current learning streak, and earned badges at a glance.
*   **Courses:** Browse all available courses. Click "View Course" to start one.
*   **Continue Learning:** The AI-powered recommendation card shows you the best lesson to tackle next.
*   **Assignments:** See a summary of how many assignments you need to complete.

#### 3. Taking a Course
- From the dashboard, click "View Course" on a course card (e.g., "Core Math").
- You'll see a timeline of topics and lessons.
- Lessons are unlocked sequentially. You must complete one lesson to unlock the next.
- Click on any unlocked lesson to begin.

#### 4. Completing a Lesson
- **Learning Steps:** Progress through the learning materials first. These can include text, images, and videos.
- **Quiz Time:** After the steps, you'll enter the quiz section.
- **Answering:** Select an answer (for multiple-choice) or type it in (for fill-in-the-blank) and click "Check Answer."
- **Hints:** If you're stuck, use the "Hint" button for a pre-written tip or the "AI Hint" button for a personalized hint from our AI Tutor.
- **Completion:** Once you correctly answer all questions, the lesson is complete! You'll earn XP and see the AI recommendation for your next lesson.

#### 5. Submitting Assignments
- Navigate to the "Assignments" page using the sidebar.
- The page is organized into tabs: "To Do," "Submitted," "Graded," and "Past Due."
- Click on an assignment in the "To Do" list.
- Read the problem, then use the rich text editor to write your solution.
- Click "Submit Assignment." You cannot edit after submitting.
- Check the "Graded" tab later to see your grade and the teacher's feedback.

#### 6. The Daily Challenge
- Navigate to the "Daily Challenge" page from the sidebar.
- Each day, our AI generates a unique problem for you based on your recent learning.
- You can post comments to discuss the problem with other students.
- Submit your solution using the editor.
- **After you submit, you'll be able to see and learn from the solutions posted by other students in the community!**

---

### Instructor Quick Start Guide

Empowering you to create the best learning experiences.

#### 1. Signing Up
- Visit the [Sign Up](/signup) page.
- Enter your name, email, and a password.
- **Crucially, select the "Teacher" role.**
- You'll be automatically logged in and redirected to your Teacher Dashboard.

#### 2. Your Dashboard: Your Command Center
The Teacher Dashboard is a tabbed interface for managing your classroom:
*   **Overview:** Get high-level analytics, see course engagement charts, and receive actionable insights from your AI Teaching Assistant.
*   **Student Progress:** View a list of all your students, their overall progress, and their last active date.
*   **Course Management:** This is where you build and organize your curriculum.
*   **Daily Assignments:** Create and manage assignments for your students.

#### 3. Creating Your First Course
- Go to the "Course Management" tab.
- Click the "Create New Course" button.
- Fill in a title and description, and save.
- Your new course will appear in an accordion. Click on it to expand it.

#### 4. Building a Lesson (Manually & with AI)
1.  **Create a Topic:** Inside your course, click "Add New Topic" (e.g., "Algebra Basics").
2.  **Create a Lesson:** Inside your new topic, click "Add New Lesson." Provide a title (e.g., "Solving Linear Equations") and an XP value. This will take you to the Lesson Builder.
3.  **Populate Content:**
    *   **With AI (Recommended for speed):** Click the **"Generate with AI"** button. The AI will use the lesson title to create a full draft of learning steps and quiz questions for you.
    *   **Manually:** Click "Add Learning Step" to add text, images, or videos. Click "Add Quiz Question" to create multiple-choice questions.
4.  **Review and Save:** Review all generated or manually created content, make any edits you see fit, and click "Save Changes."

#### 5. Creating an Assignment
- Go to the "Daily Assignments" tab.
- Click "Create New Assignment."
- Fill in the form: provide a title, a detailed problem description, associate it with one of your courses, and set a due date.
- Click "Create Assignment." It will now be visible to students.

#### 6. Grading Submissions
- On the "Daily Assignments" tab, find the assignment you want to grade.
- Click the "View Submissions" icon (looks like a group of people) on the assignment card.
- This takes you to the Submissions page, where you'll see a list of all students who have submitted work.
- Click on a student's submission to expand it and view their work.
- Use the form to enter a grade (0-100) and provide written feedback.
- Click "Save Grade." The student will now be able to see their grade and your comments.

---

## For Developers & Maintainers

### Tech Stack

EduSpark is built with a modern, robust, and scalable tech stack:

*   **Framework:** [Next.js](https://nextjs.org/) (App Router)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **UI:** [React](https://react.dev/), [ShadCN UI](https://ui.shadcn.com/), [Tailwind CSS](https://tailwindcss.com/)
*   **Backend/API:** [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
*   **Database:** [SQLite](https://www.sqlite.org/index.html) (for local development & seeding)
*   **Authentication:** [jose](https://github.com/panva/jose) for JWT-based session management
*   **AI Integration:** [Genkit](https://firebase.google.com/docs/genkit) (configured and ready for building generative AI features)

### Project Structure

```
.
├── scripts/
│   └── seed.ts          # Database schema and mock data seeder
├── src/
│   ├── app/             # Next.js App Router: pages, layouts, and API routes
│   │   ├── (auth)/      # Auth pages (login, signup)
│   │   ├── dashboard/   # Protected routes for students and teachers
│   │   └── ...
│   ├── components/
│   │   └── ui/          # Reusable UI components from ShadCN
│   ├── contexts/        # React Context providers (e.g., SessionContext)
│   ├── hooks/           # Custom React hooks (e.g., useToast)
│   ├── lib/             # Core logic, definitions, and utilities
│   │   ├── db.ts        # Database connection logic
│   │   ├── mock-data.ts # Mock data structures
│   │   └── session.ts   # Authentication session helpers
│   ├── ai/
│   │   └── genkit.ts    # Genkit configuration for AI features
│   └── middleware.ts    # Middleware for protecting dashboard routes
├── public/              # Static assets
└── ...                  # Config files (tailwind, next, tsconfig, etc.)
```

### Getting Started (for Development)

1.  **Prerequisites:**
    *   Node.js (v20 or later recommended)
    *   npm

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Seed the Database:**
    This command sets up the `local.db` SQLite file with the necessary tables and mock data for users, courses, and lessons. You must run this before starting the app for the first time.
    ```bash
    npm run db:seed
    ```

4.  **Run the Development Server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:9002`.

### Architectural Concepts

*   **Authentication:** We use a stateless JWT-based session approach. When a user logs in, a session token is created using `jose`, signed with a secret key, and stored in an HTTP-only cookie. The `middleware.ts` file intercepts requests to protected routes (`/dashboard/*`) to verify the session.
*   **Data Flow:** The application heavily utilizes **React Server Components (RSCs)** for initial page loads, fetching data directly from the database on the server. Form submissions and data mutations are handled by **Next.js Server Actions**, which eliminates the need for traditional API endpoints and simplifies data management.
*   **Styling:** The UI is built with Tailwind CSS and a set of pre-built, accessible components from ShadCN UI. The theme (colors, fonts, etc.) is defined in `src/app/globals.css` using CSS variables, making it easy to customize the look and feel.

---

## For DevOps & Deployment

### Configuration

The primary piece of configuration required for production is the session secret key.

*   **`SESSION_SECRET`**: This is a critical environment variable used to sign and verify authentication tokens. It must be a long, random, and secret string. **Do not commit this to version control.**

### Deployment

The application is configured for deployment on modern serverless platforms like **Firebase App Hosting**.

1.  **Build the Application:**
    ```bash
    npm run build
    ```
    This creates an optimized production build in the `.next` directory.

2.  **Run in Production Mode:**
    ```bash
    npm run start
    ```
    This starts the Next.js production server.

The `apphosting.yaml` file contains basic configuration for deploying to Firebase App Hosting, including instance scaling settings.

### Database in Production

The current setup uses a local `local.db` SQLite file, which is **not suitable for production environments**. For a production deployment, you should replace the SQLite connection in `src/lib/db.ts` with a connection to a managed, robust database service like:

*   Google Cloud SQL
*   Neon
*   Vercel Postgres
*   Supabase

This will typically involve installing a new database driver (`pg`, `mysql2`, etc.) and updating the `getDb` function to use the new driver and connection credentials (ideally from environment variables).

---

## For Investors & Stakeholders

### Mission & Vision

Our mission is to **spark brilliance** in every student by transforming STEM education from a passive, one-size-fits-all experience into an active, engaging, and personalized journey. We envision a world where any student, regardless of their background, can build confidence and mastery in critical technical subjects.

### Market Opportunity

The global EdTech market is experiencing explosive growth, with a strong demand for tools that can demonstrably improve learning outcomes. Traditional teaching methods often fail to engage students in STEM, leading to learning gaps and a shrinking talent pipeline. EduSpark addresses this by providing a scalable platform that is both effective for students and easy for educators to adopt and customize.

### Key Differentiators

*   **Gamified & Interactive Core:** Unlike platforms that are just video repositories, our learning model is built on interaction, immediate feedback, and reward systems (XP, streaks, badges) that are proven to increase engagement and retention.
*   **Integrated Teacher Toolkit:** We empower educators by giving them the tools to create and manage their own curriculum directly within the platform, rather than being locked into a predefined set of content. This makes EduSpark highly adaptable for different classroom needs.
*   **AI-Ready Architecture:** The platform is built from the ground up with Genkit, Google's generative AI toolkit. This positions us to rapidly deploy next-generation features, setting us apart from competitors.

### Future Roadmap

Our lean foundation allows for rapid iteration and expansion. Key areas on our roadmap include:

*   **AI-Powered Personalization:**
    *   **AI Tutors:** Providing students with real-time, conversational help when they're stuck.
    *   **Personalized Learning Paths:** Dynamically adjusting the curriculum based on a student's performance and learning style.
    *   **Automated Content Generation:** Assisting teachers in creating high-quality lesson plans and quizzes in a fraction of the time.
*   **Advanced Classroom Analytics:** Providing teachers with deep insights into student performance, identifying common misconceptions across the class, and suggesting targeted interventions.
*   **Collaboration Features:** Enabling students to work together on challenges and projects in real-time.
*   **Expansion into More Subjects:** Broadening our content library to cover more advanced topics in Math, Science, and Computer Science.
