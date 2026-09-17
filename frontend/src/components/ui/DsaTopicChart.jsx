import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip
);

const DsaTopicChart = () => {
  const data = {
    labels: ['Arrays', 'Linked Lists', 'Trees', 'Graphs', 'DP', 'SQL', 'Stacks', 'Binary Search'],
    datasets: [
      {
        label: 'Proficiency (%)',
        data: [92, 88, 45, 30, 25, 95, 70, 65],
        backgroundColor: (context) => {
          const value = context.raw;
          if (value > 80) return 'rgba(0, 112, 243, 0.9)'; // Strong
          if (value > 50) return 'rgba(0, 112, 243, 0.4)'; // Medium
          return 'rgba(255, 51, 51, 0.7)'; // Needs improvement
        },
        borderRadius: 4,
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
          display: false, // hide y axis ticks for cleaner look
          min: 0,
          max: 100,
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
        callbacks: {
          label: (context) => `Score: ${context.raw}`
        }
      }
    },
  };

  return (
    <div className="w-full h-[220px]">
      <Bar data={data} options={options} />
    </div>
  );
};

export default DsaTopicChart;
