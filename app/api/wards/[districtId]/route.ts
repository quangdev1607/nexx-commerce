import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { districtId: string } },
) {
  const { districtId } = params;

  try {
    const response = await axios.get(
      `https://vapi.vnappmob.com/api/province/ward/${districtId}`,
    );
    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 },
    );
  }
}
