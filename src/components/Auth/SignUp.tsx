import { useState } from "react";
import fetcher from "../../lib/fetcher.js";
import Cookies from "universal-cookie";
import { Link, useNavigate } from "react-router-dom";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import AuthLayout from "./AuthLayout";
import { toast } from "sonner";
import { signupFormSchema, SignupFormValues } from "../../lib/validations";
import { Eye, EyeOff } from "lucide-react";

function SignUp() {
  const cookies = new Cookies();
  const [pending, setPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      userName: "",
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (values: SignupFormValues) => {
    try {
      setPending(true);
      
      const result = await fetcher("/Api/Auth/signup", {
        method: 'POST',
        body: values
      });

      if (result.success && result.data) {
        const userData = result.data;
        cookies.set("firstName", userData.firstName);
        cookies.set("userName", userData.userName);
        cookies.set("lastName", userData.lastName);
        cookies.set("userId", userData.userId);
        cookies.set("token", userData.token, {
          path: "/",
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict"
        });

        toast.success("Account created successfully! Welcome to Games FM.");
        navigate("/");
        return;
      } else {
        // Handle specific error messages from the backend
        if (result.error) {
          toast.error(result.error);
        } else if (result.data?.message) {
          toast.error(result.data.message);
        } else {
          toast.error("Failed to create account. Please try again with a different username.");
        }
      }
    } catch (err) {
      console.error("Signup error:", err);
      toast.error("Connection error. Please check your internet and try again.");
    } finally {
      setPending(false);
    }
  };

  return (
    <AuthLayout title="Games FM">
      <div className="auth-card">
        <div className="mb-4">
          <h2 className="auth-title">Create an account</h2>
          <p className="auth-subtitle">Enter your information to join Games FM</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="auth-label">First Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="John" 
                        {...field} 
                        className="auth-input !bg-white/25 !border-white/30 !text-white !outline-none focus-visible:!ring-0 focus-visible:!ring-offset-0"
                      />
                    </FormControl>
                    <FormMessage className="text-red-300" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="auth-label">Last Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Doe" 
                        {...field} 
                        className="auth-input !bg-white/25 !border-white/30 !text-white !outline-none focus-visible:!ring-0 focus-visible:!ring-offset-0"
                      />
                    </FormControl>
                    <FormMessage className="text-red-300" />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="userName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="auth-label">Username</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="johndoe" 
                      {...field} 
                      className="auth-input !bg-white/25 !border-white/30 !text-white !outline-none focus-visible:!ring-0 focus-visible:!ring-offset-0"
                    />
                  </FormControl>
                  <FormMessage className="text-red-300" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="auth-label">Email</FormLabel>
                  <FormControl>
                    <Input 
                      type="email"
                      placeholder="john.doe@example.com" 
                      {...field} 
                      className="auth-input !bg-white/25 !border-white/30 !text-white !outline-none focus-visible:!ring-0 focus-visible:!ring-offset-0"
                    />
                  </FormControl>
                  <FormMessage className="text-red-300" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="auth-label">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="••••••••" 
                        {...field} 
                        className="auth-input !bg-white/25 !border-white/30 !text-white !outline-none focus-visible:!ring-0 focus-visible:!ring-offset-0 pr-10"
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white focus:outline-none"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-300" />
                </FormItem>
              )}
            />
            <button 
              type="submit" 
              className="auth-button"
              disabled={pending}
            >
              {pending ? "Creating Account..." : "Sign Up"}
            </button>
          </form>
        </Form>
        <div className="mt-4 text-center">
          <span className="auth-text">
            Already have an account?{" "}
            <Link to="/login" className="auth-link">
              Log in
            </Link>
          </span>
        </div>
      </div>
    </AuthLayout>
  );
}

export default SignUp;
