'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiService, Project } from '../../services/api';

export default function CreateProject() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState<number>(0);
  const [timeline, setTimeline] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [currentSkill, setCurrentSkill] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await apiService.getCurrentUser();
        if (user.user_type !== 'Company') {
          setError('Solo le aziende possono creare progetti');
          return;
        }
        setUserEmail(user.email);
      } catch (err) {
        console.error('Errore nel caricamento dell\'utente:', err);
        setError('Accesso negato. Effettua il login come azienda.');
      }
    };

    checkAuth();
  }, []);

  const addSkill = () => {
    if (currentSkill.trim() && !skills.includes(currentSkill.trim())) {
      setSkills([...skills, currentSkill.trim()]);
      setCurrentSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!title || !description || budget <= 0 || !timeline || skills.length === 0) {
      setError('Tutti i campi sono obbligatori');
      setLoading(false);
      return;
    }

    try {
      const project: Project = {
        title,
        description,
        budget,
        timeline,
        required_skills: skills,
        company_email: userEmail
      };

      await apiService.createProject(project);
      router.push('/projects');
    } catch (err: any) {
      console.error('Errore nella creazione del progetto:', err);
      setError(err.message || 'Si è verificato un errore durante la creazione del progetto');
    } finally {
      setLoading(false);
    }
  };

  if (error && error.includes('Accesso negato')) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
        <button
          onClick={() => router.push('/login')}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Vai al login
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Crea un nuovo progetto</h1>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Titolo del progetto
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Es: Sviluppo sito web e-commerce"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Descrizione dettagliata
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Descrivi dettagliatamente il progetto, le funzionalità richieste e gli obiettivi..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
              Budget (€)
            </label>
            <input
              type="number"
              id="budget"
              value={budget}
              onChange={(e) => setBudget(parseFloat(e.target.value))}
              min="0"
              step="100"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Es: 1000"
            />
          </div>

          <div>
            <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 mb-2">
              Tempistiche
            </label>
            <input
              type="text"
              id="timeline"
              value={timeline}
              onChange={(e) => setTimeline(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Es: 2 settimane, 1 mese, ecc."
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Competenze richieste
          </label>
          <div className="flex">
            <input
              type="text"
              value={currentSkill}
              onChange={(e) => setCurrentSkill(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Es: React, Python, Design, ecc."
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
            />
            <button
              type="button"
              onClick={addSkill}
              className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700"
            >
              Aggiungi
            </button>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => router.push('/projects')}
            className="mr-4 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Annulla
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Creazione in corso...' : 'Crea progetto'}
          </button>
        </div>
      </form>
    </div>
  );
}