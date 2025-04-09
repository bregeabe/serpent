import { NextResponse } from "next/server";
import { saveNewSessionWithIntervals } from "../../../../../db/utils/tracking/tracking-utils.js";

export async function POST(req) {
  try {
    const { userId, intervals } = await req.json();

    if (!userId || !Array.isArray(intervals)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const result = await saveNewSessionWithIntervals(userId, intervals);

    if (result.success) {
      return NextResponse.json({ message: "Session saved successfully", sessionId: result.sessionId });
    } else {
      return NextResponse.json({ error: result.error || "Save failed" }, { status: 500 });
    }
  } catch (err) {
    console.error("POST /api/tracking/saveSession error:", err.message);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
