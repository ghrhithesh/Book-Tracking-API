import { Request, Response, NextFunction } from 'express';
import { bookStore } from '../services/bookService';
import { AppError } from '../middleware/errorHandler';
import { CreateBookData, UpdateBookData } from '../validation/schemas';

// Add a new book
export const createBook = async (
  req: Request<{}, {}, CreateBookData>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const book = bookStore.create(req.body);
    res.status(201).json({
      success: true,
      data: book,
      message: 'Book created successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Get all books
export const getAllBooks = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const books = bookStore.findAll();
    res.status(200).json({
      success: true,
      data: books,
      message: `Retrieved ${books.length} books`,
    });
  } catch (error) {
    next(error);
  }
};

// Get a single book by ID
export const getBookById = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const book = bookStore.findById(id);

    if (!book) {
      throw new AppError('Book not found', 404);
    }

    res.status(200).json({
      success: true,
      data: book,
      message: 'Book retrieved successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Update book details (title/author)
export const updateBook = async (
  req: Request<{ id: string }, {}, UpdateBookData>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if at least one field is provided
    if (!updateData.title && !updateData.author) {
      throw new AppError('At least one field (title or author) must be provided', 400);
    }

    const updatedBook = bookStore.update(id, updateData);

    if (!updatedBook) {
      throw new AppError('Book not found', 404);
    }

    res.status(200).json({
      success: true,
      data: updatedBook,
      message: 'Book updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Mark book as checked out
export const checkoutBook = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const book = bookStore.checkout(id);

    if (!book) {
      throw new AppError('Book not found', 404);
    }

    res.status(200).json({
      success: true,
      data: book,
      message: 'Book checked out successfully',
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Book is already checked out') {
      next(new AppError('Book is already checked out', 400));
      return;
    }
    next(error);
  }
};

// Mark book as returned
export const returnBook = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const book = bookStore.return(id);

    if (!book) {
      throw new AppError('Book not found', 404);
    }

    res.status(200).json({
      success: true,
      data: book,
      message: 'Book returned successfully',
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Book is already available') {
      next(new AppError('Book is already available', 400));
      return;
    }
    next(error);
  }
};