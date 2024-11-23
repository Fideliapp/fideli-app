import React, { useEffect } from 'react';
import { useController } from 'react-hook-form';
import api from '../../../services/api';
import { toast } from 'react-toastify';

interface Enterprise {
  id: number;
  nome: string;
}

interface SelectEnterpriseProps {
  name: string;
  control: any;
  error?: string;
}

const SelectEnterprise = (props: SelectEnterpriseProps) => {
  const { name, control, error } = props;

  const [enterprises, setEnterprises] = React.useState<Enterprise[]>([]);

  const { field } = useController({
    name,
    control,
    defaultValue: '',
  });

  useEffect(() => {
    const fetchEnterprises = async () => {
      try {
        const response = await api.get('/enterprise');
        setEnterprises(response.data);
      } catch (error: any) {
        toast.error(
          error.response?.data.message || 'Erro ao carregar empresas. Tente novamente.'
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
        <option value="">Selecione uma empresa</option>
        {enterprises.map((enterprise) => (
          <option key={enterprise.id} value={enterprise.id}>
            {enterprise.nome}
          </option>
        ))}
      </select>
      {error && <span className="text-red-500">{error}</span>}
    </>
  );
};

export default SelectEnterprise;
