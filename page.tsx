'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronRight, Users, Building, Sparkles } from 'lucide-react';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Carica la preferenza di tema dal localStorage o dal sistema
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (savedTheme !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Gestisci il cambio di tema
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      {/* Navbar */}
      <nav className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <Link href="/" className={`${isDarkMode ? 'text-blue-300' : 'text-blue-600'} text-2xl font-bold`}>
                MaigenAI Hub
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/freelancers" className={`${isDarkMode ? 'text-gray-300 hover:text-blue-300' : 'text-gray-700 hover:text-blue-600'} transition-colors`}>
                Freelancers
              </Link>
              <Link href="/companies" className={`${isDarkMode ? 'text-gray-300 hover:text-blue-300' : 'text-gray-700 hover:text-blue-600'} transition-colors`}>
                Companies
              </Link>
              <Link href="/projects" className={`${isDarkMode ? 'text-gray-300 hover:text-blue-300' : 'text-gray-700 hover:text-blue-600'} transition-colors`}>
                Projects
              </Link>
              <Link
                href="/get-started"
                className={`${isDarkMode ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'} inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white`}
              >
                Get Started
              </Link>
              <button
                onClick={toggleTheme}
                className={`${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'} ml-4 px-3 py-1 rounded-full`}
              >
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
              </button>
            </div>
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-400 hover:text-gray-500 hover:bg-gray-100'} p-2 rounded-md`}
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
        {isMenuOpen && (
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} md:hidden px-2 pt-2 pb-3 space-y-1 sm:px-3`}>
            <Link href="/freelancers" className={`${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'} block px-3 py-2 rounded-md text-base font-medium`}>
              Freelancers
            </Link>
            <Link href="/companies" className={`${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'} block px-3 py-2 rounded-md text-base font-medium`}>
              Companies
            </Link>
            <Link href="/projects" className={`${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'} block px-3 py-2 rounded-md text-base font-medium`}>
              Projects
            </Link>
            <Link
              href="/get-started"
              className={`${isDarkMode ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'} block px-3 py-2 rounded-md text-base font-medium text-white`}
            >
              Get Started
            </Link>
            <button
              onClick={toggleTheme}
              className={`${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'} px-3 py-2 rounded-md w-full text-left`}
            >
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} relative overflow-hidden`}>
        <div className="max-w-7xl mx-auto">
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32`}>
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className={`${isDarkMode ? 'text-gray-100' : 'text-gray-900'} text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl`}>
                  <span className="block">The Future of Freelancing in GenAI for Europe</span>
                  <span className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>Connect the best GenAI talents with visionary companies.</span>
                </h1>
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-500'} mt-3 text-base sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0`}>
                  Join the freelance work revolution in Europe.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link
                      href="/get-started"
                      className={`${isDarkMode ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'} w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white md:py-4 md:text-lg md:px-10`}
                    >
                      Get Started Now
                      <ChevronRight className={`${isDarkMode ? 'text-blue-300' : 'text-white'} ml-2 h-5 w-5`} />
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} py-12`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'} text-base font-semibold tracking-wide uppercase`}>
              Features
            </h2>
            <p className={`${isDarkMode ? 'text-gray-200' : 'text-gray-900'} mt-2 text-3xl leading-8 font-extrabold tracking-tight sm:text-4xl`}>
              A New Way to Work with AI
            </p>
          </div>
          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <div className={`${isDarkMode ? 'bg-blue-700' : 'bg-blue-500'} absolute flex items-center justify-center h-12 w-12 rounded-md text-white`}>
                  <Users className="h-6 w-6" />
                </div>
                <p className={`${isDarkMode ? 'text-gray-200' : 'text-gray-900'} ml-16 text-lg leading-6 font-medium`}>Verified Freelancers</p>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-2 ml-16 text-base`}>Access to the best GenAI talents in Europe</p>
              </div>
              <div className="relative">
                <div className={`${isDarkMode ? 'bg-blue-700' : 'bg-blue-500'} absolute flex items-center justify-center h-12 w-12 rounded-md text-white`}>
                  <Building className="h-6 w-6" />
                </div>
                <p className={`${isDarkMode ? 'text-gray-200' : 'text-gray-900'} ml-16 text-lg leading-6 font-medium`}>Innovative Companies</p>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-2 ml-16 text-base`}>Cutting-edge projects in the AI field</p>
              </div>
              <div className="relative">
                <div className={`${isDarkMode ? 'bg-blue-700' : 'bg-blue-500'} absolute flex items-center justify-center h-12 w-12 rounded-md text-white`}>
                  <Sparkles className="h-6 w-6" />
                </div>
                <p className={`${isDarkMode ? 'text-gray-200' : 'text-gray-900'} ml-16 text-lg leading-6 font-medium`}>Smart Matching</p>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-2 ml-16 text-base`}>Perfect connections between talents and opportunities</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className={`${isDarkMode ? 'bg-blue-900' : 'bg-blue-600'}`}>
        <div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="text-center">
              <div className={`${isDarkMode ? 'text-blue-200' : 'text-white'} text-5xl font-extrabold`}>1000+</div>
              <div className={`${isDarkMode ? 'text-blue-300' : 'text-blue-100'} mt-2 text-lg font-medium`}>Freelancers</div>
            </div>
            <div className="text-center">
              <div className={`${isDarkMode ? 'text-blue-200' : 'text-white'} text-5xl font-extrabold`}>100+</div>
              <div className={`${isDarkMode ? 'text-blue-300' : 'text-blue-100'} mt-2 text-lg font-medium`}>Companies</div>
            </div>
            <div className="text-center">
              <div className={`${isDarkMode ? 'text-blue-200' : 'text-white'} text-5xl font-extrabold`}>€1M+</div>
              <div className={`${isDarkMode ? 'text-blue-300' : 'text-blue-100'} mt-2 text-lg font-medium`}>Completed Projects</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}