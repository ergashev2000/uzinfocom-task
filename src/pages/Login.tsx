import { Form, Input, Button, Card, Typography, Alert } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onFinish = async (
    values: { email: string; password: string } = {
      email: "admin@lib.uz",
      password: "admin123",
    }
  ) => {
    setError(null);
    setLoading(true);
    try {
      await login(values);
      navigate("/books");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login xatosi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f0f2f5",
      }}
    >
      <Card style={{ width: 400, padding: "12px" }}>
        <div style={{ textAlign: "center", marginBottom: 22 }}>
          <Title level={2} style={{ margin: 0 }}>
            Kutubxona Tizimi
          </Title>
          <Text type="secondary">
            Tizimga kirish uchun ma'lumotlaringizni kiriting
          </Text>
        </div>

        <Form
          name="login"
          onFinish={onFinish}
          initialValues={{ email: "admin@lib.uz", password: "admin123" }}
          layout="vertical"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Email manzilini kiriting" },
              { type: "email", message: "Noto'g'ri email formati" },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" size="large" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Parolni kiriting" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Parol"
              size="large"
            />
          </Form.Item>

          {error && (
            <Form.Item>
              <Alert message={error} type="error" showIcon />
            </Form.Item>
          )}

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
            >
              Kirish
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
