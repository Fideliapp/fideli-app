import { useForm } from 'react-hook-form';
import api from '../../../services/api';

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data: any) => {
    await api.post("/register", data)
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-lg shadow-md sm:max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">Criar uma conta</h2>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="col-span-1 sm:col-span-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                {...register('email', { required: true })}
                className={`block w-full px-3 py-2 mt-1 text-gray-900 placeholder-gray-500 border rounded-md shadow-sm appearance-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errors.email ? 'border-red-500' : ''}`}
                placeholder="email@email.com"
              />
              {errors.email && <span className="text-red-500">Este campo é obrigatório</span>}
            </div>

            <div className="col-span-1 sm:col-span-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <input
                type="password"
                id="password"
                {...register('pass', { required: true })}
                className={`block w-full px-3 py-2 mt-1 text-gray-900 placeholder-gray-500 border rounded-md shadow-sm appearance-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errors.password ? 'border-red-500' : ''}`}
                placeholder="••••••••"
              />
              {errors.password && <span className="text-red-500">Este campo é obrigatório</span>}
            </div>

            <div className="col-span-1 sm:col-span-1">
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

            <div className="col-span-1 sm:col-span-1">
              <label htmlFor="tel" className="block text-sm font-medium text-gray-700">
                Telefone
              </label>
              <input
                type="text"
                id="tel"
                {...register('tel', { required: true })}
                className={`block w-full px-3 py-2 mt-1 text-gray-900 placeholder-gray-500 border rounded-md shadow-sm appearance-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errors.tel ? 'border-red-500' : ''}`}
                placeholder="(41) 0000-0000"
              />
              {errors.tel && <span className="text-red-500">Este campo é obrigatório</span>}
            </div>
          </div>

          <div>
            <input
              type="submit"
              className="w-full px-4 py-2 text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
