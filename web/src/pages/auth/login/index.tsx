import { useForm } from 'react-hook-form';
import api from '../../../services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import logo from '../../../assets/logo.png';
import ilustration from '../../../assets/auth.png';
import { Form } from './form';

export interface LoginFormInputs {
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
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();


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

  return (
    <div className="flex flex-col h-screen p-12 bg-gray-100">
      <header className="flex mb-8">
        <img src={logo} alt="Logo" className="w-32 md:w-32" />
      </header>

      <div className="w-full max-w-[1366px] grid m-auto p-0 grid-cols-2">
        <div className='bg-gradient-to-l from-purple to-indigo-500 rounded-full flex justify-center'>
          <img src={ilustration} alt="Ilustração" className="w-128 h-128" />
        </div>
        <div>
          <Form
            onSubmit={handleSubmit(onSubmit)}
            register={register}
            errors={errors}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
