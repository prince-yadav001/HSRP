# HSRP Saarthi - High Security Registration Plate Portal

HSRP Saarthi is a modern, full-stack web application designed to streamline the process of booking and managing High Security Registration Plates (HSRP) for vehicles. This platform provides a user-friendly interface for vehicle owners to apply for HSRP, make secure payments, and track their order status in real-time. It also includes a comprehensive admin dashboard for managing bookings and application-wide settings.

## ✨ Features

- **Online Booking:** A multi-step form to easily book HSRP for various vehicle types.
- **Order Tracking:** Users can track the real-time status of their application using their mobile number.
- **Admin Dashboard:** A secure admin panel to view all bookings, update order statuses, and manage content.
- **AI-Powered Verification:** Utilizes Genkit AI to automatically verify payment proofs uploaded by users.
- **Responsive Design:** Fully responsive and modern UI built with ShadCN UI and Tailwind CSS.
- **Secure & Scalable:** Built on Next.js with a serverless PostgreSQL database (Neon) managed by Drizzle ORM.

## 🚀 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (with App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [ShadCN UI](https://ui.shadcn.com/)
- **Database:** [Neon](https://neon.tech/) (Serverless PostgreSQL)
- **ORM:** [Drizzle ORM](https://orm.drizzle.team/)
- **AI/Generative:** [Firebase Genkit](https://firebase.google.com/docs/genkit)
- **Deployment:** Firebase Hosting

## 🛠️ Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (version 20 or later)
- [npm](https://www.npmjs.com/)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd <repository-folder>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project and add your Neon database connection string:
    ```.env
    DATABASE_URL="your_neon_database_connection_string"
    ```

4.  **Run database migrations:**
    Drizzle ORM uses migration files to keep the database schema in sync with the code.
    
    First, generate the migration files:
    ```bash
    npm run db:generate
    ```
    Then, apply the migrations to your database:
    ```bash
    npm run db:migrate
    ```

5.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application should now be running at [http://localhost:9002](http://localhost:9002).

## 📂 Project Structure

```
.
├── src
│   ├── app/                # Next.js App Router pages and layouts
│   │   ├── (pages)/        # Route groups for different sections
│   │   └── layout.tsx      # Root layout
│   │   └── page.tsx        # Homepage
│   ├── ai/                 # Genkit AI flows and configuration
│   ├── components/         # Reusable React components (UI, layout, etc.)
│   ├── lib/                # Helper functions, constants, database schema
│   │   ├── schema.ts       # Drizzle ORM schema definitions
│   │   └── constants.ts    # Application-wide constants
│   └── hooks/              # Custom React hooks
├── drizzle/                # Drizzle ORM migration files
└── public/                 # Static assets
```
