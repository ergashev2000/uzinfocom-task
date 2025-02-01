import { Book, Order } from "../types";

export const initialBooks: Book[] = [
  {
    id: 1,
    title: "O'tgan kunlar",
    author: "Abdulla Qodiriy",
    dailyPrice: 1000,
    rating: 4.5,
    totalRatings: 120,
    available: true,
  },
  {
    id: 2,
    title: "Kecha va Kunduz",
    author: "Cho'lpon",
    dailyPrice: 800,
    rating: 4.3,
    totalRatings: 85,
    available: true,
  },
  {
    id: 3,
    title: "Sariq Devni Minib",
    author: "Xudoyberdi To'xtaboyev",
    dailyPrice: 1200,
    rating: 4.7,
    totalRatings: 150,
    available: false,
  },
  {
    id: 4,
    title: "Yulduzli tunlar",
    author: "Pirimqul Qodirov",
    dailyPrice: 1500,
    rating: 4.8,
    totalRatings: 200,
    available: true,
  },
];

export const initialOrders: Order[] = [
  {
    id: 1,
    bookId: 3,
    userId: 3,
    reservationDate: "2025-02-01",
    startDate: "2025-02-01",
    endDate: "2025-02-08",
    status: "active",
    fine: 1200,
  },
  {
    id: 2,
    bookId: 1,
    userId: 3,
    reservationDate: "2025-01-25",
    startDate: "2025-01-25",
    endDate: "2025-02-01",
    returnedDate: "2025-02-03",
    status: "returned",
    fine: 1000,
  },
];
