import { Form, Input, DatePicker, Button, Row, Col } from "antd";
import dayjs from "dayjs";
import { CreateUserData, UserProfile } from "../../../../types";
import PhoneNumber from "phone-mask-uz";

interface UserFormData extends Omit<CreateUserData, "dateOfBirth"> {
  dateOfBirth?: dayjs.Dayjs;
}

interface SubscriberFormProps {
  initialValues?: UserProfile;
  loading?: boolean;
  onSubmit: (values: CreateUserData) => Promise<void>;
}

const SubscriberForm: React.FC<SubscriberFormProps> = ({
  initialValues,
  loading,
  onSubmit,
}) => {
  const [form] = Form.useForm<UserFormData>();

  const handleSubmit = async (values: UserFormData) => {
    const userData: CreateUserData = {
      ...values,
      role: "user",
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
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name="fullName"
            label="F.I.O"
            rules={[{ required: true, message: "F.I.O kiriting" }]}
          >
            <Input size="large" />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Email kiriting" },
              { type: "email", message: "Noto'g'ri email formati" },
            ]}
          >
            <Input size="large" placeholder="example@gmail.com"/>
          </Form.Item>
        </Col>
      </Row>

      {!initialValues && (
        <Row gutter={16}>
          <Col span={24}>
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
              <Input.Password size="large" placeholder="******"/>
            </Form.Item>
          </Col>
        </Row>
      )}

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="phoneNumber"
            label="Telefon"
            rules={[{ required: true, message: "Telefon raqamini kiriting" }]}
          >
            <PhoneNumber inputComponent={Input} inputProps={{ size: "large" }} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="address"
            label="Manzil"
            rules={[{ required: true, message: "Manzilni kiriting" }]}
          >
            <Input size="large" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="passportNumber"
            label="Passport"
            rules={[{ required: true, message: "Passport raqamini kiriting" }]}
          >
            <Input size="large" placeholder="AA0000000"/>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="dateOfBirth"
            label="Tug'ilgan sana"
            rules={[{ required: true, message: "Tug'ilgan sanani kiriting" }]}
          >
            <DatePicker style={{ width: "100%" }} size="large" />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item>
        <Button
          size="large"
          type="primary"
          htmlType="submit"
          block
          loading={loading}
        >
          {initialValues ? "Saqlash" : "Qo'shish"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default SubscriberForm;
