import { useState, useEffect, useCallback } from "react";
import { Order } from "../types";
import { ordersAPI } from "../services/api";
import { message } from "antd";

export const useOrders = (userId?: number) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const data = await ordersAPI.getAll();
      const filteredOrders = userId
        ? data.filter((order) => order.userId === userId)
        : data;
      setOrders(filteredOrders);
      setError(null);
    } catch (err) {
      setError("Buyurtmalarni yuklashda xatolik yuz berdi");
      message.error("Buyurtmalarni yuklashda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    const checkReservations = async () => {
      await ordersAPI.checkStaleReservations();
      await fetchOrders();
    };

    const interval = setInterval(checkReservations, 60000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const createOrder = async (
    orderData: Omit<Order, "id" | "status" | "returnedDate">
  ) => {
    try {
      const newOrder = await ordersAPI.create({
        ...orderData,
        status: "active",
      });
      setOrders((prev) => [...prev, newOrder]);
      message.success("Buyurtma muvaffaqiyatli yaratildi");
      return newOrder;
    } catch (err) {
      message.error("Buyurtma yaratishda xatolik yuz berdi");
      throw err;
    }
  };

  const returnBook = async (orderId: number) => {
    try {
      await ordersAPI.return(orderId);
      await fetchOrders();
      message.success("Kitob muvaffaqiyatli qaytarildi");
    } catch (err) {
      message.error("Kitobni qaytarishda xatolik yuz berdi");
      throw err;
    }
  };

  const pickupBook = async (orderId: number) => {
    try {
      await ordersAPI.pickup(orderId);
      await fetchOrders();
      message.success("Kitob muvaffaqiyatli olib ketildi");
    } catch (err) {
      message.error("Kitobni olib ketishda xatolik yuz berdi");
    }
  };

  const calculateFine = (order: Order): number => {
    return ordersAPI.calculateFine(order);
  };

  return {
    orders,
    loading,
    error,
    createOrder,
    returnBook,
    pickupBook,
    calculateFine,
    refreshOrders: fetchOrders,
  };
};
