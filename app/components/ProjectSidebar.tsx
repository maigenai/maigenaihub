'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ProjectSidebarProps {
  onProjectAdded?: (project: any) => void;
}

export default function ProjectSidebar({ onProjectAdded }: ProjectSidebarProps) {
  const [userType, setUserType] = useState<string | null>(null);
  
  useEffect(() => {
    // Verifica il tipo di utente
    const checkUserType = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      try {
        const response = await fetch('http://localhost:8000/api/profiles/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          const userData = await response.json();
          setUserType(userData.user_type);
        }
      } catch (err) {
        console.error('Errore nel caricamento del profilo utente:', err);
      }
    };
    
    checkUserType();
  }, []);

  return (
    <div className="w-64 bg-gray-800 text-white p-6 flex flex-col">
      <h2 className="text-xl font-semibold mb-6">Progetti</h2>
      
      <nav className="flex flex-col space-y-4 flex-1">
        <Link 
          href="/projects" 
          className="flex items-center text-gray-300 hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
            <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
          </svg>
          Tutti i progetti
        </Link>
        
        {userType === 'Company' && (
          <Link 
            href="/projects/create" 
            className="flex items-center text-gray-300 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Crea nuovo progetto
          </Link>
        )}
        
        {userType === 'Freelancer' && (
          <Link 
            href="/projects/matches" 
            className="flex items-center text-gray-300 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zm7-10a1 1 0 01.707.293l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 9H7a1 1 0 110-2h7.586l-3.293-3.293A1 1 0 0112 2z" clipRule="evenodd" />
            </svg>
            Progetti consigliati
          </Link>
        )}
        
        <Link 
          href="/dashboard" 
          className="flex items-center text-gray-300 hover:text-white transition-colors mt-8"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
          Dashboard
        </Link>
      </nav>
      
      <div className="mt-auto pt-6 border-t border-gray-700">
        <div className="text-sm text-gray-400">
          <p>Trova i migliori talenti o opportunità di lavoro su MaigenAI Hub!</p>
        </div>
      </div>
    </div>
  );
}