import { NextRequest, NextResponse } from "next/server";
import { refreshUserTrackingStats } from "../../../../db/utils/dashboard/dashboard-utils";

export async function POST(req) {
  const { username } = await req.json();

  if (!username) return NextResponse.json({ error: "Missing username" }, { status: 400 });

  try {
    await refreshUserTrackingStats(username);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error in tracking/setupUser:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
