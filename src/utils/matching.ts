import { Recipe, MatchResult, FilterState } from '../types';

// Common stop words and culinary adjectives to strip out when matching
const DESCRIPTORS = new Set([
  'fresh',
  'dried',
  'dry',
  'raw',
  'cooked',
  'boiled',
  'baked',
  'steamed',
  'fried',
  'roasted',
  'minced',
  'diced',
  'chopped',
  'sliced',
  'grated',
  'crushed',
  'peeled',
  'pitted',
  'boneless',
  'skinless',
  'ground',
  'whole',
  'warm',
  'hot',
  'cold',
  'large',
  'medium',
  'small',
  'ripe',
  'unripe',
  'sweet',
  'salted',
  'unsalted',
  'extra',
  'virgin',
  'cloves',
  'clove',
  'stalks',
  'stalk',
  'pinch',
  'spoon',
  'tablespoon',
  'teaspoon',
  'cup',
  'cups',
  'grams',
  'gram',
  'gm',
  'g',
  'kg',
  'ml',
  'tbsp',
  'tsp',
  'oz',
  'pound',
  'lbs',
  'handful',
  'finely',
  'coarsely',
  'roughly',
  'thinly',
  'thickly',
  'leaves',
  'leaf',
  'paste',
  'powder',
  'seeds',
  'seed',
  'pieces',
  'piece',
  'puree',
  'cubes',
  'cube',
  'florets',
  'to',
  'taste',
  'for',
  'garnish',
  'as',
  'needed',
  'optional',
]);

// Aliases and regional names map to standard base terms
const ALIAS_MAP: Record<string, string> = {
  // Vegetables / Staples
  alu: 'potato',
  aloo: 'potato',
  potatoes: 'potato',
  spud: 'potato',
  pyaz: 'onion',
  pyaaz: 'onion',
  kanda: 'onion',
  onions: 'onion',
  shallot: 'onion',
  shallots: 'onion',
  tamatar: 'tomato',
  tomatoes: 'tomato',
  anda: 'egg',
  ande: 'egg',
  eggs: 'egg',
  egg: 'egg',
  dahi: 'yogurt',
  curd: 'yogurt',
  yoghurt: 'yogurt',
  cilantro: 'coriander',
  dhania: 'coriander',
  coriander: 'coriander',
  jeera: 'cumin',
  cumin: 'cumin',
  haldi: 'turmeric',
  turmeric: 'turmeric',
  mirch: 'chilli',
  mirchi: 'chilli',
  chilli: 'chilli',
  chili: 'chilli',
  chillies: 'chilli',
  chilies: 'chilli',
  chiles: 'chilli',
  paneer: 'paneer',
  cottagecheese: 'paneer',
  atta: 'wheat flour',
  gehun: 'wheat flour',
  wheatflour: 'wheat flour',
  maida: 'flour',
  allpurposeflour: 'flour',
  flour: 'flour',
  chawal: 'rice',
  rice: 'rice',
  palak: 'spinach',
  spinach: 'spinach',
  gobi: 'cauliflower',
  gobhi: 'cauliflower',
  phoolgobi: 'cauliflower',
  cauliflower: 'cauliflower',
  matar: 'peas',
  muttar: 'peas',
  peas: 'peas',
  greenpeas: 'peas',
  bhindi: 'okra',
  okra: 'okra',
  ladyfinger: 'okra',
  ladyfingers: 'okra',
  shimlamirch: 'capsicum',
  capsicum: 'capsicum',
  bellpepper: 'capsicum',
  peppers: 'capsicum',
  adrak: 'ginger',
  ginger: 'ginger',
  lehsun: 'garlic',
  lahsun: 'garlic',
  garlic: 'garlic',
  methi: 'fenugreek',
  fenugreek: 'fenugreek',
  sarson: 'mustard',
  mustard: 'mustard',
  rai: 'mustard',
  hing: 'asafoetida',
  asafoetida: 'asafoetida',
  garammasala: 'garam masala',
  besan: 'gram flour',
  gramflour: 'gram flour',
  chickpeaflour: 'gram flour',
  suji: 'semolina',
  sooji: 'semolina',
  rava: 'semolina',
  semolina: 'semolina',
  poha: 'poha',
  flattenedrice: 'poha',
  sabudana: 'sabudana',
  tapioca: 'sabudana',
  dal: 'lentils',
  daal: 'lentils',
  lentil: 'lentils',
  lentils: 'lentils',
  moongdal: 'moong dal',
  toordal: 'toor dal',
  arhardal: 'toor dal',
  uraddal: 'urad dal',
  chanadal: 'chana dal',
  chana: 'chickpeas',
  chole: 'chickpeas',
  chickpea: 'chickpeas',
  chickpeas: 'chickpeas',
  rajma: 'kidney beans',
  kidneybean: 'kidney beans',
  kidneybeans: 'kidney beans',
  mutton: 'mutton',
  lamb: 'mutton',
  gosht: 'mutton',
  chicken: 'chicken',
  murgh: 'chicken',
  fish: 'fish',
  machhli: 'fish',
  prawn: 'shrimp',
  prawns: 'shrimp',
  shrimp: 'shrimp',
  milk: 'milk',
  doodh: 'milk',
  cream: 'cream',
  malai: 'cream',
  ghee: 'ghee',
  clarifiedbutter: 'ghee',
  butter: 'butter',
  makhan: 'butter',
  makhana: 'fox nuts',
  bread: 'bread',
  pav: 'bread',
  bun: 'bread',
  cheese: 'cheese',
  mozzarella: 'cheese',
  cheddar: 'cheese',
  parmesan: 'cheese',
  pasta: 'pasta',
  spaghetti: 'pasta',
  macaroni: 'pasta',
  penne: 'pasta',
  fettuccine: 'pasta',
  noodles: 'noodles',
  maggi: 'noodles',
  soysauce: 'soy sauce',
  vinegar: 'vinegar',
  sirka: 'vinegar',
  lemon: 'lemon',
  lime: 'lime',
  nimbu: 'lemon',
  sugar: 'sugar',
  chini: 'sugar',
  jaggery: 'jaggery',
  gur: 'jaggery',
  honey: 'honey',
  coconut: 'coconut',
  nariyal: 'coconut',
  cashew: 'cashew',
  cashews: 'cashew',
  kaju: 'cashew',
  almond: 'almond',
  almonds: 'almond',
  badam: 'almond',
  raisins: 'raisins',
  kishmish: 'raisins',
  cardamom: 'cardamom',
  elaichi: 'cardamom',
  cinnamon: 'cinnamon',
  dalchini: 'cinnamon',
  clovespice: 'clove',
  laung: 'clove',
  clove: 'clove',
  blackpepper: 'black pepper',
  kaliMirch: 'black pepper',
  sesame: 'sesame',
  til: 'sesame',
  mushroom: 'mushroom',
  mushrooms: 'mushroom',
  tofu: 'tofu',
  avocado: 'avocado',
  guacamole: 'avocado',
  corn: 'corn',
  sweetcorn: 'corn',
  makai: 'corn',
  cucumber: 'cucumber',
  kheera: 'cucumber',
  carrot: 'carrot',
  carrots: 'carrot',
  gajar: 'carrot',
  cabbage: 'cabbage',
  pattaGobi: 'cabbage',
  eggplant: 'eggplant',
  baingan: 'eggplant',
  aubergine: 'eggplant',
  brinjal: 'eggplant',
};

