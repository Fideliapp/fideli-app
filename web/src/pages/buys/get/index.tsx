import { useEffect, useState } from "react";
import api from "../../../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

interface Buys {
  id: number,
  pontos: number,
  valorAcumulado: number,
  empresa: {
    id: number,
    nome: string,
  }
}

const GetBuys = () => {
  const [buys, setBuys] = useState<Buys[]>([]);
  const navigate = useNavigate()
  const { userId } = useAuth()

  useEffect(() => {

    if (userId == null) return

    api.get(`/buys/${userId}`).then((response) => {
      setBuys(response.data);
    });
  }, [userId]);

  return (
    <div className="bg-gray-100 min-h-screen w-full p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-purple mb-4">Compras</h1>
        <button
          className="px-4 py-2 text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-purple focus:ring-offset-2 focus:ring-offset-gray-100"
          onClick={() => navigate('/buys/create')}
        >
          Nova compra
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
        {buys.map(({ id, empresa, pontos, valorAcumulado }) => (
          <div
            key={id}
            className="col-span-1 w-full p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <h2 className="text-lg font-semibold text-gray-800">{empresa.nome}</h2>
            <div className="flex justify-between">
              <p className="text-sm text-gray-500">Total Gasto: {valorAcumulado}</p>
              <p className="text-sm text-gray-500">Pontos: {pontos}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GetBuys;
