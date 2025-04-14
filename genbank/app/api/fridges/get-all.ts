import {NextRequest, NextResponse} from "next/server";

export async function GET(request: NextRequest) {
  const {email, password, role, name} = await request.json();
  console.log(email, password, role, name);
  

  return NextResponse.json({
    success: false,
    error: "Invalid email or password",
  });
}