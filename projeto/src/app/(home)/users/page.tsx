'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Input, Table, Modal, Form, Button, message } from 'antd';
import { format } from 'date-fns';
import * as S from './styles'
import { useModal } from '../layout';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar: string;
}

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [form] = Form.useForm();

  const modalContext = useModal();
  if (!modalContext) {
    return null;
  }

  const { isModalVisible, showModal, handleCancel, handleOk } = modalContext;

  const fetchUsers = async () => {
    const result = await axios('https://api.escuelajs.co/api/v1/users');
    const usersWithKey = result.data.map((user: User) => ({ ...user, key: user.id }));
    setUsers(usersWithKey);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = async () => {
    if (search !== "") {
      const result = await axios(`https://api.escuelajs.co/api/v1/users/${search}`);
      console.log(result.data);
      const usersWithKey = ({ ...result.data, key: result.data.id });
      setUsers([result.data]);
    } else {
      fetchUsers()
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy - HH:mm');
  };

  const columns = [
    {
      title: 'Avatar',
      dataIndex: 'avatar',
      key: 'avatar',
      render: (avatar: string) => <img src={avatar} alt="avatar" style={{ width: 50, height: 50, borderRadius: '50%' }} />
    },
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Função', dataIndex: 'role', key: 'role' },
    {
      title: 'Ultima Modificação',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (updatedAt: string) => formatDate(updatedAt)
    },
    {
      title: 'Data de Criação',
      dataIndex: 'creationAt',
      key: 'creationAt',
      render: (creationAt: string) => formatDate(creationAt)
    },
  ];

  const handleFormSubmit = async (user: User) => {
    try {
      const response = await axios.post('https://api.escuelajs.co/api/v1/users', user);
      message.success('User created successfully!');
      showModal()
      fetchUsers();
    } catch (error) {
      message.error('Failed to create user.');
      console.error('Error creating user:', error);
    }
  };

  return (
    <S.UsersMainBody>
      <Modal title="Adicionar Novo Usuário" open={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item name="avatar" label="Avatar URL">
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Input
        placeholder="Busque o usuário pelo ID"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onPressEnter={handleSearch}
      />
      <Table dataSource={users} columns={columns} scroll={{ y: 400 }} sticky />
    </S.UsersMainBody>
  );
};

export default UsersPage;
