"use client";

import React from "react";
import styles from "./Box.module.css";
import { Pie, Line } from 'react-chartjs-2';
import { Box } from "./Box";
import {
    ChartOptions,
  } from 'chart.js';

import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  ArcElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);


interface MultiGraphBoxProps {
  className?: string;
  width?: string;
  height?: string;
  chart1Data: { name: string; value: number }[];
  chart2Data: { repo: string; month: string; commits: number }[];
}

// chart1: pie chart
// chart2: line chart
export function MultiGraphBox({
  className,
  width,
  height,
  chart1Data,
  chart2Data,
}: MultiGraphBoxProps) {
    const uniqueMonths = [...new Set(chart2Data.map((d) => d.month))];
    const uniqueRepos = [...new Set(chart2Data.map((d) => d.repo))];

    const colorPalette = [
      "#60A5FA", "#F87171", "#34D399", "#FBBF24", "#A78BFA", "#FB7185"
    ];

    // convert out repos and their commits to the colored line with predefined colors above
    const lineDatasets = uniqueRepos.map((repo, i) => {
      const data = uniqueMonths.map((month) => {
        const match = chart2Data.find((d) => d.repo === repo && d.month === month);
        return match ? match.commits : 0;
      });

      return {
        label: repo,
        data,
        fill: false,
        tension: 0.3,
        borderColor: colorPalette[i % colorPalette.length],
        backgroundColor: colorPalette[i % colorPalette.length],
        pointRadius: 4,
        pointHoverRadius: 6,
      };
    });

    const lineData = {
      labels: uniqueMonths,
      datasets: lineDatasets,
    };

    const lineOptions: ChartOptions<'line'> = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: "GitHub Monthly Commits",
          color: "white",
          font: { size: 16 },
        },
        legend: {
          labels: { color: "white" },
          position: "bottom",
        },
      },
      scales: {
        x: {
          title: { display: true, text: "Month", color: "white" },
          ticks: { color: "white" },
          grid: { color: "#333" },
        },
        y: {
          title: { display: true, text: "Commits", color: "white" },
          ticks: { color: "white" },
          grid: { color: "#333" },
        },
      },
    };

  // displaying our data as the chart
  const pieData = {
    labels: chart1Data.map((d) => d.name),
    datasets: [
      {
        data: chart1Data.map((d) => d.value),
        backgroundColor: ["#1ebaba", "#ffb700", "#f63737"],
      },
    ],
  };

  const pieOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "LeetCode Submissions",
        color: "white",
        font: { size: 16, weight: "bold" },
        position: "top",
        padding: { top: 20, bottom: 10 },
      },
      legend: {
        labels: { color: "white", font: { size: 14 } },
        position: "right",
      },
    },
  };

  return (
    <Box
      className={`${styles.graphBox} ${className || ""}`}
      width={width}
      height={height}
    >
    <div className={styles.dualChartContainer}>
    <div className={`${styles.chartWrapper} ${styles.pieWrapper}`} style={{ maxWidth: "40%" }}>
        <Pie data={pieData} options={pieOptions} />
    </div>
    <div className={styles.chartWrapper} style={{ maxWidth: "60%" }}>
        <Line data={lineData} options={lineOptions} />
    </div>
    </div>
    </Box>
  );
}
