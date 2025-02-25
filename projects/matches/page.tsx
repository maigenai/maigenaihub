'use client';
import { useEffect, useState } from 'react';
import { apiService, Project } from '../../services/api';
import ProjectSidebar from '../../components/ProjectSidebar';

export default function ProjectMatches() {
  const [matchedProjects, setMatchedProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Ottieni il profilo utente
        const user = await apiService.getCurrentUser();
        setUserProfile(user);
        
        if (user.user_type !== 'Freelancer') {
          setError('Questa pagina è disponibile solo per i freelancer');
          setLoading(false);
          return;
        }
        
        // Ottieni tutti i progetti
        const allProjects = await apiService.getProjects();
        
        // Per ora mostriamo tutti i progetti come consigliati
        // In futuro qui implementeremo il vero sistema di matching
        setMatchedProjects(allProjects.map(project => ({
          project,
          score: Math.random() * 100  // Punteggio casuale per demo
        })));
        
        setLoading(false);
      } catch (err: any) {
        console.error('Errore nel caricamento dei progetti consigliati:', err);
        setError(err.message || 'Si è verificato un errore durante il caricamento dei progetti consigliati');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Funzione per ottenere il colore di sfondo in base al punteggio
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 75) return 'bg-green-400';
    if (score >= 60) return 'bg-yellow-400';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-red-400';
  };

  // Funzione per ottenere il testo in base al punteggio
  const getMatchText = (score: number) => {
    if (score >= 90) return 'Match eccellente';
    if (score >= 75) return 'Match ottimo';
    if (score >= 60) return 'Match buono';
    if (score >= 40) return 'Match discreto';
    return 'Match basso';
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <ProjectSidebar />
        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Analisi dei progetti in corso...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-50">
        <ProjectSidebar />
        <div className="flex-1 p-8">
          <div className="max-w-md mx-auto bg-red-50 border-l-4 border-red-400 p-4 text-red-700">
            {error}
          </div>
        </div>
      </div>
    );
  }

  // Ordina i progetti per punteggio (dal più alto al più basso)
  const sortedProjects = [...matchedProjects].sort((a, b) => b.score - a.score);

  return (
    <div className="flex h-screen bg-gray-50">
      <ProjectSidebar />
      <div className="flex-1 p-8 overflow-auto">
        <h1 className="text-3xl font-bold mb-6">Progetti consigliati per te</h1>
        
        {userProfile && (
          <div className="bg-white rounded-lg shadow p-4 mb-8">
            <p className="text-gray-600">
              In base alle tue competenze ({userProfile.skills?.join(', ') || 'nessuna competenza specificata'}), 
              abbiamo trovato questi progetti che potrebbero interessarti.
            </p>
          </div>
        )}
        
        {sortedProjects.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedProjects.map((item, index) => {
              const project = item.project;
              const score = Math.round(item.score);
              const scoreColor = getScoreColor(score);
              
              return (
                <div key={index} className="bg-white shadow rounded-lg overflow-hidden">
                  <div className={`${scoreColor} px-4 py-2 text-white font-medium flex justify-between items-center`}>
                    <span>{getMatchText(score)}</span>
                    <span>{score}%</span>
                  </div>
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-2">{project.title || 'Progetto senza titolo'}</h2>
                    <p className="text-gray-600 mb-4 line-clamp-3">{project.description || 'Nessuna descrizione'}</p>
                    
                    <div className="mb-4">
                      <span className="font-medium">Budget: </span>
                      <span className="text-green-600">€{project.budget?.toLocaleString() || 0}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.required_skills?.map((skill: string, i: number) => (
                        <span 
                          key={i} 
                          className={`px-3 py-1 rounded-full text-sm ${
                            userProfile.skills?.includes(skill) 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                    
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
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <p className="text-gray-500">Nessun progetto consigliato al momento.</p>
          </div>
        )}
      </div>
    </div>
  );
}