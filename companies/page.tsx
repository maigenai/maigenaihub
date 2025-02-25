'use client';

import { useEffect, useState } from 'react';
import { apiService, Company } from '../services/api';
import CompanySidebar from '../components/CompanySidebar';
import Link from 'next/link';

export default function CompanyDashboard() {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanyProfile = async () => {
      try {
        const userData = await apiService.getCurrentUser();
        
        if (userData.user_type !== 'Company') {
          setError('Solo le aziende possono accedere a questa pagina');
          return;
        }
        
        // Ottieni l'azienda corrente
        const companies = await apiService.getCompanies();
        const myCompany = companies.find((c: Company) => c.email === userData.email);
        
        if (myCompany) {
          setCompany(myCompany);
        }
        
      } catch (err) {
        console.error('Errore nel caricamento del profilo:', err);
        setError('Si è verificato un errore nel caricamento dei dati');
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyProfile();
  }, []);

  const handleCompanyCreated = (newCompany: Company) => {
    setCompany(newCompany);
  };

  if (loading) return <div className="p-8 text-center">Caricamento...</div>;
  
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <CompanySidebar onCompanyCreated={handleCompanyCreated} existingCompany={company} />
      
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard Azienda</h1>
        
        {company ? (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-2">{company.name}</h2>
            <p className="text-gray-600 mb-4">{company.description}</p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <span className="font-medium">Settore:</span> {company.industry}
              </div>
              <div>
                <span className="font-medium">Dimensione:</span> {company.size}
              </div>
              <div>
                <span className="font-medium">Sede:</span> {company.location}
              </div>
              <div>
                <span className="font-medium">Email:</span> {company.email}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
            <p className="text-yellow-700">
              Non hai ancora creato un profilo aziendale. Utilizza il form a sinistra per creare la tua azienda.
            </p>
          </div>
        )}
        
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">I tuoi progetti</h2>
            <Link 
              href="/projects"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Crea nuovo progetto
            </Link>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600">
              Gestisci i tuoi progetti esistenti o crea nuovi progetti per trovare freelancer.
            </p>
            <div className="mt-4">
              <Link 
                href="/projects" 
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Vai alla gestione progetti →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}