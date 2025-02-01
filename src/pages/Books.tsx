import { useState } from "react";
import { Button, Modal, Typography, Space, Spin, message } from "antd";
import { BookOutlined } from "@ant-design/icons";
import { useAuth } from "../context/AuthContext";
import { Book } from "../types";
import { useBooks } from "../hooks/useBooks";
import { useOrders } from "../hooks/useOrders";
import BookList from "../components/features/books/BookList/BookList";
import BookForm from "../components/features/books/BookForm/BookForm";

const { Title } = Typography;

const Books = () => {
  const { user } = useAuth();
  const {
    books,
    loading,
    addBook,
    updateBook,
    deleteBook,
    reserveBook,
    rateBook,
  } = useBooks();
  const { createOrder } = useOrders(user?.id);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [processingBookId, setProcessingBookId] = useState<number | null>(null);

  const handleReserve = async (bookId: number) => {
    setProcessingBookId(bookId);
    try {
      await reserveBook(bookId);
      const currentDate = new Date();
      const endDate = new Date();
      endDate.setDate(currentDate.getDate() + 7);

      await createOrder({
        bookId,
        userId: user!.id,
        reservationDate: currentDate.toISOString().split("T")[0],
        startDate: currentDate.toISOString().split("T")[0],
        endDate: endDate.toISOString().split("T")[0],
        fine: books.find((b) => b.id === bookId)?.dailyPrice || 0,
      });
    } finally {
      setProcessingBookId(null);
    }
  };

  const handleRate = async (bookId: number, rating: number) => {
    setProcessingBookId(bookId);
    try {
      await rateBook(bookId, rating);
    } finally {
      setProcessingBookId(null);
    }
  };

  const handleDelete = (bookId: number) => {
    Modal.confirm({
      title: "Kitobni o'chirish",
      content: "Haqiqatan ham bu kitobni o'chirmoqchimisiz?",
      okText: "Ha",
      cancelText: "Yo'q",
      onOk: async () => {
        setProcessingBookId(bookId);
        try {
          await deleteBook(bookId);
        } finally {
          setProcessingBookId(null);
        }
      },
    });
  };

  const handleSave = async (values: Partial<Book>) => {
    try {
      if (!values.title?.trim()) {
        message.error("Kitob nomi kiritilishi shart!");
        return;
      }
      if (!values.author?.trim()) {
        message.error("Muallif kiritilishi shart!");
        return;
      }
      if (typeof values.dailyPrice !== "number" || values.dailyPrice <= 0) {
        message.error("Narx 0 dan katta bo'lishi kerak!");
        return;
      }

      const bookData = {
        title: values.title.trim(),
        author: values.author.trim(),
        dailyPrice: values.dailyPrice,
      };

      if (selectedBook) {
        await updateBook(selectedBook.id, bookData);
      } else {
        await addBook(bookData);
      }

      setIsModalVisible(false);
      setSelectedBook(null);
    } catch (error) {
      console.error(error);
      message.error("Xatolik yuz berdi!");
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin />
      </div>
    );
  }

  return (
    <div>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Title level={2}>Kitoblar</Title>
          {(user?.role === "admin" || user?.role === "operator") && (
            <Button
              type="primary"
              icon={<BookOutlined />}
              size="large"
              onClick={() => {
                setSelectedBook(null);
                setIsModalVisible(true);
              }}
            >
              Yangi kitob qo'shish
            </Button>
          )}
        </div>

        <BookList
          books={books}
          userRole={user?.role}
          processingBookId={processingBookId}
          onEdit={(book) => {
            setSelectedBook(book);
            setIsModalVisible(true);
          }}
          onDelete={handleDelete}
          onReserve={handleReserve}
          onRate={handleRate}
        />

        <Modal
          title={selectedBook ? "Kitobni tahrirlash" : "Yangi kitob qo'shish"}
          open={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false);
            setSelectedBook(null);
          }}
          footer={null}
        >
          <BookForm
            initialValues={selectedBook || undefined}
            loading={loading}
            onSubmit={handleSave}
          />
        </Modal>
      </Space>
    </div>
  );
};

export default Books;
