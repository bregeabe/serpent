"use client";

import React, { useEffect, useState } from "react";
import { Box } from "../../dashboard/components/Box";
import styles from "./ActivityBox.module.css";
import { LuCalendarDays, LuClock } from "react-icons/lu";
import Link from "next/link";

export interface Session {
  id: string;
  date: string;
  duration: string;
}

export function RecentActivityBox() {
  const [sessions, setSessions] = useState<Session[]>([]);

  const fetchSessions = async () => {
    const res = await fetch("/api/tracking/session/list");
    const data = await res.json();
    setSessions(data);
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  return (
    <Box width="100%" height="100%">
      <div className={styles.section}>
        <h4 className={styles.heading}>recently tracked</h4>

        <div className={styles.sessionGrid}>
          <div className={styles.headerItem}><LuCalendarDays size={16} /></div>
          <div className={styles.headerItem}><LuClock size={16} /></div>
          <div className={styles.headerItem}></div>
        </div>

        {sessions.map((session, i) => {
          const sessionId = typeof session.id === "string" ? session.id : null;
          if (!sessionId) return null;

          return (
            <div key={i} className={styles.sessionGrid}>
              <div className={`${styles.sessionItem} ${styles.date}`}>{session.date}</div>
              <div className={`${styles.sessionItem} ${styles.duration}`}>{session.duration}</div>
              <Link href={`/tracking/editing/${sessionId}`}>
                <button className={styles.editButton}>edit</button>
              </Link>
            </div>
          );
        })}
      </div>
    </Box>
  );
}
