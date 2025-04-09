"use client";

import React, { useState, useEffect } from "react";
import { Box } from "../../dashboard/components/Box";
import styles from "./TrackerBox.module.css";

interface Props {
  userId: string
}

export function TrackerBox({ userId }: Props) {
  // state variables
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionEnded, setSessionEnded] = useState(false);
  const [currentStart, setCurrentStart] = useState<Date | null>(null);
  const [intervals, setIntervals] = useState<any[]>([]);
  const [activities, setActivities] = useState<string[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);

  // timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    let startTimestamp = currentStart ? currentStart.getTime() : null;

    if (isRunning && startTimestamp) {
      interval = setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - startTimestamp) / 1000);
        setTime(elapsed);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, currentStart ?? 0]);


  // 'what're you working on' data
  useEffect(() => {
    const fetchActivities = async () => {
      const res = await fetch("/api/activity/recent");
      const data = await res.json();
      const labels = data.map((entry: any) => {
        switch (entry.type) {
          // repo name instead of commit message
          case "commit":
            return `${entry.extra}`;
          case "leetcode":
            return `${entry.label} (${entry.extra})`;
          case "session":
            return entry.label;
          case "top":
            return entry.label;
          default:
            return entry.label;
        }
      });
      setActivities(Array.from(new Set(labels)));
    };
    fetchActivities();
  }, []);

  const handleStartStop = () => {
    if (isRunning) {
      // stop timer
      const stopTime = new Date();
      if (currentStart && selectedActivity) {
        setIntervals((prev) => [
          ...prev,
          {
            start: currentStart.toISOString(),
            end: stopTime.toISOString(),
            activity: selectedActivity,
          },
        ]);
      }
      setCurrentStart(null);
      setIsRunning(false);
      // start timer
    } else {
      if (!sessionStarted) setSessionStarted(true);
      setCurrentStart(new Date());
      setIsRunning(true);
    }
  };

  // stop the timer and allow save
  const handleEnd = () => {
    if (isRunning) handleStartStop();
    setSessionEnded(true);
  };

  // save
  const handleSave = async () => {
    if (!sessionStarted || intervals.length === 0) {
      alert("No session to save!");
      return;
    }

    const payload = {
      userId,
      intervals,
    };

    const res = await fetch("/api/tracking/session/save", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      alert("Session saved!");
      // reset state variables
      setSessionStarted(false);
      setSessionEnded(false);
      setTime(0);
      setIntervals([]);
      setSelectedActivity(null);
    } else {
      alert("Error saving session.");
    }
  };

  const formatTime = (t: number) => {
    const m = Math.floor(t / 60);
    const s = t % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  return (
    <Box width="100%" height="100%">
      <div className={styles.section}>
        <h4 className={styles.heading}>start tracking</h4>

        <div className={styles.trackerLayout}>
          <div className={styles.timerSection}>
            <div className={styles.timeDisplay}>{formatTime(time)}</div>
            <div className={styles.buttonRow}>
              <button className={styles.trackButton} onClick={handleStartStop}>
                {isRunning ? "Stop" : "Start"}
              </button>
              <button
                className={styles.trackButton}
                onClick={handleEnd}
                disabled={!sessionStarted || sessionEnded}
              >
                End
              </button>
            </div>
          </div>
          <div className={styles.taskColumn}>
            <div className={styles.statLabel}>what’re you working on?</div>
            <div className={styles.scrollableBox}>
              {activities.map((item, i) => (
                <div
                  className={`${styles.trackTag} ${
                    selectedActivity === item ? styles.selected : ""
                  }`}
                  key={i}
                  onClick={() => setSelectedActivity(item)}
                >
                  {item}
                </div>
              ))}
            </div>
            <div className={styles.saveButtonWrapper}>
              <button
                className={styles.trackButton}
                onClick={handleSave}
                disabled={!sessionEnded}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
}
