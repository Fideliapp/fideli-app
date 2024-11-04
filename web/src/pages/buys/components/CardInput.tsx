import React, { useEffect } from 'react';
import { useController } from 'react-hook-form';
import api from '../../../services/api';
import { toast } from 'react-toastify';
import { useAuth } from '../../../context/AuthContext';

interface Card {
  id: number;
  nome: string;
}

interface SelectEnterpriseProps {
  name: string;
  control: any;
  error?: string;
}

const SelectCard = (props: SelectEnterpriseProps) => {
  const { name, control, error } = props;

  const [cards, setCards] = React.useState<Card[]>([]);

  const { field } = useController({
    name,
    control,
    defaultValue: '',
  });

  const { userId } = useAuth();

  useEffect(() => {
    if (userId == null) return

    api.get(`/card/user/${userId}`).then((response) => {
      setCards(response.data);
    });
  }, [userId]);

  return (
    <>
      <select
        id="enterprise"
        value={field.value}
        onChange={(event) => {
          field.onChange(event.target.value);
        }}
        className={`block w-full px-3 py-2 mt-1 text-gray-900 placeholder-gray-500 border rounded-md shadow-sm appearance-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
      >
        <option value="">Selecione um cartão</option>
        {cards.map((card) => (
          <option key={card.id} value={card.id}>
            {card.nome}
          </option>
        ))}
      </select>
      {error && <span className="text-red-500">{error}</span>}
    </>
  );
};

export default SelectCard;
