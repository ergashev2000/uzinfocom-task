import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersAPI } from "../services/api";
import { CreateUserData, UserProfile, UserRole } from "../types";

export const useUserManagement = (role: UserRole, currentUserId?: number) => {
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users", role],
    queryFn: async () => {
      const allUsers = await usersAPI.getAll();
      return allUsers.filter((u) => u.role === role);
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateUserData) =>
      usersAPI.create({ ...data, role }, currentUserId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", role] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<UserProfile> }) =>
      usersAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", role] });
    },
  });

  const blockMutation = useMutation({
    mutationFn: usersAPI.blockUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users", role] }),
  });

  const unblockMutation = useMutation({
    mutationFn: usersAPI.unblockUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users", role] }),
  });

  const deleteMutation = useMutation({
    mutationFn: usersAPI.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users", role] }),
  });

  return {
    users,
    isLoading,
    createUser: createMutation.mutateAsync,
    updateUser: updateMutation.mutateAsync,
    blockUser: blockMutation.mutate,
    unblockUser: unblockMutation.mutate,
    deleteUser: deleteMutation.mutate,
    mutations: {
      createMutation,
      updateMutation,
      blockMutation,
      unblockMutation,
      deleteMutation,
    },
  };
};
