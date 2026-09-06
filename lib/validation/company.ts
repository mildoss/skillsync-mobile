import * as z from "zod";

const nullableUrlField = z
  .string()
  .nullable()
  .transform((val) => {
    if (val === "" || val === undefined) return null;
    return val;
  })
  .refine((val) => !val || /^https?:\/\/.+/.test(val), "Must be a valid URL");

export const createCompanySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  logoUrl: nullableUrlField,
  websiteUrl: nullableUrlField,
  companyType: z.enum(["PRODUCT", "OUTSOURCE", "OUTSTAFF", "STARTUP", "AGENCY"], {
    error: "Please select a company type",
  }),
});

export type CreateCompanyInput = z.infer<typeof createCompanySchema>;
