// Book status enum for type safety
export enum BookStatus {
  AVAILABLE = "available",
  CHECKED_OUT = "checked_out",
}

// Main Book interface
export interface Book {
  id: string;
  title: string;
  author: string;
  status: BookStatus;
  createdAt: Date;
  updatedAt: Date;
  checkedOutAt?: Date | undefined;
  returnedAt?: Date | undefined;
}

// Interface for creating a new book (without auto-generated fields)
export interface CreateBookRequest {
  title: string;
  author: string;
}

// Interface for updating book details
export interface UpdateBookRequest {
  title?: string | undefined;
  author?: string | undefined;
}

// API Response interfaces
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface ApiError {
  success: false;
  message: string;
  statusCode: number;
}
