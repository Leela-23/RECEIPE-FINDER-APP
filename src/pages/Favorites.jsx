import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import RecipeCard from '../components/RecipeCard';
import { BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/24/solid';

const Favorites = () => {
  const { favorites, removeFromFavorites, isFavorite } = useFavorites();
  const [localFavorites, setLocalFavorites] = useState([]);

  // Update local state when favorites change
  useEffect(() => {
    setLocalFavorites(favorites);
  }, [favorites]);

  const handleFavoriteClick = (e, recipe) => {
    e.stopPropagation();
    removeFromFavorites(recipe.uri);
  };

  if (localFavorites.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="mx-auto w-24 h-24 text-gray-300 mb-4">
          <BookmarkIconSolid className="w-full h-full" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-2">No favorites yet</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          You haven't saved any recipes to your favorites yet.
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Find Recipes
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Favorites</h1>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {localFavorites.length} {localFavorites.length === 1 ? 'recipe' : 'recipes'}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {localFavorites.map((recipe) => (
          <RecipeCard
            key={recipe.uri}
            recipe={recipe}
            onFavoriteClick={handleFavoriteClick}
            isFavorite={isFavorite(recipe.uri)}
            onRecipeClick={() => {}}
          />
        ))}
      </div>
    </div>
  );
};

export default Favorites;
