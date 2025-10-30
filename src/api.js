import axios from 'axios';

const EDAMAM_APP_ID = process.env.REACT_APP_EDAMAM_APP_ID;
const EDAMAM_APP_KEY = process.env.REACT_APP_EDAMAM_APP_KEY;
const SPOONACULAR_KEY = process.env.REACT_APP_SPOONACULAR_API_KEY;

// TheMealDB API endpoints
const MEALDB_BASE_URL = 'https://www.themealdb.com/api/json/v1/1';
const MEALDB_ENDPOINTS = {
  SEARCH_BY_NAME: (name) => `${MEALDB_BASE_URL}/search.php?s=${encodeURIComponent(name)}`,
  SEARCH_BY_LETTER: (letter) => `${MEALDB_BASE_URL}/search.php?f=${letter}`,
  LOOKUP_BY_ID: (id) => `${MEALDB_BASE_URL}/lookup.php?i=${id}`,
  RANDOM_MEAL: () => `${MEALDB_BASE_URL}/random.php`,
  CATEGORIES: () => `${MEALDB_BASE_URL}/categories.php`,
  LIST_BY_TYPE: (type) => `${MEALDB_BASE_URL}/list.php?${type}=list`, // type: c=category, a=area, i=ingredient
  FILTER_BY_INGREDIENT: (ingredient) => `${MEALDB_BASE_URL}/filter.php?i=${encodeURIComponent(ingredient)}`,
  FILTER_BY_CATEGORY: (category) => `${MEALDB_BASE_URL}/filter.php?c=${encodeURIComponent(category)}`,
  FILTER_BY_AREA: (area) => `${MEALDB_BASE_URL}/filter.php?a=${encodeURIComponent(area)}`,
};

// TheMealDB image utilities
export const getMealThumbnail = (imageUrl, size = 'medium') => {
  if (!imageUrl) return '';
  return `${imageUrl}/preview/${size}`; // size: small, medium, large
};

export const getIngredientImage = (ingredient, size = 'medium') => {
  if (!ingredient) return '';
  const formattedName = ingredient.toLowerCase().replace(/\s+/g, '_');
  const suffix = size === 'small' ? '-small' : size === 'large' ? '-large' : '-medium';
  return `https://www.themealdb.com/images/ingredients/${formattedName}${suffix}.png`;
};

// No predefined/mock recipes — when no paid API keys are present we use TheMealDB (free)

/**
 * Normalize a recipe object into the app's shape
 */
const normalizeEdamam = (r) => ({
  uri: r.uri,
  label: r.label,
  image: r.image,
  calories: r.calories || 0,
  ingredients: r.ingredientLines || [],
  url: r.url,
  yield: r.yield,
  totalTime: r.totalTime
});

const normalizeSpoonacular = (r) => ({
  uri: `spoonacular-${r.id}`,
  label: r.title,
  image: r.image ? r.image : `https://spoonacular.com/recipeImages/${r.id}-556x370.jpg`,
  calories: r.nutrition && r.nutrition.nutrients ? (r.nutrition.nutrients.find(n => n.name === 'Calories') || {}).amount || 0 : 0,
  ingredients: r.extendedIngredients ? r.extendedIngredients.map(i => i.original) : [],
  url: r.sourceUrl || r.spoonacularSourceUrl || '',
  yield: r.servings,
  totalTime: r.readyInMinutes
});

// TheMealDB specific API methods
export const getMealById = async (id) => {
  try {
    const res = await axios.get(MEALDB_ENDPOINTS.LOOKUP_BY_ID(id));
    return res.data.meals?.[0] || null;
  } catch (err) {
    console.error('Failed to fetch meal by ID:', err);
    return null;
  }
};

export const getRandomMeal = async () => {
  try {
    const res = await axios.get(MEALDB_ENDPOINTS.RANDOM_MEAL());
    return res.data.meals?.[0] || null;
  } catch (err) {
    console.error('Failed to fetch random meal:', err);
    return null;
  }
};

export const getMealCategories = async () => {
  try {
    const res = await axios.get(MEALDB_ENDPOINTS.CATEGORIES());
    return res.data.categories || [];
  } catch (err) {
    console.error('Failed to fetch meal categories:', err);
    return [];
  }
};

export const getListByType = async (type) => {
  try {
    const res = await axios.get(MEALDB_ENDPOINTS.LIST_BY_TYPE(type));
    return res.data.meals || [];
  } catch (err) {
    console.error(`Failed to fetch ${type} list:`, err);
    return [];
  }
};

