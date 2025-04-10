import { getRecentSessionsWithDuration } from "../../../../../db/utils/tracking/tracking-utils";

export async function GET() {
  const userId = process.env.USER_ID;
  const sessions = await getRecentSessionsWithDuration(userId);
  return Response.json(sessions);
}
