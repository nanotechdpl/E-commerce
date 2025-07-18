"use client"
import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

export const ChartComponent: React.FC = () => {
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    const data = {
      labels: ['', 'Jan 28', '', 'Jan 29', '', '', 'Jan 30', '', '', 'Jan 31', '', '', 'Feb 1', '', ''],
      datasets: [
        {
          label: 'New Visitor',
          data: [18, 12, 6, 9, 12, 3, 9, 14, 20, 8, 15, 10, 5, 14, 20],
          backgroundColor: 'rgba(255, 165, 0, 6)', // Light Orange
          borderColor: 'rgba(255, 165, 0, 3)', // Dark Orange
          borderWidth: 1,
          order: 1 // Ensure this dataset is drawn first
        },
        {
          label: 'Old Visitor',
          data: [10, 8, 15, 12, 6, 9, 14, 20, 18, 5, 18, 10, 15, 8, 21],
          backgroundColor: 'rgba(255, 165, 0, 0.5)', // Light Red
          borderColor: 'rgba(255, 166, 0, 160)', // Dark Red
          borderWidth: 1,
          order: 1 // Ensure this dataset is drawn first
        },
        {
          label: 'Last Month Visitor',
          data: [20, 25, 18, 14, 19, 16, 20, 15, 10, 10, 18, 12, 10, 24, 26],
          borderColor: 'rgba(0, 0, 255, 1)', // Blue color
          borderWidth: 2,
          fill: false,
          type: 'line',
          order: 2 // Ensure this dataset is drawn last
        },
        {
          label: 'Average Visitor',
          data: [5, 8, 12, 6, 10, 5, 10, 5, 10, 12, 6, 10, 15, 10, 12],
          borderColor: 'green', // Green color
          borderWidth: 2,
          fill: false,
          type: 'line',
          order: 2 // Ensure this dataset is drawn last
        },
      ],
    };

    const config = {
      type: 'bar',
      data,
      options: {
        scales: {
          x: {
            stacked: true,
          },
          y: {
            beginAtZero: false,
            stacked: true,
            position: 'left', // Align the first y-axis on the left
          },
          y1: {
            beginAtZero: true,
            position: 'right', // Align the second y-axis on the right
          },
        },
      },
    };

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = document.getElementById('myChart') as HTMLCanvasElement;
    chartRef.current = new Chart(ctx, config as any);
  }, []);

  return (
    <div>
      <div style={{ width: '1000px', padding: '20px', borderRadius: '20px' }} className='  bg-white text-black'>
        <canvas id="myChart"></canvas>
      </div>
    </div>
  );
};

export default ChartComponent;