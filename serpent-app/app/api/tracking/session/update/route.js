import { NextResponse } from "next/server";
import { updateSessionIntervalsAndActivities } from "../../../../../db/utils/tracking/tracking-utils";

export async function POST(req) {
  try {
    const body = await req.json();
    const { sessionId, intervals, activities } = body;

    if (!sessionId || !Array.isArray(intervals) || !Array.isArray(activities)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const result = await updateSessionIntervalsAndActivities(sessionId, intervals, activities);

    if (result.success) {
      return NextResponse.json({ message: "Session updated successfully" });
    } else {
      return NextResponse.json({ error: result.error || "Update failed" }, { status: 500 });
    }
  } catch (err) {
    console.error("Update session error:", err.message);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
