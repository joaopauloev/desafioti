"use client";
import React, { useState } from "react";
import { Card, Input, Form, message, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useForm } from "antd/lib/form/Form";
import { z } from "zod";
import axios from "axios";
import * as S from "./styles";
import { ThemeProvider } from "styled-components";

const theme = {
  fonts: {
    body: "Poppins, sans-serif",
  },
};

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [form] = useForm<LoginFormData>();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: LoginFormData) => {
    try {
      setLoading(true);
      const result = loginSchema.safeParse(values);
      if (!result.success) {
        form.setFields(
          Object.entries(result.error.errors).map(([key, value]) => ({
            name: key,
            errors: [value.message]
          }))
        );
        return;
      }
      const response = await axios.post(
        "https://api.escuelajs.co/api/v1/auth/login",
        values
      );

      localStorage.setItem('tokens', JSON.stringify(response.data));
      message.success("Login bem-sucedido!");
      setLoading(false);

      router.push("/users");
    } catch (error) {
      setLoading(false);

      message.error("Erro no login");
      console.error("Erro:", error);
    }
  };
  return (
    <ThemeProvider theme={theme}>
      <S.MainBody>
        <h1 className="title">Desafio Ti.Saúde / FrontEnd</h1>
        <Card title="Login" bordered={false} style={{ width: 300 }}>
          <Form
            form={form}
            name="login_form"
            onFinish={handleSubmit}
            layout="vertical"
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Por favor, insira seu email" },
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="Email" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Por favor, insira sua senha" },
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Senha" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Login
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </S.MainBody>
    </ThemeProvider>
  );
}