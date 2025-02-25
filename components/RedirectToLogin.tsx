'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RedirectToLogin() {
  const router = useRouter();

  useEffect(() => {
    // Controlla se c'è un token valido
    const token = localStorage.getItem('token');
    if (token) {
      // Se c'è un token, prova a verificarlo
      fetch('http://localhost:8000/api/profiles/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        if (response.ok) {
          // Token valido, reindirizza alla dashboard
          router.push('/dashboard');
        } else {
          // Token non valido, cancellalo
          localStorage.removeItem('token');
        }
      })
      .catch(err => {
        console.error('Errore nella verifica del token:', err);
        localStorage.removeItem('token');
      });
    }
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-16 w-16 text-red-500 mx-auto mb-4" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Sessione scaduta</h2>
        
        <p className="text-gray-600 mb-6">
          La tua sessione è scaduta o non hai effettuato l'accesso. 
          Per continuare, è necessario effettuare il login.
        </p>
        
        <div className="flex flex-col space-y-4">
          <Link 
            href="/login" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Vai al login
          </Link>
          
          <Link
            href="/register"
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
          >
            Registrati
          </Link>
        </div>
      </div>
    </div>
  );
}