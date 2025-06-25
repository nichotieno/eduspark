
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import { 
    mockCourses, 
    mockTopics, 
    mockLessons, 
    mockDailyAssignments
} from '../src/lib/mock-data';

async function seed() {
    console.log('Opening database...');
    const db = await open({
        filename: './local.db',
        driver: sqlite3.Database
    });

    console.log('Running migrations...');
    await db.exec(`
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
            FOREIGN KEY(courseId) REFERENCES courses(id)
        );

        -- Lessons Table
        DROP TABLE IF EXISTS lessons;
        CREATE TABLE lessons (
            id TEXT PRIMARY KEY,
            courseId TEXT NOT NULL,
            topicId TEXT NOT NULL,
            title TEXT NOT NULL,
            xp INTEGER NOT NULL,
            FOREIGN KEY(courseId) REFERENCES courses(id),
            FOREIGN KEY(topicId) REFERENCES topics(id)
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
            FOREIGN KEY(lessonId) REFERENCES lessons(id)
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
            FOREIGN KEY(lessonId) REFERENCES lessons(id)
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
    `);
    console.log('Migrations complete.');

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
    for (const assignment of mockDailyAssignments) {
        await db.run('INSERT INTO assignments (id, title, problem, courseId, dueDate) VALUES (?, ?, ?, ?, ?)',
            assignment.id,
            assignment.title,
            assignment.problem,
            assignment.courseId,
            assignment.dueDate.toISOString()
        );
    }
    console.log('Assignments seeded.');

    console.log('Database seeded successfully!');
    await db.close();
}

seed().catch(err => {
    console.error('Failed to seed database:', err);
    process.exit(1);
});
