import React, { useState } from 'react';
import { Loader2, ArrowRight, CheckCircle, AlertTriangle, Plus, Trash2 } from 'lucide-react';

interface PortfolioItem {
  title: string;
  description: string;
  url: string;
  technologies: string[];
}

interface Profile {
  skills: string[];
  experience: string;
  portfolio: PortfolioItem[];
  hourly_rate: number | null;
  availability: string;
}

interface Analysis {
  technical_evaluation: Record<string, number>;
  strengths: string[];
  improvement_areas: string[];
  profile_optimization: string[];
}

const ProfileAnalyzer = () => {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [profile, setProfile] = useState<Profile>({
    skills: [],
    experience: '',
    portfolio: [
      { title: '', description: '', url: '', technologies: [] }
    ],
    hourly_rate: null,
    availability: ''
  });
  // Alert component semplificato
  const Alert = ({ children, variant = 'default' }: { children: React.ReactNode, variant?: 'default' | 'destructive' }) => (
    <div className={`p-4 rounded-lg ${
      variant === 'destructive' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
    }`}>
      {children}
    </div>
  );

  const handleSkillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({
      ...profile,
      skills: e.target.value.split(',').map((skill: string) => skill.trim())
    });
  };

  const handlePortfolioChange = (index: number, field: string, value: string) => {
    const newPortfolio = [...profile.portfolio];
    if (field === 'technologies') {
      newPortfolio[index].technologies = value.split(',').map((tech: string) => tech.trim());
    } else if (field === 'title' || field === 'description' || field === 'url') {
      newPortfolio[index][field] = value;
    }
    setProfile({ ...profile, portfolio: newPortfolio });
  };

  const addPortfolioItem = () => {
    setProfile({
      ...profile,
      portfolio: [...profile.portfolio, { title: '', description: '', url: '', technologies: [] }]
    });
  };

  const removePortfolioItem = (index: number) => {
    const newPortfolio = profile.portfolio.filter((_, i) => i !== index);
    setProfile({ ...profile, portfolio: newPortfolio });
  };

  const analyzeProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/analyze-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });

      if (!response.ok) throw new Error('Profile analysis failed');
      
      const result = await response.json();
      setAnalysis(result);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">AI Profile Analyzer</h2>

      <div className="bg-white p-6 rounded-lg shadow">
        {/* Skills Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Skills (comma separated)
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="prompt engineering, llm development, etc."
            onChange={handleSkillChange}
          />
        </div>

        {/* Experience Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Experience
          </label>
          <textarea
            className="w-full p-2 border rounded"
            rows={3}
            placeholder="Describe your GenAI experience..."
            onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
          />
        </div>

        {/* Portfolio Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">Portfolio Projects</label>
            <button
              onClick={addPortfolioItem}
              className="text-blue-600 hover:text-blue-700 flex items-center"
              type="button"
            >
              <Plus size={16} className="mr-1" />
              Add Project
            </button>
          </div>

          {profile.portfolio.map((item, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-sm font-medium">Project {index + 1}</h4>
                <button
                  onClick={() => removePortfolioItem(index)}
                  className="text-red-600 hover:text-red-700"
                  type="button"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  placeholder="Project Title"
                  value={item.title}
                  onChange={(e) => handlePortfolioChange(index, 'title', e.target.value)}
                />

                <textarea
                  className="w-full p-2 border rounded"
                  rows={2}
                  placeholder="Project Description"
                  value={item.description}
                  onChange={(e) => handlePortfolioChange(index, 'description', e.target.value)}
                />

                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  placeholder="Project URL"
                  value={item.url}
                  onChange={(e) => handlePortfolioChange(index, 'url', e.target.value)}
                />

                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  placeholder="Technologies (comma separated)"
                  value={item.technologies.join(', ')}
                  onChange={(e) => handlePortfolioChange(index, 'technologies', e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Rate and Availability */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hourly Rate (€)
            </label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              placeholder="e.g. 75"
              value={profile.hourly_rate || ''}
              onChange={(e) => setProfile({ ...profile, hourly_rate: e.target.value ? parseFloat(e.target.value) : null })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Availability
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="e.g. Full-time, 20h/week"
              onChange={(e) => setProfile({ ...profile, availability: e.target.value })}
            />
          </div>
        </div>

        {/* Analysis Button */}
        <button
          onClick={analyzeProfile}
          disabled={loading}
          className="w-full bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
          type="button"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin mr-2" size={20} />
              Analyzing Profile...
            </>
          ) : (
            <>
              Analyze Profile
              <ArrowRight className="ml-2" size={20} />
            </>
          )}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <Alert variant="destructive">
          <div className="flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2" />
            <div>{error}</div>
          </div>
        </Alert>
      )}

      {/* Analysis Results */}
      {analysis && (
        <div className="mt-6 bg-white p-6 rounded-lg shadow">
          <div className="flex items-center mb-6">
            <CheckCircle className="text-green-500 mr-2" size={24} />
            <h3 className="text-xl font-semibold">Profile Analysis</h3>
          </div>

          {/* Technical Evaluation */}
          <div className="mb-6">
            <h4 className="font-medium mb-2">Technical Skills Evaluation</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(analysis.technical_evaluation || {}).map(([skill, score]) => (
                <div key={skill} className="bg-gray-50 p-3 rounded">
                  <div className="text-sm font-medium">{skill}</div>
                  <div className="text-2xl font-bold text-blue-600">{score.toString()}/10</div>
                </div>
              ))}
            </div>
          </div>

          {/* Strengths & Improvements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="font-medium mb-2">Strengths</h4>
              <ul className="space-y-2">
                {(analysis.strengths || []).map((strength, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="text-green-500 mr-2" size={16} />
                    {strength}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">Areas for Improvement</h4>
              <ul className="space-y-2">
                {(analysis.improvement_areas || []).map((area, index) => (
                  <li key={index} className="flex items-center">
                    <AlertTriangle className="text-orange-500 mr-2" size={16} />
                    {area}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Profile Optimization Tips */}
          <div>
            <h4 className="font-medium mb-2">Profile Optimization Suggestions</h4>
            <div className="bg-blue-50 p-4 rounded-lg">
              <ul className="space-y-3">
                {(analysis.profile_optimization || []).map((tip, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <ArrowRight className="text-blue-600" size={16} />
                    </div>
                    <p className="ml-2 text-blue-900">{tip}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileAnalyzer;