import express from 'express';
import {
  createBook,
  deleteBook,
  getAllBooks,
  getBookById,
  updateBook
} from '../controllers/bookController';
import { borrowBook, returnBook } from '../controllers/borrowBookController';
import { authenticate, requireAdmin } from '../middleware/auth';
import { createBookSchema, updateBookSchema } from '../middleware/schemas';
import { validate } from '../middleware/validate';

const router = express.Router();

router.get('/', getAllBooks);
router.get('/:id', getBookById);

///////////////// ADMIN ROUTES
router.post('/', authenticate, requireAdmin, validate(createBookSchema), createBook);
router.put('/:id', authenticate, requireAdmin, validate(updateBookSchema), updateBook);
router.delete('/:id', authenticate, requireAdmin, deleteBook);

/////////////////borrowing routes
router.post('/borrow/:id', authenticate, borrowBook);
router.put('/return/:id', authenticate, returnBook);

export default router;
