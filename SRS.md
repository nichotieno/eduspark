# Software Requirements Specification (SRS) for EduSpark

**Version 1.0**

---

## Table of Contents

1.  [Introduction](#1-introduction)
    1.1. [Purpose](#11-purpose)
    1.2. [Document Conventions](#12-document-conventions)
    1.3. [Intended Audience and Reading Suggestions](#13-intended-audience-and-reading-suggestions)
    1.4. [Product Scope](#14-product-scope)
    1.5. [References](#15-references)
2.  [Overall Description](#2-overall-description)
    2.1. [Product Perspective](#21-product-perspective)
    2.2. [Product Features](#22-product-features)
    2.3. [User Classes and Characteristics](#23-user-classes-and-characteristics)
    2.4. [Operating Environment](#24-operating-environment)
    2.5. [Design and Implementation Constraints](#25-design-and-implementation-constraints)
    2.6. [User Documentation](#26-user-documentation)
    2.7. [Assumptions and Dependencies](#27-assumptions-and-dependencies)
3.  [External Interface Requirements](#3-external-interface-requirements)
    3.1. [User Interfaces](#31-user-interfaces)
    3.2. [Hardware Interfaces](#32-hardware-interfaces)
    3.3. [Software Interfaces](#33-software-interfaces)
    3.4. [Communications Interfaces](#34-communications-interfaces)
4.  [System Features](#4-system-features)
    4.1. [Authentication and Authorization](#41-authentication-and-authorization)
    4.2. [Student Experience](#42-student-experience)
    4.3. [Teacher Experience](#43-teacher-experience)
    4.4. [AI-Powered Features](#44-ai-powered-features)
5.  [Non-functional Requirements](#5-non-functional-requirements)
    5.1. [Performance Requirements](#51-performance-requirements)
    5.2. [Security Requirements](#52-security-requirements)
    5.3. [Software Quality Attributes](#53-software-quality-attributes)

---

## 1. Introduction

### 1.1. Purpose

This Software Requirements Specification (SRS) document provides a comprehensive description of the EduSpark platform, version 1.0. Its purpose is to define the system's features, capabilities, and constraints for a diverse audience, including developers, project managers, testers, and stakeholders. This document serves as the foundation for product development, testing, and future enhancements.

### 1.2. Document Conventions

This document uses standard Markdown formatting. The system shall be referred to as "EduSpark" or "the platform."

### 1.3. Intended Audience and Reading Suggestions

*   **Developers:** Focus on Section 4 (System Features) and Section 5 (Non-functional Requirements) for implementation details.
*   **Project Managers & Stakeholders:** Review Section 1.4 (Product Scope) and Section 2 (Overall Description) for a high-level understanding of the product's vision and functionality.
*   **QA/Testers:** Use Section 4 (System Features) to create test cases and verify that all requirements have been met.
*   **UI/UX Designers:** Refer to Section 3.1 (User Interfaces) and Section 4 for feature context to inform design decisions.

### 1.4. Product Scope

EduSpark is an interactive, gamified web application designed to make STEM (Science, Technology, Engineering, and Math) education more engaging and effective. It provides a platform for students to participate in interactive lessons and for teachers to create, manage, and monitor educational content.

The key goals are:
*   **For Students:** To provide a motivating and interactive learning environment through gamification (XP, streaks, badges), personalized challenges, and AI-driven support.
*   **For Teachers:** To offer a powerful yet intuitive toolkit for creating custom courses, managing assignments, tracking student progress, and gaining AI-powered insights into classroom dynamics.

The platform aims to replace passive learning with active, hands-on problem-solving.

### 1.5. References

*   **README.md:** Provides a high-level project overview, tech stack details, and setup instructions.
*   **Next.js Documentation:** For framework-specific features and best practices.
*   **Genkit Documentation:** For details on the AI integration framework.
*   **ShadCN UI & Tailwind CSS Documentation:** For UI component and styling guidelines.

---

## 2. Overall Description

### 2.1. Product Perspective

EduSpark is a self-contained, web-based system. It operates as a full-stack Next.js application, leveraging server components and server actions to interact with a backend database. It integrates with external AI services (Google's Gemini models) via the Genkit framework to provide its intelligent features.

### 2.2. Product Features

The major features of EduSpark include:
*   **Dual-Role System:** Separate, tailored experiences for 'Student' and 'Teacher' roles.
*   **User Authentication:** Secure signup, login, and session management.
*   **Gamified Student Dashboard:** Displays progress metrics like XP, streaks, and badges.
*   **Interactive Course Content:** Students progress through courses, topics, and lessons in a structured manner. Lessons include multimedia steps and quizzes.
*   **AI-Powered Learning Aids:** An AI Tutor provides hints on quiz questions, and AI generates personalized daily challenges and recommends the next best lesson.
*   **Comprehensive Teacher Dashboard:** An all-in-one interface for content management, student tracking, and assignment grading.
*   **AI-Powered Teacher Tools:** AI assists teachers by generating classroom insights and drafting entire lesson plans.
*   **Full Assignment Lifecycle:** Teachers can create assignments, students can submit them, and teachers can grade them and provide feedback.

### 2.3. User Classes and Characteristics

*   **Students:**
    *   **Characteristics:** Typically high-school age or learners seeking to build foundational STEM skills. They are motivated by interactive content, immediate feedback, and gamified progress. They may have varying levels of technical proficiency.
    *   **Goals:** To learn and master STEM subjects, track their progress, and complete assigned coursework.
*   **Teachers (Instructors):**
    *   **Characteristics:** Educators who want to create custom digital curriculum and monitor their students' progress. They may have limited time for content creation and need efficient tools.
    *   **Goals:** To create engaging courses, manage assignments, track student performance, and identify areas where students need help.

### 2.4. Operating Environment

*   **Platform:** Web-based, accessible via modern web browsers (Chrome, Firefox, Safari, Edge).
*   **Server-Side:** Runs on a Node.js environment, designed for deployment on serverless platforms like Firebase App Hosting.
*   **Database:** Utilizes SQLite for local development and can be configured to connect to production-grade SQL databases (e.g., Cloud SQL, Neon).
*   **Dependencies:** Requires an internet connection to access the application and for AI features to communicate with Google's APIs.

### 2.5. Design and Implementation Constraints

*   **Technology Stack:** The system is exclusively built using Next.js (App Router), React, TypeScript, ShadCN UI, Tailwind CSS, and Genkit. Requests to use other frameworks (e.g., Angular) or styling libraries (e.g., Bootstrap) shall be declined.
*   **Database:** The application is designed to work with a SQL-based database.
*   **AI Provider:** All generative AI functionality is implemented using Genkit and is configured to use Google's Gemini family of models.
*   **Stateless Authentication:** Authentication is handled via stateless JWTs stored in HTTP-only cookies.

### 2.6. User Documentation

The `README.md` file serves as the primary technical documentation for developers and maintainers, containing setup instructions, architectural overviews, and deployment guidance. A separate user guide is out of the scope of this SRS but would be a recommended future deliverable.

### 2.7. Assumptions and Dependencies

*   **API Keys:** A valid API key for Google AI services must be configured in the environment for AI features to function.
*   **Session Secret:** A secure, random `SESSION_SECRET` must be configured in the environment for authentication to be secure.
*   **Database Seeding:** The `npm run db:seed` script must be run before the first launch to initialize the database schema and populate it with mock data.

---

## 3. External Interface Requirements

### 3.1. User Interfaces

The user interface is a responsive web application designed for desktop and mobile browsers. Key UI screens include:
*   **Landing Page:** Publicly accessible page introducing the platform and its features.
*   **Login/Signup Pages:** Forms for user authentication.
*   **Student Dashboard:** The main hub for students, featuring stat cards, course access, assignment summaries, and the personalized learning recommendation.
*   **Course Progression Page:** A visual, linear path showing topics and lessons within a course.
*   **Lesson Page:** An interactive view for progressing through learning steps and answering quiz questions.
*   **Teacher Dashboard:** A tabbed interface for managing courses, students, assignments, and viewing analytics.
*   **Lesson Builder:** A rich interface for teachers to create and edit lesson content, including steps and questions.
*   **Assignment & Challenge Pages:** Interfaces for students to view problems and submit their work.
*   **Profile Page:** A page for users to view and update their profile information.

### 3.2. Hardware Interfaces

No direct hardware interfaces are required beyond standard client devices (desktops, laptops, tablets, smartphones) capable of running a modern web browser.

### 3.3. Software Interfaces

*   **Google AI Platform:** The system communicates with Google's AI services via REST APIs managed by the Genkit framework to power its generative AI features.
*   **Database Driver:** The system uses the `sqlite3` and `sqlite` npm packages to interface with the SQLite database. Production deployments would require a different driver (e.g., `pg` for PostgreSQL).

### 3.4. Communications Interfaces

All communication between the client (browser) and the server occurs over HTTPS.

---

## 4. System Features

This section details the functional requirements of EduSpark.

### 4.1. Authentication and Authorization

*   **4.1.1. User Registration:** A user shall be able to sign up for a new account by providing their name, email, password, and selecting a role ('student' or 'teacher').
*   **4.1.2. User Login:** A registered user shall be able to log in using their email and password. Upon successful login, they shall be redirected to their respective dashboard.
*   **4.1.3. Session Management:** The system shall use JWTs stored in secure, HTTP-only cookies to manage user sessions. Sessions will expire after 24 hours.
*   **4.1.4. Logout:** A logged-in user shall be able to log out, which will destroy their session cookie.
*   **4.1.5. Role-Based Access Control:** The system shall restrict access to dashboard pages based on user role.
    *   `/dashboard/student/*` routes shall be accessible only to users with the 'student' role.
    *   `/dashboard/teacher/*` routes shall be accessible only to users with the 'teacher' role.
    *   Unauthorized access attempts shall result in a redirect to the user's correct dashboard.

### 4.2. Student Experience

#### 4.2.1. Student Dashboard
*   **4.2.1.1. Gamification Stats:** The dashboard shall display the student's total Experience Points (XP), current daily learning streak, and the number of badges earned.
*   **4.2.1.2. Course Access:** The dashboard shall display cards for all available courses, allowing the student to navigate to a course page.
*   **4.2.1.3. AI-Powered "Continue Learning":** The dashboard shall feature a card that recommends the next lesson for the student based on AI analysis of their performance. If all lessons are complete, a congratulatory message shall be shown.
*   **4.2.1.4. Assignments Overview:** The dashboard shall display a summary card showing the number of assignments the student currently has to do, with a link to the full assignments page.

#### 4.2.2. Course Progression
*   **4.2.2.1. Course View:** Each course shall have a dedicated page displaying its topics and lessons in a vertical, timeline-style layout.
*   **4.2.2.2. Lesson Locking:** Lessons shall be locked by default. A lesson shall become unlocked only when the preceding lesson in the course has been completed. The first lesson of a course is always unlocked.
*   **4.2.2.3. Progress Indication:** Completed lessons shall be visually distinct from unlocked but incomplete lessons. Locked lessons shall have a lock icon.

#### 4.2.3. Lesson Experience
*   **4.2.3.1. Lesson Structure:** A lesson consists of a series of learning steps followed by a quiz.
*   **4.2.3.2. Learning Steps:** A step can contain a title, text content, an image, or a video. Students navigate through steps sequentially.
*   **4.2.3.3. Quiz Questions:** A quiz consists of multiple-choice or fill-in-the-blank questions.
*   **4.2.3.4. Answering Questions:** Students must select an answer (for multiple-choice) or type one in (for fill-in-the-blank) and submit it for checking.
*   **4.2.3.5. Instant Feedback:** The system shall provide immediate feedback on whether the answer was correct or incorrect. Incorrect answers allow the student to try again.
*   **4.2.3.6. Hints:** Students can request a pre-written hint for each question. They can also request an AI-generated hint from the AI Tutor.
*   **4.2.3.7. Lesson Completion:** Upon successfully completing the final question of the quiz, the lesson is marked as complete. The student's XP is updated, their daily streak is recorded, and any relevant badges are awarded. The student is then presented with the AI-recommended next lesson.

#### 4.2.4. Assignments
*   **4.2.4.1. Assignments Page:** A dedicated page at `/dashboard/assignments` shall allow students to view all their assignments.
*   **4.2.4.2. Tabbed View:** The page shall be organized into tabs: "To Do", "Submitted", "Graded", and "Past Due".
*   **4.2.4.3. Assignment Submission:** Students can view the details of an assignment and submit their solution using a rich text editor. Submissions are blocked after the due date.
*   **4.2.4.4. Viewing Grades:** After a teacher has graded a submission, the student shall be able to see their grade and any written feedback on the assignment page.

#### 4.2.5. Personalized Daily Challenge
*   **4.2.5.1. Daily Generation:** Each day, the system shall use an AI flow to generate a unique challenge for the student based on their recent learning history.
*   **4.2.5.2. Community Discussion:** Students can post comments and engage in discussions about the daily challenge.
*   **4.2.5.3. Solution Submission:** Students can submit their solution to the challenge.
*   **4.2.5.4. Peer Learning:** After submitting their own solution, a student shall be able to view the solutions submitted by other students, fostering peer learning.

#### 4.2.6. Profile Management
*   **4.2.6.1. View Profile:** Students shall be able to view their profile information (name, email, role).
*   **4.2.6.2. Update Profile:** Students shall be able to update their name and avatar image.
*   **4.2.6.3. Change Password:** Students shall be able to change their account password after verifying their current password.

### 4.3. Teacher Experience

#### 4.3.1. Dashboard Overview & Analytics
*   **4.3.1.1. Key Metrics:** The overview tab shall display cards with key analytics: Total Students and Average Course Progress.
*   **4.3.1.2. AI Teaching Assistant:** The overview shall feature a card displaying brief, actionable insights about the classroom generated by an AI flow.
*   **4.3.1.3. Engagement Charts:** The overview shall display charts visualizing course engagement (students enrolled per course) and a list of recent assignment submissions.

#### 4.3.2. Student Progress Tracking
*   **4.3.2.1. Student List:** The "Student Progress" tab shall display a table of all students in the class.
*   **4.3.2.2. Progress Metrics:** The table shall show each student's name, avatar, overall course completion percentage, and their last active date.

#### 4.3.3. Course and Content Management (CRUD)
*   **4.3.3.1. Course Management:** Teachers shall be able to create, edit, and delete courses.
*   **4.3.3.2. Topic Management:** Within a course, teachers shall be able to create, edit, and delete topics.
*   **4.3.3.3. Lesson Management:** Within a topic, teachers shall be able to create and delete lessons.
*   **4.3.3.4. Lesson Builder:** Teachers can edit lessons on a dedicated Lesson Builder page. They can add, edit, and delete learning steps (text, image, video) and quiz questions (multiple-choice, fill-in-the-blank).
*   **4.3.3.5. AI Content Generation:** On the Lesson Builder page, a teacher can click a button to have the AI automatically generate a full draft of lesson steps and quiz questions based on the lesson's title.

#### 4.3.4. Assignment Management (CRUD)
*   **4.3.4.1. Assignment List:** The "Daily Assignments" tab shall display a list of all created assignments.
*   **4.3.4.2. Create/Edit Assignments:** Teachers shall be able to create and edit assignments, providing a title, problem description, associated course, and a due date.

#### 4.3.5. Submission Review and Grading
*   **4.3.5.1. Submission Access:** Teachers can access a dedicated page for each assignment to view all student submissions.
*   **4.3.5.2. Grading Interface:** For each submission, the teacher can view the student's work and use a form to enter a grade (0-100) and provide written feedback.
*   **4.3.5.3. Status Update:** Once graded, the submission's status is updated for both the teacher and the student.

### 4.4. AI-Powered Features

*   **4.4.1. AI Tutor (Hints):** In the student lesson view, the system shall provide an "AI Hint" button. When clicked, a Genkit flow is triggered to generate a Socratic-style hint for the current quiz question without revealing the answer.
*   **4.4.2. AI-Powered Content Generation:** In the teacher's lesson builder, the system shall provide a "Generate with AI" button. This triggers a Genkit flow that takes the lesson title as input and outputs a structured JSON object containing multiple learning steps and quiz questions, which then populates the editor.
*   **4.4.3. AI Classroom Insights:** On the teacher dashboard, the system shall trigger a Genkit flow that uses a custom tool to fetch classroom analytics. The AI analyzes this data and generates 2-4 brief, actionable insights for the teacher.
*   **4.4.4. Personalized Daily Challenge Generation:** When a student visits the Daily Challenge page for the first time on a given day, the system triggers a Genkit flow. This flow uses a tool to fetch the student's recently completed topics and generates a unique, relevant word problem for them to solve.
*   **4.4.5. Personalized Learning Path Recommendation:** After a student completes a lesson, or when they visit their dashboard, the system triggers a Genkit flow. This flow uses tools to analyze the student's quiz performance history and the list of available lessons. It then recommends the most appropriate next lesson to tackle, providing a one-sentence justification.

---

## 5. Non-functional Requirements

### 5.1. Performance Requirements

*   **Page Load Time:** All pages should have a First Contentful Paint (FCP) of less than 2.5 seconds under typical network conditions.
*   **Server Response Time:** Server Action and API route responses should complete in under 500ms for non-AI operations.
*   **AI Feature Response Time:** AI-powered features are dependent on external API latency but should display loading states to the user to manage expectations. The system should gracefully handle AI API timeouts.

### 5.2. Security Requirements

*   **Authentication:** Passwords must be hashed using a strong, one-way algorithm (bcrypt).
*   **Session Management:** JWTs must be stored in HTTP-only cookies to prevent access from client-side scripts (XSS).
*   **Data Validation:** All user input must be validated on the server-side (using Zod schemas) before being processed or inserted into the database to prevent injection attacks.
*   **Authorization:** All server actions and API routes that modify data must verify that the user has a valid session and the appropriate permissions for the action.
*   **Secrets Management:** API keys and session secrets must be stored as environment variables and not be committed to the source code repository.

### 5.3. Software Quality Attributes

*   **Maintainability:** Code shall be well-organized, following the project structure outlined in `README.md`. Reusable components and logic should be abstracted into their own files. TypeScript should be used to ensure type safety.
*   **Usability:** The platform shall be intuitive for both student and teacher users. The UI shall be clean, responsive, and provide clear feedback for all user actions.
*   **Reliability:** The application should handle errors gracefully (e.g., database connection failures, AI API errors) and provide informative messages to the user without crashing.
*   **Scalability:** The application is built on a serverless-friendly architecture (Next.js App Router) and can be scaled horizontally by increasing the number of running instances in a production environment.
