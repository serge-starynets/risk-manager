# Risk Manager

A full-stack web application for managing organizational and corporate risks. Users can create, edit, and remove risks as well as risk categories. The application supports filtering risks and categories by creator, allowing users to view either all items or only those they've created.

## Features

-   **Risk Management**: Create, edit, and delete risks with descriptions and categories
-   **Category Management**: Organize risks using custom categories
-   **User Filtering**: Switch between viewing all risks/categories or only those created by the current user
-   **Real-time Updates**: GraphQL API with efficient data loading using DataLoader
-   **Pagination**: Cursor-based pagination for efficient data retrieval
-   **Modern UI**: Built with React and Tailwind CSS for a responsive, modern interface
-   **Simple Authentication**: Username-based identification (no complex authentication required)

## Tech Stack

### Frontend

-   **TypeScript** - Type-safe JavaScript
-   **React 19** - UI library
-   **Vite** - Build tool and dev server
-   **Apollo Client** - GraphQL client
-   **Tailwind CSS** - Utility-first CSS framework
-   **React Toastify** - Toast notifications

### Backend

-   **Node.js** - Runtime environment
-   **TypeScript** - Type-safe JavaScript
-   **Apollo Server** - GraphQL server
-   **MongoDB** - Database (via MongoDB Atlas)
-   **Mongoose** - MongoDB object modeling
-   **DataLoader** - Efficient batching and caching for GraphQL resolvers

## Project Structure

```
risk-manager/
├── risk-manager-frontend/     # React frontend application
│   ├── src/
│   │   ├── api/               # Apollo Client setup and GraphQL queries
│   │   ├── components/        # React components
│   │   ├── contexts/          # React contexts (UserContext)
│   │   └── constants/         # Application constants
│   └── package.json
│
├── risk-manager-server/       # GraphQL backend server
│   ├── src/
│   │   ├── models/            # Mongoose models (Risk, Category)
│   │   ├── resolvers.ts       # GraphQL resolvers
│   │   ├── schema.ts          # GraphQL schema
│   │   ├── dataLoader.ts      # DataLoader implementation
│   │   ├── db.ts              # Database connection
│   │   ├── server.ts          # Apollo Server setup
│   │   └── scripts/           # Seed scripts for database
│   └── package.json
│
└── README.md
```

## Prerequisites

-   **Node.js** (version specified in `.nvmrc` files)
-   **npm** or **yarn**
-   **MongoDB Atlas** account (or local MongoDB instance)
-   **Git**

## Installation

1. **Clone the repository**

    ```bash
    git clone <repository-url>
    cd risk-manager
    ```

2. **Install frontend dependencies**

    ```bash
    cd risk-manager-frontend
    npm install
    ```

3. **Install backend dependencies**
    ```bash
    cd ../risk-manager-server
    npm install
    ```

## Configuration

### Backend Configuration

1. Navigate to `risk-manager-server/`
2. Create a `.env` file (you can use `.env.example` as a template)
3. Add your MongoDB connection string:
    ```env
    MONGODB_URI=your_mongodb_atlas_connection_string
    PORT=4000
    ```

### Frontend Configuration

1. Navigate to `risk-manager-frontend/`
2. Create a `.env` file (you can use `.env.example` as a template)
3. Configure the GraphQL endpoint:
    ```env
    VITE_GRAPHQL_URL=http://localhost:4000
    ```

## Running the Application

### Development Mode

1. **Start the backend server**

    ```bash
    cd risk-manager-server
    npm run dev
    ```

    The GraphQL server will start on `http://localhost:4000` (or the port specified in your `.env` file).

2. **Start the frontend development server**
    ```bash
    cd risk-manager-frontend
    npm run dev
    ```
    The frontend will be available at `http://localhost:5173` (or the port Vite assigns).

### Production Build

1. **Build the frontend**

    ```bash
    cd risk-manager-frontend
    npm run build
    ```

2. **Build the backend**
    ```bash
    cd risk-manager-server
    npm run build
    npm start
    ```

## Available Scripts

### Frontend Scripts

-   `npm run dev` - Start development server
-   `npm run build` - Build for production
-   `npm run preview` - Preview production build
-   `npm run lint` - Run ESLint

### Backend Scripts

-   `npm run dev` - Start development server with hot reload
-   `npm start` - Start production server
-   `npm run build` - Compile TypeScript
-   `npm run seed` - Seed database with sample data
-   `npm run seed-large` - Seed database with large dataset
-   `npm test` - Run tests

## Database Seeding

The project includes seed scripts to populate the database with sample data:

```bash
cd risk-manager-server
npm run seed        # Seed with standard dataset
npm run seed-large  # Seed with large dataset for performance testing
```

## Testing

Run the backend integration tests suite:

```bash
cd risk-manager-server
npm test
```
