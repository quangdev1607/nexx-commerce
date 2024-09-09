"use client";

import formatPrice from "@/lib/format-price";
import { useCartStore } from "@/lib/zustand-store";
import emptyCart from "@/public/empty-cart.json";

import { motion } from "framer-motion";
import Lottie from "lottie-react";
import { MinusCircle, PlusCircle } from "lucide-react";
import Image from "next/image";
import { useMemo } from "react";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

export const CartItems = () => {
  const { cart, addToCart, removeFromCart, setCheckoutProgress } =
    useCartStore();

  const totalPrice = useMemo(() => {
    return cart.reduce((acc, item) => {
      return acc + item.price! * item.variant.quantity;
    }, 0);
  }, [cart]);

  return (
    <motion.div className="flex flex-col items-center">
      {cart.length === 0 && (
        <div className="flex w-full flex-col items-center justify-center">
          <motion.div
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <span className="text-center text-2xl text-muted-foreground">
              Your cart is empty
            </span>
            <Lottie className="h-64" animationData={emptyCart} />
          </motion.div>
        </div>
      )}
      {cart.length > 0 && (
        <div className="max-h-80 w-full overflow-y-auto">
          <Table className="mx-auto max-w-2xl">
            <TableHeader>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Quantity</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cart.map((item) => (
                <TableRow key={(item.id + item.variant.variantID).toString()}>
                  <TableCell>{item.itemName}</TableCell>
                  <TableCell>{formatPrice(item.price)}</TableCell>
                  <TableCell>
                    <div>
                      <Image
                        className="rounded-md"
                        width={48}
                        height={48}
                        src={item.image}
                        alt={item.itemName}
                        priority
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-between">
                      <MinusCircle
                        onClick={() => {
                          removeFromCart({
                            ...item,
                            variant: {
                              quantity: 1,
                              variantID: item.variant.variantID,
                            },
                          });
                        }}
                        className="cursor-pointer transition-colors duration-300 hover:text-muted-foreground"
                        size={14}
                      />
                      <p className="text-md font-bold">
                        {item.variant.quantity}
                      </p>
                      <PlusCircle
                        onClick={() =>
                          addToCart({
                            ...item,
                            variant: {
                              quantity: 1,
                              variantID: item.variant.variantID,
                            },
                          })
                        }
                        className="cursor-pointer transition-colors duration-300 hover:text-muted-foreground"
                        size={14}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      <motion.div className="relative my-5 flex items-center justify-center overflow-hidden">
        <span className="text-md">Total: {formatPrice(totalPrice)}</span>
      </motion.div>
      <Button
        onClick={() => {
          setCheckoutProgress("customer-info");
        }}
        className="w-full max-w-md"
        disabled={cart.length === 0}
      >
        Continue
      </Button>
    </motion.div>
  );
};
