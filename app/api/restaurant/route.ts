import { NextRequest, NextResponse } from "next/server";

import { supabase } from "@/lib/supabase-client";

interface RequestBody {
  profileId: string;
}

export async function POST(req: NextRequest) {
  const body: RequestBody = await req.json();
  const { profileId } = body;
  console.log("api:updaterestaurants:profileId:", profileId);

  const { data, error } = await supabase
    .from("restaurants")
    .insert({ profileId });

  if (error) {
    console.log("api:updaterestaurants:error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function GET() {
  console.log("api:gettingrestaurants");

  const { data, error } = await supabase
    .from("restaurants")
    .select("profileId");

  if (error) {
    console.log("api:gettingrestaurants:error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ restaurants: data });
}
