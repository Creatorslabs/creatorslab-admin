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

    const isAuth = !!token;
    const role = token?.role as UserRole;
    const status = token?.status as UserStatus;

    // 1. Not authenticated → redirect to login
    if (!isAuth) {
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    }

    if (status === "Restricted" || status === "Banned") {
      if (!path.startsWith("/support")) {
        return NextResponse.redirect(new URL("/support", req.url));
      }
      return null;
    }

    if (
      path.startsWith("/support") &&
      (status === "Active" || status === undefined)
    ) {
        return NextResponse.redirect(new URL("/403", req.url));
    }

    // 4. Enforce role-based access
    if (role && roleRouteMap[role]) {
      const allowedPaths = roleRouteMap[role];
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
        // Let API routes go through
        if (req.nextUrl.pathname.startsWith("/api")) return true;
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|auth|api/public).*)"],
};
