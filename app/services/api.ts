// frontend/services/api.ts

interface PortfolioItem {
  title: string;
  description: string;
  url: string;
  technologies: string[];
}

interface Freelancer {
  experience: string;
  skills: string[];
  portfolio: PortfolioItem[];
  user_type: string;
  email: string;
  hourly_rate?: number;
  availability?: string;
}

interface Company {
  name: string;
  description: string;
  industry: string;
  size: string;
  location: string;
  email: string;
  user_type: string;
}

interface Project {
  title: string;
  description: string;
  budget: number;
  timeline: string;
  required_skills: string[];
  company_email?: string;
  freelancer_email?: string;
}

export const apiService = {
  async getFreelancers(): Promise<Freelancer[]> {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in getFreelancers');
      throw new Error('No authentication token found');
    }
    
    try {
      const response = await fetch('http://localhost:8000/api/profiles', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Failed to fetch freelancers: ${response.status} ${response.statusText}`, errorText);
        throw new Error(`Failed to fetch freelancers: ${response.status}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('Error in getFreelancers:', error);
      throw error;
    }
  },

  async getCompanies(): Promise<Company[]> {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in getCompanies');
      throw new Error('No authentication token found');
    }
    
    try {
      const response = await fetch('http://localhost:8000/api/companies', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Failed to fetch companies: ${response.status} ${response.statusText}`, errorText);
        throw new Error(`Failed to fetch companies: ${response.status}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('Error in getCompanies:', error);
      throw error;
    }
  },

  async getProjects(): Promise<Project[]> {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in getProjects');
      throw new Error('No authentication token found');
    }
    
    try {
      console.log('Fetching projects from API...');
      const response = await fetch('http://localhost:8000/api/projects', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Failed to fetch projects: ${response.status} ${response.statusText}`, errorText);
        throw new Error(`Failed to fetch projects: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Projects received:', data);
      return data;
    } catch (error) {
      console.error('Error in getProjects:', error);
      throw error;
    }
  },

  async createFreelancerProfile(profile: Freelancer): Promise<Freelancer> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    try {
      const response = await fetch('http://localhost:8000/api/profiles', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Failed to create freelancer profile: Status ${response.status}`, errorText);
        throw new Error(`Failed to create freelancer profile: ${response.status} ${errorText}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('Error in createFreelancerProfile:', error);
      throw error;
    }
  },

  async createCompany(company: Company): Promise<Company> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    try {
      const response = await fetch('http://localhost:8000/api/companies', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(company),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Failed to create company: Status ${response.status}`, errorText);
        throw new Error(`Failed to create company: ${response.status}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('Error in createCompany:', error);
      throw error;
    }
  },

  async createProject(project: Project): Promise<Project> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    try {
      console.log('Creating project:', project);
      const response = await fetch('http://localhost:8000/api/projects', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(project),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Failed to create project: Status ${response.status}`, errorText);
        throw new Error(`Failed to create project: ${response.status} ${errorText}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('Error in createProject:', error);
      throw error;
    }
  },

  async getCurrentUser(): Promise<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in getCurrentUser');
      throw new Error('No authentication token found');
    }
    
    try {
      const response = await fetch('http://localhost:8000/api/profiles/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Failed to fetch current user: ${response.status} ${response.statusText}`, errorText);
        throw new Error(`Failed to fetch current user: ${response.status}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('Error in getCurrentUser:', error);
      throw error;
    }
  },

  async findMatches(freelancerId: string, project: any): Promise<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    try {
      const response = await fetch(`http://localhost:8000/api/matching/find-matches?freelancer_id=${freelancerId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(project),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Failed to find matches: ${response.status}`, errorText);
        throw new Error(`Failed to find matches: ${response.status}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('Error in findMatches:', error);
      throw error;
    }
  },

  async batchMatch(project: any, minScore: number = 0.7): Promise<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    try {
      const response = await fetch('http://localhost:8000/api/matching/batch-match', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ project, min_score: minScore }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Failed to perform batch match: ${response.status}`, errorText);
        throw new Error(`Failed to perform batch match: ${response.status}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('Error in batchMatch:', error);
      throw error;
    }
  },
};

export type { Freelancer, Company, Project, PortfolioItem };