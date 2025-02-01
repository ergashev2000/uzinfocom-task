import { useState } from "react";
import { Button, message, Modal, Space, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useAuth } from "../context/AuthContext";
import { CreateUserData, UserProfile } from "../types";
import { useUserManagement } from "../hooks/useUserManagement";
import SubscriberList from "../components/features/subscribers/SubscriberList/SubscriberList";
import SubscriberForm from "../components/features/subscribers/SubscriberForm/SubscriberForm";

const { Title } = Typography;

const Subscribers = () => {
  const { user } = useAuth();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  const {
    users,
    isLoading,
    createUser,
    updateUser,
    blockUser,
    unblockUser,
    deleteUser,
    mutations: {
      createMutation,
      updateMutation,
      blockMutation,
      unblockMutation,
      deleteMutation,
    },
  } = useUserManagement("user", user?.id);

  const handleSubmit = async (values: CreateUserData) => {
    try {
      if (selectedUser) {
        await updateUser({
          id: selectedUser.id,
          data: values,
        });
      } else {
        await createUser(values);
      }
      setIsModalVisible(false);
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Xatolik yuz berdi");
    }
  };

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
          <Title level={2}>Obunachilar</Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={() => {
              setSelectedUser(null);
              setIsModalVisible(true);
            }}
          >
            Yangi obunachi
          </Button>
        </div>

        <SubscriberList
          subscribers={users}
          loading={isLoading}
          blockLoading={blockMutation.isPending}
          unblockLoading={unblockMutation.isPending}
          deleteLoading={deleteMutation.isPending}
          onEdit={(subscriber) => {
            setSelectedUser(subscriber);
            setIsModalVisible(true);
          }}
          onBlock={blockUser}
          onUnblock={unblockUser}
          onDelete={deleteUser}
        />

        <Modal
          title={
            selectedUser ? "Obunachini tahrirlash" : "Yangi obunachi qo'shish"
          }
          open={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false);
            setSelectedUser(null);
          }}
          footer={null}
        >
          <SubscriberForm
            initialValues={selectedUser || undefined}
            loading={createMutation.isPending || updateMutation.isPending}
            onSubmit={handleSubmit}
          />
        </Modal>
      </Space>
    </div>
  );
};

export default Subscribers;
