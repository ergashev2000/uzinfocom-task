import { Table, Tag, Button, Space } from "antd";
import { Book, Order, UserRole } from "../../../../types";
import { CheckOutlined, DownloadOutlined } from "@ant-design/icons";

interface OrderListProps {
  orders: Order[];
  books: Book[];
  userRole?: UserRole;
  loading?: boolean;
  returningOrderId: number | null;
  pickingUpOrderId?: number | null;
  onReturn: (orderId: number) => void;
  onPickup: (orderId: number) => void;
  calculateFine: (order: Order) => number;
}

const OrderList: React.FC<OrderListProps> = ({
  orders,
  books,
  userRole,
  loading,
  returningOrderId,
  pickingUpOrderId,
  onReturn,
  onPickup,
  calculateFine,
}) => {
  const getStatusTag = (status: string) => {
    let color = "";
    let text = "";

    switch (status) {
      case "active":
        color = "processing";
        text = "Band qilingan";
        break;
      case "picked_up":
        color = "warning";
        text = "Olib ketilgan";
        break;
      case "returned":
        color = "success";
        text = "Qaytarilgan";
        break;
      case "cancelled":
        color = "error";
        text = "Bekor qilingan";
        break;
      default:
        color = "default";
        text = status;
    }

    return <Tag color={color}>{text}</Tag>;
  };

  const columns = [
    {
      title: "Kitob",
      dataIndex: "bookId",
      key: "bookId",
      render: (bookId: number) => {
        const book = books.find((b) => b.id === bookId);
        return book ? book.title : "Noma'lum kitob";
      },
    },
    {
      title: "Boshlanish sanasi",
      dataIndex: "startDate",
      key: "startDate",
      render: (date: string) => new Date(date).toLocaleDateString("uz-UZ"),
    },
    {
      title: "Tugash sanasi",
      dataIndex: "endDate",
      key: "endDate",
      render: (date: string) => new Date(date).toLocaleDateString("uz-UZ"),
    },
    {
      title: "Qaytarilgan sana",
      dataIndex: "returnedDate",
      key: "returnedDate",
      render: (date: string) =>
        date ? new Date(date).toLocaleDateString("uz-UZ") : "-",
    },
    {
      title: "Holat",
      dataIndex: "status",
      key: "status",
      render: (status: string) => getStatusTag(status),
    },
    {
      title: "Jarimalar",
      key: "fine",
      render: (_: any, record: Order) => {
        const fine = calculateFine(record);
        return fine > 0 ? <Tag color="error">{fine} so'm</Tag> : "-";
      },
    },
    ...(userRole === "operator" || userRole === "admin"
      ? [
          {
            title: "Amallar",
            key: "actions",
            render: (_: any, record: Order) => (
              <Space>
                {["operator", "admin"].includes(userRole) &&
                  record.status === "active" && (
                    <Button
                      type="primary"
                      size="middle"
                      onClick={() => onPickup(record.id)}
                      loading={pickingUpOrderId === record.id}
                    >
                      <CheckOutlined /> Kitobni olib ketish
                    </Button>
                  )}
                {["operator", "admin"].includes(userRole) &&
                  record.status === "picked_up" && (
                    <Button
                      type="default"
                      size="middle"
                      onClick={() => onReturn(record.id)}
                      loading={returningOrderId === record.id}
                    >
                      <DownloadOutlined /> Kitob qaytarildi
                    </Button>
                  )}
              </Space>
            ),
          },
        ]
      : []),
  ];

  return (
    <div className="table-container">
      <Table
        columns={columns}
        dataSource={orders}
        rowKey="id"
        loading={loading}
        pagination={{
          showSizeChanger: true,
          showTotal: (total) => `Jami ${total} ta buyurtma`,
        }}
      />
    </div>
  );
};

export default OrderList;
