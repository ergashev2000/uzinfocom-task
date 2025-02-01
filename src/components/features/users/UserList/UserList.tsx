import { Table, Button, Space, Tag, Popconfirm } from 'antd';
import { LockOutlined, UnlockOutlined } from '@ant-design/icons';
import { UserProfile } from '../../../../types';

interface UserListProps {
    users: UserProfile[];
    loading?: boolean;
    blockLoading?: boolean;
    unblockLoading?: boolean;
    deleteLoading?: boolean;
    onEdit: (user: UserProfile) => void;
    onBlock: (userId: number) => void;
    onUnblock: (userId: number) => void;
    onDelete: (userId: number) => void;
}

const UserList: React.FC<UserListProps> = ({
    users,
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
            title: 'F.I.O',
            dataIndex: 'fullName',
            key: 'fullName',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Telefon',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
        },
        {
            title: 'Manzil',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Rol',
            dataIndex: 'role',
            key: 'role',
            render: (role: string) => {
                const color = role === 'admin' ? 'red' : role === 'operator' ? 'blue' : 'green';
                return <Tag color={color}>{role.toUpperCase()}</Tag>;
            },
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                return <Tag color={status === 'active' ? 'success' : 'error'}>
                    {status === 'active' ? 'Faol' : 'Bloklangan'}
                </Tag>;
            },
        },
        {
            title: 'Amallar',
            key: 'action',
            render: (_: any, record: UserProfile) => (
                <Space>
                    {record.role !== 'admin' && (
                        <>
                            <Button
                                type="link"
                                onClick={() => onEdit(record)}
                            >
                                Tahrirlash
                            </Button>
                            {record.status === 'active' ? (
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
                                title="Foydalanuvchini o'chirish"
                                description="Haqiqatan ham bu foydalanuvchini o'chirmoqchimisiz?"
                                onConfirm={() => onDelete(record.id)}
                                okText="Ha"
                                cancelText="Yo'q"
                            >
                                <Button type="link" danger loading={deleteLoading}>
                                    O'chirish
                                </Button>
                            </Popconfirm>
                        </>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={users}
            rowKey="id"
            loading={loading}
            pagination={{
                position: ['bottomCenter'],
                showSizeChanger: true,
                showTotal: (total) => `Jami ${total} ta foydalanuvchi`,
            }}
        />
    );
};

export default UserList;
