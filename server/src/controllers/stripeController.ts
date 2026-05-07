import { Request, Response } from 'express';
import mongoose from 'mongoose';
import stripe from '../config/stripe';
import { JwtPayload } from '../middleware/auth';
import Book from '../models/Book';
import Task from '../models/Task';

/**
 * Idempotent post-payment processing: marks book as borrowed and creates return task.
 */
async function processSuccessfulPayment(bookId: string, userId: string) {
  const book = await Book.findById(bookId);
  if (!book) throw new Error('Book not found');

  if (!book.isBorrowed) {
    book.isBorrowed = true;
    book.borrowedBy = new mongoose.Types.ObjectId(userId);
    book.borrowedAt = new Date();
    await book.save();
  }

  let task = await Task.findOne({ user: userId, relatedBook: bookId });
  if (!task) {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);
    task = await Task.create({
      user: userId,
      title: `Return "${book.title}" by ${dueDate.toDateString()}`,
      relatedBook: bookId,
      dueDate,
    });
  }

  return { book, task };
}

export const createCheckoutSession = async (
  req: Request & { user?: JwtPayload },
  res: Response
) => {
  const { bookId } = req.body;
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!bookId || !mongoose.Types.ObjectId.isValid(bookId)) {
    return res.status(400).json({ error: 'Invalid book ID' });
  }

  try {
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    if (book.isBorrowed) return res.status(400).json({ error: 'Book is already borrowed' });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      metadata: {
        bookId: book.id,
        userId,
      },
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
      locale: 'en',
      success_url: `${process.env.CLIENT_URL || 'https://library-task-manager-3cs9hef8z-sudip-gts-projects.vercel.app/'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL || 'https://library-task-manager-3cs9hef8z-sudip-gts-projects.vercel.app/'}/cancel`,
    });

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Stripe Checkout Error:', error);
    return res.status(500).json({ error: 'Failed to create Stripe session' });
  }
};

export const handleStripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return res.status(400).json({ error: 'Missing signature or webhook secret' });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: 'Invalid signature' });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { bookId, userId } = session.metadata || {};

    if (bookId && userId) {
      try {
        await processSuccessfulPayment(bookId, userId);
        console.log(`Webhook: Book ${bookId} borrowed by user ${userId}`);
      } catch (error) {
        console.error('Webhook processing error:', error);
      }
    }
  }

  res.json({ received: true });
};

export const verifyCheckoutSession = async (
  req: Request & { user?: JwtPayload },
  res: Response
) => {
  const { session_id } = req.query;
  const userId = req.user?.userId;

  if (!session_id || typeof session_id !== 'string') {
    return res.status(400).json({ error: 'Missing session_id' });
  }

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status !== 'paid') {
      return res.status(400).json({ error: 'Payment not completed' });
    }

    const bookId = session.metadata?.bookId;
    const sessionUserId = session.metadata?.userId;

    if (!bookId || sessionUserId !== userId) {
      return res.status(403).json({ error: 'Session does not belong to this user' });
    }

    const { book, task } = await processSuccessfulPayment(bookId, userId);
    return res.status(200).json({ book, task });
  } catch (error) {
    console.error('Session verification error:', error);
    return res.status(500).json({ error: 'Failed to verify session' });
  }
};
