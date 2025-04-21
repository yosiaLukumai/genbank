import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const authenticated = req.cookies.get("authenticated_user_wvc")?.value;

  if (req.nextUrl.pathname.startsWith("/dashboard")) {
    if (!authenticated) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

 

  return NextResponse.next();
}

export const config = {
  matcher: "/dashboard/:path*",
};


