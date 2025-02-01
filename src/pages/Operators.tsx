import { useState } from "react";
import { Button, Modal, Space, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useAuth } from "../context/AuthContext";
import { CreateUserData, UserProfile } from "../types";
import { usersAPI } from "../services/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import OperatorList from "../components/features/operators/OperatorList/OperatorList";
import OperatorForm from "../components/features/operators/OperatorForm/OperatorForm";

const { Title } = Typography;

const Operators = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const allUsers = await usersAPI.getAll();
      return allUsers.filter((u) => u.role === "operator");
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateUserData) =>
      usersAPI.create({ ...data, role: "operator" }, user!.id),
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
          <Title level={2}>Operatorlar</Title>
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={() => {
              setSelectedUser(null);
              setIsModalVisible(true);
            }}
          >
            Yangi operator
          </Button>
        </div>

        <OperatorList
          operators={users}
          loading={isLoading}
          blockLoading={blockMutation.isPending}
          unblockLoading={unblockMutation.isPending}
          deleteLoading={deleteMutation.isPending}
          onEdit={(operator) => {
            setSelectedUser(operator);
            setIsModalVisible(true);
          }}
          onBlock={(operatorId) => blockMutation.mutate(operatorId)}
          onUnblock={(operatorId) => unblockMutation.mutate(operatorId)}
          onDelete={(operatorId) => deleteMutation.mutate(operatorId)}
        />

        <Modal
          title={
            selectedUser ? "Operatorni tahrirlash" : "Yangi operator qo'shish"
          }
          open={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false);
            setSelectedUser(null);
          }}
          footer={null}
        >
          <OperatorForm
            initialValues={selectedUser || undefined}
            loading={createMutation.isPending || updateMutation.isPending}
            onSubmit={handleSubmit}
          />
        </Modal>
      </Space>
    </div>
  );
};

export default Operators;
