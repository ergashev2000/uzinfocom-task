import { Form, Input, Button, InputNumber } from "antd";
import { Book } from "../../../../types";

interface BookFormProps {
  initialValues?: Book;
  loading?: boolean;
  onSubmit: (values: Partial<Book>) => Promise<void>;
}

const BookForm: React.FC<BookFormProps> = ({
  initialValues,
  loading,
  onSubmit,
}) => {
  const [form] = Form.useForm();

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onSubmit}
      initialValues={initialValues}
    >
      <Form.Item
        label="Nomi"
        name="title"
        rules={[{ required: true, message: "Majburiy maydon" }]}
      >
        <Input size="large" placeholder="Kitob nomi" />
      </Form.Item>
      <Form.Item
        label="Muallif"
        name="author"
        rules={[{ required: true, message: "Majburiy maydon" }]}
      >
        <Input size="large" placeholder="Muallif" />
      </Form.Item>
      <Form.Item
        label="Kunlik narx"
        name="dailyPrice"
        rules={[
          { required: true, message: "Majburiy maydon" },
          { type: "number", min: 1, message: "Narx 0 dan katta bo'lishi kerak" },
        ]}
      >
        <InputNumber
          min={1}
          addonAfter="so'm"
          style={{ width: "100%" }}
          size="large"
          placeholder="Kunlik narx"
        />
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          block
          size="large"
          loading={loading}
        >
          {initialValues ? "Saqlash" : "Qo'shish"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default BookForm;
