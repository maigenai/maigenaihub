// frontend/app/components/CompanySidebar.tsx
'use client';
import { useState, FormEvent } from 'react';
import { apiService } from '../services/api';

interface Company {
  name: string;
  description: string;
  industry: string;
  size: string;
  location: string;
  email: string;
  user_type: string;
}

interface CompanySidebarProps {
  onCompanyAdded: (company: Company) => void;
}

export default function CompanySidebar({ onCompanyAdded }: CompanySidebarProps) {
  const [formData, setFormData] = useState<Company>({
    name: '',
    description: '',
    industry: '',
    size: '',
    location: '',
    email: '',
    user_type: 'Company'
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = await apiService.createCompany(formData);
      onCompanyAdded(result);
      setFormData({ name: '', description: '', industry: '', size: '', location: '', email: '', user_type: 'Company' });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="w-80 border-r bg-white p-6">
      <h2 className="text-xl font-semibold mb-4">Add Company</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input 
            type="text"
            className="w-full border rounded-md p-2"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea 
            className="w-full border rounded-md p-2"
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Industry</label>
          <input 
            type="text"
            className="w-full border rounded-md p-2"
            value={formData.industry}
            onChange={(e) => setFormData({...formData, industry: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Size</label>
          <select 
            className="w-full border rounded-md p-2"
            value={formData.size}
            onChange={(e) => setFormData({...formData, size: e.target.value})}
          >
            <option value="">Select...</option>
            <option value="1-10">1-10 employees</option>
            <option value="11-50">11-50 employees</option>
            <option value="51-200">51-200 employees</option>
            <option value="201+">201+ employees</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <input 
            type="text"
            className="w-full border rounded-md p-2"
            value={formData.location}
            onChange={(e) => setFormData({...formData, location: e.target.value})}
          />
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
        <button 
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
        >
          Add Company
        </button>
      </form>
    </div>
  );
}