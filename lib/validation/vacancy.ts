import * as z from "zod";

const emptyToUndefined = z
  .string()
  .optional()
  .transform((v) => (v === "" ? undefined : v));
const numberOrEmpty = z.coerce
  .number()
  .optional()
  .or(z.literal("").transform(() => undefined));

export const vacancySchema = z
  .object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(20, "Description must be at least 20 characters"),
    categoryId: z.string().min(1, "Please select a category"),
    skills: z.array(z.string()).min(1, "Select at least one skill"),
    languages: z.array(z.string()).default([]),
    domainId: emptyToUndefined,
    type: z.enum(["REMOTE", "OFFICE", "HYBRID"]),
    experience: numberOrEmpty,
    location: emptyToUndefined,
    salaryMin: numberOrEmpty,
    salaryMax: numberOrEmpty,
    isActive: z.boolean().default(true),
  })
  .refine(
    (data) => {
      if (data.salaryMin != null && data.salaryMax != null) {
        return Number(data.salaryMin) <= Number(data.salaryMax);
      }
      return true;
    },
    {
      message: "Maximum salary must be greater than minimum",
      path: ["salaryMax"],
    },
  );

export type VacancyInput = z.infer<typeof vacancySchema>;
export type VacancyFormValues = z.input<typeof vacancySchema>;
export type VacancyData = z.output<typeof vacancySchema>;