import { z } from "zod";

export const PASSWORD_MISMATCH_MESSAGE = "Passwords do not match.";

export const signupSchema = z
  .object({
    email: z
      .string()
      .trim()
      .min(1, "Email is required.")
      .email("Enter a valid email address."),
    password: z
      .string()
      .min(9, "Password must contain more than 8 characters.")
      .max(47, "Password must contain less than 48 characters.")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
        "Password must contain uppercase, lowercase and number.",
      ),
    confirmedPassword: z.string().min(1, "Confirm password is required."),
  })
  .superRefine((values, context) => {
    if (
      values.password.length > 0 &&
      values.confirmedPassword.length > 0 &&
      values.password !== values.confirmedPassword
    ) {
      context.addIssue({
        code: "custom",
        path: ["password"],
        message: PASSWORD_MISMATCH_MESSAGE,
      });

      context.addIssue({
        code: "custom",
        path: ["confirmedPassword"],
        message: PASSWORD_MISMATCH_MESSAGE,
      });
    }
  });

export type SignupFormValues = z.infer<typeof signupSchema>;
