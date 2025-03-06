import React, { useEffect, Dispatch, SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { StoreActions, useStoreActions } from "easy-peasy";
import { User } from "../types/declarations";

interface ProviderProps {
  user: User | null;
  children: React.ReactNode;
  setUser?: Dispatch<SetStateAction<User | null>>;
}

function Provider({ user, children, setUser: externalSetUser }: ProviderProps) {
  const cookies = new Cookies();
  const navigate = useNavigate();
  const setUser = useStoreActions((actions: StoreActions<any>) => actions.setUser);

  const token = cookies.get("token");
  console.log("Provider: token exists:", !!token);

  useEffect(() => {
    if (token) {
      console.log("Provider: Token found, setting user data from cookies");
      const userData = {
        id: cookies.get("userId"),
        userName: cookies.get("userName"),
        firstName: cookies.get("firstName"),
        lastName: cookies.get("lastName"),
        email: cookies.get("email"),
      } as User;
      
      console.log("Provider: User data from cookies:", userData);
      setUser(userData);
      if (externalSetUser) externalSetUser(userData);
    } else {
      console.log("Provider: No token found");
    }
  }, [token, externalSetUser, setUser]);

  useEffect(() => {
    if (user) {
      console.log("Provider: User prop exists, setting user in store", user);
      setUser(user);
    }
    // Removed automatic redirection to signup
  }, [user, setUser]);

  return <>{children}</>;
}

export default Provider;