export const filterByIngredient = async (ingredient) => {
  try {
    const res = await axios.get(MEALDB_ENDPOINTS.FILTER_BY_INGREDIENT(ingredient));
    return res.data.meals || [];
  } catch (err) {
    console.error('Failed to filter by ingredient:', err);
    return [];
  }
};

export const filterByCategory = async (category) => {
  try {
    const res = await axios.get(MEALDB_ENDPOINTS.FILTER_BY_CATEGORY(category));
    return res.data.meals || [];
  } catch (err) {
    console.error('Failed to filter by category:', err);
    return [];
  }
};

export const filterByArea = async (area) => {
  try {
    const res = await axios.get(MEALDB_ENDPOINTS.FILTER_BY_AREA(area));
    return res.data.meals || [];
  } catch (err) {
    console.error('Failed to filter by area:', err);
    return [];
  }
};

export const searchByFirstLetter = async (letter) => {
  try {
    const res = await axios.get(MEALDB_ENDPOINTS.SEARCH_BY_LETTER(letter));
    return res.data.meals || [];
  } catch (err) {
    console.error('Failed to search by letter:', err);
    return [];
  }
};

/**
 * Fetch recipes using Edamam or Spoonacular depending on which API keys are available.
 * If no keys are present, returns a small mocked list so the UI still works.
 */
