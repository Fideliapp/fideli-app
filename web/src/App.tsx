import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css'
import Home from './pages/home';
import Register from './pages/auth/register';
import CreateEnterprise from './pages/enterprise/create';
import CreateCard from './pages/card/create';

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
    <RouterProvider router={router} />
  )
}

export default App