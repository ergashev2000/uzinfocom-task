import { Book, Order } from "../types";
import { initialBooks, initialOrders } from "../data/mockData";

export const getBooks = (): Book[] => {
  const books = localStorage.getItem("books");
  if (!books) {
    localStorage.setItem("books", JSON.stringify(initialBooks));
    return initialBooks;
  }
  return JSON.parse(books);
};

export const setBooks = (books: Book[]) => {
  localStorage.setItem("books", JSON.stringify(books));
};

export const getOrders = (): Order[] => {
  const orders = localStorage.getItem("orders");
  if (!orders) {
    localStorage.setItem("orders", JSON.stringify(initialOrders));
    return initialOrders;
  }
  const parsedOrders = JSON.parse(orders);
  return parsedOrders.map((order: any) => ({
    ...order,
    status: order.status as "active" | "returned" | "cancelled"
  }));
};

export const setOrders = (orders: Order[]) => {
  localStorage.setItem("orders", JSON.stringify(orders));
};

export const calculateFine = (order: Order): number => {
  if (order.status !== "returned" || !order.returnedDate) return 0;

  const endDate = new Date(order.endDate);
  const returnedDate = new Date(order.returnedDate);
  const daysLate = Math.max(
    0,
    Math.floor(
      (returnedDate.getTime() - endDate.getTime()) / (1000 * 60 * 60 * 24)
    )
  );

  return Math.round(daysLate * order.fine * 0.01);
};
