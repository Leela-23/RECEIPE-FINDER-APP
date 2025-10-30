import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Home, Favorites } from './pages';

// Create router with v7 future flags enabled
const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <App />, // App is the layout (renders <Outlet />)
      children: [
        { index: true, element: <Home /> },
        { path: 'favorites', element: <Favorites /> },
      ],
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
      v7_normalizeFormMethod: true,
      v7_fetcherPersist: true,
      v7_prependBasename: true
    }
  }
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
