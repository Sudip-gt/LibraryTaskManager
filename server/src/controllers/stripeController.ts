import { Request, Response } from 'express';
import stripe from '../config/stripe';
import Book from '../models/Book'; 
import mongoose from 'mongoose';

export const createCheckoutSession = async (req: Request, res: Response) => {
  const { bookId } = req.body;

  if (!bookId || !mongoose.Types.ObjectId.isValid(bookId)) {
    return res.status(400).json({ error: 'Invalid book ID' });
  }

  try {
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    if (book.isBorrowed) {
      return res.status(400).json({ error: 'Book is already borrowed' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: book.title,
              description: `Borrowing fee for "${book.title}"`,
            },
            unit_amount: book.borrowFee * 100,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/success?bookId=${book._id}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
    });

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Stripe Checkout Error:', error);
    return res.status(500).json({ error: 'Failed to create Stripe session' });
  }
};
