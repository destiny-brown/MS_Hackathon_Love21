import Link from "next/link";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function NotAuthorizedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Not authorized</CardTitle>
          <CardDescription>
            Your account does not have access to this page. If this looks wrong, please contact Love 21 staff.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <Link className="font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" href="/login">
            Log in with a different account
          </Link>
          <br />
          <Link className="font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" href="/">
            Return to public site
          </Link>
        </CardContent>
      </Card>
    </main>
  );
}
