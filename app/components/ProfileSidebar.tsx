// frontend/app/components/ProfileSidebar.tsx
'use client';
import { useState, FormEvent } from 'react';
import { apiService } from '../services/api';

interface ProfileSidebarProps {
  onProfileAdded: (profile: any) => void;
}

export default function ProfileSidebar({ onProfileAdded }: ProfileSidebarProps) {
  const [formData, setFormData] = useState({
    experience: '',
    skills: '',
    hourly_rate: '',
    availability: 'Full-time',
    email: '',
    user_type: 'Freelancer',
    portfolio: [{
      title: '',
      description: '',
      url: '',
      technologies: ''
    }]
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        hourly_rate: parseFloat(formData.hourly_rate) || 0,
        skills: formData.skills.split(',').map(s => s.trim()),
        portfolio: formData.portfolio.map(p => ({
          ...p,
          technologies: p.technologies.split(',').map(t => t.trim())
        }))
      };
      const result = await apiService.createFreelancerProfile(data);
      onProfileAdded(result);
      setFormData({
        experience: '',
        skills: '',
        hourly_rate: '',
        availability: 'Full-time',
        email: '',
        user_type: 'Freelancer',
        portfolio: [{ title: '', description: '', url: '', technologies: '' }]
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="w-80 border-r bg-white p-6">
      <h2 className="text-xl font-semibold mb-4">Aggiungi Profilo</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Esperienza</label>
          <textarea 
            className="w-full border rounded-md p-2"
            rows={3}
            value={formData.experience}
            onChange={(e) => setFormData({...formData, experience: e.target.value})}
            placeholder="Descrivi la tua esperienza..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Skills</label>
          <input 
            type="text"
            className="w-full border rounded-md p-2"
            value={formData.skills}
            onChange={(e) => setFormData({...formData, skills: e.target.value})}
            placeholder="es: prompt engineering, LLM development"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Tariffa Oraria (€)</label>
          <input 
            type="number"
            className="w-full border rounded-md p-2"
            value={formData.hourly_rate}
            onChange={(e) => setFormData({...formData, hourly_rate: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Disponibilità</label>
          <select 
            className="w-full border rounded-md p-2"
            value={formData.availability}
            onChange={(e) => setFormData({...formData, availability: e.target.value})}
          >
            <option>Full-time</option>
            <option>Part-time</option>
            <option>Freelance</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input 
            type="email"
            className="w-full border rounded-md p-2"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Portfolio</label>
          {formData.portfolio.map((item, index) => (
            <div key={index} className="space-y-2 mt-2">
              <input
                type="text"
                className="w-full border rounded-md p-2"
                value={item.title}
                onChange={(e) => {
                  const newPortfolio = [...formData.portfolio];
                  newPortfolio[index].title = e.target.value;
                  setFormData({...formData, portfolio: newPortfolio});
                }}
                placeholder="Titolo progetto"
              />
              <input
                type="text"
                className="w-full border rounded-md p-2"
                value={item.description}
                onChange={(e) => {
                  const newPortfolio = [...formData.portfolio];
                  newPortfolio[index].description = e.target.value;
                  setFormData({...formData, portfolio: newPortfolio});
                }}
                placeholder="Descrizione"
              />
              <input
                type="text"
                className="w-full border rounded-md p-2"
                value={item.technologies}
                onChange={(e) => {
                  const newPortfolio = [...formData.portfolio];
                  newPortfolio[index].technologies = e.target.value;
                  setFormData({...formData, portfolio: newPortfolio});
                }}
                placeholder="Tecnologie (separate da virgola)"
              />
            </div>
          ))}
        </div>

        <button 
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
        >
          Salva Profilo
        </button>
      </form>
    </div>
  );
}