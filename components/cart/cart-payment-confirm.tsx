"use client";

import { CreateOrderSchema } from "@/formSchema";
import formatPrice from "@/lib/format-price";
import { useCartStore } from "@/lib/zustand-store";
import { creatOrderAction } from "@/server/actions/create-order";
import { UserAddress } from "@/server/db/schema";
import { useDistricts, useProvinces, useWards } from "@/services/queries";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { FormEvent } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Form } from "../ui/form";
import { Separator } from "../ui/separator";
export const PaymentConfirm = ({
  userAddress,
  userName,
}: {
  userAddress: UserAddress;
  userName?: string;
}) => {
  const { cart, setCheckoutProgress, clearCart, setCartOpen } = useCartStore();
  const totalPrice = cart.reduce((acc, item) => {
    return acc + item.price * item.variant.quantity;
  }, 0);

  const { data: provinceData } = useProvinces();
  const { data: districtData } = useDistricts(userAddress.province);
  const { data: wardData } = useWards(userAddress.district);

  const province = provinceData?.results.filter(
    (p) => p.province_id === userAddress.province,
  )[0];
  const district = districtData?.results.filter(
    (d) => d.district_id === userAddress.district,
  )[0];
  const ward = wardData?.results.filter(
    (d) => d.ward_id === userAddress.ward,
  )[0];

  const { execute } = useAction(creatOrderAction, {
    onSuccess: (result) => {
      if (result.data?.success) {
        toast.success(result.data.success);
        setCheckoutProgress("confirmation-page");
        clearCart();
      }

      if (result.data?.error) {
        toast.error(result.data.error);
      }
    },
  });
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    execute({
      orderAddress: `${userAddress.address}, ${ward?.ward_name}, ${district?.district_name}, ${province?.province_name}`,
      status: "succeeded",
      total: totalPrice,
      products: cart.map((item) => ({
        productID: item.id,
        variantID: item.variant.variantID,
        quantity: item.variant.quantity,
      })),
    });
  };
  return (
    <div className="mx-auto flex max-w-2xl items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Confirm order</CardTitle>
          <CardDescription>Check your order info</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-5">
            <span className="w-20 font-bold">Name:</span>
            <span className="flex-1">{userName}</span>
          </div>

          <div className="flex items-center gap-5">
            <span className="w-20 font-bold">Address:</span>
            <span className="flex-1">
              {userAddress.address}, {ward?.ward_name},{" "}
              {district?.district_name}, {province?.province_name}
            </span>
          </div>
          <div className="flex items-center gap-5">
            <span className="w-20 font-bold">Phone:</span>
            <span className="flex-1">{userAddress.phone}</span>
          </div>
          <div className="flex items-center gap-5">
            <span className="w-20 font-bold">Total:</span>
            <span className="flex-1">{formatPrice(totalPrice)}</span>
          </div>
          <Separator className="my-2" />
          <div className="flex items-center gap-5">
            <span>Payment method:</span>
            <span className="flex-1">COD</span>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-center">
          <form onSubmit={handleSubmit}>
            <Button type="submit">Checkout</Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
};
