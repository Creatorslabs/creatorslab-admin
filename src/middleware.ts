import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Define allowed routes per role
const roleRouteMap: Record<
  "Super Admin" | "Admin" | "Moderator" | "Support",
  string[]
> = {
  "Super Admin": ["/", "/users", "/tasks", "/engagement", "/admins"],
  Admin: ["/", "/users", "/tasks", "/engagement", "/admins"],
  Moderator: ["/", "/tasks", "/engagement"],
  Support: ["/", "/users"],
};

type UserStatus = "Active" | "Restricted" | "Banned" | undefined;
type UserRole = "Super Admin" | "Admin" | "Moderator" | "Support" | undefined;

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    const publicFile = /\.(.*)$/.test(path);
    const isNextStatic = path.startsWith("/_next/");

    if (
      publicFile ||
      isNextStatic ||
      path.startsWith("/fonts") ||
      path.startsWith("/images")
    ) {
      return NextResponse.next();
    }

    const isAuth = !!token;
    const role = token?.role as UserRole;
    const status = token?.status as UserStatus;

    if (!isAuth) {
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    }

    // Redirect restricted or banned users unless they are on /support
    if (status === "Restricted" || status === "Banned") {
      if (!path.startsWith("/support")) {
        return NextResponse.redirect(new URL("/support", req.url));
      }
      return null;
    }

    // Prevent active or undefined-status users from accessing /support
    if (
      path.startsWith("/support") &&
      (status === "Active" || status === undefined)
    ) {
      return NextResponse.redirect(new URL("/403", req.url));
    }

    // Enforce role-based access only on protected paths
    if (role && roleRouteMap[role]) {
      const allowedPaths = roleRouteMap[role];

      // If the path is in the restricted list, check if role is allowed
      const isProtected = allowedPaths.some(
        (allowedPath) =>
          path === allowedPath || path.startsWith(`${allowedPath}/`)
      );

      if (!isProtected) {
        // Let it through since it's not in any protected path
        return null;
      }

      // If it *is* protected but the user role doesn't have it, redirect
      const isAllowed = allowedPaths.some(
        (allowedPath) =>
          path === allowedPath || path.startsWith(`${allowedPath}/`)
      );

      if (!isAllowed) {
        return NextResponse.redirect(new URL("/403", req.url));
      }
    }

    return null;
  },
  {
    callbacks: {
      authorized: ({ req }) => {
        // Allow all API routes to be handled by individual route handlers
        if (req.nextUrl.pathname.startsWith("/api")) {
          return true;
        }

        return true; // Let middleware handle everything else
      },
    },
  }
);

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|auth/signin|auth/callback|public|^$).*)",
  ],
};
