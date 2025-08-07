import express from 'express';
import {
  createBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook
} from '../controllers/bookController';
import { authenticate, requireAdmin } from '../middleware/auth';
import { borrowBook, returnBook } from '../controllers/borrowBookController';

const router = express.Router();

router.get('/', getAllBooks);
router.get('/:id', getBookById);

///////////////// ADMIN ROUTES
router.post('/', authenticate, requireAdmin, createBook);
router.put('/:id', authenticate, requireAdmin, updateBook);
router.delete('/:id', authenticate, requireAdmin, deleteBook);

/////////////////borrowing routes
router.post('/borrow/:id', authenticate, borrowBook);
router.put('/return/:id', authenticate, returnBook);

export default router;
