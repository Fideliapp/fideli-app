import Chart from 'react-apexcharts';
import { useEffect, useState } from 'react';
import api from '../../services/api';
import Table from '../../components/table';
import { toast } from 'react-toastify';

interface User {
  id: number;
  admin: boolean;
  email: string;
  tel: string;
  actions?: string; // Add actions key to User interface
}

function Reports() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await api.get('/auth/users');
        setUsers(response.data);
      } catch (error) {
        setError('Failed to fetch users');
        console.error(error);
      }
    };

    getUsers();
  }, []);

  const columns: Array<{ key: keyof User | 'actions'; label: string; render?: (row: User) => JSX.Element }> = [
    { key: 'id', label: 'ID' },
    { key: 'admin', label: 'Admin' },
    { key: 'email', label: 'Email' },
    { key: 'tel', label: 'Telephone' },
    {
      key: 'actions',
      label: 'Ações',
      render: (row: User) => (
        <button
          className="px-4 py-2 text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
          onClick={() => handleButtonClick(row.id)}
        >
          Definir como admin
        </button>
      ),
    },
  ];

  const handleButtonClick = async (id: number) => {
    await api.put(`/auth/set-admin/${id}`);

    toast.success('Usuário definido como admin');
  };


  const barChartOptions = {
    chart: {
      type: 'bar' as const,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded',
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: ['a', 'b', 'c'],
    },
    yaxis: {
      title: {
        text: 'Pontos',
      },
    },
    title: {
      text: 'Pontos por Empresa',
      align: 'center',
    },
    colors: ['#4338ca'],
  };

  const barChartSeries = [
    {
      name: 'Pontos',
      data: [1, 2, 3],
    },
  ];

  const lineChartOptions = {
    chart: {
      type: 'line' as const,
      height: 350,
    },
    title: {
      text: 'Total Gasto',
      align: 'center',
    },
    xaxis: {
      categories: ['A', 'B', 'C'],
    },
    yaxis: {
      title: {
        text: 'Total Gasto (R$)',
      },
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    markers: {
      size: 4,
    },
    dataLabels: {
      enabled: false,
    },
    colors: ['#4338ca'],
  };

  const lineChartSeries = [
    {
      name: 'Total Gasto',
      data: [0, 2, 3],
    },
  ];

  return (
    <div className="bg-gray-100 w-full p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <Chart options={barChartOptions} series={barChartSeries} type="bar" height={350} />
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6">
          <Chart options={lineChartOptions} series={lineChartSeries} type="line" height={350} />
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6 col-span-2">
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <Table columns={columns} data={users} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Reports;
