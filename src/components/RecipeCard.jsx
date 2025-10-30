import { HeartIcon as HeartIconOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

import { useState } from 'react';

const RecipeCard = ({ recipe, onRecipeClick, onFavoriteClick, isFavorite }) => {
  const [imgLoaded, setImgLoaded] = useState(false);

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (onFavoriteClick) {
      onFavoriteClick(e, recipe);
    }
  };

  const src = recipe.image || 'https://via.placeholder.com/600x400?text=No+Image';

  return (
    <div 
      className="card cursor-pointer h-full flex flex-col bg-transparent"
      onClick={() => onRecipeClick && onRecipeClick(recipe)}
    >
      {/* Recipe Image */}
      <div className="relative h-48 overflow-hidden bg-gray-200 dark:bg-gray-700">
        {/* skeleton / backdrop while image loads */}
        {!imgLoaded && (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600"></div>
        )}

        <img 
          src={src}
          alt={recipe.label}
          className={`w-full h-full object-cover transition-transform duration-300 ${imgLoaded ? 'hover:scale-105' : 'opacity-0'}`}
          onLoad={() => setImgLoaded(true)}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/600x400?text=No+Image';
            setImgLoaded(true);
          }}
        />
        
        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-2 right-2 p-2 bg-white/80 dark:bg-gray-800/80 rounded-full shadow-md hover:scale-110 transition-transform"
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavorite ? (
            <HeartIconSolid className="h-6 w-6 text-red-500 fill-current" />
          ) : (
            <HeartIconOutline className="h-6 w-6 text-gray-700 dark:text-gray-200" />
          )}
        </button>
        
        {/* Calories Badge */}
        <span className="absolute bottom-2 left-2 bg-white/90 dark:bg-gray-800/90 text-xs font-medium px-2 py-1 rounded-full">
          {Math.round(recipe.calories)} cal
        </span>
      </div>
      
      {/* Recipe Info */}
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{recipe.label}</h3>
        
        {/* Ingredients Preview */}
        {recipe.ingredients && (
          <div className="mt-2">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
              {recipe.ingredients.slice(0, 3).join(', ')}
              {recipe.ingredients.length > 3 ? '...' : ''}
            </p>
          </div>
        )}
        
        {/* View Recipe Button */}
        <button 
          className="mt-4 text-sm font-medium text-primary hover:text-primary/80 transition-colors text-left"
          onClick={(e) => {
            e.stopPropagation();
            onRecipeClick && onRecipeClick(recipe);
          }}
        >
          View Recipe →
        </button>
      </div>
    </div>
  );
};

export default RecipeCard;
