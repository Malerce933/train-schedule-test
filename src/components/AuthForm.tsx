'use client';

import Link from 'next/link';
import { auth } from '@/actions/auth-action';
import { useActionState } from 'react';

type AuthMode = 'login' | 'signup';

type AuthFormProps = {
  mode: AuthMode;
};

type FormState = {
  errors?: {
    [key: string]: string;
  };
};

export default function AuthForm({ mode }: AuthFormProps) {
  const [formState, formAction] = useActionState<FormState, FormData>(
    auth.bind(null, mode),
    {}
  );

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-sm p-6 bg-white border border-gray-300 rounded-lg shadow-md">
        <form id="auth-form" action={formAction} className="space-y-4">
          <p>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              className="border p-1 rounded w-full"
              required
            />
          </p>
          <p>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              className="border p-1 rounded w-full"
              required
            />
          </p>

          {formState.errors && (
            <ul id="form-errors" className="text-red-600 text-sm">
              {Object.keys(formState.errors).map((key) => (
                <li key={key}>{formState.errors?.[key]}</li>
              ))}
            </ul>
          )}

          <p>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700"
            >
              {mode === 'login' ? 'Login' : 'Create Account'}
            </button>
          </p>

          <p className="text-sm text-center">
            {mode === 'login' ? (
              <Link href="/?mode=signup" className="text-blue-500 underline">
                Create an account
              </Link>
            ) : (
              <Link href="/?mode=login" className="text-blue-500 underline">
                Login with existing account
              </Link>
            )}
          </p>
        </form>
      </div>
    </div>
  );
}
