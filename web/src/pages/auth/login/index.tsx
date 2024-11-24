import { useForm } from 'react-hook-form';
import api from '../../../services/api';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import { FaEye } from 'react-icons/fa';
import { useState } from 'react';

import logo from '../../../assets/logo.png';
import ilustration from '../../../assets/auth.png';

interface LoginFormInputs {
  email: string;
  pass: string;
}

const setToken = (token: string | null) => {
  if (token) {
    localStorage.setItem('auth', token);
  } else {
    localStorage.removeItem('auth');
  }
  window.dispatchEvent(new Event('auth-changed'));
};

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const res = await api.post("/auth/login", data);
      const { token } = res.data;

      setToken(token);
      toast.success("Autenticado com sucesso");
      navigate('/enterprise');
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      toast.error('Erro no login, por favor, tente novamente.');
    }
  };

  const handleShowPassword = () => setShowPassword(!showPassword);

  return (
    <div className="flex gap-8 items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg p-8 space-y-6 sm:max-w-md">
        <img src={ilustration} alt="user" className="object-cover w-128 h-128" />
      </div>
      <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-lg shadow-md sm:max-w-md">
        <img src={logo} className="w-32 mx-auto" />
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="col-span-1 sm:col-span-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                email
              </label>
              <input
                type="email"
                id="cpf"
                {...register('email', { required: true })}
                className="block w-full px-3 py-2 mt-1 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md shadow-sm appearance-none focus:ring-purple focus:border-purple sm:text-sm"
                placeholder="email"
              />
              {errors.email && <span className="text-red-500">Este campo é obrigatório</span>}
            </div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Senha
            </label>
            <div className="col-span-1 sm:col-span-2 flex flex-row shadow-sm border border-gray-300 rounded-md">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                {...register('pass', { required: true })}
                className="w-full px-3 py-2 mt-1 text-gray-900 border-none rounded-md outline-none appearance-none focus:ring-purple focus:border-purple sm:text-sm"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={handleShowPassword}
                className="flex items-center mr-2 text-gray-500"
              >
                <FaEye />
              </button>
            </div>
            {errors.pass && <span className="text-red-500">Este campo é obrigatório</span>}
          </div>
          <div>
            <input
              type="submit"
              className="w-full px-4 py-2 text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-purple focus:ring-offset-2 focus:ring-offset-gray-100"
            />
          </div>

          <div className="text-center">
            <span className="text-sm text-gray-600">Não tem uma conta? </span>
            <Link to="/auth/register" className="text-purple hover:underline">
              Crie sua conta
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
