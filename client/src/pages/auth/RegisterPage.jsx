import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['student', 'educator']).default('student'),
});

export default function RegisterPage() {
  const { register: regUser, loading } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    try {
      const user = await regUser(data);
      toast.success('Account created!');
      navigate(user.role === 'educator' ? '/dashboard/educator' : '/dashboard/student', { replace: true });
    } catch (err) {
      toast.error(typeof err === 'string' ? err : err?.message || 'Registration failed');
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="card w-full max-w-md">
        <h1 className="font-display text-2xl font-bold">Create account</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
          <div>
            <label className="text-sm font-medium">Full Name</label>
            <input {...register('name')} className="input-field mt-1" />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <input {...register('email')} className="input-field mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium">Password</label>
            <input type="password" {...register('password')} className="input-field mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium">I am a</label>
            <select {...register('role')} className="input-field mt-1">
              <option value="student">Student</option>
              <option value="educator">Educator</option>
            </select>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm">Already have an account? <Link to="/login" className="text-primary-600 font-semibold">Sign in</Link></p>
      </div>
    </div>
  );
}
