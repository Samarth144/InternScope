# InternScope - Internship Market Intelligence & Decision Engine

InternScope is a comprehensive market intelligence platform for students to simulate internship outcomes, analyze market competition, and compare offers using data-driven algorithms.

## Features

- **Market Simulator**: Estimate acceptance probability based on skills, projects, and market competition.
- **Bulk Analysis**: Run Monte-Carlo simulations on 300 synthetic students to visualize market saturation.
- **Offer Comparator**: Compare two internship offers side-by-side with long-term growth projection (ROI).
- **PDF Export**: Generate downloadable analysis reports.
- **Real-time Metrics**: Interactive visualizations using Chart.js.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (Glassmorphism design)
- **Database**: PostgreSQL (e.g., Neon)
- **ORM**: Prisma
- **Visuals**: Chart.js, Framer Motion

## Prerequisites

- Node.js (v18+)
- A PostgreSQL database (Neon recommended)

## Setup Instructions

1.  **Configure Environment**:
    Create a `.env` file in the root directory (refer to `.env.example`) and add your database URL:
    ```env
    DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
    NEXTAUTH_SECRET="your-secret-here"
    GOOGLE_CLIENT_ID="your-google-client-id"
    GOOGLE_CLIENT_SECRET="your-google-client-secret"
    NEXTAUTH_URL="http://localhost:3000"
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Setup Database Schema**:
    ```bash
    npx prisma migrate deploy
    ```

4.  **Seed Data**:
    ```bash
    # Seed core data
    npm run seed
    # Seed internship listings
    npm run seed:internships
    ```

5.  **Run Application**:
    ```bash
    npm run dev
    ```

6.  **Open in Browser**:
    Visit [http://localhost:3000](http://localhost:3000)

## Running Tests

Unit tests for the core decision algorithms (Readiness, Acceptance Probability) are provided.

```bash
npm test
```

## Project Structure

- `src/app`: Next.js App Router pages and API routes.
- `src/lib/utils/calculations.ts`: Core algorithms for readiness and growth index.
- `prisma/schema.prisma`: Database models (Student, Company, Offer, Internship).
- `src/components`: UI components (ProfileBuilder, SimulatorCard, BulkSimulator).

## Formulas (Judges Reference)

**Readiness Score**:
`0.40*SkillAvg + 0.20*ProjectStrength + 0.20*ExperienceFactor + 0.10*CGPA_normalized + 0.10*RoleMatch`

**Acceptance Probability**:
`clamp(Readiness*0.50 - CompetitionIndex*0.30 + ExperienceFactor*0.10 + RoleMatch*0.10, 0,100)`

**Growth Index (Offer ROI)**:
`0.40*LearningScore + 0.30*BrandScore + 0.20*TechStackValue + 0.10*NetworkScore`
