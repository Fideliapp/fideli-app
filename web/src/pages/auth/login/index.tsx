import { useForm } from 'react-hook-form';
import api from '../../../services/api';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import { FaEye } from 'react-icons/fa';
import { useEffect, useState } from 'react';

interface LoginFormInputs {
  cpf: string;
  pass: string;
}

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const res = await api.post("/auth/login", data);
      const { token } = res.data;

      localStorage.setItem('auth', token);
      toast.success("Autenticado com sucesso");
      navigate('/enterprise');
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      toast.error('Erro no login, por favor, tente novamente.');
    }
  };

  const handleShowPassword = () => setShowPassword(!showPassword);

  useEffect(() => {
    console.log(showPassword)
  }, [showPassword])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-lg shadow-md sm:max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">Login</h2>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="col-span-1 sm:col-span-2">
              <label htmlFor="cpf" className="block text-sm font-medium text-gray-700">
                CPF
              </label>
              <input
                type="text"
                id="cpf"
                {...register('cpf', { required: true })}
                className={`block w-full px-3 py-2 mt-1 text-gray-900 placeholder-gray-500 border rounded-md shadow-sm appearance-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errors.cpf ? 'border-red-500' : ''}`}
                placeholder="000.000.000-00"
              />
              {errors.cpf && <span className="text-red-500">Este campo é obrigatório</span>}
            </div>
            <div className='col-span-1 sm:col-span-2 flex flex-row shadow-sm border rounded-md justify-center'>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                {...register('pass', { required: true })}
                className={`w-full px-3 py-2 mt-1 text-gray-900 border-none rounded-md outline-none appearance-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errors.pass ? 'border-red-500' : ''}`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => handleShowPassword}
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
              className="w-full px-4 py-2 text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
            />
          </div>

          <div className="text-center">
            <span className="text-sm text-gray-600">Não tem uma conta? </span>
            <Link to="/auth/register" className="text-indigo-600 hover:underline">
              Crie sua conta
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
