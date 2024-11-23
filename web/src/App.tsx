import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Home from './pages/home';
import Register from './pages/auth/register';
import CreateEnterprise from './pages/enterprise/create';
import CreateCard from './pages/card/create';
import Login from './pages/auth/login';
import { toast, ToastContainer } from 'react-toastify';
import GetEnterprise from './pages/enterprise/get';
import Sidebar from './components/sidebar';
import './App.css'
import 'react-toastify/dist/ReactToastify.css';
import GetCards from './pages/card/get';
import { jwtDecode } from "jwt-decode";
import { AuthProvider, useAuth } from './context/AuthContext';
import GetBuys from './pages/buys/get';
import CreateBuy from './pages/buys/create';
import Reports from './pages/reports';
import GetNf from './pages/nf/get';
import CreateNf from './pages/nf/create';

const isTokenExpired = (token: string): boolean => {
  const { exp } = jwtDecode<{ exp: number }>(token);
  return Date.now() >= exp * 1000;
}

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem('auth');

  if (!token || isTokenExpired(token)) {
    return <Navigate to="/auth/login" />;
  }

  return (
    <div className="w-full h-full flex">
      <Sidebar />
      {children}
    </div>
  );
};

const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const { isAdmin } = useAuth()

  alert("isAdmin, " + isAdmin)

  if (!isAdmin) {
    toast.error("Você não tem permissão");

    return <Navigate to="/card" />
  }

  return (
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  );
}

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
      <AdminRoute>
        <CreateEnterprise />
      </AdminRoute>
    ),
  },
  {
    path: '/enterprise',
    element: (
      <AdminRoute>
        <GetEnterprise />
      </AdminRoute>
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
  {
    path: '/card',
    element: (
      <ProtectedRoute>
        <GetCards />
      </ProtectedRoute>
    ),
  },
  {
    path: '/buys',
    element: (
      <ProtectedRoute>
        <GetBuys />
      </ProtectedRoute>
    ),
  },
  {
    path: '/buys/create',
    element: (
      <ProtectedRoute>
        <CreateBuy />
      </ProtectedRoute>
    ),
  },
  {
    path: '/reports',
    element: (
      <AdminRoute>
        <Reports />
      </AdminRoute>
    )
  },
  {
    path: '/nf',
    element: (
      <ProtectedRoute>
        <GetNf />
      </ProtectedRoute>
    )
  },
  {
    path: '/nf/create',
    element: (
      <ProtectedRoute>
        <CreateNf />
      </ProtectedRoute>
    )
  },
]);

function App() {
  return (
    <AuthProvider>
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
    </AuthProvider>
  );
}

export default App;
