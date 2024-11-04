import { useEffect, useState } from "react";
import api from "../../../services/api";
import { useNavigate } from "react-router-dom";
import { FaBuilding } from "react-icons/fa"; // Ícone para a empresa
import { useAuth } from "../../../context/AuthContext";

interface Cards {
  id: number;
  nome: string;
  empresa: {
    nome: string;
  }
}

const GetCards = () => {
  const navigate = useNavigate();
  const [cards, setCards] = useState<Cards[]>([]);
  const { userId } = useAuth();

  useEffect(() => {
    if (userId == null) return

    api.get(`/card/user/${userId}`).then((response) => {
      setCards(response.data);
    });
  }, [userId]);

  return (
    <div className="bg-gray-100 min-h-screen w-full p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-4">Cartões</h1>
        <button
          className="px-4 py-2 text-white bg-indigo-600 rounded-md shadow-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
          onClick={() => navigate('/card/create')}
        >
          Novo cartão
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        {cards.map(({ id, nome, empresa }) => (
          <div
            key={id}
            className="col-span-1 w-full p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <h2 className="text-xl font-bold text-indigo-700 mb-2">{nome}</h2>
            <div className="flex items-center text-gray-500">
              <FaBuilding className="mr-2" />
              <span className="text-sm">{empresa.nome}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GetCards;
