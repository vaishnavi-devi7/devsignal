import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler
);

const WeeklyActivityChart = () => {
  const data = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Problems Solved',
        data: [1, 3, 2, 5, 0, 4, 6],
        borderColor: 'rgba(0, 112, 243, 1)',
        backgroundColor: 'rgba(0, 112, 243, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgba(0, 112, 243, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(0, 112, 243, 1)',
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: '#888888',
          font: { family: "'Inter', sans-serif", size: 11 },
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
        ticks: {
          display: false,
          min: 0,
        },
        border: { display: false }
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#111111',
        titleColor: '#ededed',
        bodyColor: '#888888',
        borderColor: '#222222',
        borderWidth: 1,
        padding: 10,
        displayColors: false,
      }
    },
  };

  return (
    <div className="w-full h-[160px]">
      <Line data={data} options={options} />
    </div>
  );
};

export default WeeklyActivityChart;