/**
 * Clean & normalize an ingredient string
 */
export function normalizeIngredient(input: string): string {
  if (!input) return '';

  // Lowercase & remove extra punctuation
  let cleaned = input
    .toLowerCase()
    .replace(/[0-9/.,\-()&!*]/g, ' ')
    .trim();

  // Split words
  const words = cleaned.split(/\s+/).filter(Boolean);

  // Filter out descriptor/unit words
  const meaningfulWords = words.filter((w) => !DESCRIPTORS.has(w));

  const joined = (meaningfulWords.length > 0 ? meaningfulWords : words).join(' ');
  const squished = joined.replace(/\s+/g, '');

  // Check alias map
  if (ALIAS_MAP[squished]) {
    return ALIAS_MAP[squished];
  }
  if (ALIAS_MAP[joined]) {
    return ALIAS_MAP[joined];
  }

  // Handle plural 's' or 'es'
  let single = joined;
  if (single.endsWith('ies')) {
    single = single.slice(0, -3) + 'y';
  } else if (single.endsWith('es') && single.length > 4) {
    single = single.slice(0, -2);
  } else if (single.endsWith('s') && !single.endsWith('ss') && single.length > 3) {
    single = single.slice(0, -1);
  }

  if (ALIAS_MAP[single]) {
    return ALIAS_MAP[single];
  }

  return single.trim();
}

/**
 * Check if a recipe ingredient matches any user available ingredients
 */
