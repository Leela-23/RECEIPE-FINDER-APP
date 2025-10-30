import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import { FavoritesProvider } from './context/FavoritesContext';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    // Check user's preferred color scheme
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true' || 
             (!('darkMode' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  // Update dark mode class and save to localStorage
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  return (
    <FavoritesProvider>
      <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'dark' : ''}`}>
        <div className="flex flex-col min-h-screen">
          <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          <main className="flex-grow container mx-auto px-4 py-8">
            {/* Outlet renders the active child route (Home, Favorites, etc.) */}
            <Outlet />
          </main>
          <footer className="bg-white dark:bg-gray-800 shadow-inner py-4 mt-8">
            <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-300">
              <p>© {new Date().getFullYear()} Recipe Finder App. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </div>
    </FavoritesProvider>
  );
}

export default App;
