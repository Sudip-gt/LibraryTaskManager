import mongoose from "mongoose";
import Book, { IBook } from "../models/Book";

const books: Partial<IBook>[] = [
    {
        title: "Clean Code",
        author: "Robert C. Martin",
        description: "A handbook of agile software craftsmanship.",
        available: true,
        borrowFee: 50,
        isBorrowed: false,
        borrowedBy: null,
        borrowedAt: null,
    },
    {
        title: "The Pragmatic Programmer",
        author: "Andrew Hunt & David Thomas",
        description: "Journey to mastery for modern programmers.",
        available: true,
        borrowFee: 40,
        isBorrowed: false,
        borrowedBy: null,
        borrowedAt: null,
    },
    {
        title: "Design Patterns",
        author: "Erich Gamma et al.",
        description: "Elements of reusable object-oriented software.",
        available: false,
        borrowFee: 60,
        isBorrowed: true,
        borrowedBy: null,
        borrowedAt: new Date(),
    },
    {
        title: "Introduction to Algorithms",
        author: "Thomas H. Cormen et al.",
        description: "Comprehensive guide to algorithms.",
        available: true,
        borrowFee: 55,
        isBorrowed: false,
        borrowedBy: null,
        borrowedAt: null,
    },
    {
        title: "Refactoring",
        author: "Martin Fowler",
        description: "Improving the design of existing code.",
        available: true,
        borrowFee: 45,
        isBorrowed: false,
        borrowedBy: null,
        borrowedAt: null,
    },
    {
        title: "Head First Design Patterns",
        author: "Eric Freeman & Elisabeth Robson",
        description: "A brain-friendly guide to building extensible and maintainable object-oriented software.",
        available: true,
        borrowFee: 35,
        isBorrowed: false,
        borrowedBy: null,
        borrowedAt: null,
    },
    {
        title: "You Don't Know JS: Scope & Closures",
        author: "Kyle Simpson",
        description: "Deep dive into JavaScript core mechanisms.",
        available: true,
        borrowFee: 25,
        isBorrowed: false,
        borrowedBy: null,
        borrowedAt: null,
    },
    {
        title: "Eloquent JavaScript",
        author: "Marijn Haverbeke",
        description: "A modern introduction to programming.",
        available: true,
        borrowFee: 30,
        isBorrowed: false,
        borrowedBy: null,
        borrowedAt: null,
    },
    {
        title: "The Mythical Man-Month",
        author: "Frederick P. Brooks Jr.",
        description: "Essays on software engineering.",
        available: true,
        borrowFee: 20,
        isBorrowed: false,
        borrowedBy: null,
        borrowedAt: null,
    },
    {
        title: "Code Complete",
        author: "Steve McConnell",
        description: "A practical handbook of software construction.",
        available: true,
        borrowFee: 50,
        isBorrowed: false,
        borrowedBy: null,
        borrowedAt: null,
    },
    {
        title: "Structure and Interpretation of Computer Programs",
        author: "Harold Abelson & Gerald Jay Sussman",
        description: "Foundational text in computer science.",
        available: true,
        borrowFee: 65,
        isBorrowed: false,
        borrowedBy: null,
        borrowedAt: null,
    },
    {
        title: "Cracking the Coding Interview",
        author: "Gayle Laakmann McDowell",
        description: "189 programming questions and solutions.",
        available: true,
        borrowFee: 35,
        isBorrowed: false,
        borrowedBy: null,
        borrowedAt: null,
    },
    {
        title: "System Design Interview",
        author: "Alex Xu",
        description: "Insider's guide to system design interviews.",
        available: true,
        borrowFee: 40,
        isBorrowed: false,
        borrowedBy: null,
        borrowedAt: null,
    },
];

export const seedBooks = async () => {
    try {
        await Book.deleteMany();
        await Book.insertMany(books);

        console.log("Books seeded successfully");
    } catch (error) {
        console.error("Error seeding books:", error);
    }
};
