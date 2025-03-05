import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { StoreActions, useStoreActions } from "easy-peasy";

interface ProviderProps {
  user: User | null;
  children: React.ReactNode;
  client: StreamChat<DefaultGenerics>;
  setUser?: (user: User | null) => void;
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
            name: cookies.get("userName")
          },
          token
        )
        .then((user: User) => {
          setUser(user);
          if (externalSetUser) externalSetUser(user);
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
