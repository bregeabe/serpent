"use client";

import React from "react";
import styles from "./Box.module.css";
import { FaGithub, FaCode, FaJava } from "react-icons/fa";
import {
  SiLeetcode,
  SiPython,
  SiJavascript,
  SiTypescript,
  SiCplusplus,
  SiC,
  SiRuby,
  SiGo,
  SiRust,
  SiSwift,
  SiKotlin,
  SiPhp,
  SiHtml5,
  SiCss3,
  SiScala,
  SiDart,
  SiHaskell,
  SiPerl,
  SiElixir
} from "react-icons/si";
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// language icons
const languageIcons: Record<string, React.ReactNode> = {
  Python: <SiPython color="#FFD43B" />,
  JavaScript: <SiJavascript color="#F7DF1E" />,
  TypeScript: <SiTypescript color="#3178C6" />,
  "C++": <SiCplusplus color="#00599C" />,
  C: <SiC color="#A8B9CC" />,
  Java: <FaJava color="#007396" />,
  Ruby: <SiRuby color="#CC342D" />,
  Go: <SiGo color="#00ADD8" />,
  Rust: <SiRust color="#000000" />,
  Swift: <SiSwift color="#FA7343" />,
  Kotlin: <SiKotlin color="#7F52FF" />,
  PHP: <SiPhp color="#777BB4" />,
  HTML: <SiHtml5 color="#E34F26" />,
  CSS: <SiCss3 color="#1572B6" />,
  Scala: <SiScala color="#DC322F" />,
  Dart: <SiDart color="#0175C2" />,
  Haskell: <SiHaskell color="#5D4F85" />,
  Perl: <SiPerl color="#39457E" />,
  Elixir: <SiElixir color="#4B275F" />
};

interface BoxProps {
  className?: string;
  width?: string;
  height?: string;
  children?: React.ReactNode;
}

export function Box({ className, width, height, children }: BoxProps) {
  return (
    <div
      className={`${styles.box} ${className || ""}`}
      style={{ width: width || "auto", height: height || "auto" }}
    >
      {children}
    </div>
  );
}

// left half box data
export interface DashboardData {
  profile: {
    name: string;
    username: string;
    github: { username: string; followers: number };
    leetcode: { username: string; views: number };
  };
  topLanguages: Record<string, string>;
  topActivities: Record<string, string>;
  topStats: {
    sessionsTracked: number;
    intervalsLogged: number;
    languagesUsed: number;
    totalHours: number;
  };
  activityTotals: {
    repoCount: number;
    commitCount: number;
    submissionCount: number;
    solutionCount: number;
  };
}

interface TextBoxProps extends BoxProps {
  data: DashboardData | null;
}

export function TextBox({ data, className, ...boxProps }: TextBoxProps) {
  if (!data) return <Box {...boxProps} className={className}>No data available</Box>;

  const { profile, topLanguages, topActivities, topStats } = data;

  const stat = (label: string, value: string | number) => (
    <div className={styles.stat}>
      <span className={styles.statValue}>{value}</span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  );

  // recolor for ranks
  const getRankClass = (index: number) => {
    if (index === 0) return styles.gold;
    if (index === 1) return styles.silver;
    if (index === 2) return styles.bronze;
    return "";
  };

  return (
    <Box className={`${styles.textBoxContainer} ${className || ""}`} {...boxProps}>
      <div className={styles.profileHeader}>
        <div>
          <div className={styles.name}>{profile.name}</div>
          <div className={styles.username}>{profile.username}</div>
        </div>
        <div className={styles.social}>
          <div className={styles.socialRow}>
            <FaGithub size={14} />
            {profile.github.username}{" "}
            <span className={styles.greenStat}>{profile.github.followers} followers</span>
          </div>
          <div className={styles.socialRow}>
            <SiLeetcode size={14} />
            {profile.leetcode.username}{" "}
            <span className={styles.orangeStat}>{profile.leetcode.views} views</span>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h4>Top Languages</h4>
        {Object.entries(topLanguages).map(([lang, time], i) => (
          <div className={styles.row} key={lang}>
            <span className={`${styles.rank} ${getRankClass(i)}`}>#{i + 1}</span>
            <span className={styles.icon}>
              {languageIcons[lang] ?? <FaCode color="#888" />}
            </span>
            <span className={styles.label}>{lang}</span>
            <span className={styles.time}>{time} total</span>
          </div>
        ))}
      </div>

      <div className={styles.section}>
        <h4>Top Activities</h4>
        {Object.entries(topActivities).map(([act, time], i) => (
          <div className={styles.row} key={act}>
            <span className={`${styles.rank} ${getRankClass(i)}`}>#{i + 1}</span>
            <span className={styles.label}>{act}</span>
            <span className={styles.time}>{time} total</span>
          </div>
        ))}
      </div>

      <div className={styles.section}>
        <h4>Top Stats</h4>
        <div className={styles.statsGrid}>
          {stat("sessions tracked", topStats.sessionsTracked)}
          {stat("intervals logged", topStats.intervalsLogged)}
          {stat("languages used", topStats.languagesUsed)}
          {stat("hours total", topStats.totalHours)}
        </div>
      </div>

      <div className={styles.section}>
      <h4>Activity Totals</h4>
      <div className={styles.statsGrid}>
        {stat("repos", data.activityTotals.repoCount)}
        {stat("commits", data.activityTotals.commitCount)}
        {stat("submissions", data.activityTotals.submissionCount)}
        {stat("solutions", data.activityTotals.solutionCount)}
      </div>
    </div>
    </Box>
  );
}

interface GraphBoxProps extends BoxProps {
  activityData: { name: string; hours: string }[];
}

export function GraphBox({ className, children, activityData, ...boxProps }: GraphBoxProps) {
  const labels = activityData.map((item) => item.name);
  const data = activityData.map((item) => parseFloat(item.hours));

  // bar chart settings
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Hours',
        data,
        backgroundColor: [
          '#ECAC44',
          '#C084FC',
          '#C084FC',
          '#C084FC',
          '#C084FC',
          '#4ADE80'
        ],
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'What have you been working on',
        color: 'white',
        font: { size: 16 },
      },
    },
    scales: {
      y: {
        ticks: { color: 'white' },
        title: {
          display: true,
          text: 'Hours',
          color: 'white',
        },
        grid: { color: '#333' },
      },
      x: {
        ticks: { color: 'white' },
        title: {
          display: true,
          text: 'Activities',
          color: 'white',
        },
        grid: { color: '#333' },
      },
    },
  };

  return (
    <Box className={`${styles.graphBox} ${className || ""}`} {...boxProps}>
      <Bar data={chartData} options={options} />
    </Box>
  );
}