"use client";

import { useEffect, useState } from "react";
import styles from "./other.module.css";
import { Box } from "../dashboard/components/Box";
import Footer from "../components/inappFooter";

interface Activity {
  activity_id: string;
  name: string;
  description?: string;
  type: string;
  language?: string;
}

export default function ManageActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [newActivity, setNewActivity] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newLanguage, setNewLanguage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [editedActivities, setEditedActivities] = useState<
    Record<string, { name: string; description: string; language: string }>
  >({});

  const fetchActivities = async () => {
    const res = await fetch("/api/activity/user");
    const data = await res.json();
    setActivities(data);

    const initialEdits: Record<
      string,
      { name: string; description: string; language: string }
    > = {};
    data.forEach((a: Activity) => {
      initialEdits[a.activity_id] = {
        name: a.name || "",
        description: a.description || "",
        language: a.language || "",
      };
    });
    setEditedActivities(initialEdits);
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleAdd = async () => {
    if (!newActivity.trim()) return;
    setIsSaving(true);
    const res = await fetch("/api/activity/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newActivity.trim(),
        description: newDescription.trim(),
        language: newLanguage.trim(),
      }),
    });
    if (res.ok) {
      setNewActivity("");
      setNewDescription("");
      setNewLanguage("");
      await fetchActivities();
    }
    setIsSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this activity?")) return;
    const res = await fetch(`/api/activity/delete?id=${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      await fetchActivities();
    }
  };

  const handleEditChange = (
    id: string,
    field: "name" | "description" | "language",
    value: string
  ) => {
    setEditedActivities((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleUpdate = async (id: string) => {
    const update = editedActivities[id];
    if (!update || !update.name?.trim()) return;

    const res = await fetch(`/api/activity/update`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        activity_id: id,
        name: update.name.trim(),
        description: update.description?.trim() ?? "",
        language: update.language?.trim() ?? "",
      }),
    });

    if (res.ok) {
      await fetchActivities();
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#000",
      }}
    >
      <div style={{ padding: "40px", flex: "1 0 auto" }}>
        <Box width="100%">
          <h2 className={styles.heading}>Manage Activities</h2>

          <div style={{ marginBottom: 24 }}>
            <input
              type="text"
              placeholder="New activity name"
              value={newActivity}
              onChange={(e) => setNewActivity(e.target.value)}
              className={`${styles.timeInput} ${styles.fullWidthInput}`}
            />
            <input
              type="text"
              placeholder="Optional description"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className={`${styles.timeInput} ${styles.fullWidthInput}`}
            />
            <input
              type="text"
              placeholder="Language"
              value={newLanguage}
              onChange={(e) => setNewLanguage(e.target.value)}
              className={`${styles.timeInput} ${styles.fullWidthInput}`}
            />
            <button
              className={styles.saveButton}
              onClick={handleAdd}
              disabled={isSaving}
            >
              Add
            </button>
          </div>

          {activities.map((activity) => {
            const edits = editedActivities[activity.activity_id] ?? {
              name: "",
              description: "",
              language: "",
            };

            return (
              <div key={activity.activity_id} className={styles.intervalBox}>
                <input
                  type="text"
                  value={edits.name}
                  onChange={(e) =>
                    handleEditChange(activity.activity_id, "name", e.target.value)
                  }
                  className={`${styles.timeInput} ${styles.fullWidthInput}`}
                />
                <input
                  type="text"
                  value={edits.description}
                  onChange={(e) =>
                    handleEditChange(activity.activity_id, "description", e.target.value)
                  }
                  className={`${styles.timeInput} ${styles.fullWidthInput}`}
                />
                <input
                  type="text"
                  value={edits.language}
                  onChange={(e) =>
                    handleEditChange(activity.activity_id, "language", e.target.value)
                  }
                  className={`${styles.timeInput} ${styles.fullWidthInput}`}
                />
                <div style={{ display: "flex", gap: "12px", marginTop: 4 }}>
                  <button
                    className={styles.saveButton}
                    onClick={() => handleUpdate(activity.activity_id)}
                  >
                    Update
                  </button>
                  <button
                    className={styles.cancelButton}
                    onClick={() => handleDelete(activity.activity_id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </Box>
      </div>
      <div style={{ flexShrink: 0 }}>
        <Footer />
      </div>
    </div>
  );
}
