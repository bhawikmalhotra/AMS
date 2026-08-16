import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { login } from "./actions";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Employee Attendance</CardTitle>
        </CardHeader>

        <CardContent>
          <form action={login} className="space-y-4">
            <Input
              name="email"
              type="email"
              placeholder="Email"
              required
            />

            <Input
              name="password"
              type="password"
              placeholder="Password"
              required
            />

            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}