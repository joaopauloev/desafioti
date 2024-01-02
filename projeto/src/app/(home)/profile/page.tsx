/* eslint-disable @next/next/no-img-element */
'use client'
import React from 'react';
import { useUser } from '@/app/utils/userContext';

export default function Profile() {
  const { user } = useUser();

  if (!user) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <h1>Profile</h1>
      <img src={user.avatar} alt={user.name} width={50} height={50}/>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
      <p>User ID: {user.id}</p>
      <p>Email: {user.email}</p>
    </div>
  );
}
