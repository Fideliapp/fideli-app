import { useForm } from 'react-hook-form';
import api from '../../../services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import logo from '../../../assets/logo.png';
import ilustration from '../../../assets/auth.png';
import { Form } from './Form';

export interface RegisterFormInputs {
  email: string;
  pass: string;
  cpf: string;
  nome: string;
  tel: string
}

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormInputs>();
  const navigate = useNavigate();

  const onSubmit = async (data: RegisterFormInputs) => {
    try {
      console.log(data);
      const res = await api.post("/auth/register", { ...data });

      if (res.status >= 200 && res.status < 300) {
        toast.success("Cadastro realizado com sucesso!");
        navigate("/auth/login");
      } else {
        toast.error(res.data.message || "Ops... algo deu errado.");
      }
    } catch (error: any) {
      if (error.response) {
        toast.error(
          error.response.data.message || "Erro no servidor. Tente novamente."
        );
      } else if (error.request) {
        toast.error("Não foi possível se conectar ao servidor. Verifique sua conexão.");
      } else {
        toast.error("Erro desconhecido. Tente novamente.");
      }
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

export default Register;
