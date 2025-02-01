import { useState, useEffect, useCallback } from "react";
import { Book } from "../types";
import { booksAPI } from "../services/api";
import { message } from "antd";

export const useBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true);
      const data = await booksAPI.getAll();
      setBooks(data);
      setError(null);
    } catch (err) {
      setError("Kitoblarni yuklashda xatolik yuz berdi");
      message.error("Kitoblarni yuklashda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const addBook = async (book: any) => {
    try {
      const newBook: Book = {
        ...book,
        id: Math.max(...books.map((b) => b.id), 0) + 1,
        rating: 0,
        totalRatings: 0,
        available: true,
      };
      const updatedBooks = [...books, newBook];
      await booksAPI.update(updatedBooks);
      setBooks(updatedBooks);
      message.success("Yangi kitob qo'shildi");
      return newBook;
    } catch (err) {
      message.error("Kitob qo'shishda xatolik yuz berdi");
      throw err;
    }
  };

  const updateBook = async (id: number, updates: Partial<Book>) => {
    try {
      const updatedBooks = books.map((book) =>
        book.id === id ? { ...book, ...updates } : book
      );
      await booksAPI.update(updatedBooks);
      setBooks(updatedBooks);
      message.success("Kitob muvaffaqiyatli yangilandi");
    } catch (err) {
      message.error("Kitobni yangilashda xatolik yuz berdi");
      throw err;
    }
  };

  const deleteBook = async (id: number) => {
    try {
      const updatedBooks = books.filter((book) => book.id !== id);
      await booksAPI.update(updatedBooks);
      setBooks(updatedBooks);
      message.success("Kitob o'chirildi");
    } catch (err) {
      message.error("Kitobni o'chirishda xatolik yuz berdi");
      throw err;
    }
  };

  const reserveBook = async (id: number) => {
    try {
      await booksAPI.reserve(id);
      setBooks(
        books.map((book) =>
          book.id === id ? { ...book, available: false } : book
        )
      );
      message.success("Kitob band qilindi");
    } catch (err) {
      message.error("Kitobni band qilishda xatolik yuz berdi");
      throw err;
    }
  };

  const rateBook = async (id: number, rating: number) => {
    try {
      await booksAPI.rate(id, rating);
      const updatedBooks = await booksAPI.getAll();
      setBooks(updatedBooks);
      message.success("Bahoyingiz qabul qilindi");
    } catch (err) {
      message.error("Kitobni baholashda xatolik yuz berdi");
      throw err;
    }
  };

  return {
    books,
    loading,
    error,
    addBook,
    updateBook,
    deleteBook,
    reserveBook,
    rateBook,
    refreshBooks: fetchBooks,
  };
};
