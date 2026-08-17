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

  // console.log(user);
  
  return (
    <nav className="border-b bg-background">
      <div className="flex h-16 items-center justify-between px-6">
        
        {/* Left side */}
        <div>
          <h1 className="text-lg font-semibold">
            Attendance Management
          </h1>

          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span>{user.name}</span>

            <span className="text-border">•</span>

            <span>{user.email}</span>
            <span>{user.employeeId}</span>

            <span className="text-border">•</span>

            <span>
              {user.role === "MANAGER"
                ? `${user.role} · ${departmentName}`
                : user.role}
            </span>
          </div>
        </div>

        {/* Right side */}
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}
        >
          <Button variant="outline" type="submit">
            Logout
          </Button>
        </form>

      </div>
    </nav>
  );
}