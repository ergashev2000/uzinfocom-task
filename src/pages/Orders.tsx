import { useState } from "react";
import { Modal, Space, Typography } from "antd";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../hooks/useOrders";
import { useBooks } from "../hooks/useBooks";
import OrderList from "../components/features/orders/OrderList/OrderList";

const { Title } = Typography;

const Orders = () => {
  const { user } = useAuth();
  const { orders, loading, returnBook, pickupBook, calculateFine } = useOrders(
    user?.role === "user" ? user.id : undefined
  );
  const { books, refreshBooks } = useBooks();
  const [returningOrder, setReturningOrder] = useState<number | null>(null);
  const [pickingUpOrder, setPickingUpOrder] = useState<number | null>(null);

  const handleReturn = async (orderId: number) => {
    Modal.confirm({
      title: "Kitobni qaytarish",
      content: "Kitobni qaytarishni tasdiqlaysizmi?",
      okText: "Ha",
      cancelText: "Yo'q",
      onOk: async () => {
        setReturningOrder(orderId);
        try {
          await returnBook(orderId);
          await refreshBooks();
        } finally {
          setReturningOrder(null);
        }
      },
    });
  };

  const handlePickup = async (orderId: number) => {
    Modal.confirm({
      title: "Kitob olib ketildi",
      content: "Kitob olib ketilganini tasdiqlaysizmi?",
      okText: "Ha",
      cancelText: "Yo'q",
      onOk: async () => {
        setPickingUpOrder(orderId);
        try {
          await pickupBook(orderId);
        } finally {
          setPickingUpOrder(null);
        }
      },
    });
  };

  return (
    <div>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Title level={2}>Buyurtmalar</Title>
        <OrderList
          orders={orders}
          books={books}
          userRole={user?.role}
          loading={loading}
          returningOrderId={returningOrder}
          pickingUpOrderId={pickingUpOrder}
          onReturn={handleReturn}
          onPickup={handlePickup}
          calculateFine={calculateFine}
        />
      </Space>
    </div>
  );
};

export default Orders;
