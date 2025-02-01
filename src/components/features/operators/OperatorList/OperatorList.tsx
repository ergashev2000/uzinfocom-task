import { Table, Button, Space, Tag, Popconfirm } from "antd";
import { LockOutlined, UnlockOutlined } from "@ant-design/icons";
import { UserProfile } from "../../../../types";

interface OperatorListProps {
  operators: UserProfile[];
  loading?: boolean;
  blockLoading?: boolean;
  unblockLoading?: boolean;
  deleteLoading?: boolean;
  onEdit: (operator: UserProfile) => void;
  onBlock: (operatorId: number) => void;
  onUnblock: (operatorId: number) => void;
  onDelete: (operatorId: number) => void;
}

const OperatorList: React.FC<OperatorListProps> = ({
  operators,
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
            title="Operatorni o'chirish"
            description="Haqiqatan ham bu operatorni o'chirmoqchimisiz?"
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
      dataSource={operators}
      rowKey="id"
      loading={loading}
      scroll={{ x: "max-content" }}
      pagination={{
        showSizeChanger: true,
        showTotal: (total) => `Jami ${total} ta operator`,
      }}
    />
  );
};

export default OperatorList;
