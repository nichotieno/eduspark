# EduSpark: Spark Your Brilliance

**An interactive, gamified learning platform designed to make STEM education engaging, effective, and accessible for everyone.**

---

## Table of Contents

- [Overview](#overview)
- [For Our Users](#for-our-users)
  - [For Students](#for-students)
  - [For Instructors](#for-instructors)
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

## For Our Users

### For Students

Welcome to a new way to learn!

*   **Interactive Courses:** Dive into subjects like Math and Science with lessons that are more than just text. Solve problems, get hints, and build confidence with hands-on activities.
*   **Track Your Progress:** Earn Experience Points (XP) for every lesson you complete. Watch your total grow as you master new skills.
*   **Build a Streak:** Stay motivated by maintaining a daily learning streak. Log in and complete a lesson each day to keep the flame alive!
*   **Earn Badges:** Unlock achievements and earn badges for reaching milestones, like completing your first course or mastering a tough topic.
*   **Daily Challenges:** Test your knowledge with a new STEM problem every day. Compete with your peers and discuss solutions in the community section.
*   **Assignments:** Keep up with your coursework by viewing and submitting assignments directly through your dashboard.

**Getting Started:** Simply [Sign Up](/signup) as a student, and you'll be redirected to your personal dashboard to begin your learning journey.

### For Instructors

Empowering you to create the best learning experiences.

*   **Full Content Control:** Our intuitive dashboard allows you to create and manage your own courses, topics, and lessons from scratch.
*   **Dynamic Lesson Builder:** Craft engaging lessons with a rich text editor, add learning steps with text, images, and videos, and create quizzes with multiple-choice or fill-in-the-blank questions.
*   **Assignment Management:** Easily create, assign, and set due dates for daily or weekly assignments for your courses.
*   **Student Progress Monitoring:** Get a high-level overview of your students' progress, see who is excelling, and identify who might need extra help. (More detailed analytics are on our roadmap!)

**Getting Started:** [Sign Up](/signup) and select the "Teacher" role. You will be taken directly to your Teacher Dashboard where you can start building your first course.

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
