import { Form, Input, DatePicker, Select, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { CreateUserData, UserProfile } from '../../../../types';
import { useAuth } from '../../../../context/AuthContext';
import dayjs from 'dayjs';

const { Option } = Select;

interface UserFormProps {
    initialValues?: UserProfile;
    loading?: boolean;
    onSubmit: (values: CreateUserData) => Promise<void>;
}

interface UserFormData extends Omit<CreateUserData, 'dateOfBirth'> {
    dateOfBirth?: dayjs.Dayjs;
}

const UserForm: React.FC<UserFormProps> = ({
    initialValues,
    loading,
    onSubmit,
}) => {
    const { user } = useAuth();
    const [form] = Form.useForm<UserFormData>();

    const handleSubmit = async (values: UserFormData) => {
        const userData: CreateUserData = {
            ...values,
            dateOfBirth: values.dateOfBirth?.format('YYYY-MM-DD'),
        };
        await onSubmit(userData);
        form.resetFields();
    };

    const roleOptions = user?.role === 'admin' 
        ? ['admin', 'operator', 'user'] 
        : ['user'];

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{ 
                role: 'user',
                ...initialValues,
                dateOfBirth: initialValues?.dateOfBirth ? dayjs(initialValues.dateOfBirth) : undefined,
            }}
        >
            <Form.Item
                name="fullName"
                label="F.I.O"
                rules={[{ required: true, message: 'F.I.O kiriting' }]}
            >
                <Input prefix={<UserOutlined />} />
            </Form.Item>

            <Form.Item
                name="email"
                label="Email"
                rules={[
                    { required: true, message: 'Email kiriting' },
                    { type: 'email', message: 'Noto\'g\'ri email formati' },
                ]}
            >
                <Input />
            </Form.Item>

            {!initialValues && (
                <Form.Item
                    name="password"
                    label="Parol"
                    rules={[
                        { required: true, message: 'Parol kiriting' },
                        { min: 6, message: 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak' },
                    ]}
                >
                    <Input.Password />
                </Form.Item>
            )}

            <Form.Item
                name="phoneNumber"
                label="Telefon"
                rules={[{ required: true, message: 'Telefon raqamini kiriting' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="address"
                label="Manzil"
                rules={[{ required: true, message: 'Manzilni kiriting' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="passportNumber"
                label="Passport"
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="dateOfBirth"
                label="Tug'ilgan sana"
            >
                <DatePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
                name="role"
                label="Rol"
                rules={[{ required: true, message: 'Rolni tanlang' }]}
            >
                <Select disabled={user?.role !== 'admin'}>
                    {roleOptions.map(role => (
                        <Option key={role} value={role}>
                            {role === 'admin' ? 'Administrator' :
                             role === 'operator' ? 'Operator' :
                             'Foydalanuvchi'}
                        </Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" block loading={loading}>
                    {initialValues ? "Saqlash" : "Qo'shish"}
                </Button>
            </Form.Item>
        </Form>
    );
};

export default UserForm;
