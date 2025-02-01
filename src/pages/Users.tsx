import { useState } from "react";
import { Button, Modal, Space, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useAuth } from "../context/AuthContext";
import { CreateUserData, UserProfile } from "../types";
import { usersAPI } from "../services/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import UserList from "../components/features/users/UserList/UserList";
import UserForm from "../components/features/users/UserForm/UserForm";

const { Title } = Typography;

const Users = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: usersAPI.getAll,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateUserData) => usersAPI.create(data, user!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsModalVisible(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<UserProfile> }) =>
      usersAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsModalVisible(false);
    },
  });

  const blockMutation = useMutation({
    mutationFn: usersAPI.blockUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });

  const unblockMutation = useMutation({
    mutationFn: usersAPI.unblockUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: usersAPI.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });

  const handleSubmit = async (values: CreateUserData) => {
    if (selectedUser) {
      await updateMutation.mutateAsync({
        id: selectedUser.id,
        data: values,
      });
    } else {
      await createMutation.mutateAsync(values);
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
          <Title level={2}>Foydalanuvchilar</Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setSelectedUser(null);
              setIsModalVisible(true);
            }}
          >
            Yangi foydalanuvchi
          </Button>
        </div>

        <UserList
          users={users}
          loading={isLoading}
          blockLoading={blockMutation.isPending}
          unblockLoading={unblockMutation.isPending}
          deleteLoading={deleteMutation.isPending}
          onEdit={(user) => {
            setSelectedUser(user);
            setIsModalVisible(true);
          }}
          onBlock={(userId) => blockMutation.mutate(userId)}
          onUnblock={(userId) => unblockMutation.mutate(userId)}
          onDelete={(userId) => deleteMutation.mutate(userId)}
        />

        <Modal
          title={
            selectedUser
              ? "Foydalanuvchini tahrirlash"
              : "Yangi foydalanuvchi qo'shish"
          }
          open={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false);
            setSelectedUser(null);
          }}
          footer={null}
        >
          <UserForm
            initialValues={selectedUser || undefined}
            loading={createMutation.isPending || updateMutation.isPending}
            onSubmit={handleSubmit}
          />
        </Modal>
      </Space>
    </div>
  );
};

export default Users;
