import { useForm } from 'react-hook-form';
import api from '../../../services/api';
import { toast } from 'react-toastify';
import { useAuth } from '../../../context/AuthContext';
import SelectEnterprise from '../components/EnterpriseInput';
import SelectCard from '../components/CardINput';
import { useNavigate } from 'react-router-dom';

const CreateBuy = () => {
  const { register, handleSubmit, formState: { errors }, control } = useForm();
  const { userId } = useAuth();
  const navigate = useNavigate()

  const onSubmit = async (data: any) => {
    console.log(data)

    try {
      const res = await api.post("/buys", {
        ...data,
        clienteId: userId,
        cartaoId: Number(data.cartaoId),
        valor: Number(data.valor),
        empresaId: Number(data.empresaId)
      });

      if (res.status >= 200 && res.status < 300) {
        toast.success("Cadastro realizado com sucesso!");
        navigate('/buys ')
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
    <div className="flex items-center justify-center h-screen w-full bg-gray-100">
      <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-lg shadow-md sm:max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">Adicionar uma compra</h2>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="col-span-1 sm:col-span-2">
              <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
                Valor da compra
              </label>
              <input
                type="number"
                id="nome"
                {...register('valor', { required: true })}
                className={`block w-full px-3 py-2 mt-1 text-gray-900 placeholder-gray-500 border rounded-md shadow-sm appearance-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errors.nome ? 'border-red-500' : ''}`}
                placeholder="Valor da compra"
              />
              {errors.nome && <span className="text-red-500">Este campo é obrigatório</span>}
            </div>
            <div className="col-span-1 sm:col-span-2">
              <label htmlFor="numero" className="block text-sm font-medium text-gray-700">
                Selecione a empresa
              </label>
              <SelectEnterprise
                name="empresaId"
                control={control}
                error={errors.empresaId ? 'Este campo é obrigatório' : undefined}
              />
            </div>
            <div className="col-span-1 sm:col-span-2">
              <label htmlFor="numero" className="block text-sm font-medium text-gray-700">
                Selecione um cartão
              </label>
              <SelectCard
                name="cartaoId"
                control={control}
                error={errors.cartaoId ? 'Este campo é obrigatório' : undefined}
              />
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

export default CreateBuy;
