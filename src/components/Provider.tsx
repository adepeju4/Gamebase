import React, { useEffect, Dispatch, SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { StoreActions, useStoreActions } from "easy-peasy";
import { StreamChat } from "stream-chat";
import { User } from "../types/declarations";

interface ProviderProps {
  user: User | null;
  children: React.ReactNode;
  client: StreamChat;
  setUser?: Dispatch<SetStateAction<User | null>>;
}

function Provider({ user, children, client, setUser: externalSetUser }: ProviderProps) {
  const cookies = new Cookies();
  const navigate = useNavigate();
  const setUser = useStoreActions((actions: StoreActions<any>) => actions.setUser);

  const token = cookies.get("token");

  useEffect(() => {
    if (token && client) {
      client
        .connectUser(
          {
            id: cookies.get("userId"),
            username: cookies.get("userName"),
            firstName: cookies.get("firstName"),
            lastName: cookies.get("lastName"),
            hashedPassword: cookies.get("hashedPassword"),
          },
          token
        )
        .then(() => {
          const userData = {
            id: cookies.get("userId"),
            userName: cookies.get("userName"),
            firstName: cookies.get("firstName"),
            lastName: cookies.get("lastName"),
          } as User;
          
          setUser(userData);
          if (externalSetUser) externalSetUser(userData);
        });
    }
  }, [token, client, externalSetUser]);

  useEffect(() => {
    if (user) setUser(user);
    if (!token && !user) {
      navigate("/signup");
    }
  }, [user, token, navigate, setUser]);

  return <>{children}</>;
}

export default Provider;
