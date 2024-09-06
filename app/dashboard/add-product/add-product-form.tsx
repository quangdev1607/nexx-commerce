"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ProductSchema, zProductSchema } from "@/formSchema";
import { addProduct } from "@/server/actions/add-product";
import { getProduct } from "@/server/actions/get-product";
import { zodResolver } from "@hookform/resolvers/zod";
import { DollarSign, Loader2Icon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Tiptap } from "./tiptap";

export const AddProductForm = () => {
  const form = useForm<zProductSchema>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
    },
    mode: "onChange",
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const editMode = searchParams.get("id");

  const checkProduct = async (id: number) => {
    if (editMode) {
      const data = await getProduct(id);
      if (data.error) {
        toast.error(data.error);
        router.push("/dashboard/products");
        return;
      }
      if (data.success) {
        const productId = parseInt(editMode);
        form.setValue("title", data.success.title);
        form.setValue("description", data.success.description);
        form.setValue("price", data.success.price);
        form.setValue("id", productId);
      }
    }
  };

  useEffect(() => {
    if (editMode) {
      checkProduct(parseInt(editMode));
    }
  }, []);

  const { execute, status } = useAction(addProduct, {
    onSuccess(result) {
      if (result.data?.error) {
        toast.error(result.data.error);
      }
      if (result.data?.success) {
        router.push("/dashboard/products");
        toast.success(result.data.success);
      }
    },
  });

  const onSubmit = (values: zProductSchema) => {
    execute(values);
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>{editMode ? "Edit product" : "Create product"}</CardTitle>
        <CardDescription>
          {editMode ? "Make changes to your product" : "Add a new product"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="title"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="description"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Tiptap val={field.value} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="price"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Price</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Input
                        {...field}
                        type="number"
                        placeholder="Your price in USD"
                        step="0.1"
                        min={0}
                      />
                      <span className="rounded-md bg-muted p-2">VNĐ</span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {status === "executing" ? (
              <Button className="w-full" disabled type="submit" size={"lg"}>
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button
                disabled={!form.formState.isDirty || !form.formState.isValid}
                type="submit"
                className="mt-2 w-full text-base"
              >
                {editMode ? "Save changes" : "Create product"}
              </Button>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
