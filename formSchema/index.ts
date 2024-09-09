import * as z from "zod";
// ---------------------------Auth------------------------------
export const LoginSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(6, { message: "Password must contain at least 6 characters" }),
  code: z.optional(z.string()),
});

export const RegisterSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(4, { message: "Username must contain at least 4 characters" })
      .refine(
        (value) => {
          const allowedChars = /^[a-zA-Z]+(?: [a-zA-Z]+)*$/;
          return allowedChars.test(value);
        },
        { message: "Username can only contain letters and spaces" },
      ),
    email: z.string().email({ message: "Invalid email" }),
    password: z
      .string()
      .min(1, { message: "Password can not be empty" })
      .min(6, { message: "Password must contain at least 6 characters" }),
    passwordConfirm: z
      .string()
      .min(1, { message: "Password can not be empty" }),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.passwordConfirm) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["passwordConfirm"],
        message: "Password does not match",
      });
    }
  });

export const NewPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters long"),
  token: z.string().nullable().optional(),
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});
// ---------------------------Dashboard-----------------------------
export const SettingsSchema = z
  .object({
    name: z.optional(z.string().min(4)),
    image: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(6)),
    newPassword: z.optional(z.string().min(6)),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }
      return true;
    },
    { message: "New password is required", path: ["newPassword"] },
  );

// ---------------------------Product------------------------------
export const ProductSchema = z.object({
  id: z.number().optional(),
  title: z
    .string()
    .min(5, { message: "Title must contain at least 5 characters" }),
  description: z
    .string()
    .min(5, { message: "Description must contain at least 40 characters" }),
  price: z.coerce
    .number({ invalid_type_error: "Price must be a number" })
    .positive({ message: "Price can not be negative" }),
});

export type zProductSchema = z.infer<typeof ProductSchema>;

export const DeleteProductSchema = z.object({
  id: z.number(),
});

// ---------------------------Variant------------------------------
export const VariantSchema = z.object({
  productId: z.number(),
  id: z.number().optional(),
  editMode: z.boolean(),
  productType: z
    .string()
    .min(3, { message: "Product type must contain at least 3 characters" }),
  color: z.string().min(3, { message: "Not a valid color" }),
  tags: z.array(
    z.string().min(1, { message: "You should provide at least 1 tag" }),
  ),
  variantImages: z
    .array(
      z.object({
        url: z.string().refine((url) => url.search("blob:") !== 0, {
          message: "Wait for the image to upload",
        }),
        size: z.number(),
        key: z.string().optional(),
        id: z.number().optional(),
        name: z.string(),
      }),
    )
    .min(1, { message: "You should provide at least 1 image" }),
});

export const DeleteVariantSchema = z.object({
  id: z.number(),
});

// ---------------------------Reviews------------------------------

export const ReviewSchema = z.object({
  productID: z.number(),
  rating: z
    .number()
    .min(1, { message: "You should rate at least 1 star" })
    .max(5, { message: "You can only rate 5 stars max" }),
  comment: z
    .string()
    .min(3, { message: "Please add at least 3 characters for this review" }),
});
//ORDER
export const CreateOrderSchema = z.object({
  orderAddress: z.string(),
  total: z.number(),
  status: z.string(),
  products: z.array(
    z.object({
      productID: z.number(),
      variantID: z.number(),
      quantity: z.number(),
    }),
  ),
});

// ---------------------------Payment------------------------------
export const PaymentIntentSchema = z.object({
  amount: z.number(),
  currency: z.string(),
  cart: z.array(
    z.object({
      quantity: z.number(),
      productID: z.number(),
      title: z.string(),
      price: z.number(),
      image: z.string(),
    }),
  ),
});

// ---------------------------Address------------------------------

export const AddressSchema = z.object({
  editMode: z.boolean().optional(),
  userId: z.string(),
  province: z.string(),
  district: z.string(),
  ward: z.string(),
  address: z.string(),
  phone: z.string().min(9).max(15),
});
