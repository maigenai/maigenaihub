'use client';

import { useEffect, useState } from 'react';

interface User {
  email: string;
  user_type: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No authentication token found. Please log in again.');
      setLoading(false);
      return;
    }

    // Chiama un endpoint protetto nel backend per ottenere i dati dell'utente
    fetch('http://localhost:8000/api/profiles/me', {
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch user data');
        return res.json();
      })
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="max-w-md mx-auto p-6">Loading...</div>;
  if (error) return <div className="max-w-md mx-auto p-6 text-red-600">{error}</div>;

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h1 className="text-2xl font-bold mb-4 text-center">Dashboard - MaigenAI Hub</h1>
      {user ? (
        <div className="space-y-4">
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>User Type:</strong> {user.user_type}</p>
          <p>Welcome to your dashboard! Here you can manage your profile, view matches, and explore projects.</p>
          <button
            onClick={() => {
              localStorage.removeItem('token');
              window.location.href = '/get-started';
            }}
            className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Logout
          </button>
        </div>
      ) : (
        <p>No user data available. Please log in again.</p>
      )}
    </div>
  );
}