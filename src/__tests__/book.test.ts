import request from "supertest";
import app from "../app";
import { bookStore } from "../services/bookService";
import { BookStatus } from "../types/book.types";

// Test data
const sampleBook = {
  title: "The Great Gatsby",
  author: "F. Scott Fitzgerald",
};

const sampleBook2 = {
  title: "1984",
  author: "George Orwell",
};

describe("Book API Endpoints", () => {
  // Clear database before each test
  beforeEach(() => {
    bookStore.clear();
  });

  describe("POST /books", () => {
    it("should create a new book successfully", async () => {
      const response = await request(app)
        .post("/books")
        .send(sampleBook)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toMatchObject({
        title: sampleBook.title,
        author: sampleBook.author,
        status: BookStatus.AVAILABLE,
      });
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.createdAt).toBeDefined();
    });

    it("should return 400 for invalid book data", async () => {
      const response = await request(app)
        .post("/books")
        .send({ title: "" }) // Missing author and empty title
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Validation failed");
    });
  });

  describe("GET /books", () => {
    it("should return all books", async () => {
      // Create test books
      await request(app).post("/books").send(sampleBook);
      await request(app).post("/books").send(sampleBook2);

      const response = await request(app).get("/books").expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.message).toBe("Retrieved 2 books");
    });

    it("should return empty array when no books exist", async () => {
      const response = await request(app).get("/books").expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(0);
      expect(response.body.message).toBe("Retrieved 0 books");
    });
  });

  describe("GET /books/:id", () => {
    it("should return a specific book by ID", async () => {
      // Create a book first
      const createResponse = await request(app).post("/books").send(sampleBook);

      const bookId = createResponse.body.data.id;

      const response = await request(app).get(`/books/${bookId}`).expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(bookId);
      expect(response.body.data.title).toBe(sampleBook.title);
    });

    it("should return 404 for non-existent book", async () => {
      const fakeId = "123e4567-e89b-12d3-a456-426614174000";
      const response = await request(app).get(`/books/${fakeId}`).expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Book not found");
    });
  });

  describe("PATCH /books/:id", () => {
    it("should update book details", async () => {
      // Create a book first
      const createResponse = await request(app).post("/books").send(sampleBook);

      const bookId = createResponse.body.data.id;
      const updateData = { title: "Updated Title" };

      const response = await request(app)
        .patch(`/books/${bookId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe("Updated Title");
      expect(response.body.data.author).toBe(sampleBook.author); // Should remain unchanged
    });

    it("should return 404 for non-existent book", async () => {
      const fakeId = "123e4567-e89b-12d3-a456-426614174000";
      const response = await request(app)
        .patch(`/books/${fakeId}`)
        .send({ title: "New Title" })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Book not found");
    });
  });

  describe("PATCH /books/:id/checkout", () => {
    it("should checkout an available book", async () => {
      // Create a book first
      const createResponse = await request(app).post("/books").send(sampleBook);

      const bookId = createResponse.body.data.id;

      const response = await request(app)
        .patch(`/books/${bookId}/checkout`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe(BookStatus.CHECKED_OUT);
      expect(response.body.data.checkedOutAt).toBeDefined();
      expect(response.body.message).toBe("Book checked out successfully");
    });

    it("should return 400 when trying to checkout already checked out book", async () => {
      // Create and checkout a book
      const createResponse = await request(app).post("/books").send(sampleBook);

      const bookId = createResponse.body.data.id;

      // First checkout
      await request(app).patch(`/books/${bookId}/checkout`).expect(200);

      // Second checkout should fail
      const response = await request(app)
        .patch(`/books/${bookId}/checkout`)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Book is already checked out");
    });
  });

  describe("PATCH /books/:id/return", () => {
    it("should return a checked out book", async () => {
      // Create and checkout a book
      const createResponse = await request(app).post("/books").send(sampleBook);

      const bookId = createResponse.body.data.id;

      await request(app).patch(`/books/${bookId}/checkout`).expect(200);

      // Now return the book
      const response = await request(app)
        .patch(`/books/${bookId}/return`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe(BookStatus.AVAILABLE);
      expect(response.body.data.returnedAt).toBeDefined();
      expect(response.body.message).toBe("Book returned successfully");
    });

    it("should return 400 when trying to return available book", async () => {
      // Create a book (but don't check it out)
      const createResponse = await request(app).post("/books").send(sampleBook);

      const bookId = createResponse.body.data.id;

      const response = await request(app)
        .patch(`/books/${bookId}/return`)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Book is already available");
    });
  });
});
