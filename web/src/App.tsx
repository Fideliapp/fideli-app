import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css'
import Home from './pages/home';
import Register from './pages/auth/register';
import CreateEnterprise from './pages/enterprise/create';
import CreateCard from './pages/card/create';
import Login from './pages/auth/login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/auth/register',
    element: <Register />,
  },
  {
    path: '/auth/login',
    element: <Login />,
  },
  {
    path: '/enterprise/create',
    element: <CreateEnterprise />,
  },
  {
    path: '/card/create',
    element: <CreateCard />,
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
  )
}

export default App