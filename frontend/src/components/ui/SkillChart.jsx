import React from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip
);

const SkillChart = () => {
  const data = {
    labels: ['JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'AWS'],
    datasets: [
      {
        label: 'Skill Level',
        data: [90, 75, 85, 80, 70, 60],
        backgroundColor: 'rgba(0, 112, 243, 0.2)',
        borderColor: 'rgba(0, 112, 243, 0.8)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(0, 112, 243, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(0, 112, 243, 1)',
        pointRadius: 3,
        pointHoverRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        angleLines: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          circular: true,
        },
        pointLabels: {
          color: '#888888',
          font: {
            family: "'Inter', sans-serif",
            size: 11,
          },
        },
        ticks: {
          display: false,
          min: 0,
          max: 100,
          stepSize: 20,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#111111',
        titleColor: '#ededed',
        bodyColor: '#888888',
        borderColor: '#222222',
        borderWidth: 1,
        padding: 10,
        displayColors: false,
        callbacks: {
          label: (context) => `Proficiency: ${context.raw}%`
        }
      }
    },
  };

  return (
    <div className="w-full h-[240px]">
      <Radar data={data} options={options} />
    </div>
  );
};

export default SkillChart;
