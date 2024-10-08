import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import './App.css'
import Home from './pages/home';
import Register from './pages/auth/register';
import CreateEnterprise from './pages/enterprise/create';
import CreateCard from './pages/card/create';
import Login from './pages/auth/login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem('authToken');
  console.log(token)
  if (!token) {
    return <Navigate to="/auth/login" />;
  }

  return children;
};

const router = createBrowserRouter([
  {
    path: '/auth/register',
    element: <Register />,
  },
  {
    path: '/auth/login',
    element: <Login />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
  {
    path: '/enterprise/create',
    element: (
      <ProtectedRoute>
        <CreateEnterprise />
      </ProtectedRoute>
    ),
  },
  {
    path: '/card/create',
    element: (
      <ProtectedRoute>
        <CreateCard />
      </ProtectedRoute>
    ),
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-right"
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;
