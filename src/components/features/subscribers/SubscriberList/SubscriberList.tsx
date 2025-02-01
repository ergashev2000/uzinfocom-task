import { Table, Button, Space, Tag, Popconfirm } from "antd";
import { LockOutlined, UnlockOutlined } from "@ant-design/icons";
import { UserProfile } from "../../../../types";

interface SubscriberListProps {
  subscribers: UserProfile[];
  loading?: boolean;
  blockLoading?: boolean;
  unblockLoading?: boolean;
  deleteLoading?: boolean;
  onEdit: (subscriber: UserProfile) => void;
  onBlock: (subscriberId: number) => void;
  onUnblock: (subscriberId: number) => void;
  onDelete: (subscriberId: number) => void;
}

const SubscriberList: React.FC<SubscriberListProps> = ({
  subscribers,
  loading,
  blockLoading,
  unblockLoading,
  deleteLoading,
  onEdit,
  onBlock,
  onUnblock,
  onDelete,
}) => {
  const columns = [
    {
      title: "F.I.O",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Telefon",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Manzil",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Passport",
      dataIndex: "passportNumber",
      key: "passportNumber",
    },
    {
      title: "Tug'ilgan sana",
      dataIndex: "dateOfBirth",
      key: "dateOfBirth",
      render: (date: string) =>
        date ? new Date(date).toLocaleDateString("uz-UZ") : "-",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "active" ? "success" : "error"}>
          {status === "active" ? "Faol" : "Bloklangan"}
        </Tag>
      ),
    },
    {
      title: "Amallar",
      key: "action",
      width: "20%",
      render: (_: any, record: UserProfile) => (
        <Space>
          <Button type="link" onClick={() => onEdit(record)}>
            Tahrirlash
          </Button>
          {record.status === "active" ? (
            <Button
              type="text"
              danger
              icon={<LockOutlined />}
              loading={blockLoading}
              onClick={() => onBlock(record.id)}
            >
              Bloklash
            </Button>
          ) : (
            <Button
              type="text"
              icon={<UnlockOutlined />}
              loading={unblockLoading}
              onClick={() => onUnblock(record.id)}
            >
              Blokdan chiqarish
            </Button>
          )}
          <Popconfirm
            title="Obunachilarni o'chirish"
            description="Haqiqatan ham bu obunachini o'chirmoqchimisiz?"
            onConfirm={() => onDelete(record.id)}
            okText="Ha"
            cancelText="Yo'q"
          >
            <Button type="link" danger loading={deleteLoading}>
              O'chirish
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={subscribers}
      rowKey="id"
      loading={loading}
      pagination={{
        showSizeChanger: true,
        showTotal: (total) => `Jami ${total} ta obunachi`,
      }}
    />
  );
};

export default SubscriberList;
