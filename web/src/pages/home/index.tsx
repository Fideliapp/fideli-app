import { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface GetUserPoints {
  id: number;
  nome: string;
  pontos: number;
}
interface TotalSpend {
  data: string;
  valor: number;
}

function Home() {
  const [barChartData, setBarChartData] = useState<number[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  const [lineChartData, setLineChartData] = useState<string[]>([]);
  const [spend, setSpend] = useState<number[]>([])

  const { userId } = useAuth();

  useEffect(() => {
    if (userId == null) return;

    api.get(`/buys/points-by-enterprise/${userId}`).then((response) => {
      const pointsData = response.data.map((item: GetUserPoints) => item.pontos);
      const categoryData = response.data.map((item: GetUserPoints) => item.nome);
      setBarChartData(pointsData);
      setCategories(categoryData);
    });

    api.get(`/buys/total-spend/${userId}`).then((response) => {
      const spendData = response.data.map((item: TotalSpend) => {
        const date = new Date(item.data);
        const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear().toString().slice(-2)}`;
        return formattedDate;
      });
      const categoryData = response.data.map((item: TotalSpend) => item.valor);
      setLineChartData(spendData);
      setSpend(categoryData);
    });
  }, [userId]);

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
      categories: categories,
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
      data: barChartData,
    },
  ];

  const lineChartOptions = {
    chart: {
      type: 'line' as const,
      height: 350,
    },
    title: {
      text: 'Gastos',
      align: 'center',
    },
    xaxis: {
      categories: lineChartData
    },
    yaxis: {
      title: {
        text: 'Pontos',
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
      name: 'Pontos do Usuário',
      data: spend,
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
      </div>
    </div>
  );
}

export default Home;
