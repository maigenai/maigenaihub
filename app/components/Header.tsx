// Questo file può essere inserito come nuovo componente: app/components/Header.tsx

'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userType, setUserType] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Controlla se il token è valido facendo una chiamata API
      fetch('http://localhost:8000/api/profiles/me', {
        headers: { 'Authorization': `Bearer ${token}` },
      })
        .then(res => {
          if (res.ok) {
            setIsLoggedIn(true);
            return res.json();
          } else {
            // Token non valido
            localStorage.removeItem('token');
            setIsLoggedIn(false);
            throw new Error('Invalid token');
          }
        })
        .then(data => {
          setUserName(data.email);
          setUserType(data.user_type);
        })
        .catch(err => {
          console.error('Failed to fetch user data:', err);
        });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUserName('');
    setUserType('');
    router.push('/');
  };

  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">MaigenAI Hub</Link>
        
        <nav className="flex items-center space-x-6">
          {isLoggedIn ? (
            <>
              <Link href="/dashboard" className="hover:text-blue-200">Dashboard</Link>
              <Link href="/projects" className="hover:text-blue-200">Progetti</Link>
              {userType === 'Company' && (
                <Link href="/companies" className="hover:text-blue-200">La mia azienda</Link>
              )}
              {userType === 'Freelancer' && (
                <Link href="/freelancers" className="hover:text-blue-200">Il mio profilo</Link>
              )}
              <div className="flex items-center">
                <span className="mr-3">Ciao, {userName}</span>
                <button 
                  onClick={handleLogout}
                  className="bg-white text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-md font-medium"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-blue-200">Login</Link>
              <Link href="/register" className="bg-white text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-md font-medium">
                Registrati
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}