"use client";

import { useState, useMemo } from "react";
import styles from "./EditingBox.module.css";
import { Box } from "../../../dashboard/components/Box";

export interface Activity {
  interval_id: string;
  activity_id: string;
  activity_name: string;
}

export interface Interval {
  interval_id: string;
  start: string;
  end: string;
  duration: string;
}

export interface Session {
  id: string;
  date: string;
  duration: string;
}

export interface AvailableActivity {
  activity_id: string;
  name: string;
}

interface Props {
  session: Session;
  intervals: Interval[];
  activities: Activity[];
  availableActivities: AvailableActivity[];
}

interface EditableActivity {
  interval_id: string;
  activity_id: string;
}

export function EditingBox({
  session,
  intervals,
  activities,
  availableActivities,
}: Props) {
  const [editableSession] = useState(session);
  const [editableIntervals, setEditableIntervals] = useState(intervals);

  // matching activities to intervals
  const [editableActivities, setEditableActivities] = useState<EditableActivity[]>(() =>
    intervals.map((int) => {
      const matched = activities.find((a) => a.interval_id === int.interval_id);
      return {
        interval_id: int.interval_id,
        activity_id: matched?.activity_id || "",
      };
    })
  );

  // handles working with now-deleted activities, instead of just pulling from the activities table, we just
  // gives a list of activity objects both available to the user and used in the session
  const mergedActivityOptions = useMemo(() => {
    const map = new Map<string, string>();

    availableActivities.forEach((act) => {
      map.set(act.activity_id, act.name);
    });

    activities.forEach((a) => {
      if (!map.has(a.activity_id)) {
        map.set(a.activity_id, a.activity_name);
      }
    });

    return Array.from(map.entries()).map(([id, name]) => ({
      activity_id: id,
      name,
    }));
  }, [availableActivities, activities]);

  const handleIntervalChange = (
    id: string,
    field: "start" | "end",
    value: string
  ) => {
    setEditableIntervals((prev) =>
      prev.map((int) =>
        int.interval_id === id ? { ...int, [field]: value } : int
      )
    );
  };

  const handleActivityChange = (intervalId: string, newActivityId: string) => {
    setEditableActivities((prev) =>
      prev.map((act) =>
        act.interval_id === intervalId
          ? { ...act, activity_id: newActivityId }
          : act
      )
    );
  };

  const handleSave = async () => {
    try {
      const res = await fetch("/api/tracking/session/update", {
        method: "POST",
        body: JSON.stringify({
          sessionId: session.id,
          intervals: editableIntervals,
          activities: editableActivities,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unknown error");
      alert("Saved successfully");
    } catch (err) {
      console.error("Save failed", err);
      alert("Save failed");
    }
  };

  return (
    <div style={{ padding: "32px" }}>
      <Box width="100%" height="auto">
        <h2 className={styles.heading}>
          Editing Session for {editableSession.date}
        </h2>
        <p className={styles.meta}>Total Duration: {editableSession.duration}</p>

        {editableIntervals.map((interval) => {
          const selectedActivity = editableActivities.find(
            (a) => a.interval_id === interval.interval_id
          )?.activity_id;

          return (
            <div key={interval.interval_id} className={styles.intervalBox}>
              <p className={styles.label}>
                <strong>Interval:</strong>
                <input
                  type="time"
                  value={interval.start}
                  onChange={(e) =>
                    handleIntervalChange(
                      interval.interval_id,
                      "start",
                      e.target.value
                    )
                  }
                  className={styles.timeInput}
                />
                -
                <input
                  type="time"
                  value={interval.end}
                  onChange={(e) =>
                    handleIntervalChange(
                      interval.interval_id,
                      "end",
                      e.target.value
                    )
                  }
                  className={styles.timeInput}
                />
              </p>
              <p className={styles.submeta}>Duration: {interval.duration}</p>

              <label className={styles.label}>
                Activity:
                <select
                  value={selectedActivity || ""}
                  onChange={(e) =>
                    handleActivityChange(interval.interval_id, e.target.value)
                  }
                  className={styles.select}
                >
                  <option value="" disabled>
                    Select activity
                  </option>
                  {mergedActivityOptions.map((activity) => (
                    <option
                      key={activity.activity_id}
                      value={activity.activity_id}
                    >
                      {activity.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          );
        })}

        <div style={{ marginTop: "24px", display: "flex", gap: "12px" }}>
          <button className={styles.saveButton} onClick={handleSave}>
            Save Changes
          </button>
          <button className={styles.cancelButton}>Cancel</button>
        </div>
      </Box>
    </div>
  );
}
