'use client';
import { useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AuthWrapperProps {
  children: ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  
  // Pagine che non richiedono autenticazione
  const publicPages = ['/', '/login', '/register'];
  
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      // Se siamo in una pagina pubblica, non serve controllare l'autenticazione
      if (publicPages.includes(pathname)) {
        setIsAuthChecked(true);
        return;
      }
      
      // Se non c'è token, reindirizza al login
      if (!token) {
        router.push('/login-redirect');
        return;
      }
      
      try {
        // Verifica che il token sia valido
        const response = await fetch('http://localhost:8000/api/profiles/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          // Token non valido, reindirizza
          localStorage.removeItem('token');
          router.push('/login-redirect');
          return;
        }
        
        // Token valido, mostra il contenuto
        setIsAuthChecked(true);
      } catch (error) {
        console.error('Errore nella verifica del token:', error);
        localStorage.removeItem('token');
        router.push('/login-redirect');
      }
    };
    
    checkAuth();
  }, [pathname, router]);
  
  // Mostra il contenuto solo dopo aver verificato l'autenticazione
  if (!isAuthChecked && !publicPages.includes(pathname)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return <>{children}</>;
}