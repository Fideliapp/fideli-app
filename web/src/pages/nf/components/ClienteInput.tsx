import React, { useEffect } from 'react';
import { useController } from 'react-hook-form';
import api from '../../../services/api';
import { toast } from 'react-toastify';

interface User {
  id: number;
  admin: boolean;
  email: string;
  tel: string;
  nome: string;
}

interface SelectClienteProps {
  name: string;
  control: any;
  error?: string;
}

const SelectCliente = (props: SelectClienteProps) => {
  const { name, control, error } = props;

  const [users, setUsers] = React.useState<User[]>([]);

  const { field } = useController({
    name,
    control,
    defaultValue: '',
  });

  useEffect(() => {
    const fetchEnterprises = async () => {
      try {
        const response = await api.get('/auth/users');
        setUsers(response.data);
      } catch (error: any) {
        toast.error(
          error.response?.data.message || 'Erro ao carregar clientes. Tente novamente.'
        );
      }
    };

    fetchEnterprises();
  }, []);

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
        <option value="">Selecione uma cliente</option>
        {users.map((users) => (
          <option key={users.id} value={users.id}>
            {users.nome}
          </option>
        ))}
      </select>
      {error && <span className="text-red-500">{error}</span>}
    </>
  );
};

export default SelectCliente;
