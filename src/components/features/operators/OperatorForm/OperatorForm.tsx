import { Form, Input, DatePicker, Button, Row, Col } from "antd";
import dayjs from "dayjs";
import { CreateUserData, UserProfile } from "../../../../types";
import PhoneNumber from "phone-mask-uz";

interface UserFormData extends Omit<CreateUserData, "dateOfBirth"> {
  dateOfBirth?: dayjs.Dayjs;
}

interface OperatorFormProps {
  initialValues?: UserProfile;
  loading?: boolean;
  onSubmit: (values: CreateUserData) => Promise<void>;
}

const OperatorForm: React.FC<OperatorFormProps> = ({
  initialValues,
  loading,
  onSubmit,
}) => {
  const [form] = Form.useForm<UserFormData>();

  const handleSubmit = async (values: UserFormData) => {
    const userData: CreateUserData = {
      ...values,
      role: "operator",
      dateOfBirth: values.dateOfBirth?.format("YYYY-MM-DD"),
    };
    await onSubmit(userData);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        ...initialValues,
        dateOfBirth: initialValues?.dateOfBirth
          ? dayjs(initialValues.dateOfBirth)
          : undefined,
      }}
    >
      <Form.Item
        name="fullName"
        label="F.I.O"
        rules={[{ required: true, message: "F.I.O kiriting" }]}
      >
        <Input size="large" placeholder="F.I.O" />
      </Form.Item>

      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: "Email kiriting" },
          { type: "email", message: "Noto'g'ri email formati" },
        ]}
      >
        <Input size="large" placeholder="example@mail.com" />
      </Form.Item>

      {!initialValues && (
        <Form.Item
          name="password"
          label="Parol"
          rules={[
            { required: true, message: "Parol kiriting" },
            {
              min: 6,
              message: "Parol kamida 6 ta belgidan iborat bo'lishi kerak",
            },
          ]}
        >
          <Input.Password size="large" placeholder="********" />
        </Form.Item>
      )}

      <Form.Item
        name="phoneNumber"
        label="Telefon"
        rules={[{ required: true, message: "Telefon raqamini kiriting" }]}
      >
        <PhoneNumber inputComponent={Input} inputProps={{ size: "large" }} />
      </Form.Item>

      <Form.Item
        name="address"
        label="Manzil"
        rules={[{ required: true, message: "Manzilni kiriting" }]}
      >
        <Input size="large" />
      </Form.Item>

      <Row gutter={12}>
        <Col span={12}>
          <Form.Item name="passportNumber" label="Passport">
            <Input size="large" placeholder="AA0000000" maxLength={9} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="dateOfBirth" label="Tug'ilgan sana">
            <DatePicker
              style={{ width: "100%" }}
              size="large"
              maxDate={dayjs(new Date())}
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item>
        <Button type="primary" htmlType="submit" block size="large" loading={loading}>
          {initialValues ? "Saqlash" : "Qo'shish"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default OperatorForm;
