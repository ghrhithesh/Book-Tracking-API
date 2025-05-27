# Book Tracking API

A simple RESTful API for tracking books in a small library. Built with TypeScript, Node.js, and Express.

## Features

-  Add new books to the library
-  List all books with their current status
-  Get details of a specific book
-  Update book information (title and author)
-  Check out books to patrons
-  Mark books as returned
-  Strong TypeScript typing throughout
-  Input validation with Zod
-  Comprehensive error handling
-  Unit tests for all endpoints

## Tech Stack

- **Runtime**: Node.js ≥ 18
- **Language**: TypeScript ≥ 5
- **Framework**: Express.js
- **Validation**: Zod
- **Testing**: Jest + Supertest
- **Code Quality**: ESLint + Prettier

## Quick Start

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd book-tracking-api
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:3000`

### Available Scripts

```bash
# Development
npm run dev          # Start development server with hot reload
npm run build        # Build TypeScript to JavaScript
npm run start        # Start production server

# Testing
npm test             # Run all tests
npm run test:watch   # Run tests in watch mode

# Code Quality
npm run lint         # Check code with ESLint
npm run lint:fix     # Fix ESLint issues automatically
npm run format       # Format code with Prettier
```

## API Endpoints

### Base URL: `http://localhost:3000`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check endpoint |
| POST | `/books` | Add a new book |
| GET | `/books` | Get all books |
| GET | `/books/:id` | Get a specific book |
| PATCH | `/books/:id` | Update book details |
| PATCH | `/books/:id/checkout` | Check out a book |
| PATCH | `/books/:id/return` | Return a book |

## API Usage Examples

### 1. Add a New Book

```bash
curl -X POST http://localhost:3000/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "status": "available",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "message": "Book created successfully"
}
```

### 2. Get All Books

```bash
curl http://localhost:3000/books
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "title": "The Great Gatsby",
      "author": "F. Scott Fitzgerald",
      "status": "available",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "message": "Retrieved 1 books"
}
```

### 3. Get a Specific Book

```bash
curl http://localhost:3000/books/123e4567-e89b-12d3-a456-426614174000
```

### 4. Update Book Details

```bash
curl -X PATCH http://localhost:3000/books/123e4567-e89b-12d3-a456-426614174000 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Great Gatsby - Updated Edition"
  }'
```

### 5. Check Out a Book

```bash
curl -X PATCH http://localhost:3000/books/123e4567-e89b-12d3-a456-426614174000/checkout
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "status": "checked_out",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z",
    "checkedOutAt": "2024-01-15T11:00:00.000Z"
  },
  "message": "Book checked out successfully"
}
```

### 6. Return a Book

```bash
curl -X PATCH http://localhost:3000/books/123e4567-e89b-12d3-a456-426614174000/return
```

## Book Status

Books can have one of two statuses:
- `available` - The book is available for checkout
- `checked_out` - The book is currently checked out

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors, business logic errors)
- `404` - Not Found
- `500` - Internal Server Error

**Error Response Format:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "title",
      "message": "Title is required"
    }
  ]
}
```

## Project Structure

```
src/
├── __tests__/           # Test files
│   └── books.test.ts
├── controllers/         # Request handlers
│   └── bookController.ts
├── middleware/          # Express middleware
│   ├── errorHandler.ts
│   └── validation.ts
├── routes/             # Route definitions
│   └── bookRoutes.ts
├── services/           # Business logic
│   └── bookService.ts
├── types/              # TypeScript type definitions
│   └── book.types.ts
├── validation/         # Zod schemas
│   └── schemas.ts
├── app.ts              # Express app setup
└── index.ts            # Server entry point
```

## Development Notes

### Data Persistence
- Books are stored in memory using a Map data structure
- Data is lost when the server restarts
- This is intentional for the scope of this assignment

### TypeScript Configuration
- Strict mode enabled for maximum type safety
- ESLint configured with Airbnb TypeScript rules
- Prettier for consistent code formatting

### Testing
- Comprehensive tests for all endpoints
- Happy path and error scenarios covered
- Uses Jest and Supertest for API testing

## Design Decisions

1. **In-Memory Storage**: Used Map for simplicity and performance. In production, this would be replaced with a database.

2. **UUID for IDs**: Used Node.js built-in `crypto.randomUUID()` for generating unique book IDs.

3. **Strong Typing**: Extensive TypeScript interfaces and enums for type safety.

4. **Validation**: Zod schemas for runtime validation of request data.

5. **Error Handling**: Centralized error handling with custom error classes.

6. **Separation of Concerns**: Clear separation between routes, controllers, services, and validation.

## Future Enhancements

- Database integration (PostgreSQL, MongoDB)
- User authentication and authorization
- Book categories and tags
- Due dates for checked-out books
- Search and filtering capabilities
- Pagination for large book collections

## License

MIT License
