import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Book from './src/models/Book';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://sudippaudel:9wayEYLu6hLCvx1w@ctsproject.vzsvyse.mongodb.net/';

const seedBooks = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    await Book.deleteMany({});
    console.log('Cleared existing books');

    const books = [
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    description: 'A story about the Jazz Age in the United States.',
    available: true,
    borrowFee: 2.5,
  },
  {
    title: '1984',
    author: 'George Orwell',
    description: 'Dystopian novel set in a totalitarian regime.',
    available: true,
    borrowFee: 3.0,
  },
  {
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    description: 'A novel about racial injustice in the Deep South.',
    available: true,
    borrowFee: 2.0,
  },
  {
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    description: 'A story about teenage alienation and rebellion.',
    available: true,
    borrowFee: 1.5,
  },
  {
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    description: 'A romantic novel of manners.',
    available: true,
    borrowFee: 2.2,
  },
  {
    title: 'Moby-Dick',
    author: 'Herman Melville',
    description: 'An epic sea story of Captain Ahab\'s obsession.',
    available: true,
    borrowFee: 2.8,
  },
  {
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    description: 'Fantasy adventure preceding The Lord of the Rings.',
    available: true,
    borrowFee: 2.0,
  },
  {
    title: 'Fahrenheit 451',
    author: 'Ray Bradbury',
    description: 'Dystopian novel about censorship and knowledge.',
    available: true,
    borrowFee: 2.7,
  },
  {
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    description: 'A philosophical story about personal legend and destiny.',
    available: true,
    borrowFee: 2.5,
  },
  {
    title: 'The Book Thief',
    author: 'Markus Zusak',
    description: 'A WWII novel narrated by Death.',
    available: true,
    borrowFee: 2.9,
  },
  {
    title: 'Brave New World',
    author: 'Aldous Huxley',
    description: 'Another dystopian classic set in a genetically engineered society.',
    available: true,
    borrowFee: 3.0,
  },
  {
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    description: 'A non-fiction book on the history of Homo sapiens.',
    available: true,
    borrowFee: 3.5,
  },
  {
    title: 'Crime and Punishment',
    author: 'Fyodor Dostoevsky',
    description: 'A psychological novel about guilt and redemption.',
    available: true,
    borrowFee: 2.5,
  },
  {
    title: 'The Road',
    author: 'Cormac McCarthy',
    description: 'A post-apocalyptic tale of a father and son.',
    available: true,
    borrowFee: 2.0,
  },
  {
    title: 'Animal Farm',
    author: 'George Orwell',
    description: 'A political satire in the form of an allegorical novella.',
    available: true,
    borrowFee: 1.8,
  },
];

    await Book.insertMany(books);
    console.log('Books seeded successfully!');
  } catch (error) {
    console.error('Error seeding books:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

seedBooks();
