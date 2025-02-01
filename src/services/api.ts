import {
  Book,
  Order,
  User,
  LoginCredentials,
  UserProfile,
  CreateUserData,
} from "../types";
import { initialBooks, initialOrders } from "../data/mockData";

const STORAGE_KEYS = {
  BOOKS: "library_books",
  ORDERS: "library_orders",
  AUTH: "library_auth",
  USERS: "library_users",
  PASSWORDS: "library_passwords",
} as const;

const INITIAL_ADMIN: UserProfile = {
  id: 1,
  email: "admin@lib.uz",
  fullName: "Islomjon Ergashev",
  role: "admin",
  phoneNumber: "+998901234567",
  address: "Tashkent",
  createdAt: "2025-01-01",
  status: "active",
};

const INITIAL_PASSWORDS = {
  "admin@lib.uz": "admin123",
};

const getStorageItem = <T>(key: string, initialData: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : initialData;
  } catch (error) {
    console.error(`Error reading from localStorage: ${key}`, error);
    return initialData;
  }
};

const setStorageItem = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error writing to localStorage: ${key}`, error);
  }
};

export const usersAPI = {
  getAll: async (): Promise<UserProfile[]> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return getStorageItem<UserProfile[]>(STORAGE_KEYS.USERS, [INITIAL_ADMIN]);
  },

  create: async (
    userData: CreateUserData,
    creatorId: number
  ): Promise<UserProfile> => {
    const users = await usersAPI.getAll();
    const passwords = getStorageItem<Record<string, string>>(
      STORAGE_KEYS.PASSWORDS,
      INITIAL_PASSWORDS
    );

    if (users.some((u) => u.email === userData.email)) {
      throw new Error("Bu email allaqachon ro'yxatdan o'tgan");
    }

    const creator = users.find((u) => u.id === creatorId);
    if (!creator) {
      throw new Error("Yaratuvchi foydalanuvchi topilmadi");
    }

    if (creator.role === "operator" && userData.role !== "user") {
      throw new Error("Operator faqat oddiy foydalanuvchilarni yarata oladi");
    }

    const newUser: UserProfile = {
      ...userData,
      id: Math.max(...users.map((u) => u.id), 0) + 1,
      createdAt: new Date().toISOString(),
      createdBy: creatorId,
      status: "active",
    };

    passwords[userData.email] = userData.password;
    setStorageItem(STORAGE_KEYS.PASSWORDS, passwords);

    const updatedUsers = [...users, newUser];
    setStorageItem(STORAGE_KEYS.USERS, updatedUsers);
    return newUser;
  },

  update: async (
    id: number,
    updates: Partial<UserProfile>
  ): Promise<UserProfile> => {
    const users = await usersAPI.getAll();
    const userIndex = users.findIndex((u) => u.id === id);

    if (userIndex === -1) {
      throw new Error("Foydalanuvchi topilmadi");
    }

    if (
      updates.email &&
      users.some((u) => u.email === updates.email && u.id !== id)
    ) {
      throw new Error("Bu email allaqachon ro'yxatdan o'tgan");
    }

    const updatedUser = { ...users[userIndex], ...updates };
    users[userIndex] = updatedUser;
    await setStorageItem(STORAGE_KEYS.USERS, users);
    return updatedUser;
  },

  delete: async (id: number): Promise<void> => {
    const users = await usersAPI.getAll();
    const updatedUsers = users.filter((u) => u.id !== id);
    await setStorageItem(STORAGE_KEYS.USERS, updatedUsers);
  },

  blockUser: async (id: number): Promise<void> => {
    await usersAPI.update(id, { status: "blocked" });
  },

  unblockUser: async (id: number): Promise<void> => {
    await usersAPI.update(id, { status: "active" });
  },
};

export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<User> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const users = await usersAPI.getAll();
    const passwords = getStorageItem<Record<string, string>>(
      STORAGE_KEYS.PASSWORDS,
      INITIAL_PASSWORDS
    );

    const user = users.find((u) => u.email === credentials.email);

    if (!user) {
      throw new Error("Email yoki parol noto'g'ri");
    }

    if (user.status === "blocked") {
      throw new Error("Sizning akkauntingiz bloklangan");
    }

    const savedPassword = passwords[credentials.email];
    if (!savedPassword || savedPassword !== credentials.password) {
      throw new Error("Email yoki parol noto'g'ri");
    }

    const { createdAt, createdBy, status, ...userWithoutMeta } = user;
    setStorageItem(STORAGE_KEYS.AUTH, userWithoutMeta);
    return userWithoutMeta;
  },

  logout: async (): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    localStorage.removeItem(STORAGE_KEYS.AUTH);
  },

  getCurrentUser: (): User | null => {
    return getStorageItem<User | null>(STORAGE_KEYS.AUTH, null);
  },
};

export const booksAPI = {
  getAll: async (): Promise<Book[]> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return getStorageItem<Book[]>(STORAGE_KEYS.BOOKS, initialBooks);
  },

  update: async (books: Book[]): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    setStorageItem(STORAGE_KEYS.BOOKS, books);
  },

  reserve: async (bookId: number): Promise<void> => {
    const books = await booksAPI.getAll();
    const updatedBooks = books.map((book) =>
      book.id === bookId ? { ...book, available: false } : book
    );
    await booksAPI.update(updatedBooks);
  },

  unreserve: async (bookId: number): Promise<void> => {
    const books = await booksAPI.getAll();
    const updatedBooks = books.map((book) =>
      book.id === bookId ? { ...book, available: true } : book
    );
    await booksAPI.update(updatedBooks);
  },

  rate: async (bookId: number, rating: number): Promise<void> => {
    const books = await booksAPI.getAll();
    const updatedBooks = books.map((book) => {
      if (book.id === bookId) {
        const newTotalRatings = book.totalRatings + 1;
        const newRating =
          (book.rating * book.totalRatings + rating) / newTotalRatings;
        return {
          ...book,
          rating: Number(newRating.toFixed(1)),
          totalRatings: newTotalRatings,
        };
      }
      return book;
    });
    await booksAPI.update(updatedBooks);
  },
};

export const ordersAPI = {
  getAll: async (): Promise<Order[]> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return getStorageItem<Order[]>(STORAGE_KEYS.ORDERS, initialOrders);
  },

  checkStaleReservations: async (): Promise<void> => {
    const orders = await ordersAPI.getAll();
    const currentDate = new Date();
    
    const updatedOrders = orders.map(order => {
      if (order.status === "active") {
        const reservationDate = new Date(order.reservationDate);
        const hoursSinceReservation = (currentDate.getTime() - reservationDate.getTime()) / (1000 * 60 * 60);
        
        if (hoursSinceReservation > 24) {
          return { ...order, status: "cancelled" as const };
        }
      }
      return order;
    });

    if (orders.length !== updatedOrders.length) {
      await ordersAPI.update(updatedOrders);
      
      const cancelledOrders = updatedOrders.filter(
        (order, index) => order.status === "cancelled" && orders[index].status === "active"
      );
      
      for (const order of cancelledOrders) {
        await booksAPI.unreserve(order.bookId);
      }
    }
  },

  update: async (orders: Order[]): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    setStorageItem(STORAGE_KEYS.ORDERS, orders);
  },

  create: async (order: Omit<Order, "id">): Promise<Order> => {
    const orders = await ordersAPI.getAll();
    const newOrder = {
      ...order,
      id: Math.max(...orders.map((o) => o.id), 0) + 1,
    };
    await ordersAPI.update([...orders, newOrder]);
    return newOrder;
  },

  pickup: async (orderId: number): Promise<void> => {
    const orders = await ordersAPI.getAll();
    const currentDate = new Date().toISOString().split("T")[0];

    const updatedOrders = orders.map((order) =>
      order.id === orderId && order.status === "active"
        ? { ...order, status: "picked_up" as const, startDate: currentDate }
        : order
    );

    await ordersAPI.update(updatedOrders);
  },

  return: async (orderId: number): Promise<void> => {
    const orders = await ordersAPI.getAll();
    const currentDate = new Date().toISOString().split("T")[0];

    const updatedOrders = orders.map((order) =>
      order.id === orderId && order.status === "picked_up"
        ? { ...order, status: "returned" as const, returnedDate: currentDate }
        : order
    );

    await ordersAPI.update(updatedOrders);

    const returnedOrder = updatedOrders.find((o) => o.id === orderId);
    if (returnedOrder) {
      await booksAPI.unreserve(returnedOrder.bookId);
    }
  },

  calculateFine: (order: Order): number => {
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
  },
};
