import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Define allowed routes per role
const roleRouteMap: Record<
  "Super Admin" | "Admin" | "Moderator" | "Support",
  string[]
> = {
  "Super Admin": [
    "/",
    "/users",
    "/tasks",
    "/engagement",
    "/admins",
    "/profile",
  ],
  Admin: ["/", "/users", "/tasks", "/engagement", "/admins", "/profile"],
  Moderator: ["/", "/tasks", "/engagement", "/profile"],
  Support: ["/", "/users", "/profile"],
};

type UserStatus = "Active" | "Restricted" | "Banned" | undefined;
type UserRole = "Super Admin" | "Admin" | "Moderator" | "Support" | undefined;

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Allow static files
    const publicFile = /\.(.*)$/.test(path);
    const isNextStatic = path.startsWith("/_next/");
    const isFont = path.startsWith("/fonts");
    const isImage = path.startsWith("/images");
    const isAuthPage = path.startsWith("/auth");
    const isAPIRoute = path.startsWith("/api");
    const isForbiden = path.startsWith("/403");

    if (publicFile || isNextStatic || isFont || isImage || isAPIRoute || isForbiden) {
      return NextResponse.next();
    }

    const isAuth = !!token;
    const role = token?.role as UserRole;
    const status = token?.status as UserStatus;

    // If user is on auth pages and is authenticated, redirect to dashboard
    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
      return null;
    }

    // If not authenticated, redirect to signin
    if (!isAuth) {
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    }

    // If user is banned or restricted, allow only /support
    if (status === "Restricted" || status === "Banned") {
      if (!path.startsWith("/support")) {
        return NextResponse.redirect(new URL("/support", req.url));
      }
      return null;
    }

    // If user is active or undefined and tries to access /support, deny
    if (
      path.startsWith("/support") &&
      (status === "Active" || status === undefined)
    ) {
      return NextResponse.redirect(new URL("/403", req.url));
    }

    // Role-based route control
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
        // Let API routes be handled by route handlers directly
        if (req.nextUrl.pathname.startsWith("/api")) {
          return true;
        }
        return true; // All other paths pass to middleware
      },
    },
  }
);

// Matcher config for middleware
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|auth/signin|auth/callback|public|^$).*)",
  ],
};
