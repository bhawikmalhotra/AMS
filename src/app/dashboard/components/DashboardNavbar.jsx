import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";

export default async function DashboardNavbar() {
  const session = await auth();
  const user = session?.user;

  if (!user) return null;

  let departmentName = null;

  if (user.departmentId) {
    const department = await prisma.department.findUnique({
      where: {
        id: user.departmentId,
      },
      select: {
        name: true,
      },
    });

    departmentName = department?.name;
  }

  const getRoleBadgeStyle = (role) => {
    switch (role) {
      case "ADMIN":
        return "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-200";
      case "MANAGER":
        return "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-200";
      default:
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200";
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6 max-w-7xl mx-auto">
        
        {/* Left Side: Logo & Brand */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
            📋
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight">
              Attendance System
            </h1>
            <p className="text-xs text-muted-foreground hidden sm:block">
              Employee Portal
            </p>
          </div>
        </div>

        {/* Right Side: User Profile Info & Logout */}
        <div className="flex items-center gap-4">
          
          {/* User Details Box */}
          <div className="flex items-center gap-3 text-sm">
            <div className="text-right hidden md:block">
              <p className="font-semibold text-foreground text-sm leading-none mb-1">
                {user.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {user.email} &bull; <span className="font-mono">{user.employeeId}</span>
              </p>
            </div>

            {/* Role & Dept Badge */}
            <div className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getRoleBadgeStyle(user.role)}`}>
              {user.role === "MANAGER" && departmentName
                ? `MANAGER • ${departmentName}`
                : user.role}
            </div>
          </div>

          <div className="h-6 w-px bg-border hidden sm:block" />

          {/* Logout Button Form */}
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <Button variant="outline" size="sm" type="submit" className="text-xs font-medium">
              Logout
            </Button>
          </form>

        </div>

      </div>
    </nav>
  );
}