export const fetchRecipes = async (query, { to = 20 } = {}) => {
  // Prefer Edamam if keys are set
  if (EDAMAM_APP_ID && EDAMAM_APP_KEY) {
    const url = `https://api.edamam.com/search?q=${encodeURIComponent(query)}&app_id=${EDAMAM_APP_ID}&app_key=${EDAMAM_APP_KEY}&to=${to}`;
    const res = await axios.get(url);
    if (!res.data || !Array.isArray(res.data.hits)) return [];
    return res.data.hits.map(hit => normalizeEdamam(hit.recipe));
  }

  // Fallback to Spoonacular if its key is provided
  if (SPOONACULAR_KEY) {
    // Use complexSearch to get basic results, then fetch details for each hit to get ingredients
    const searchUrl = `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(query)}&number=${to}&addRecipeInformation=true&apiKey=${SPOONACULAR_KEY}`;
    const res = await axios.get(searchUrl);
    if (!res.data || !Array.isArray(res.data.results)) return [];
    return res.data.results.map(r => normalizeSpoonacular(r));
  }

  console.log('Using TheMealDB API - no API keys set for Edamam or Spoonacular');
  
  // Initialize results map to store unique recipes
  const searchResults = new Map();  try {
    // Helper function to calculate relevance score
    const calculateRelevance = (meal, searchQuery) => {
      const query = searchQuery.toLowerCase();
      const name = meal.strMeal.toLowerCase();
      const category = meal.strCategory?.toLowerCase() || '';
      const area = meal.strArea?.toLowerCase() || '';
      let score = 0;

      // Exact name match gets highest score
      if (name === query) {
        score += 100;
      }
      // Name starts with query
      else if (name.startsWith(query)) {
        score += 80;
      }
      // Name contains query as a word
      else if (name.includes(` ${query} `) || name.includes(`${query} `) || name.includes(` ${query}`)) {
        score += 60;
      }
      // Name contains query somewhere
      else if (name.includes(query)) {
        score += 40;
      }

      // Check ingredients
      for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`]?.toLowerCase() || '';
        if (ingredient === query) {
          score += 50;
        } else if (ingredient.includes(query)) {
          score += 30;
        }
      }

      // Category and area matches
      if (category === query) score += 40;
      if (area === query) score += 40;
      if (category.includes(query)) score += 20;
      if (area.includes(query)) score += 20;

      return score;
    };

    // Helper function to normalize meal data
    const normalizeMealDBMeal = (meal, query) => {
      const ingredients = [];
      for (let i = 1; i <= 20; i++) {
        const ing = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ing && ing.trim()) {
          ingredients.push((measure && measure.trim() ? `${measure.trim()} ` : '') + ing.trim());
        }
      }

      // Calculate relevance score
      const relevanceScore = calculateRelevance(meal, query);

      return {
        uri: `themealdb-${meal.idMeal}`,
        label: meal.strMeal,
        image: meal.strMealThumb,
        calories: 0,
        ingredients,
        url: meal.strSource || meal.strYoutube || '',
        yield: null,
        totalTime: null,
        instructions: meal.strInstructions,
        relevanceScore, // Add relevance score to the recipe object
        category: meal.strCategory,
        cuisine: meal.strArea
      };
    };

    // Get all categories first
    const categoriesRes = await axios.get(`${MEALDB_BASE_URL}/categories.php`);
    const categories = categoriesRes.data.categories || [];
    
    // Helper function to add meals to results map
    const addMealsToResults = (meals) => {
      if (!meals) return;
      meals.forEach(meal => searchResults.set(meal.idMeal, meal));
    };

    // Search strategies
    const searchPromises = [
      // 1. Direct name search
      axios.get(`${MEALDB_BASE_URL}/search.php?s=${encodeURIComponent(query)}`),
      
      // 2. First letter search
      axios.get(`${MEALDB_BASE_URL}/search.php?f=${query.charAt(0)}`),
      
      // 3. Ingredient search
      axios.get(`${MEALDB_BASE_URL}/filter.php?i=${encodeURIComponent(query)}`),
      
      // 4. Category search if query matches any category
      ...categories
        .filter(cat => cat.strCategory.toLowerCase().includes(query.toLowerCase()))
        .map(cat => axios.get(`${MEALDB_BASE_URL}/filter.php?c=${encodeURIComponent(cat.strCategory)}`)),
      
      // 5. Area/Cuisine search
      axios.get(`${MEALDB_BASE_URL}/filter.php?a=${encodeURIComponent(query)}`)
    ];

    console.log('Starting comprehensive TheMealDB search for:', query);
    
    const responses = await Promise.allSettled(searchPromises);
    
    // Process successful responses
    responses.forEach(response => {
      if (response.status === 'fulfilled' && response.value.data?.meals) {
        addMealsToResults(response.value.data.meals);
      }
    });

    // For meals that only have basic info, fetch full details
    const mealsNeedingDetails = Array.from(searchResults.values())
      .filter(meal => !meal.strInstructions)
      .slice(0, Math.min(to, 10));

    if (mealsNeedingDetails.length > 0) {
      const detailsPromises = mealsNeedingDetails.map(meal =>
        axios.get(`${MEALDB_BASE_URL}/lookup.php?i=${meal.idMeal}`)
      );
      
      const detailsResponses = await Promise.allSettled(detailsPromises);
      
      detailsResponses.forEach(response => {
        if (response.status === 'fulfilled' && response.value.data?.meals?.[0]) {
          searchResults.set(response.value.data.meals[0].idMeal, response.value.data.meals[0]);
        }
      });
    }

    // If still no results, try a fuzzy search through categories and areas
    if (searchResults.size === 0) {
        // Get all areas
      const areasRes = await axios.get(`${MEALDB_BASE_URL}/list.php?a=list`);
      const areas = areasRes.data.meals || [];
      
      // Check each area for partial matches
      const matchingAreas = areas
        .filter(area => area.strArea.toLowerCase().includes(query.toLowerCase()))
        .map(area => axios.get(`${MEALDB_BASE_URL}/filter.php?a=${encodeURIComponent(area.strArea)}`));
      
      if (matchingAreas.length > 0) {
        const areaResponses = await Promise.allSettled(matchingAreas);
        
        areaResponses.forEach(response => {
          if (response.status === 'fulfilled' && response.value.data?.meals) {
            addMealsToResults(response.value.data.meals);
          }
        });
      }
    }

    // Final processing of results
    const processedResults = Array.from(searchResults.values())
      .map(meal => normalizeMealDBMeal(meal, query))
      .filter(recipe => recipe.relevanceScore > 0)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, to);

    console.log('Search complete:', {
      query,
      count: processedResults.length,
      matches: processedResults.map(r => r.label)
    });

    return processedResults;
  } catch (err) {
    console.warn('TheMealDB lookup failed:', {
      error: err.message || err,
      query,
      provider: 'themealdb'
    });

    // Log the specific error for debugging
    if (err.response) {
      console.warn('API Response Error:', {
        status: err.response.status,
        data: err.response.data
      });
    } else if (err.request) {
      console.warn('No API Response:', {
        request: err.request
      });
    }
  }

  // No results found from any provider
  return [];
};

export default fetchRecipes;

export const getActiveProvider = () => {
  if (EDAMAM_APP_ID && EDAMAM_APP_KEY) return 'edamam';
  if (SPOONACULAR_KEY) return 'spoonacular';
  return 'themealdb';
};
