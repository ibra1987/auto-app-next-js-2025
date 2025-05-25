// import { auth } from "@/auth";
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// export async function middleware(request: NextRequest) {
//   const session = await auth();
//   const { pathname } = request.nextUrl;

//   // Define protected paths
//   const protectedPaths = ["/admin", "/in", "/api"];

//   // Check if the current request matches a protected path
//   const isProtected = protectedPaths.some((path) =>
//     pathname.startsWith(path)
//   );

//   // Exemptions: allow access to /api/admin/login without auth
// const isLoginApi = pathname === "/api/admin/login" || pathname.startsWith("/api/auth");

//   if (isProtected && !isLoginApi && !session) {
//     // If it's an API route, return 401 instead of redirect
//     if (pathname.startsWith("/api")) {
//       return new NextResponse(
//         JSON.stringify({ status: "unauthorized", message: "Not authenticated" }),
//         {
//           status: 401,
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );
//     }

//     // If it's a page route, redirect to login
//     const loginUrl = new URL("/login", request.url);
//     return NextResponse.redirect(loginUrl);
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     "/admin/:path*",
//     "/in/:path*",
//     "/api/:path*"
//   ],
// };


export async function middleware(req:Request) {
  
}