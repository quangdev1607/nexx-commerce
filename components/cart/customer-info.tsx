"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AddressSchema } from "@/formSchema";
import { useDistricts, useProvinces, useWards } from "@/services/queries";
import { zodResolver } from "@hookform/resolvers/zod";

import { useCartStore } from "@/lib/zustand-store";
import { createUserAddress } from "@/server/actions/create-address";
import { UserAddress } from "@/server/db/schema";
import { motion } from "framer-motion";
import { Session } from "next-auth";
import { useAction } from "next-safe-action/hooks";
import { FormEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Input } from "../ui/input";

export const CustomerInfo = ({
  userId,
  userAddress,
}: {
  userId: string;
  userAddress?: UserAddress;
}) => {
  const form = useForm<z.infer<typeof AddressSchema>>({
    resolver: zodResolver(AddressSchema),
    defaultValues: {
      userId,
      address: "",
      phone: "",
      editMode: !!userAddress,
    },
  });

  const setEditMode = () => {
    if (!userAddress) return;
    if (userAddress) {
      form.setValue("address", userAddress.address);

      form.setValue("phone", userAddress.phone.toString());
    }
  };

  useEffect(() => {
    setEditMode();
  }, [userAddress]);
  const { data: provincesData, isLoading, error } = useProvinces();
  const [provinceId, setProvinceId] = useState("");
  const [districtId, setDistrictId] = useState("");
  const { setCheckoutProgress } = useCartStore();

  const {
    data: districtsData,
    isLoading: districtLoading,
    error: districtError,
  } = useDistricts(provinceId);
  const {
    data: wardsData,
    isLoading: wardLoading,
    error: wardError,
  } = useWards(districtId);

  if (error || districtError || wardError)
    throw new Error(
      error?.message || districtError?.message || wardError?.message,
    );

  const { execute, status } = useAction(createUserAddress, {
    onSuccess(result) {
      if (result.data?.success) {
        toast.success(result.data?.success);
        setCheckoutProgress("payment-page");
      }

      if (result.data?.error) {
        toast.error(result.data.error);
      }
    },
  });

  const onSubmit = (values: z.infer<typeof AddressSchema>) => {
    execute(values);
  };

  return (
    <motion.div className="mx-auto flex max-w-2xl">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col items-center justify-center gap-4"
        >
          <div className="flex items-center gap-4">
            <FormField
              control={form.control}
              name="province"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Province</FormLabel>
                  <FormControl>
                    <Select
                      defaultValue={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setProvinceId(value);
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="--Choose province--" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {provincesData?.results.map((p) => (
                          <SelectItem key={p.province_id} value={p.province_id}>
                            {p.province_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="district"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>District</FormLabel>
                  <FormControl>
                    <Select
                      defaultValue={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setDistrictId(value);
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="--Choose district--" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {districtsData?.results.map((d) => (
                          <SelectItem key={d.district_id} value={d.district_id}>
                            {d.district_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ward"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ward</FormLabel>
                  <FormControl>
                    <Select
                      defaultValue={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="--Choose ward--" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {wardsData?.results.map((w) => (
                          <SelectItem key={w.ward_id} value={w.ward_id}>
                            {w.ward_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex w-full items-center gap-4">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Your address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Phone number</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Your phone" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            disabled={!form.formState.isValid}
            className="w-full max-w-md"
            type="submit"
          >
            Continue
          </Button>
        </form>
      </Form>
    </motion.div>
  );
};
