/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Input, Table, Modal, Form, message, Dropdown } from "antd";
import { format } from "date-fns";
import * as S from "./styles";
import { useModal } from "../layout";
import { DeleteOutlined, EditOutlined, MoreOutlined } from "@ant-design/icons";
import { getAccessToken } from "../../utils/tokenManager";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar: string;
}

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [showEdit, setShowEdit] = useState(false);
  const [toBeEdited, setToBeEdited] = useState<User>({
    id: 0,
    name: "",
    email: "",
    role: "",
    avatar: "",
  });
  const [form] = Form.useForm();

  const fetchUsers = async () => {
    const result = await axios("https://api.escuelajs.co/api/v1/users");
    const usersWithKey = result.data.map((user: User) => ({
      ...user,
      key: user.id,
    }));
    setUsers(usersWithKey);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const modalContext = useModal();
  if (!modalContext) {
    return null;
  }

  const { isModalVisible, handleCancel } = modalContext;

  const handleSearch = async () => {
    if (search !== "") {
      const result = await axios(
        `https://api.escuelajs.co/api/v1/users/${search}`
      );
      const usersWithKey = { ...result.data, key: result.data.id };
      setUsers([usersWithKey]);
    } else {
      fetchUsers();
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy - HH:mm");
  };

  const columns = [
    {
      title: "Avatar",
      dataIndex: "avatar",
      key: "avatar",
      render: (avatar: string) => (
        <img
          src={avatar}
          alt="avatar"
          width={50}
          height={50}
          style={{ borderRadius: "50%" }}
        />
      ),
    },
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Função", dataIndex: "role", key: "role" },
    {
      title: "Ultima Modificação",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (updatedAt: string) => formatDate(updatedAt),
    },
    {
      title: "Data de Criação",
      dataIndex: "creationAt",
      key: "creationAt",
      render: (creationAt: string) => formatDate(creationAt),
    },
    {
      key: "action",
      render: (record: User) => (
        <Dropdown
          trigger={["click"]}
          menu={{
            items: [
              {
                label: "Editar",
                key: "1",
                icon: <EditOutlined />,
                style: { color: "#590082" },
                onClick: () => {
                  handleOpenEdit(record);
                },
              },
              {
                label: "Deletar",
                key: "2",
                icon: <DeleteOutlined />,
                style: { color: "red" },
                onClick: () => {
                  handleDelete(record.id);
                },
              },
            ],
          }}
        >
          <MoreOutlined />
        </Dropdown>
      ),
    },
  ];

  const handleOpenEdit = (user: User) => {
    form.setFieldsValue(user);
    setShowEdit(!showEdit);
  };

  const handleCancelEdit = () => {
    form.resetFields();
    setShowEdit(!showEdit);
  };

  const handleEdit = async () => {
    const values = form.getFieldsValue();
    try {
      const token = getAccessToken();
      const response = await axios.put(
        `https://api.escuelajs.co/api/v1/users/${toBeEdited.id}`,
        values,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response.data);

      if (response.data) {
        message.success("User updated successfully");
        fetchUsers();
        setShowEdit(false);
        handleCancelEdit()
      }
    } catch (error) {
      console.error("Failed to update user:", error);
      message.error("Failed to update user");
    }
  };

  const handleDelete = async (userId: number) => {
    try {
      const token = getAccessToken();
      const response = await axios.delete(
        `https://api.escuelajs.co/api/v1/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        message.success("User deleted successfully");
        fetchUsers();
      }
    } catch (error) {
      console.error("Failed to delete user:", error);
      message.error("Failed to delete user");
    }
  };

  const handleFormSubmit = async (user: User) => {
    try {
      await axios.post("https://api.escuelajs.co/api/v1/users", user);

      message.success("User created successfully!");
      fetchUsers();
      handleCancel();
    } catch (error) {
      message.error("Failed to create user.");
      console.error("Error creating user:", error);
    }
  };

  return (
    <S.UsersMainBody>
      <Modal
        title="Editar Usuário"
        open={showEdit}
        onOk={() => form.submit()}
        onCancel={handleCancelEdit}
      >
        <Form form={form} layout="vertical" onFinish={handleEdit}>
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true }]}
            
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: "email" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Adicionar novo Usuário"
        open={isModalVisible}
        onOk={() => form.submit()}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: "email" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item name="avatar" label="Avatar URL">
            <Input />
          </Form.Item>
          <Form.Item></Form.Item>
        </Form>
      </Modal>
      <Input
        placeholder="Busque o usuário pelo ID"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onPressEnter={handleSearch}
      />
      <Table dataSource={users} columns={columns} scroll={{ y: 500 }} sticky />
    </S.UsersMainBody>
  );
};

export default UsersPage;
