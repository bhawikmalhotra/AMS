import { auth } from "./auth";

const roleDashboards = {
  EMPLOYEE: "/dashboard/employee",
  MANAGER: "/dashboard/manager",
};

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  // Not logged in
  if (!isLoggedIn) {
    return Response.redirect(new URL("/login", req.url));
  }

  // Check role-specific dashboard
  for (const [role, dashboard] of Object.entries(roleDashboards)) {
    if (pathname.startsWith(dashboard)) {
      if (req.auth.user.role !== role) {
        const correctDashboard = roleDashboards[req.auth.user.role];

        return Response.redirect(
          new URL(correctDashboard || "/dashboard", req.url)
        );
      }

      break;
    }
  }
});

export const config = {
  matcher: ["/dashboard/:path*"],
};