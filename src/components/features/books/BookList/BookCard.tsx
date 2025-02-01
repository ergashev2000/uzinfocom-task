import { Card, Button, Rate, Typography } from "antd";
import { EditOutlined, DeleteOutlined, BookOutlined } from "@ant-design/icons";
import { Book, UserRole } from "../../../../types";

const { Text } = Typography;

interface BookCardProps {
  book: Book;
  userRole?: UserRole;
  processing: boolean;
  onEdit: (book: Book) => void;
  onDelete: (bookId: number) => void;
  onReserve: (bookId: number) => void;
  onRate: (bookId: number, rating: number) => void;
}

const BookCard: React.FC<BookCardProps> = ({
  book,
  userRole,
  processing,
  onEdit,
  onDelete,
  onReserve,
  onRate,
}) => {
  return (
    <Card
      className="book-card"
      cover={
        <div
          className="book-cover"
          style={{
            backgroundColor: `hsl(${book.id * 100}, 70%, 85%)`,
          }}
        >
          <BookOutlined />
        </div>
      }
      actions={[
        ...(userRole === "user"
          ? [
              book.available && (
                <div style={{ paddingInline: 12 }}>
                  <Button
                    type="primary"
                    block
                    size="large"
                    onClick={() => onReserve(book.id)}
                    loading={processing}
                  >
                    Band qilish
                  </Button>
                </div>
              ),
            ]
          : []),
        ...(userRole !== "user"
          ? [
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => onEdit(book)}
                loading={processing}
                size="large"
                variant="outlined"
              />,
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                size="large"
                variant="outlined"
                onClick={() => onDelete(book.id)}
                loading={processing}
              />,
            ]
          : []),
      ]}
    >
      <Card.Meta
        title={book.title}
        description={
          <>
            <Text>{book.author}</Text>
            <br />
            <Text type="secondary">Kunlik: {book.dailyPrice} so'm</Text>
            <br />
            <Rate
              disabled={userRole !== "user"}
              value={book.rating}
              onChange={(value) => onRate(book.id, value)}
              allowHalf
            />
            <Text type="secondary"> ({book.totalRatings})</Text>
            {!book.available && (
              <div
                style={{
                  marginTop: 8,
                  position: "absolute",
                  right: 8,
                  top: 8,
                  backgroundColor: "rgba(0, 0, 0, 0.3)",
                  padding: "4px 8px",
                  borderRadius: "4px",
                }}
              >
                <Text type="warning">Band qilingan</Text>
              </div>
            )}
          </>
        }
      />
    </Card>
  );
};

export default BookCard;
