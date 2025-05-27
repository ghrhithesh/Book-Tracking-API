import { Router } from 'express';
import {
  createBook,
  getAllBooks,
  getBookById,
  updateBook,
  checkoutBook,
  returnBook,
} from '../controllers/bookController';
import { validateBody, validateParams } from '../middleware/validation';
import {
  createBookSchema,
  updateBookSchema,
  bookIdSchema,
} from '../validation/schemas';

const router = Router();

// POST /books - Add a new book
router.post('/', validateBody(createBookSchema), createBook);

// GET /books - List all books
router.get('/', getAllBooks);

// GET /books/:id - Get a single book
router.get('/:id', validateParams(bookIdSchema), getBookById);

// PATCH /books/:id - Update book details
router.patch(
  '/:id',
  validateParams(bookIdSchema),
  validateBody(updateBookSchema),
  updateBook
);

// PATCH /books/:id/checkout - Mark book as checked out
router.patch('/:id/checkout', validateParams(bookIdSchema), checkoutBook);

// PATCH /books/:id/return - Mark book as returned
router.patch('/:id/return', validateParams(bookIdSchema), returnBook);

export default router;