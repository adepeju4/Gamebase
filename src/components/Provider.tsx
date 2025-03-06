import React, { useEffect, Dispatch, SetStateAction } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { StoreActions, useStoreActions } from 'easy-peasy';
import { User } from '../types/declarations';

interface ProviderProps {
  user: User | null;
  children: React.ReactNode;
  setUser?: Dispatch<SetStateAction<User | null>>;
}

function Provider({ user, children, setUser: externalSetUser }: ProviderProps) {
  const cookies = new Cookies();
  const navigate = useNavigate();
  const setUser = useStoreActions((actions: StoreActions<any>) => actions.setUser);

  const token = cookies.get('token');

  useEffect(() => {
    if (token) {
      const userData = {
        id: cookies.get('userId'),
        userName: cookies.get('userName'),
        firstName: cookies.get('firstName'),
        lastName: cookies.get('lastName'),
        email: cookies.get('email'),
      } as User;

      setUser(userData);
      if (externalSetUser) externalSetUser(userData);
    }
  }, [token, externalSetUser, setUser]);

  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, [user, setUser]);

  return <>{children}</>;
}

export default Provider;
