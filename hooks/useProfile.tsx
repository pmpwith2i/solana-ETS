import React from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';

export const useProfile = () => {
  const { user, error, isLoading } = useUser();

  return {
    user,
  };
};
