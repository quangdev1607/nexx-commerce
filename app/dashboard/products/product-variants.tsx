"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { VariantSchema } from "@/formSchema";
import { VariantsWithImagesTags } from "@/lib/infer-type";
import { createVariant } from "@/server/actions/create-variant";
import { deleteVariant } from "@/server/actions/delete-variant";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { forwardRef, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { InputTags } from "./input-tags";
import { VariantImages } from "./variant-images";

type VariantProps = {
  children: React.ReactNode;
  editMode: boolean;
  productId?: number;
  variant?: VariantsWithImagesTags;
};

export const ProductVariant = forwardRef<HTMLDivElement, VariantProps>(
  ({ children, editMode = false, productId, variant }, ref) => {
    const form = useForm<z.infer<typeof VariantSchema>>({
      resolver: zodResolver(VariantSchema),
      defaultValues: {
        tags: [],
        variantImages: [],
        color: "#000000",
        editMode,
        id: undefined,
        productId,
        productType: "",
      },
    });

    const [open, setOpen] = useState(false);
    const setEditMode = () => {
      if (!editMode) {
        form.reset();
        return;
      }
      if (editMode && variant) {
        form.setValue("editMode", true);
        form.setValue("id", variant.id);
        form.setValue("productId", variant.productID);
        form.setValue("productType", variant.productType);
        form.setValue("color", variant.color);
        form.setValue(
          "tags",
          variant.variantTags.map((tag) => tag.tag),
        );
        form.setValue(
          "variantImages",
          variant.variantImages.map((img) => ({
            name: img.name,
            size: img.size,
            url: img.url,
          })),
        );
      }
    };
    useEffect(() => {
      setEditMode();
    }, [variant]);

    const { execute, status } = useAction(createVariant, {
      onSuccess(result) {
        if (result.data?.success) {
          toast.success(result.data.success);
          form.reset();
          setOpen(false);
        }
        if (result.data?.error) {
          toast.error(result.data.error);
        }
      },
    });

    const variantDeleteAction = useAction(deleteVariant, {
      onSuccess(result) {
        if (result.data?.success) {
          toast.success(result.data.success);
          setOpen(false);
        }
        if (result.data?.error) {
          toast.error(result.data.error);
        }
      },
    });

    const onSubmit = (values: z.infer<typeof VariantSchema>) => {
      execute(values);
    };
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>{children}</DialogTrigger>
        <DialogContent className="flex max-h-[860px] flex-col gap-8 overflow-y-scroll lg:max-w-screen-lg">
          <DialogHeader>
            <DialogTitle>
              {editMode ? "Edit" : "Create"} your variant 🎨
            </DialogTitle>
            <DialogDescription>
              You can add tags, images, and more
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              className="flex w-full flex-col gap-2"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                name="productType"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Variant title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Set a title for your variant"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="color"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Variant color</FormLabel>
                    <FormDescription>Pick any color</FormDescription>
                    <FormControl>
                      <Input type="color" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="tags"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <InputTags
                        {...field}
                        onChange={(e) => field.onChange(e)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <VariantImages />

              <div className="flex items-center justify-center gap-4">
                {editMode && variant && (
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      variantDeleteAction.execute({ id: variant.id });
                    }}
                    disabled={variantDeleteAction.status === "executing"}
                    type="button"
                    variant={"destructive"}
                    className="mt-4"
                  >
                    Delete Variant
                  </Button>
                )}
                <Button
                  disabled={
                    status === "executing" ||
                    !form.formState.isValid ||
                    !form.formState.isDirty
                  }
                  type="submit"
                  className="mt-4 bg-blue-400"
                >
                  {editMode ? "Update variant" : "Create variant"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    );
  },
);

ProductVariant.displayName = "ProductVariant";
