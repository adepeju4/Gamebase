import * as z from "zod";

// Login form validation schema
export const loginFormSchema = z.object({
  userName: z.string().min(3, { message: "Username must be at least 3 characters." }),
  password: z.string().min(1, { message: "Password is required." }),
});

// Signup form validation schema
export const signupFormSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters." }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters." }),
  userName: z.string().min(3, { message: "Username must be at least 3 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

// Type definitions for form values
export type LoginFormValues = z.infer<typeof loginFormSchema>;
export type SignupFormValues = z.infer<typeof signupFormSchema>; 