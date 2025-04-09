import styles from "./dashboard.module.css";
import { TextBox, GraphBox } from "./components/Box";
import { MultiGraphBox } from "./components/MultiGraphBox";
import {
  getCompleteUserDashboardData,
  getTop6ActivitiesByUser,
  getLeetCodeDifficultyPie,
  getGitHubMonthlyCommitLines
} from "../../db/utils/dashboard/dashboard-utils";
import Footer from "../components/inappFooter";

export default async function Home() {
  const userId = process.env.USER_ID;

  // load data
  const [rawData, top6, leetcodeDifficultyData, githubLineData] = await Promise.all([
    // gets all data for left text box
    getCompleteUserDashboardData(userId),
    // gets data for top right graph
    getTop6ActivitiesByUser(userId),
    // leetcode pie chart data
    getLeetCodeDifficultyPie(userId),
    // github commits for line chart data
    getGitHubMonthlyCommitLines(userId)
  ]);

  if (!rawData) {
    return <div>Error loading dashboard</div>;
  }

  const data = {
    ...rawData,
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.container}>
          <TextBox data={data} className={styles.textBox} width="400px" />
          <GraphBox
            className={styles.graphBoxTop}
            width="100%"
            height="350px"
            activityData={top6}
          />
          <MultiGraphBox
            className={styles.graphBoxBottom}
            width="100%"
            height="350px"
            chart1Data={leetcodeDifficultyData ?? []}
            chart2Data={githubLineData}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
