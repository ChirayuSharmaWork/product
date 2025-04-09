# Product Management Web App

A full-stack product management application built with Next.js, TypeScript, and Neon DB (PostgreSQL).

## Features

- User Authentication (JWT-based)
  - User Signup
  - User Login
  - Logout functionality
  - Protected routes

- Product Management
  - Create Product
  - View all products
  - Update product
  - Delete product

- Product Filtering & Search
  - Filter products by category, price range, or rating
  - Search products by name or description

## Tech Stack

- Frontend: React.js with Next.js
- Backend: Next.js API Routes
- Database: PostgreSQL (Neon DB)
- ORM: Prisma
- Authentication: JWT (jose)
- Styling: Tailwind CSS with shadcn/ui components

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Neon DB account

### Installation

1. Clone the repository
2. Install dependencies
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. Set up environment variables
   Create a `.env` file in the root directory with the following variables:
   \`\`\`
   DATABASE_URL=your_neon_db_connection_string
   JWT_SECRET=your_jwt_secret
   \`\`\`

4. Run Prisma migrations
   \`\`\`bash
   npx prisma migrate dev
   \`\`\`

5. Seed the database (optional)
   \`\`\`bash
   npm run seed
   # or
   yarn seed
   \`\`\`

6. Start the development server
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

7. Open [http://localhost:3000](http://localhost:3000) in your browser

## Default Users

After running the seed script, you can log in with these credentials:

- Admin User:
  - Email: admin@example.com
  - Password: admin123

- Regular User:
  - Email: user@example.com
  - Password: user123


