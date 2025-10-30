import { XMarkIcon, HeartIcon as HeartIconOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

const RecipeModal = ({ isOpen, onClose, recipe, isFavorite, onFavoriteToggle }) => {
  if (!isOpen || !recipe) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm" 
            onClick={onClose}
          ></div>
        </div>

        {/* Modal content */}
        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="relative">
            {/* Recipe Image */}
            <div className="h-64 sm:h-80 w-full overflow-hidden">
              <img 
                src={recipe.image || 'https://via.placeholder.com/800x400?text=No+Image'} 
                alt={recipe.label} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/800x400?text=No+Image';
                }}
              />
              
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-md hover:scale-110 transition-transform"
                aria-label="Close modal"
              >
                <XMarkIcon className="h-6 w-6 text-gray-700 dark:text-gray-200" />
              </button>
              
              {/* Favorite Button */}
              <button
                onClick={onFavoriteToggle}
                className="absolute top-4 right-16 p-2 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-md hover:scale-110 transition-transform"
                aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                {isFavorite ? (
                  <HeartIconSolid className="h-6 w-6 text-red-500 fill-current" />
                ) : (
                  <HeartIconOutline className="h-6 w-6 text-gray-700 dark:text-gray-200" />
                )}
              </button>
            </div>
            
            <div className="p-6 sm:p-8">
              {/* Recipe Title and Info */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">{recipe.label}</h2>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 space-x-4">
                  <span>🔥 {Math.round(recipe.calories)} calories</span>
                  {recipe.yield && <span>🍽️ Serves {recipe.yield}</span>}
                  {recipe.totalTime && <span>⏱️ {recipe.totalTime} min</span>}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Ingredients */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 border-b pb-2">Ingredients</h3>
                  <ul className="space-y-2">
                    {recipe.ingredients && recipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="flex items-start">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mt-2 mr-2"></span>
                        <span className="text-gray-700 dark:text-gray-300">{ingredient}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Instructions */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 border-b pb-2">Instructions</h3>
                  {recipe.instructions ? (
                    <div className="prose max-w-none text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {recipe.instructions}
                    </div>
                  ) : recipe.url ? (
                    <p className="text-gray-700 dark:text-gray-300">
                      For detailed instructions, please visit the original recipe at:{' '}
                      <a 
                        href={recipe.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {new URL(recipe.url).hostname}
                      </a>
                    </p>
                  ) : (
                    <p className="text-gray-500 italic">No instructions available.</p>
                  )}
                </div>
              </div>
              
              {/* View Full Recipe Button */}
              {recipe.url && (
                <div className="mt-8 text-center">
                  <a
                    href={recipe.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    View Full Recipe
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeModal;
