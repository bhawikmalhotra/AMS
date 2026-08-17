import LoginForm from "./LoginForm";

export const metadata = {
  title: "Login | VYNS Global Attendance Management System",
  description: "Sign in to access your VYNS Global employee, manager, or admin portal.",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <LoginForm />
    </main>
  );
}