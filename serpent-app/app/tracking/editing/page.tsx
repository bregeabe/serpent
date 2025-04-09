import { getSessionDetails } from "../../../db/utils/tracking/tracking-utils";
import { EditingBox } from "./components/EditingBox";
import Footer from "../../components/inappFooter";
import styles from "./editing.module.css";

interface Props {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function EditPage({ searchParams }: Props) {
  const sessionId = typeof searchParams.id === "string" ? searchParams.id : "";

  if (!sessionId) return <div>Invalid session ID</div>;

  const data = await getSessionDetails(sessionId);

  if (!data || !data.session) {
    return <div>Session not found</div>;
  }

  return (
    <div>
      <div className={styles.container}>
        <EditingBox
          session={data.session}
          intervals={data.intervals}
          activities={data.activities}
          availableActivities={data.availableActivities}
        />
      </div>
      <Footer />
    </div>
  );
}
