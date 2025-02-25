'use client';
import { useEffect, useState } from 'react';
import { apiService, Project } from '../services/api';
import ProjectSidebar from '../components/ProjectSidebar';
import Link from 'next/link';

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [userProjects, setUserProjects] = useState<Project[]>([]);
  const [userType, setUserType] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Accesso negato. Effettua il login per visualizzare i progetti.');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const userData = await apiService.getCurrentUser();
        setUserType(userData.user_type);
        setUserEmail(userData.email);
        
        const allProjects = await apiService.getProjects();
        console.log("Progetti ricevuti:", allProjects);
        setProjects(allProjects);
        
        // Filtra i progetti dell'utente
        if (userData.user_type === 'Company') {
          const companyProjects = allProjects.filter((p: Project) => 
            p.company_email === userData.email
          );
          setUserProjects(companyProjects);
        } else if (userData.user_type === 'Freelancer') {
          const freelancerProjects = allProjects.filter((p: Project) => 
            p.freelancer_email === userData.email
          );
          setUserProjects(freelancerProjects);
        }
      } catch (err: any) {
        console.error("Errore:", err);
        setError(err.message || 'Si è verificato un errore durante il caricamento dei progetti');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return (
    <div className="flex h-screen bg-gray-50">
      <ProjectSidebar />
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Caricamento progetti...</p>
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex h-screen bg-gray-50">
      <ProjectSidebar />
      <div className="flex-1 p-8">
        <div className="max-w-md mx-auto bg-red-50 border-l-4 border-red-400 p-4 text-red-700">
          {error}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <ProjectSidebar />
      <div className="flex-1 p-8 overflow-auto">
        {userType === 'Company' && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">I tuoi progetti</h1>
              <Link 
                href="/projects/create"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Crea nuovo progetto
              </Link>
            </div>
            
            {userProjects.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userProjects.map((project, index) => (
                  <div key={`user-${index}`} className="bg-white shadow rounded-lg p-6 border-l-4 border-blue-500">
                    <h2 className="text-xl font-semibold">{project.title || 'Progetto senza titolo'}</h2>
                    <p className="text-gray-600 mt-2 line-clamp-3">{project.description || 'Nessuna descrizione'}</p>
                    <div className="mt-4">
                      <span className="font-medium">Budget: </span>
                      <span className="text-green-600">€{project.budget?.toLocaleString() || 0}</span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {project.required_skills?.map((skill: string, i: number) => (
                        <span key={i} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white shadow rounded-lg p-6 text-center">
                <p className="text-gray-500 mb-4">Non hai ancora creato progetti.</p>
                <Link 
                  href="/projects/create"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
                >
                  Crea il tuo primo progetto
                </Link>
              </div>
            )}
          </div>
        )}
        
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">Tutti i progetti disponibili</h2>
          
          {projects.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, index) => (
                <div key={`all-${index}`} className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-xl font-semibold">{project.title || 'Progetto senza titolo'}</h2>
                  <p className="text-gray-600 mt-2 line-clamp-3">{project.description || 'Nessuna descrizione'}</p>
                  <div className="mt-4">
                    <span className="font-medium">Budget: </span>
                    <span className="text-green-600">€{project.budget?.toLocaleString() || 0}</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {project.required_skills?.map((skill: string, i: number) => (
                      <span key={i} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                  {userType === 'Freelancer' && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <button 
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
                        onClick={() => {
                          // Qui implementerai la logica per candidarsi al progetto
                          alert('Funzionalità di candidatura in fase di sviluppo');
                        }}
                      >
                        Candidati a questo progetto
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg p-6 text-center">
              <p className="text-gray-500">Nessun progetto disponibile al momento.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}