import { NextResponse } from "next/server";
import { createActivity } from "../../../../db/utils/tracking/tracking-utils";

export async function POST(req) {
  const { name, description, language } = await req.json();

  if (!name || typeof name !== "string") {
    return NextResponse.json({ error: "Invalid name" }, { status: 400 });
  }

  const result = await createActivity(name, description || "", language || "");

  if (result.success) {
    return NextResponse.json({ message: "Created", activity_id: result.activity_id });
  } else {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }
}
