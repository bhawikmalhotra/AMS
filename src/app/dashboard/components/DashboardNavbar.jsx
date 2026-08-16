import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";

export default async function DashboardNavbar() {
  const session = await auth();
  const user = session?.user;

  if (!user) return null;

  return (
    <nav className="flex items-center justify-between border-b px-6 py-4">
      <div>
        <h1 className="font-semibold">Attendance Management</h1>

        <div className="mt-1 flex gap-3 text-sm text-muted-foreground">
          <span>{user.name}</span>

          <span>{user.employeeId}</span>

          {user.role === "MANAGER" && (
            <>
              <span>Manager</span>
              <span>{user.departmentId}</span>
            </>
          )}
        </div>
      </div>

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
    </nav>
  );
}