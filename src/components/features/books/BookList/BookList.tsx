import { Row, Col, Empty, Typography } from "antd";
import { Book } from "../../../../types";
import BookCard from "./BookCard";
import { UserRole } from "../../../../types";

const { Text } = Typography;

interface BookListProps {
  books: Book[];
  userRole?: UserRole;
  processingBookId: number | null;
  onEdit: (book: Book) => void;
  onDelete: (bookId: number) => void;
  onReserve: (bookId: number) => void;
  onRate: (bookId: number, rating: number) => void;
}

const BookList: React.FC<BookListProps> = ({
  books,
  userRole,
  processingBookId,
  onEdit,
  onDelete,
  onReserve,
  onRate,
}) => {
  if (books.length === 0) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={<Text type="secondary">Hozircha kitoblar yo'q</Text>}
      />
    );
  }

  return (
    <Row gutter={[16, 16]}>
      {books.map((book) => (
        <Col xs={24} sm={12} md={8} lg={6} key={book.id}>
          <BookCard
            book={book}
            userRole={userRole}
            processing={processingBookId === book.id}
            onEdit={onEdit}
            onDelete={onDelete}
            onReserve={onReserve}
            onRate={onRate}
          />
        </Col>
      ))}
    </Row>
  );
};

export default BookList;
