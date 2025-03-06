import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { Input } from '../../components/ui/input';
import fetcher from '../../lib/fetcher';
import { Link } from 'react-router-dom';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import AuthLayout from './AuthLayout';
import './auth.css';
import { toast } from 'sonner';
import { loginFormSchema, LoginFormValues } from '../../lib/validations';
import { Eye, EyeOff } from 'lucide-react';

const cookies = new Cookies();

function LogIn() {
  const [pending, setPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      userName: '',
      password: '',
    },
  });

  const handleSubmit = async (values: LoginFormValues) => {
    try {
      setPending(true);

      console.log('Submitting login form with values:', values);

      const result = await fetcher('/Api/Auth/login', {
        method: 'POST',
        body: values,
      });

      console.log('Login API response:', result);

      if (result.success && result.data) {
        const userData = result.data;
        console.log('Login successful, user data:', userData);

        // Store user data in cookies
        cookies.set('firstName', userData.firstName);
        cookies.set('userName', userData.userName);
        cookies.set('lastName', userData.lastName);
        cookies.set('email', userData.email);
        cookies.set('userId', userData.userId);

        // Store JWT token with proper configuration
        cookies.set('token', userData.token, {
          path: '/',
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          // Don't set an expiry here - let the JWT itself handle expiration
        });

        toast.success('Login successful! Welcome back.');
        console.log('Attempting to navigate to homepage...');

        // Try both navigation methods to ensure redirection works
        navigate('/');

        // Use a direct approach as a fallback
        setTimeout(() => {
          console.log('Using direct navigation as fallback');
          window.location.href = '/';
        }, 100);

        console.log('Navigation function called');
        return;
      } else {
        // Handle specific error messages from the backend
        console.log('Login failed:', result.error || result.data?.message);
        if (result.error) {
          toast.error(result.error);
        } else if (result.data?.message) {
          toast.error(result.data.message);
        } else {
          toast.error('Invalid username or password. Please try again.');
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      toast.error('Connection error. Please check your internet and try again.');
    } finally {
      setPending(false);
    }
  };

  return (
    <AuthLayout title="Games FM">
      <div className="auth-card">
        <div className="mb-4">
          <h2 className="auth-title">Log in</h2>
          <p className="auth-subtitle">Enter your credentials to access your account</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="userName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="auth-label">Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="gameMaster123"
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
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        {...field}
                        className="auth-input !bg-white/25 !border-white/30 !text-white !outline-none focus-visible:!ring-0 focus-visible:!ring-offset-0 pr-10"
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white focus:outline-none"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-300" />
                </FormItem>
              )}
            />
            <button type="submit" className="auth-button" disabled={pending}>
              {pending ? 'Logging In...' : 'Log In'}
            </button>
          </form>
        </Form>
        <div className="mt-4 text-center">
          <span className="auth-text">
            Don't have an account?{' '}
            <Link to="/signup" className="auth-link">
              Sign up
            </Link>
          </span>
        </div>
      </div>
    </AuthLayout>
  );
}

export default LogIn;
