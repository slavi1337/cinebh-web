import { z } from "zod";

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required."),
    newPassword: z
      .string()
      .min(9, "Password must contain more than 8 characters.")
      .max(47, "Password must contain less than 48 characters.")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
        "Password must contain uppercase, lowercase and number.",
      ),
    repeatNewPassword: z.string().min(1, "Repeat new password is required."),
  })
  .superRefine((values, context) => {
    if (
      values.newPassword.length > 0 &&
      values.repeatNewPassword.length > 0 &&
      values.newPassword !== values.repeatNewPassword
    ) {
      context.addIssue({
        code: "custom",
        path: ["newPassword"],
        message: "Passwords do not match.",
      });

      context.addIssue({
        code: "custom",
        path: ["repeatNewPassword"],
        message: "Passwords do not match.",
      });
    }
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
