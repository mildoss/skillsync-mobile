import * as z from "zod";

const emailSchema = z
  .string()
  .refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), { message: "Incorrect email" });

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(6, "Password required"),
});

export const registerSchema = z.object({
  role: z.enum(["APPLICANT", "EMPLOYER"]),
  email: emailSchema,
  password: z.string().min(6, "The password must be at least 6 characters long."),
  confirmPassword: z.string().min(6, "Confirm your password"),
})
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
