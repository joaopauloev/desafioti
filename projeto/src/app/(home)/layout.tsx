/* eslint-disable @next/next/no-img-element */
"use client";
import { Button, Tabs, TabsProps } from "antd";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";
import * as S from "./styles";
import StyledComponentsRegistry from "@/app/_lib/registry";
import { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "@/app/utils/userContext";
import { getAccessToken, updateAccessToken } from "@/app/utils/tokenManager";
import { User } from "@/app/interfaces/user";

interface ModalContextProps {
  isModalVisible: boolean;
  showModal: () => void;
  handleCancel: () => void;
  isProductModalVisible: boolean;
  showProductModal: () => void;
  handleProductCancel: () => void;
}

const ModalContext = createContext<ModalContextProps | null>(null);

export const useModal = () => useContext(ModalContext);

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isProductModalVisible, setIsProductModalVisible] = useState(false);
  const [tab, setTab] = useState("users");
  const router = useRouter();
  const path = usePathname();
  const { user, setUser } = useUser();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const showProductModal = () => {
    setIsProductModalVisible(true);
  };

  const handleProductCancel = () => {
    setIsProductModalVisible(false);
  };

  const items: TabsProps["items"] = [
    {
      key: "users",
      label: "Usuários",
    },
    {
      key: "products",
      label: "Produtos",
    },
  ];

  useEffect(() => {
    if (path === "/users") {
      setTab("users");
    } else {
      setTab("products");
    }
  }, [path]);

  const handleTabChange = (key: string) => {
    router.push(`/${key}`);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const accessToken = getAccessToken();
        if (!accessToken) {
          throw new Error("No access token available");
        }
        const response = await axios.get<User>(
          "https://api.escuelajs.co/api/v1/auth/profile",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setUser(response.data);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          const newAccessToken = await updateAccessToken();
          if (newAccessToken) {
            fetchProfile();
          }
        } else {
          console.error("Error fetching profile:", error);
        }
      }
    };

    fetchProfile();
  }, [setUser]);

  return (
    <ModalContext.Provider
      value={{
        isModalVisible,
        showModal,
        handleCancel,
        isProductModalVisible,
        showProductModal,
        handleProductCancel,
      }}
    >
      <S.MainBody>
        <S.Header>
          Desafio Ti.Saude
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span>{user?.name}</span>
            <img
              src={user?.avatar ?? ""}
              alt="user-avatar"
              width={50}
              height={50}
              style={{ borderRadius: "50%" }}
              onClick={() => router.push("/profile")}
            />
          </div>
        </S.Header>
        {path === "/users" || path === "/products" ? (
          <S.TabBox>
            <Tabs activeKey={tab} onChange={handleTabChange} items={items} />
            {path.includes("/users") && (
              <Button type="primary" onClick={showModal}>
                Criar Usuário
              </Button>
            )}
            {path.includes("/products") && (
              <Button type="primary" onClick={showProductModal}>
                Criar Produto
              </Button>
            )}
          </S.TabBox>
        ) : null}
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </S.MainBody>
    </ModalContext.Provider>
  );
}
