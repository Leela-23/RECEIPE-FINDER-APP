import { createContext, useState, useEffect, useContext } from 'react';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  // Load favorites from localStorage on initial render
  useEffect(() => {
    const savedFavorites = localStorage.getItem('recipeFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('recipeFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const addToFavorites = (recipe) => {
    setFavorites(prevFavorites => {
      // Check if recipe is already in favorites
      if (!prevFavorites.some(item => item.uri === recipe.uri)) {
        return [...prevFavorites, recipe];
      }
      return prevFavorites;
    });
  };

  const removeFromFavorites = (recipeUri) => {
    setFavorites(prevFavorites => 
      prevFavorites.filter(recipe => recipe.uri !== recipeUri)
    );
  };

  const isFavorite = (recipeUri) => {
    return favorites.some(recipe => recipe.uri === recipeUri);
  };

  return (
    <FavoritesContext.Provider 
      value={{ 
        favorites, 
        addToFavorites, 
        removeFromFavorites, 
        isFavorite 
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export default FavoritesContext;
