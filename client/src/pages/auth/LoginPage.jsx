import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { ROLE_ROUTES } from '../../constants';

const schema = z.object({
  email: z.string().email('Invalid email').transform((v) => v.toLowerCase().trim()),
  password: z.string().min(1, 'Password required'),
});

export default function LoginPage() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname;
  const [apiError, setApiError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data) => {
    setApiError('');
    try {
      const user = await login(data);
      toast.success(`Welcome back, ${user.name}!`);
      navigate(from || ROLE_ROUTES[user.role] || '/dashboard/student', { replace: true });
    } catch (err) {
      const message = typeof err === 'string' ? err : err?.message || 'Login failed';
      setApiError(message);
      toast.error(message);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="card w-full max-w-md">
        <h1 className="font-display text-2xl font-bold">Welcome back</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Sign in to continue learning</p>
        {apiError && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
            {apiError}
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4" noValidate>
          <div>
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              {...register('email')}
              className="input-field mt-1"
            />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              {...register('password')}
              className="input-field mt-1"
            />
            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
          </div>
          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-sm text-primary-600 hover:underline dark:text-primary-400">
              Forgot password?
            </Link>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-semibold text-primary-600 hover:underline dark:text-primary-400">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
