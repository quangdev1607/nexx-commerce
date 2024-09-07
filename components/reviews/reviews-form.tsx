"use client";

import { ReviewSchema } from "@/formSchema";
import { cn } from "@/lib/utils";
import { addReviewAction } from "@/server/actions/add-review";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Loader2Icon, Star } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Textarea } from "../ui/textarea";
export const ReviewsForm = () => {
  const searchParams = useSearchParams();
  const productID = Number(searchParams.get("productID"));
  const form = useForm<z.infer<typeof ReviewSchema>>({
    resolver: zodResolver(ReviewSchema),
    defaultValues: {
      rating: 3,
      comment: "",
      productID,
    },
  });

  const { execute, status } = useAction(addReviewAction, {
    onSuccess({ data }) {
      if (data?.success) {
        toast.success("Review added 🎉");
        setOpen(false);
        form.reset();
      }
      if (data?.error) {
        toast.error(data.error);
      }
    },
  });

  const [open, setOpen] = useState(false);

  const onSubmit = (values: z.infer<typeof ReviewSchema>) => {
    execute(values);
  };
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="w-full">
          <Button variant={"secondary"} className="w-full font-medium">
            Leave a review
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="comment"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your review</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What do your about this product?"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="rating"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your rating</FormLabel>
                  <FormControl>
                    <Input type="hidden" placeholder="star raing" {...field} />
                  </FormControl>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <motion.div
                        whileTap={{ scale: 0.8 }}
                        whileHover={{ scale: 1.2 }}
                        key={val}
                        className="relative cursor-pointer"
                      >
                        <Star
                          onClick={() => {
                            form.setValue("rating", val, {
                              shouldValidate: true,
                            });
                          }}
                          key={val}
                          className={cn(
                            "bg-transparent text-primary transition-all duration-300 ease-in-out",
                            form.getValues("rating") >= val
                              ? "fill-primary"
                              : "fill-muted",
                          )}
                        />
                      </motion.div>
                    ))}
                  </div>
                </FormItem>
              )}
            />
            {status === "executing" ? (
              <Button className="w-full" disabled type="submit" size={"lg"}>
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                Adding review
              </Button>
            ) : (
              <Button type="submit" className="w-full">
                Add review
              </Button>
            )}
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
};
