import { useState } from 'react';
import { useFavorites } from '../context/FavoritesContext';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import fetchRecipes from '../api';
import RecipeCard from '../components/RecipeCard';
import RecipeModal from '../components/RecipeModal';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

  const searchRecipes = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);

    try {
      console.log('Searching for:', searchQuery);
      
      // Call the API
      const results = await fetchRecipes(searchQuery, { to: 24 });
      console.log('Search Results:', results);
      setRecipes(results);
      
      setRecipes(results);
    } catch (err) {
      console.error('Error details:', {
        message: err.message,
        stack: err.stack,
        response: err.response?.data
      });
      setError(err.message || 'Failed to fetch recipes. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleRecipeClick = (recipe) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  };

  const handleFavoriteClick = (e, recipe) => {
    e.stopPropagation();
    if (isFavorite(recipe.uri)) {
      removeFromFavorites(recipe.uri);
    } else {
      addToFavorites(recipe);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Find Your Perfect Recipe</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Search for recipes by ingredients, cuisine, or dish name
        </p>
        
        <form onSubmit={searchRecipes} className="max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for recipes..."
              className="w-full px-6 py-4 pr-12 rounded-full border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary text-white p-2 rounded-full hover:bg-primary/90 transition-colors"
              disabled={loading}
            >
              <MagnifyingGlassIcon className="h-6 w-6" />
            </button>
          </div>
        </form>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-8" role="alert">
          <p>{error}</p>
        </div>
      )}

      {/* No Results */}
      {!loading && !error && recipes.length === 0 && searchQuery && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">No recipes found for "{searchQuery}"</p>
          <p className="text-gray-400 dark:text-gray-500 mt-2">Try a different search term</p>
        </div>
      )}

      {/* Recipe Grid */}
      {!loading && recipes.length > 0 && (
        <>
          <h2 className="text-2xl font-semibold mb-6">Search Results</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.uri}
                recipe={recipe}
                onRecipeClick={handleRecipeClick}
                onFavoriteClick={handleFavoriteClick}
                isFavorite={isFavorite(recipe.uri)}
              />
            ))}
          </div>
        </>
      )}

      {/* Recipe Modal */}
      <RecipeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        recipe={selectedRecipe}
        isFavorite={selectedRecipe ? isFavorite(selectedRecipe.uri) : false}
        onFavoriteToggle={selectedRecipe ? 
          (e) => handleFavoriteClick(e, selectedRecipe) : undefined
        }
      />
    </div>
  );
};

export default Home;
