'use client';
import { useEffect, useState } from 'react';
import { apiService, Freelancer } from '../services/api';
import ProfileSidebar from '../components/ProfileSidebar';

interface PortfolioItem {
  title: string;
  description: string;
  url: string;
  technologies: string[];
}

export default function Freelancers() {
  const [freelancer, setFreelancer] = useState<Freelancer | null>(null);
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No authentication token found. Please log in again.');
      return;
    }

    // Fetch del profilo dell'utente autenticato
    fetch('http://localhost:8000/api/profiles/me', {
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch user data: ${res.status} ${res.statusText}`);
        return res.json();
      })
      .then((data) => {
        if (data.user_type !== 'Freelancer') {
          setError('Only freelancers can access this page');
          return;
        }
        setFreelancer(data);
      })
      .catch((err) => setError(err.message));

    // Fetch di tutti i freelancer
    apiService.getFreelancers()
      .then((data) => setFreelancers(Array.isArray(data) ? data : []))
      .catch((err) => setError(`Freelancers fetch error: ${err.message}`));
  }, []);

  const handleProfileAdded = (newProfile: Freelancer) => {
    setFreelancers([...freelancers, newProfile]);
  };

  if (error) return <div className="max-w-md mx-auto p-6 text-red-600">{error}</div>;

  return (
    <div className="flex h-screen bg-gray-50">
      <ProfileSidebar onProfileAdded={handleProfileAdded} />
      
      <div className="flex-1 p-8 overflow-auto">
        <h1 className="text-3xl font-bold mb-6">GenAI Freelancers</h1>
        {freelancer && (
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold">Your Profile</h2>
            <p><strong>Experience:</strong> {freelancer.experience || 'Not specified'}</p>
            <p><strong>Skills:</strong> {freelancer.skills ? freelancer.skills.join(', ') : 'No skills listed'}</p>
          </div>
        )}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {freelancers.map((freelancer, index) => (
            <div key={index} className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold">{freelancer.experience || 'No experience'}</h2>
              <div className="mt-4">
                <h3 className="font-medium">Skills:</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {freelancer.skills.map((skill, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              {freelancer.portfolio && freelancer.portfolio.map((item, index) => (
                <div key={index} className="mt-4">
                  <h3 className="font-medium">Portfolio:</h3>
                  <div className="mt-2 border-t pt-2">
                    <h4 className="font-medium">{item.title}</h4>
                    <p className="text-gray-600">{item.description}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {item.technologies.map((tech, i) => (
                        <span key={i} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}