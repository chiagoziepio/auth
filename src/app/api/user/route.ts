import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const reqHeaders = new Headers(req.headers);
    const userId = reqHeaders.get("x-user-id");

    console.log(userId);

    return NextResponse.json({
      success: true,
      msg: "User fetched successfully",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      msg: "Something went wrong",
    });
  }
}
