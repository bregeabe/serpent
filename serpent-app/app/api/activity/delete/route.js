import { NextResponse } from "next/server";
import { deleteActivity } from "../../../../db/utils/tracking/tracking-utils";

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const activity_id = searchParams.get("id");

  if (!activity_id || typeof activity_id !== "string") {
    return NextResponse.json({ error: "Missing or invalid activity ID" }, { status: 400 });
  }

  const result = await deleteActivity(activity_id);

  if (result.success) {
    return NextResponse.json({ message: "Deleted successfully" });
  } else {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }
}
