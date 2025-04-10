"use client";

import { useEffect, useState } from "react";
import styles from "./tracking.module.css";
import { RecentActivityBox } from "./components/ActivityBox";
import { TrackerBox } from "./components/TrackerBox";
import Footer from "../components/inappFooter";

export default function TrackingPage() {
  const [sessions, setSessions] = useState([]);
  const userId = process.env.NEXT_PUBLIC_USER_ID;

  const fetchSessions = async () => {
    const res = await fetch("/api/tracking/session/list");
    const data = await res.json();
    setSessions(data);
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.boxGrid}>
          <div className={styles.trackerWrapper}>
            <TrackerBox userId={userId!} refreshSessions={fetchSessions} />
          </div>
          <div className={styles.activityWrapper}>
            <RecentActivityBox/>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
