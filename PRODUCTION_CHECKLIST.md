# EduSpark: Production Readiness Checklist

This document outlines the essential steps required to take the EduSpark platform from a feature-complete development state to a live, production-ready application ready for real users.

---

## 1. Infrastructure & Deployment

These are critical backend and configuration tasks that must be completed before going live.

### 1.1. Production Database
-   **Requirement:** The current SQLite database (`local.db`) is for development only and is not suitable for a production environment that handles multiple concurrent users.
-   **Action:**
    1.  Choose and set up a managed, production-grade SQL database service (e.g., **Google Cloud SQL**, **Neon**, **Vercel Postgres**, **Supabase**).
    2.  Install the appropriate Node.js driver for your chosen database (e.g., `npm install pg` for Postgres).
    3.  Update the `src/lib/db.ts` file to use the new driver and connect to the production database using credentials.
    4.  Store database connection details (host, username, password) securely as environment variables, not in the code.

### 1.2. Environment Variables
-   **Requirement:** Secure secrets and configuration must be set up in the production hosting environment.
-   **Action:**
    1.  **`SESSION_SECRET`**: Generate a long, random, and secret string to be used for signing authentication tokens. This is critical for security.
    2.  **`GOOGLE_API_KEY`**: Provide a valid Google AI API key to enable all generative AI features.
    3.  Ensure these variables are set in your deployment environment (e.g., Firebase App Hosting secrets, Vercel environment variables).

---

## 2. Content & Legal

This section covers the initial content of the platform and necessary legal compliance.

### 2.1. Initial Platform Content
-   **Requirement:** Decide on the state of the platform for the first users. The development `db:seed` script should **not** be run in production.
-   **Action:** Choose one of the following strategies:
    *   **Blank Slate:** Launch with an empty database. The first registered teachers will be responsible for creating all initial course content.
    *   **Pre-populated Content:** Before launch, populate the production database with a set of high-quality, professionally created "starter" courses. This provides immediate value to the first students who sign up.

### 2.2. Legal Documents
-   **Requirement:** The footer of the landing page contains links for "Terms" and "Privacy" that currently lead nowhere. These are legally required for most public web applications.
-   **Action:**
    1.  Draft and create a **Terms of Service** document that outlines the rules and expectations for using the platform.
    2.  Draft and create a **Privacy Policy** document that clearly explains what user data is collected and how it is used.
    3.  Create pages within the application to host these documents and update the footer links to point to them.

---

## 3. Testing & Quality Assurance (QA)

Rigorous testing is required to ensure a stable and bug-free user experience.

### 3.1. Internal QA Testing
-   **Requirement:** The application must be thoroughly tested for functional bugs and regressions.
-   **Action:**
    1.  Conduct end-to-end testing of all user flows (e.g., student signup -> course completion, teacher signup -> lesson creation -> grading).
    2.  Test all features on a staging environment that mirrors the production setup.

### 3.2. User Acceptance Testing (UAT)
-   **Requirement:** Real users must validate that the platform meets their needs and is intuitive to use.
-   **Action:**
    1.  Run a "closed beta" program by inviting a small group of trusted students and teachers to use the platform.
    2.  Collect feedback on usability, feature requests, and any bugs they encounter.
    3.  Address critical feedback before a full public launch.

### 3.3. Cross-Browser & Device Testing
-   **Requirement:** The platform must provide a consistent experience across various devices and browsers.
-   **Action:** Manually test the application's UI and functionality on:
    *   **Browsers:** Latest versions of Chrome, Firefox, Safari, and Edge.
    *   **Devices:** Desktops, tablets, and mobile phones to ensure responsiveness.

---

## 4. User Support & Onboarding

Users need resources to learn the platform and get help when they're stuck.

### 4.1. User Documentation
-   **Requirement:** While the `README.md` now contains detailed user guides, these could be made more accessible.
-   **Action (Optional but Recommended):** Create an in-app "Help" or "FAQ" section that contains the user guides, making them easily discoverable without needing to find the project's source code.

### 4.2. Support Channel
-   **Requirement:** Users need a way to report issues or ask questions.
-   **Action:**
    1.  Set up a dedicated support email address (e.g., `support@eduspark.com`).
    2.  Consider adding a simple "Contact Us" or "Report an Issue" form within the application that sends an email to the support address.

---

Once these checklist items are addressed, EduSpark will be well-prepared for a successful public launch.