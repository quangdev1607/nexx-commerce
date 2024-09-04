import * as z from "zod";

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
          const allowedChars = /^[a-zA-Z]+(?:[a-zA-Z]+)*$/;
          return allowedChars.test(value);
        },
        { message: "Username can only contain letter" },
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
