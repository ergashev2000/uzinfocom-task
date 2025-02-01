export type UserRole = "admin" | "operator" | "user";

export interface UserProfile {
  id: number;
  email: string;
  fullName: string;
  role: UserRole;
  phoneNumber: string;
  address: string;
  passportNumber?: string;
  dateOfBirth?: string;
  createdAt: string;
  createdBy?: number;
  status: "active" | "blocked";
}

export type User = Omit<UserProfile, "createdAt" | "createdBy" | "status">;

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface CreateUserData
  extends Omit<UserProfile, "id" | "createdAt" | "createdBy" | "status"> {
  password: string;
}

export interface Book {
  id: number;
  title: string;
  author: string;
  dailyPrice: number;
  rating: number;
  totalRatings: number;
  available: boolean;
}

export interface Order {
  id: number;
  bookId: number;
  userId: number;
  reservationDate: string;
  startDate: string;
  endDate: string;
  returnedDate?: string;
  status: "active" | "picked_up" | "returned" | "cancelled";
  fine: number;
}

export interface Rating {
  id: number;
  bookId: number;
  userId: number;
  rating: number;
  date: string;
}

export interface AuthContextT {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}
