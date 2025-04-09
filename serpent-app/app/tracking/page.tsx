import styles from "./tracking.module.css";
import { getRecentSessionsWithDuration } from "../../db/utils/tracking/tracking-utils.js";
import { RecentActivityBox } from "./components/ActivityBox";
import { TrackerBox } from "./components/TrackerBox";
import Footer from "../components/inappFooter";

export default async function TrackingPage() {
  const userId = process.env.USER_ID;
  const recentSessions = await getRecentSessionsWithDuration(userId);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.boxGrid}>
          <div className={styles.trackerWrapper}>
            <TrackerBox userId={userId!} />
          </div>
          <div className={styles.activityWrapper}>
            <RecentActivityBox sessions={recentSessions} />
          </div>
        </div>
      </main>
    <Footer />
    </div>
  );
}