export function doesIngredientMatch(
  recipeIng: string,
  userIngredients: string[]
): boolean {
  if (!recipeIng || !Array.isArray(userIngredients) || userIngredients.length === 0) return false;

  const normalizedRecipe = normalizeIngredient(recipeIng);
  const rawRecipe = recipeIng.toLowerCase();

  for (const userItem of userIngredients) {
    if (!userItem) continue;
    const normalizedUser = normalizeIngredient(userItem);
    const rawUser = userItem.toLowerCase().trim();

    if (!normalizedUser && !rawUser) continue;

    // Exact normalized match
    if (normalizedRecipe === normalizedUser) return true;

    // Substring contains in normalized forms
    if (
      normalizedRecipe.length >= 3 &&
      normalizedUser.length >= 3 &&
      (normalizedRecipe.includes(normalizedUser) || normalizedUser.includes(normalizedRecipe))
    ) {
      return true;
    }

    // Direct token intersection
    const recipeTokens = normalizedRecipe.split(' ');
    const userTokens = normalizedUser.split(' ');
    const hasIntersection = recipeTokens.some(
      (rt) => rt.length >= 3 && userTokens.includes(rt)
    );
    if (hasIntersection) return true;

    // Direct raw substring match
    if (rawRecipe.includes(rawUser) || rawUser.includes(rawRecipe)) {
      return true;
    }
  }

  return false;
}

/**
 * Calculate match metrics for a single recipe against user ingredients
 */
export function calculateRecipeMatch(
  recipe: Recipe,
  userIngredients: string[]
): MatchResult {
  const safeUserIngredients = Array.isArray(userIngredients) ? userIngredients : [];
  const safeRecipeIngredients = Array.isArray(recipe.ingredients) ? recipe.ingredients : [];
  const matchedIngredients: string[] = [];
  const missingIngredients: string[] = [];
  const haveIngredients: string[] = [];

  // If user has no ingredients entered, treat as 0% match with all missing
  if (safeUserIngredients.length === 0) {
    safeRecipeIngredients.forEach((ing) => {
      missingIngredients.push(ing.item || ing.original);
    });
    return {
      recipe,
      matchedIngredients: [],
      missingIngredients,
      haveIngredients: [],
      matchPercentage: 0,
      missingCount: safeRecipeIngredients.length,
      matchedCount: 0,
      totalRequired: safeRecipeIngredients.length,
    };
  }

  for (const ing of safeRecipeIngredients) {
    const ingName = ing.item || ing.original;
    if (doesIngredientMatch(ingName, safeUserIngredients)) {
      matchedIngredients.push(ingName);
      haveIngredients.push(ingName);
    } else {
      missingIngredients.push(ingName);
    }
  }

  const totalRequired = safeRecipeIngredients.length || 1;
  const matchedCount = matchedIngredients.length;
  const missingCount = missingIngredients.length;
  const matchPercentage = Math.round((matchedCount / totalRequired) * 100);

  return {
    recipe,
    matchedIngredients,
    missingIngredients,
    haveIngredients,
    matchPercentage,
    missingCount,
    matchedCount,
    totalRequired,
  };
}

/**
 * Natural language intent parser for search queries like:
 * - "I have potatoes and eggs"
 * - "chicken dinner"
 * - "vegetarian Indian food"
 * - "something under 30 minutes"
 * - "something sweet"
 * - "something spicy"
 */
