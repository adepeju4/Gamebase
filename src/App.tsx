import { useState } from 'react';

import TicTacToe from './components/Game/TicTacToe';
import Ludo from './components/Game/Ludo';
import Chess from './components/Game/Chess';
import { StoreProvider } from 'easy-peasy';
import store from './lib/store';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import SignUp from './components/Auth/SignUp';
import LogIn from './components/Auth/Login';

import ChooseGame from './components/ChooseGame';
import Provider from './components/Provider';
import JoinGame from './components/JoinGame';
import ProtectedRoute from './components/ProtectedRoute';

import { User } from './types/declarations';
import { getCurrentUser } from './lib/auth';

function App() {
  // Initialize user from auth utility
  const [user, setUser] = useState<User | null>(getCurrentUser());

  const router = createBrowserRouter([
    {
      path: '/signup',
      element: (
        <ProtectedRoute requireAuth={false}>
          <SignUp />
        </ProtectedRoute>
      ),
    },
    {
      path: '/login',
      element: (
        <ProtectedRoute requireAuth={false}>
          <LogIn />
        </ProtectedRoute>
      ),
    },
    {
      path: '/',
      element: (
        <ProtectedRoute>
          <Provider user={user} setUser={setUser}>
            <ChooseGame />
          </Provider>
        </ProtectedRoute>
      ),
      index: true,
    },
    {
      path: '/join',
      element: (
        <ProtectedRoute>
          <Provider user={user} setUser={setUser}>
            <JoinGame />
          </Provider>
        </ProtectedRoute>
      ),
    },
    {
      path: '/tic-tac-toe',
      element: (
        <ProtectedRoute>
          <Provider user={user} setUser={setUser}>
            <TicTacToe />
          </Provider>
        </ProtectedRoute>
      ),
    },
    {
      path: '/ludo',
      element: (
        <ProtectedRoute>
          <Provider user={user} setUser={setUser}>
            <Ludo />
          </Provider>
        </ProtectedRoute>
      ),
    },
    {
      path: '/chess',
      element: (
        <ProtectedRoute>
          <Provider user={user} setUser={setUser}>
            <Chess />
          </Provider>
        </ProtectedRoute>
      ),
    },
    // Catch-all route - redirect to home
    {
      path: '*',
      element: <Navigate to="/" replace />,
    },
  ]);

  return (
    <div className="w-screen h-screen block relative">
      <StoreProvider store={store}>
        <RouterProvider router={router} />
      </StoreProvider>
    </div>
  );
}

export default App;
