"use client";
import React from "react";
import { Card, Input, Form, message, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useForm } from "antd/lib/form/Form";
import { z } from "zod";
import axios from "axios";
import * as S from "./styles";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [form] = useForm<LoginFormData>();

  const handleSubmit = async (values: LoginFormData) => {
    const result = loginSchema.safeParse(values);
    if (!result.success) {
      // Se houver erros de validação, exiba-os.
      result.error.errors.forEach((error) => {
        form.setFields([
          {
            name: error.path[0],
            errors: [error.message],
          },
        ]);
      });
      return;
    }

    try {
      const response = await axios.post(
        "https://api.escuelajs.co/api/v1/auth/login",
        values
      );
      message.success("Login bem-sucedido!");
      console.log("Resposta da API:", response.data);
    } catch (error) {
      message.error("Erro no login");
      console.error("Erro:", error);
    }
  };
  return (
    <S.MainBody>
      <h1>Desafio Ti Saude</h1>
      <Card title="Login" bordered={false} style={{ width: 300 }}>
        <Form
          form={form}
          name="login_form"
          onFinish={handleSubmit}
          layout="vertical"
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Por favor, insira seu email" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Por favor, insira sua senha" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Senha" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </S.MainBody>
  );
}
