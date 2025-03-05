import { useState } from "react";

import "./scss/global.scss";
import TicTacToe from "./components/Game/TicTacToe";
import Ludo from "./components/Game/Ludo";
import Chess from "./components/Game/Chess";
import { StoreProvider } from "easy-peasy";
import store from "./lib/store";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SignUp from "./components/Auth/SignUp";
import LogIn from "./components/Auth/Login";
import ShootingStars from "./elements/ShootingStars";

import ChooseGame from "./components/ChooseGame";
import Provider from "./components/Provider";
import Layout from "./pages/Layout";
import JoinGame from "./components/JoinGame";

import { StreamChat } from "stream-chat";

// Use the User interface from declarations.d.ts

function App() {
  const [user, setUser] = useState<User | null>(null);
  const client = StreamChat.getInstance(import.meta.env.VITE_KEY);
  const router = createBrowserRouter([
    {
      path: "/signup",
      element: (
        <Layout>
          <SignUp />
        </Layout>
      ),
    },
    {
      path: "/login",
      element: (
        <Layout>
          <LogIn />
        </Layout>
      ),
    },
    {
      path: "/",
      element: (
        <Provider user={user} setUser={setUser} client={client}>
          <ChooseGame />
        </Provider>
      ),
    },
    {
      path: "/join",
      element: (
        <Provider user={user} setUser={setUser} client={client}>
          <JoinGame client={client} />
        </Provider>
      ),
    },
    {
      path: "tic-tac-toe",
      element: (
        <Provider user={user} client={client} setUser={setUser}>
          <TicTacToe />
        </Provider>
      ),
    },
    { path: "ludo", element: <Ludo /> },
    { path: "chess", element: <Chess /> },
  ]);

  return (
    <div className="App">
      <StoreProvider store={store}>
        <RouterProvider router={router} />
        <ShootingStars />
      </StoreProvider>
    </div>
  );
}

export default App;
