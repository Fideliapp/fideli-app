import { useEffect, useState } from "react";
import api from "../../../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import SelectEnterprise from "../components/EnterpriseInput";
import { useForm, Controller } from "react-hook-form";

interface Nfs {
  id: number;
  nf: string;
  valor: number;
  compraId: number | null;
}

const GetNf = () => {
  const navigate = useNavigate();
  const [nfs, setNfs] = useState<Nfs[]>([]);
  const { userId } = useAuth();
  const { control, watch } = useForm({
    defaultValues: { empresa: "" },
  });
  const selectedEnterprise = watch("empresa");

  useEffect(() => {
    if (!userId) return;

    // Busca inicial para todos os cartões
    api.get(`/nf/enterprise/${selectedEnterprise}`).then((response) => {
      setNfs(response.data);
    });
  }, [userId]);

  useEffect(() => {
    if (!selectedEnterprise) return;

    api.get(`/nf/enterprise/${selectedEnterprise}`).then((response) => {
      setNfs(response.data);
    });
  }, [selectedEnterprise]);

  return (
    <div className="bg-gray-100 min-h-screen w-full p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-purple mb-4">Notas Fiscais</h1>
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
          <button
            className="w-full px-4 py-2 text-white bg-indigo-600 rounded-md shadow-md hover:bg-indigo-700 focus:ring-2 focus:ring-purple focus:ring-offset-2 focus:ring-offset-gray-100"
            onClick={() => navigate("/nf/create")}
          >
            Cadastrar NF
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {nfs.map(({ id, compraId, nf, valor }) => (
          <div
            key={id}
            className="col-span-1 w-full p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <h2 className="text-xl font-bold text-indigo-700 mb-2">{nf}</h2>
            <div className="flex items-center text-gray-500">
              <span className="text-sm">{
                Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(valor)
              }</span>
              <span className="text-sm ml-2">Usado: {compraId !== null ? "Sim" : "Não"}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GetNf;
