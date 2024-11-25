import { useEffect, useState } from "react";
import api from "../../../services/api";
import { useNavigate } from "react-router-dom";
import SelectEnterprise from "../components/EnterpriseInput";
import { useForm, Controller } from "react-hook-form";
import { useAuth } from "../../../context/AuthContext";
import { toast } from "react-toastify";

interface Promotions {
  id: number;
  nome: string;
  descricao: number;
  valor: number;
  data: string;
}

const GetPromotions = () => {
  const navigate = useNavigate();
  const [promotions, setPromotions] = useState<Promotions[]>([]);
  const { control, watch } = useForm({
    defaultValues: { empresa: "" },
  });
  const selectedEnterprise = watch("empresa");
  const { isAdmin, userId } = useAuth()

  const handlePromotion = async (id: number) => {
    try {
      const res = await api.post(`/promotions/buy`, { promocaoId: id, clienteId: userId })

      if (res.status >= 200 && res.status < 300) {
        toast.success("Promoção adquirida com sucesso!");
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
  }

  useEffect(() => {
    if (!selectedEnterprise) return;

    api.get(`/promotions/enterprise/${selectedEnterprise}`).then((response) => {
      setPromotions(response.data);
    });
  }, [selectedEnterprise]);

  return (
    <div className="bg-gray-100 min-h-screen w-full p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-purple mb-4">Promoções</h1>
        <div className="flex items-center gap-2">
          <Controller
            name="empresa"
            control={control}
            render={({ field, fieldState }) => (
              <SelectEnterprise
                control={control}
                error={fieldState.error?.message}
                {...field}
              />
            )}
          />
          {
            isAdmin && (
              <button
                className="w-full px-4 py-2 text-white bg-purple rounded-md shadow-md hover:bg-purple focus:ring-2 focus:ring-purple focus:ring-offset-2 focus:ring-offset-gray-100"
                onClick={() => navigate("/promotions/create")}
              >
                Criar promoções
              </button>
            )
          }
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols- lg:grid-cols-3 gap-6 mt-6">
        {promotions.map(({ id, nome, descricao, valor, data }) => {
          const hasExpired = new Date(data) < new Date();

          return (
            <div
              key={id}
              className="w-full p-6 bg-gradient-to-b from-purple-100 to-white border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <h2 className="text-xl font-bold text-purple-700 mb-2">{nome}</h2>
              <p className="text-sm text-gray-600 mb-4">{descricao}</p>

              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold text-gray-800">
                  Pontos necessários:{" "}
                  <span className="text-purple-600">{valor}</span>
                </span>
              </div>

              <hr className="my-4 border-gray-300" />

              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-500">
                  Disponível até:{" "}
                  <span className="font-medium text-gray-700">
                    {
                      hasExpired ? "Expirado" : new Date(data).toLocaleDateString("pt-BR")
                    }
                  </span>
                </p>
                <button
                  disabled={hasExpired}
                  className="w-full px-4 py-2 text-white bg-purple rounded-md shadow-md hover:bg-purple focus:ring-2 focus:ring-purple focus:ring-offset-2 focus:ring-offset-gray-100 disabled:opacity-50"
                  onClick={() => handlePromotion(id)}
                >
                  Trocar
                </button>
              </div>
            </div>

          )
        })}
      </div>
    </div>
  );
};

export default GetPromotions;
