import React, { useReducer, createContext, useContext } from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
  useLocation,
} from 'react-router-dom';

import './styles/index.css';

import ParentDashboard from './pages/LandingPage';
import ErrorPage from './pages/ErrorPage';
import Login from './pages/Login';
import Register from './pages/Register';
import { initialMainState, mainReducer } from './reducers/main-reducer';
import { MainContext } from './context/context';

function Layout() {
  return (
    <>
      <div id="page-content" style={{ minHeight: '100vh' }}>
        <Outlet />
      </div>
    </>
  );
}

// Component to protext routes from unauthorized users
// function RequireAuth({ children }) {
//   const { main } = useContext(MainContext);
//   const location = useLocation();

//   if (!main.state.accessToken) {
//     return <Navigate to="/" state={{ from: location }} replace />;
//   }

//   return children;
// }

const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <LandingPage />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/register',
        element: <Register />,
      },
      // {
      //   path: '/dashboard',
      //   element: (
      //     <RequireAuth>
      //       <Dashboard />
      //     </RequireAuth>
      //   ),
      // },
    ],
  },
]);

const MainContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(mainReducer, initialMainState);

  const main = {
    state,
    dispatch,
  };

  return (
    <MainContext.Provider value={{ main }}>{children}</MainContext.Provider>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <MainContextProvider>
    <RouterProvider router={router} />
  </MainContextProvider>
);