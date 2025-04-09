import { NextResponse } from "next/server";
import { updateActivity } from "../../../../db/utils/tracking/tracking-utils";

export async function PUT(req) {
  const { activity_id, name, description, language } = await req.json();

  if (!activity_id) {
    return NextResponse.json({ error: "Missing activity ID" }, { status: 400 });
  }

  const result = await updateActivity(activity_id, { name, description, language });

  if (result.success) {
    return NextResponse.json({ message: "Updated" });
  } else {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }
}
