'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Register() {
  const [userType, setUserType] = useState('Freelancer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await fetch('http://localhost:8000/api/profiles/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, user_type: userType }),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        if (data.user_type === 'Freelancer') {
          router.push('/freelancers');
        } else if (data.user_type === 'Company') {
          router.push('/companies');
        }
      } else {
        const errorData = await response.json();
        setError(`Registration failed: ${errorData.detail || 'Unknown error'}`);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(`Error: ${error.message}`);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h1 className="text-2xl font-bold mb-4 text-center">Get Started with MaigenAI Hub</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-md p-2 mt-1 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-md p-2 mt-1 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">User Type</label>
          <select
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            className="w-full border rounded-md p-2 mt-1 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="Freelancer">Freelancer</option>
            <option value="Company">Company</option>
          </select>
        </div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Register
        </button>
      </form>
    </div>
  );
}