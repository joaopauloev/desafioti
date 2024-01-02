/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";
import { useUser } from "@/app/utils/userContext";
import { Button, Card, Divider } from "antd";
import * as S from "./styles";

export default function Profile() {
  const { user } = useUser();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <S.ProfileBody>
      <S.ProfileHeader>
        <Button type="text" onClick={() => window.history.back()}>
          Voltar
        </Button>
        <h2>Perfil</h2>
      </S.ProfileHeader>
      <Card>
        <img src={user.avatar} alt={user.name} className="avatar" />
        <Divider type="horizontal"/>
        <p>Name: {user.name}</p>
        <p>Email: {user.email}</p>
        <p>Role: {user.role}</p>
        <p>User ID: {user.id}</p>
        <p>Email: {user.email}</p>
      </Card>
    </S.ProfileBody>
  );
}
