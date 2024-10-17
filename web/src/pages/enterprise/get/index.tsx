import { useEffect, useState } from "react";
import api from "../../../services/api";
import { FaStar } from "react-icons/fa";

interface Enterprise {
  id: number;
  nome: string;
  cnpj: string;
}

const RenderStars = (rating: number) => {
  const totalStars = 5;
  return (
    <div className="flex">
      {[...Array(totalStars)].map((_, index) => (
        <FaStar
          key={index}
          className={`text-yellow-400 ${index < rating ? '' : 'opacity-25'}`}
        />
      ))}
    </div>
  );
};

const GetEnterprise = () => {
  const [enterprises, setEnterprises] = useState<Enterprise[]>([]);

  useEffect(() => {
    api.get('/enterprise').then((response) => {
      setEnterprises(response.data);
    });
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen w-full p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-4">Lista de Empresas</h1>
        <button
          className="px-4 py-2 text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
        >
          Nova compra
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
        {enterprises.map(({ cnpj, nome, id }) => (
          <div
            key={id}
            className="col-span-1 w-full p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <h2 className="text-lg font-semibold text-gray-800">{nome}</h2>
            <div className="flex justify-between">
              <p className="text-sm text-gray-500">CNPJ: {cnpj}</p>
              {RenderStars(2)} {/* TODO: Criar tabelas e retornar na rota */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GetEnterprise;
