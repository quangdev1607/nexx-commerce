import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { AddProductForm } from "./add-product-form";

export default async function AddProductPage() {
  const session = await auth();

  if (session?.user.role !== "admin") return redirect("/dashboard/settings");
  return <AddProductForm />;
}
