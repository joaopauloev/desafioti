"use client";
import { Button, Modal, Tabs, TabsProps } from "antd";
import { useRouter, usePathname } from "next/navigation";
import * as S from "./styles";
import StyledComponentsRegistry from '../../lib/registry'
import { createContext, useContext, useState } from 'react';

interface ModalContextProps {
  isModalVisible: boolean;
  showModal: () => void;
  handleCancel: () => void;
  handleOk: () => void;
}

const ModalContext = createContext<ModalContextProps | null>(null);

export const useModal = () => useContext(ModalContext);

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const router = useRouter();
  const path = usePathname()

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const items: TabsProps['items'] = [
    {
      key: 'users',
      label: 'Usuários',
    },
    {
      key: 'products',
      label: 'Produtos',
    },
  ];
  const handleTabChange = (key: string) => {
    router.push(`/${key}`);
  };

  return (
    <ModalContext.Provider value={{ isModalVisible, showModal, handleCancel, handleOk }}>
      <S.MainBody>
        <S.Header>Desafio Ti.Saude</S.Header>
        <S.TabBox>
          <Tabs defaultActiveKey={path} onChange={handleTabChange} items={items} />
          {path.includes('/users') && (
            <Button type="primary" onClick={showModal}>
              Criar Usuário
            </Button>
          )}
        </S.TabBox>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </S.MainBody>
    </ModalContext.Provider>
  );
}