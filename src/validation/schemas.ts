import { z } from 'zod';

// Schema for creating a new book
export const createBookSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters')
    .trim(),
  author: z
    .string()
    .min(1, 'Author is required')
    .max(100, 'Author must be less than 100 characters')
    .trim(),
});

// Schema for updating book details
export const updateBookSchema = z.object({
  title: z
    .string()
    .min(1, 'Title cannot be empty')
    .max(200, 'Title must be less than 200 characters')
    .trim()
    .optional(),
  author: z
    .string()
    .min(1, 'Author cannot be empty')
    .max(100, 'Author must be less than 100 characters')
    .trim()
    .optional(),
});

// Schema for validating book ID parameter
export const bookIdSchema = z.object({
  id: z.string().min(1, 'Book ID is required'),
});

// Type exports for use in controllers
export type CreateBookData = z.infer<typeof createBookSchema>;
export type UpdateBookData = z.infer<typeof updateBookSchema>;
export type BookIdParams = z.infer<typeof bookIdSchema>;