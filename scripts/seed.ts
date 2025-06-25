
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import { 
    mockCourses, 
    mockTopics, 
    mockLessons, 
} from '../src/lib/mock-data';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import path from 'path';
import os from 'os';

async function seed() {
    const dbPath = path.join(os.tmpdir(), 'local.db');
    console.log(`Opening database at: ${dbPath}`);
    const db = await open({
        filename: dbPath,
        driver: sqlite3.Database
    });

    console.log('Running migrations...');
    await db.exec(`
        -- Users Table
        DROP TABLE IF EXISTS users;
        CREATE TABLE users (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            role TEXT NOT NULL CHECK(role IN ('student', 'teacher')),
            avatarUrl TEXT
        );

        -- Courses Table
        DROP TABLE IF EXISTS courses;
        CREATE TABLE courses (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT NOT NULL
        );

        -- Topics Table
        DROP TABLE IF EXISTS topics;
        CREATE TABLE topics (
            id TEXT PRIMARY KEY,
            courseId TEXT NOT NULL,
            title TEXT NOT NULL,
            FOREIGN KEY(courseId) REFERENCES courses(id) ON DELETE CASCADE
        );

        -- Lessons Table
        DROP TABLE IF EXISTS lessons;
        CREATE TABLE lessons (
            id TEXT PRIMARY KEY,
            courseId TEXT NOT NULL,
            topicId TEXT NOT NULL,
            title TEXT NOT NULL,
            xp INTEGER NOT NULL,
            FOREIGN KEY(courseId) REFERENCES courses(id) ON DELETE CASCADE,
            FOREIGN KEY(topicId) REFERENCES topics(id) ON DELETE CASCADE
        );
        
        -- Lesson Steps Table
        DROP TABLE IF EXISTS lesson_steps;
        CREATE TABLE lesson_steps (
            id TEXT PRIMARY KEY,
            lessonId TEXT NOT NULL,
            title TEXT NOT NULL,
            content TEXT,
            image TEXT,
            videoUrl TEXT,
            "data-ai-hint" TEXT,
            step_order INTEGER,
            FOREIGN KEY(lessonId) REFERENCES lessons(id) ON DELETE CASCADE
        );

        -- Questions Table
        DROP TABLE IF EXISTS questions;
        CREATE TABLE questions (
            id TEXT PRIMARY KEY,
            lessonId TEXT NOT NULL,
            text TEXT NOT NULL,
            type TEXT NOT NULL,
            options TEXT, -- JSON string
            correctAnswer TEXT NOT NULL,
            hint TEXT,
            image TEXT,
            "data-ai-hint" TEXT,
            question_order INTEGER,
            FOREIGN KEY(lessonId) REFERENCES lessons(id) ON DELETE CASCADE
        );

        -- User Question Answers Table
        DROP TABLE IF EXISTS user_question_answers;
        CREATE TABLE user_question_answers (
            id TEXT PRIMARY KEY,
            userId TEXT NOT NULL,
            lessonId TEXT NOT NULL,
            questionId TEXT NOT NULL,
            answer TEXT NOT NULL,
            isCorrect BOOLEAN NOT NULL,
            timestamp TEXT NOT NULL,
            FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY(lessonId) REFERENCES lessons(id) ON DELETE CASCADE,
            FOREIGN KEY(questionId) REFERENCES questions(id) ON DELETE CASCADE
        );

        -- Assignments Table
        DROP TABLE IF EXISTS assignments;
        CREATE TABLE assignments (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            problem TEXT NOT NULL,
            courseId TEXT NOT NULL,
            dueDate TEXT NOT NULL
        );

        -- Submissions Table
        DROP TABLE IF EXISTS submissions;
        CREATE TABLE submissions (
            id TEXT PRIMARY KEY,
            assignmentId TEXT NOT NULL,
            userId TEXT NOT NULL,
            content TEXT NOT NULL,
            submittedAt TEXT NOT NULL,
            grade INTEGER,
            feedback TEXT,
            FOREIGN KEY(assignmentId) REFERENCES assignments(id) ON DELETE CASCADE,
            FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE,
            UNIQUE(assignmentId, userId)
        );

        -- User Progress Table (tracks completed lessons)
        DROP TABLE IF EXISTS user_progress;
        CREATE TABLE user_progress (
            userId TEXT NOT NULL,
            lessonId TEXT NOT NULL,
            completedAt TEXT NOT NULL,
            xpEarned INTEGER NOT NULL,
            PRIMARY KEY(userId, lessonId),
            FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY(lessonId) REFERENCES lessons(id) ON DELETE CASCADE
        );

        -- User Streaks Table (tracks daily activity)
        DROP TABLE IF EXISTS user_streaks;
        CREATE TABLE user_streaks (
            userId TEXT NOT NULL,
            "date" TEXT NOT NULL, -- YYYY-MM-DD
            PRIMARY KEY(userId, "date"),
            FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE
        );

        -- User Badges Table (tracks earned badges)
        DROP TABLE IF EXISTS user_badges;
        CREATE TABLE user_badges (
            userId TEXT NOT NULL,
            badgeId TEXT NOT NULL,
            earnedAt TEXT NOT NULL,
            PRIMARY KEY(userId, badgeId),
            FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE
        );

        -- User Daily Challenge Table
        DROP TABLE IF EXISTS user_challenges;
        CREATE TABLE user_challenges (
            id TEXT PRIMARY KEY,
            userId TEXT NOT NULL,
            title TEXT NOT NULL,
            problem TEXT NOT NULL,
            topic TEXT NOT NULL,
            "date" TEXT NOT NULL,
            FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE
        );

        -- Challenge Comments Table
        DROP TABLE IF EXISTS challenge_comments;
        CREATE TABLE challenge_comments (
            id TEXT PRIMARY KEY,
            challengeId TEXT NOT NULL,
            userId TEXT NOT NULL,
            comment TEXT NOT NULL,
            timestamp TEXT NOT NULL,
            FOREIGN KEY(challengeId) REFERENCES user_challenges(id) ON DELETE CASCADE,
            FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE
        );

        -- Challenge Submissions Table
        DROP TABLE IF EXISTS challenge_submissions;
        CREATE TABLE challenge_submissions (
            id TEXT PRIMARY KEY,
            challengeId TEXT NOT NULL,
            userId TEXT NOT NULL,
            content TEXT NOT NULL,
            submittedAt TEXT NOT NULL,
            FOREIGN KEY(challengeId) REFERENCES user_challenges(id) ON DELETE CASCADE,
            FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE,
            UNIQUE(challengeId, userId)
        );
    `);
    console.log('Migrations complete.');

    // Seed Users
    console.log('Seeding users...');
    const users = [
        { 
            id: 'user_student_1', 
            name: 'Alex Doe', 
            email: 'student@example.com', 
            password: 'password123', 
            role: 'student', 
            avatarUrl: 'https://placehold.co/100x100.png' 
        },
        { 
            id: 'user_student_2', 
            name: 'Beth Smith', 
            email: 'student2@example.com', 
            password: 'password123', 
            role: 'student', 
            avatarUrl: 'https://placehold.co/100x100.png'
        },
        { 
            id: 'user_teacher_1', 
            name: 'Prof. Ada', 
            email: 'teacher@example.com', 
            password: 'password123', 
            role: 'teacher', 
            avatarUrl: 'https://placehold.co/100x100.png'
        }
    ];
    for (const user of users) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        await db.run(
            'INSERT INTO users (id, name, email, password, role, avatarUrl) VALUES (?, ?, ?, ?, ?, ?)',
            user.id, user.name, user.email, hashedPassword, user.role, user.avatarUrl
        );
    }
    console.log('Users seeded.');

    // Seed Courses
    console.log('Seeding courses...');
    for (const course of mockCourses) {
        await db.run('INSERT INTO courses (id, title, description) VALUES (?, ?, ?)',
            course.id,
            course.title,
            course.description
        );
    }
    console.log('Courses seeded.');

    // Seed Topics
    console.log('Seeding topics...');
    for (const topic of mockTopics) {
        await db.run('INSERT INTO topics (id, courseId, title) VALUES (?, ?, ?)',
            topic.id,
            topic.courseId,
            topic.title
        );
    }
    console.log('Topics seeded.');

    // Seed Lessons, Steps, and Questions
    console.log('Seeding lessons...');
    for (const lesson of mockLessons) {
        await db.run('INSERT INTO lessons (id, courseId, topicId, title, xp) VALUES (?, ?, ?, ?, ?)',
            lesson.id,
            lesson.courseId,
            lesson.topicId,
            lesson.title,
            lesson.xp
        );

        let stepOrder = 0;
        for (const step of lesson.steps) {
            await db.run(
              'INSERT INTO lesson_steps (id, lessonId, title, content, image, videoUrl, "data-ai-hint", step_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
              step.id,
              lesson.id,
              step.title,
              step.content,
              step.image,
              step.videoUrl,
              step['data-ai-hint'],
              stepOrder++
            );
        }

        let questionOrder = 0;
        for (const question of lesson.questions) {
            await db.run(
              'INSERT INTO questions (id, lessonId, text, type, options, correctAnswer, hint, image, "data-ai-hint", question_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
              question.id,
              lesson.id,
              question.text,
              question.type,
              JSON.stringify(question.options),
              question.correctAnswer,
              question.hint,
              question.image,
              question['data-ai-hint'],
              questionOrder++
            );
        }
    }
    console.log('Lessons seeded.');

    // Seed Assignments
    console.log('Seeding assignments...');
    const assignmentDate = new Date();
    assignmentDate.setDate(assignmentDate.getDate() + 2);
    await db.run('INSERT INTO assignments (id, title, problem, courseId, dueDate) VALUES (?, ?, ?, ?, ?)',
        'da1', 'Solving Linear Equations', 'Solve for x in the following equation: 3x - 7 = 14. Show your work.', 'math', assignmentDate.toISOString()
    );
    console.log('Assignments seeded.');
    
    // Seed initial student progress for demonstration
    console.log('Seeding initial student progress...');
    const studentId1 = 'user_student_1';
    const lessonId = 'm1'; // Intro to Algebra
    const now = new Date();
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);

    await db.run('INSERT INTO user_progress (userId, lessonId, completedAt, xpEarned) VALUES (?, ?, ?, ?)', studentId1, lessonId, now.toISOString(), 100);
    await db.run('INSERT INTO user_streaks (userId, "date") VALUES (?, ?)', studentId1, yesterday.toISOString().split('T')[0]);
    await db.run('INSERT INTO user_badges (userId, badgeId, earnedAt) VALUES (?, ?, ?)', studentId1, 'b1', now.toISOString()); // Math Beginner badge
    console.log('Initial student progress seeded.');

    console.log('Database seeded successfully!');
    await db.close();
}

seed().catch(err => {
    console.error('Failed to seed database:', err);
    process.exit(1);
});
