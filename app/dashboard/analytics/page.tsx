import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function AnalyticPage() {
  const session = await auth();

  if (session?.user.role !== "admin") return redirect("/dashboard/settings");
  return <h1>Hello analytics</h1>;
}