export function parseNaturalLanguageQuery(query: string): {
  extractedIngredients: string[];
  inferredCuisine: string | null;
  inferredMealType: string | null;
  inferredDietary: string[];
  inferredMaxTime: number | null;
  isSpicyPreference: boolean;
  isSweetPreference: boolean;
  cleanedKeyword: string;
} {
  const text = query.toLowerCase().trim();
  const extractedIngredients: string[] = [];
  let inferredCuisine: string | null = null;
  let inferredMealType: string | null = null;
  const inferredDietary: string[] = [];
  let inferredMaxTime: number | null = null;
  let isSpicyPreference = false;
  let isSweetPreference = false;

  // 1. Check for "I have X, Y and Z" or "with X and Y"
  const iHaveMatch = text.match(/(?:i have|with|using|got|pantry has)\s+(.+)/i);
  if (iHaveMatch) {
    const ingText = iHaveMatch[1]
      .replace(/\band\b/g, ',')
      .replace(/\bplus\b/g, ',')
      .replace(/\&/g, ',');
    const splitIngs = ingText.split(',').map((s) => s.trim()).filter(Boolean);
    for (const item of splitIngs) {
      const norm = normalizeIngredient(item);
      if (norm && norm.length > 1) {
        extractedIngredients.push(norm);
      }
    }
  }

  // 2. Cuisine detection
  const cuisines = [
    'Indian',
    'Italian',
    'Mexican',
    'Chinese',
    'Japanese',
    'Korean',
    'Thai',
    'Mediterranean',
    'Middle Eastern',
    'American',
    'French',
    'Greek',
    'Turkish',
    'Vietnamese',
  ];
  for (const c of cuisines) {
    if (text.includes(c.toLowerCase())) {
      inferredCuisine = c;
      break;
    }
  }

  // 3. Meal type detection
  if (text.includes('breakfast') || text.includes('brunch') || text.includes('morning')) {
    inferredMealType = 'Breakfast';
  } else if (text.includes('lunch')) {
    inferredMealType = 'Lunch';
  } else if (text.includes('dinner') || text.includes('supper')) {
    inferredMealType = 'Dinner';
  } else if (text.includes('snack') || text.includes('bites')) {
    inferredMealType = 'Snack';
  } else if (text.includes('dessert') || text.includes('sweet') || text.includes('meetha')) {
    inferredMealType = 'Dessert';
    isSweetPreference = true;
  } else if (text.includes('drink') || text.includes('beverage')) {
    inferredMealType = 'Drink';
  }

  // 4. Dietary tags
  if (text.includes('vegetarian') || text.includes('veg') && !text.includes('non-veg')) {
    inferredDietary.push('Vegetarian');
  }
  if (text.includes('vegan')) {
    inferredDietary.push('Vegan');
  }
  if (text.includes('high protein') || text.includes('protein rich') || text.includes('protein')) {
    inferredDietary.push('High Protein');
  }
  if (text.includes('gluten free') || text.includes('gluten-free')) {
    inferredDietary.push('Gluten Free');
  }

  // 5. Time constraints
  if (text.includes('15 min') || text.includes('15 minutes')) {
    inferredMaxTime = 15;
  } else if (
    text.includes('quick') ||
    text.includes('fast') ||
    text.includes('30 min') ||
    text.includes('30 minutes') ||
    text.includes('under 30')
  ) {
    inferredMaxTime = 30;
  } else if (text.includes('45 min') || text.includes('under 45')) {
    inferredMaxTime = 45;
  }

  // 6. Flavors
  if (text.includes('spicy') || text.includes('hot') || text.includes('tikha') || text.includes('teekha')) {
    isSpicyPreference = true;
  }
  if (text.includes('sweet') || text.includes('meetha')) {
    isSweetPreference = true;
  }

  // Clean remaining keyword for general search
  let cleaned = text
    .replace(/(?:i have|with|using|got|pantry has|want|make|cook|food|recipe|recipes|something|quick|fast|under \d+ minutes?)/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return {
    extractedIngredients,
    inferredCuisine,
    inferredMealType,
    inferredDietary,
    inferredMaxTime,
    isSpicyPreference,
    isSweetPreference,
    cleanedKeyword: cleaned,
  };
}

/**
 * Filter, match, and sort the recipe database
 */
export function filterAndRankRecipes(
  recipes: Recipe[],
  userIngredients: string[],
  filters: FilterState
): MatchResult[] {
  if (!Array.isArray(recipes)) return [];

  // Parse natural language if search query exists
  const parsedNL = filters.searchQuery
    ? parseNaturalLanguageQuery(filters.searchQuery)
    : null;

  // Combine user ingredients with any NL-extracted ingredients
  const combinedUserIngredients = [
    ...userIngredients,
    ...(parsedNL?.extractedIngredients || []),
  ];

  // 1. Calculate matches for all recipes
  const results: MatchResult[] = recipes.map((r) =>
    calculateRecipeMatch(r, combinedUserIngredients)
  );

  // 2. Filter step
  const filtered = results.filter((res) => {
    const { recipe } = res;

    // Search query matching
    if (filters.searchQuery && filters.searchQuery.trim() !== '') {
      const q = filters.searchQuery.toLowerCase().trim();
      const kw = parsedNL?.cleanedKeyword?.toLowerCase() || '';

      const matchesName = recipe.name.toLowerCase().includes(q) || (kw && recipe.name.toLowerCase().includes(kw));
      const matchesCuisine = recipe.cuisine.toLowerCase().includes(q) || (parsedNL?.inferredCuisine && recipe.cuisine.toLowerCase() === parsedNL.inferredCuisine.toLowerCase());
      const matchesRegion = recipe.region ? recipe.region.toLowerCase().includes(q) : false;
      const matchesMealType = recipe.mealType.toLowerCase().includes(q) || (parsedNL?.inferredMealType && recipe.mealType.toLowerCase() === parsedNL.inferredMealType.toLowerCase());
      const matchesTags = recipe.tags.some((t) => t.toLowerCase().includes(q) || (kw && t.toLowerCase().includes(kw)));
      const matchesIngredientNames = recipe.ingredients.some((i) =>
        (i.item || i.original).toLowerCase().includes(q) || (kw && (i.item || i.original).toLowerCase().includes(kw))
      );
      const matchesSpicy = parsedNL?.isSpicyPreference ? !!recipe.isSpicy : false;
      const matchesSweet = parsedNL?.isSweetPreference ? !!recipe.isSweet : false;
      const matchesDietaryNL = parsedNL?.inferredDietary?.length
        ? parsedNL.inferredDietary.some((d) => recipe.dietaryTags?.includes(d))
        : false;

      // If user had "I have potatoes and eggs", they matched via combinedUserIngredients, so that's satisfied
      const hasExtractedIngs = !!(parsedNL && parsedNL.extractedIngredients && parsedNL.extractedIngredients.length > 0);

      if (
        !matchesName &&
        !matchesCuisine &&
        !matchesRegion &&
        !matchesMealType &&
        !matchesTags &&
        !matchesIngredientNames &&
        !matchesSpicy &&
        !matchesSweet &&
        !matchesDietaryNL &&
        !hasExtractedIngs
      ) {
        return false;
      }
    }

    // Cuisine filter
    if (filters.cuisine && filters.cuisine !== 'All' && recipe.cuisine !== filters.cuisine) {
      return false;
    }

    // Region filter
    if (filters.region && filters.region !== 'All' && recipe.region !== filters.region) {
      return false;
    }

    // Meal type filter
    if (filters.mealType && filters.mealType !== 'All' && recipe.mealType !== filters.mealType) {
      return false;
    }

    // Dietary filters (must match all selected)
    if (filters.dietary && filters.dietary.length > 0) {
      const matchesAll = filters.dietary.every((tag) =>
        recipe.dietaryTags?.includes(tag)
      );
      if (!matchesAll) return false;
    }

    // Max cooking time filter
    const effectiveMaxTime = filters.maxCookTime ?? filters.maxTime;
    if (effectiveMaxTime !== null && effectiveMaxTime !== undefined && recipe.totalTime > effectiveMaxTime) {
      return false;
    }

    // Missing ingredients threshold limit
    if (filters.missingLimit !== null && filters.missingLimit !== undefined && res.missingCount > filters.missingLimit) {
      return false;
    }

    // Difficulty filter
    if (filters.difficulty && recipe.difficulty !== filters.difficulty) {
      return false;
    }

    // Only recipes user can make right now (0 missing)
    if (filters.onlyCanMake && res.missingCount > 0) {
      return false;
    }

    return true;
  });

  // 3. Sorting step
  filtered.sort((a, b) => {
    // If user provided ingredients, prioritize by match criteria unless explicit sort is selected
    if (filters.sortBy === 'best-match') {
      const hasUserIngs = Array.isArray(userIngredients) && userIngredients.length > 0;
      const hasParsedIngs = !!(parsedNL && parsedNL.extractedIngredients && parsedNL.extractedIngredients.length > 0);
      if (hasUserIngs || hasParsedIngs) {
        // 1st: fewest missing ingredients
        if (a.missingCount !== b.missingCount) {
          return a.missingCount - b.missingCount;
        }
        // 2nd: highest match percentage
        if (b.matchPercentage !== a.matchPercentage) {
          return b.matchPercentage - a.matchPercentage;
        }
      }
      // Fallback to popularity
      return b.recipe.popularity - a.recipe.popularity;
    }

    if (filters.sortBy === 'fewest-missing') {
      if (a.missingCount !== b.missingCount) {
        return a.missingCount - b.missingCount;
      }
      return b.matchPercentage - a.matchPercentage;
    }

    if (filters.sortBy === 'match-percentage') {
      if (b.matchPercentage !== a.matchPercentage) {
        return b.matchPercentage - a.matchPercentage;
      }
      return a.missingCount - b.missingCount;
    }

    if (filters.sortBy === 'quickest' || filters.sortBy === 'fastest') {
      return a.recipe.totalTime - b.recipe.totalTime;
    }

    if (filters.sortBy === 'lowest-cost') {
      return a.recipe.estimatedCost - b.recipe.estimatedCost;
    }

    if (filters.sortBy === 'highest-protein') {
      return b.recipe.protein - a.recipe.protein;
    }

    if (filters.sortBy === 'lowest-calories' || filters.sortBy === 'calories-low') {
      return a.recipe.calories - b.recipe.calories;
    }

    if (filters.sortBy === 'most-popular' || filters.sortBy === 'popularity') {
      return b.recipe.popularity - a.recipe.popularity;
    }

    return 0;
  });

  return filtered;
}
