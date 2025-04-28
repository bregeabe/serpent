import { getRecentMixedActivity } from "../../../../db/utils/tracking/tracking-utils";

export async function GET(req) {
  const userId = process.env.USER_ID;
  const activity = await getRecentMixedActivity(userId, 15);
  return Response.json(activity);
}
