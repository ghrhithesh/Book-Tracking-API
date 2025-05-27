import { randomUUID } from 'crypto';
import {
  Book,
  BookStatus,
  CreateBookRequest,
  UpdateBookRequest,
} from '../types/book.types';

// In-memory data store (simulates a database)
class BookStore {
  private books: Map<string, Book> = new Map();

  // Add a new book
  create(bookData: CreateBookRequest): Book {
    const newBook: Book = {
      id: randomUUID(),
      title: bookData.title,
      author: bookData.author,
      status: BookStatus.AVAILABLE,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.books.set(newBook.id, newBook);
    return newBook;
  }

  // Get all books
  findAll(): Book[] {
    return Array.from(this.books.values());
  }

  // Get book by ID
  findById(id: string): Book | undefined {
    return this.books.get(id);
  }

  // Update book details (title/author)
  update(id: string, updateData: UpdateBookRequest): Book | undefined {
    const book = this.books.get(id);
    if (!book) {
      return undefined;
    }

    if (updateData.title === undefined && updateData.author === undefined) {
      return book;
    }

    const updatedBook: Book = {
      ...book,
      title: updateData.title !== undefined ? updateData.title : book.title,
      author: updateData.author !== undefined ? updateData.author : book.author,
      updatedAt: new Date(),
    };

    this.books.set(id, updatedBook);
    return updatedBook;
  }

  // Mark book as checked out
  checkout(id: string): Book | undefined {
    const book = this.books.get(id);
    if (!book) {
      return undefined;
    }

    if (book.status === BookStatus.CHECKED_OUT) {
      throw new Error('Book is already checked out');
    }

    const updatedBook: Book = {
      ...book,
      status: BookStatus.CHECKED_OUT,
      checkedOutAt: new Date(),
      updatedAt: new Date(),
    };

    this.books.set(id, updatedBook);
    return updatedBook;
  }

  // Mark book as returned
  return(id: string): Book | undefined {
    const book = this.books.get(id);
    if (!book) {
      return undefined;
    }

    if (book.status === BookStatus.AVAILABLE) {
      throw new Error('Book is already available');
    }

    const updatedBook: Book = {
      ...book,
      status: BookStatus.AVAILABLE,
      returnedAt: new Date(),
      updatedAt: new Date(),
    };

    this.books.set(id, updatedBook);
    return updatedBook;
  }

  // Clear all books (useful for testing)
  clear(): void {
    this.books.clear();
  }
}

// Export singleton instance
export const bookStore = new BookStore();