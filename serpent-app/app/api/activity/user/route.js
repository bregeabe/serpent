import { NextResponse } from "next/server";
import { getAllActivities } from "../../../../db/utils/tracking/tracking-utils";

export async function GET() {
  const data = await getAllActivities();
  return NextResponse.json(data);
}
