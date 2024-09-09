"use client";

import { useCartStore } from "@/lib/zustand-store";
import { motion } from "framer-motion";

import { Check, CreditCard, ShoppingCart, UserCheck } from "lucide-react";
import { FcCustomerSupport } from "react-icons/fc";

export const CartProgress = () => {
  const { checkoutProgress } = useCartStore();

  return (
    <div className="flex items-center justify-center pb-6">
      <div className="relative h-3 w-64 rounded-md bg-muted">
        <div className="absolute left-0 top-0 flex h-full w-full items-center justify-between">
          <motion.span
            className="absolute left-0 top-0 z-30 h-full bg-primary ease-in-out"
            initial={{ width: 0 }}
            animate={{
              width:
                checkoutProgress === "cart-page"
                  ? 0
                  : checkoutProgress === "customer-info"
                    ? "33%"
                    : checkoutProgress === "payment-page"
                      ? "66%"
                      : "100%", // For confirmation page
            }}
          />
          {/* Cart icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.25 }}
            className="z-50 rounded-full bg-primary p-2"
          >
            <ShoppingCart className="text-black" size={14} />
          </motion.div>
          {/* Customer Info Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{
              scale: checkoutProgress === "customer-info" ? 1 : 0,
            }}
            transition={{ delay: 0.25 }}
            className="z-50 rounded-full bg-primary p-2"
          >
            <UserCheck className="text-black" size={14} />
          </motion.div>
          {/* Payment Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{
              scale: checkoutProgress === "payment-page" ? 1 : 0,
            }}
            transition={{ delay: 0.25 }}
            className="z-50 rounded-full bg-primary p-2"
          >
            <CreditCard className="text-black" size={14} />
          </motion.div>
          {/* Confirmation Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{
              scale: checkoutProgress === "confirmation-page" ? 1 : 0,
            }}
            transition={{ delay: 0.25 }}
            className="z-50 rounded-full bg-primary p-2"
          >
            <Check className="text-black" size={14} />
          </motion.div>
        </div>
      </div>
    </div>
  );
};
