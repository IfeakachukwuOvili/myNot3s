import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { handleLogin } from '../utils/authUtils';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleLogin({
      email,
      password,
      setIsLoading,
      setError,
      setFieldErrors,
      navigate
    });
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900 p-4">
      <div className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            Welcome Back
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Please sign in to your account
          </p>
        </div>

        {error && (
          <div className="p-2 mb-4 bg-red-100 border border-red-400 text-red-700 text-sm rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3" autoComplete="off">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-500">
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              className={`mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border rounded focus:ring-1 focus:ring-blue-500 ${
                fieldErrors.email ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
              }`}
              placeholder="Enter your email"
              onChange={e => setEmail(e.target.value.trim())}
              autoComplete="off"
              maxLength={100}
            />
            {fieldErrors.email && (
              <p className="mt-1 text-xs text-red-500">{fieldErrors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-500">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              className={`mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border rounded focus:ring-1 focus:ring-blue-500 ${
                fieldErrors.password ? 'border-red-500' : 'border-gray-200 dark:text-gray-500'
              }`}
              placeholder="Enter your password"
              onChange={e => setPassword(e.target.value)}
              autoComplete="new-password"
              maxLength={100}
            />
            {fieldErrors.password && (
              <p className="mt-1 text-xs text-red-500">{fieldErrors.password}</p>
            )}
            <Link 
              to="/forgot-password" 
              className="block mt-1 text-xs text-blue-600 hover:text-blue-700"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              Forgot your password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 text-sm text-white rounded transition-colors ${
              isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="mt-3 text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-600 hover:text-blue-700">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
