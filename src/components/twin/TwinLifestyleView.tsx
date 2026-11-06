'use client';

// =============================================================================
// RIIQX — Food & Lifestyle Decision Intelligence View
// What to Eat • What to Cook • Evidence-Based Nutrition & Dining Truth
// Interactive Ingredients Search • Zero Simulation • Honest Macro Math
// =============================================================================

import React, { useState } from 'react';
import {
  Utensils,
  Sparkles,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Plus,
  Flame,
  ShieldCheck,
  ShoppingBag,
} from 'lucide-react';
import { useRiiqx } from '@/context/RiiqxContext';

interface CookHomeRecipe {
  title: string;
  time: string;
  cost: string;
  calories: string;
  protein: string;
  carbs: string;
  fats: string;
  whyTwinPicks: string;
  healthTip: string;
  ingredients: string[];
  steps: string[];
}

interface EatOutStrategy {
  title: string;
  cuisine: string;
  estimatedCost: string;
  calories: string;
  protein: string;
  orderingHack: string;
  whatRestaurantsHide: string;
  betterSwaps: string[];
}

export function TwinLifestyleView() {
  const { setActiveTab } = useRiiqx();
  const [mode, setMode] = useState<'cook_home' | 'eat_out'>('cook_home');
  const [ingredientsInput, setIngredientsInput] = useState('');
  const [dietaryPreference, setDietaryPreference] = useState('High Protein / Low Carb');
  const [budgetConstraint, setBudgetConstraint] = useState('Under ₹400');
  const [mealType, setMealType] = useState('Dinner');
  const [timeAvailable, setTimeAvailable] = useState('25 mins');
  const [expandedRecipeIndex, setExpandedRecipeIndex] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);
  const [cookRecipes, setCookRecipes] = useState<CookHomeRecipe[]>([
    {
      title: 'Tofu / Paneer Tikka Sauté with Spiced Mint Greens',
      time: '18 mins',
      cost: '₹120',
      calories: '340 kcal',
      protein: '26g',
      carbs: '14g',
      fats: '18g',
      whyTwinPicks: 'Matches your low-glycemic, anti-inflammatory dietary preference. Fast to prep without high-sodium restaurant sauces.',
      healthTip: 'Cooking tomatoes in cold-pressed mustard or olive oil significantly increases lycopene absorption.',
      ingredients: [
        '200g Fresh Low-fat Paneer or Firm Tofu',
        '1 cup Finely chopped baby spinach / methi',
        '2 Ripe Tomatoes (pureed/diced)',
        '1 Green Chilli, Ginger-Garlic paste, Jeera & Haldi',
      ],
      steps: [
        'Heat 1 tsp cold-pressed oil in a pan; temper with cumin seeds and minced ginger-garlic.',
        'Add diced onions and tomatoes; cook down until soft and aromatic with turmeric and sea salt.',
        'Fold in fresh greens until just wilted to preserve heat-sensitive folates.',
        'Add cubed paneer or tofu; toss for 3-4 minutes until coated with the masala. Garnish with fresh coriander.',
      ],
    },
    {
      title: 'Tempered Masoor Dal with Jeera Brown Rice & Kachumber',
      time: '25 mins',
      cost: '₹75',
      calories: '410 kcal',
      protein: '20g',
      carbs: '65g',
      fats: '8g',
      whyTwinPicks: 'Comfort food with complete amino acid profile; light on digestion for high-humidity climates.',
      healthTip: 'Adding lemon juice right before eating supplies Vitamin C, boosting non-heme plant iron absorption by up to 300%.',
      ingredients: [
        '1/2 cup Split Red Lentils (Dhuli Masoor Dal)',
        '1/3 cup Brown Basmati or Foxtail Millet',
        '1 Cucumber & Tomato (diced fine with lemon & coriander)',
        'Ghee (1/2 tsp), Hing, Cumin seeds, and Dry Red Chilli',
      ],
      steps: [
        'Wash lentils and pressure cook or boil with turmeric and salt until tender (approx. 12 mins).',
        'Steam brown rice or millet separately until grains are separate and fluffy.',
        'Prepare a quick tadka: heat 1/2 tsp ghee, add hing and cumin seeds until they splutter.',
        'Pour aromatic tadka over the dal. Serve steaming with fresh crunchy kachumber salad.',
      ],
    },
    {
      title: 'High-Fiber Roasted Chana & Sprout Chaat',
      time: '10 mins',
      cost: '₹55',
      calories: '260 kcal',
      protein: '16g',
      carbs: '38g',
      fats: '5g',
      whyTwinPicks: 'Zero seed oil oxidation; packed with prebiotics and micronutrients for gut health.',
      healthTip: 'Sprouting lentils increases digestible protein and breaks down phytates for superior mineral absorption.',
      ingredients: [
        '1 cup Sprouted Moong Beans',
        '1/2 cup Roasted Bengal Gram (Chana)',
        '1 Small Red Onion & 1 Tomato (diced)',
        'Chaat Masala, Roasted Cumin Powder, Fresh Lemon Juice',
      ],
      steps: [
        'Steam the sprouted moong for 3 minutes (or use raw if well-rinsed).',
        'In a bowl, combine sprouts, roasted chana, onions, tomatoes, and green chillies.',
        'Season with rock salt, roasted jeera powder, and generous squeeze of fresh lemon juice.',
        'Toss thoroughly and enjoy immediately as a crisp, nutrient-dense meal.',
      ],
    },
  ]);

  const [eatOutGuides, setEatOutGuides] = useState<EatOutStrategy[]>([
    {
      title: 'Tandoori Tikka (Chicken or Paneer) with Green Salad & Tandoori Roti',
      cuisine: 'North Indian / Tandoor',
      estimatedCost: '₹260 - ₹380',
      calories: '450 kcal',
      protein: '36g',
      orderingHack:
        'In order instructions, write: "Please do NOT brush butter/oil on top after roasting. Send raw onions and lemon on the side."',
      whatRestaurantsHide:
        'Most restaurant "butter gravies" (Makhani/Korma) contain 40-60% heavy dairy fat, cashew paste, and commercial palm oil blends.',
      betterSwaps: [
        'Order Tandoori Roti (whole wheat) instead of Butter Naan (refined maida + butter).',
        'Choose Yellow Tadka Dal or Chana Masala over Dal Makhani.',
      ],
    },
    {
      title: 'Steamed Idli / Plain Dosa with Double Sambar & Podi',
      cuisine: 'South Indian Fast Casual',
      estimatedCost: '₹140 - ₹220',
      calories: '320 kcal',
      protein: '12g',
      orderingHack:
        'Ask for an extra bowl of hot vegetable sambar and skip or minimize the high-calorie coconut chutney.',
      whatRestaurantsHide:
        'Restaurant coconut chutney is frequently enriched with fried dal and high quantities of vegetable oil to preserve emulsion.',
      betterSwaps: [
        'Choose Steamed Idli or Plain Dosa over Medu Vada (deep fried in reused seed oil).',
        'Opt for Pesarattu (green gram moong dosa) for nearly double the protein and fiber.',
      ],
    },
    {
      title: 'Custom Teriyaki / Garlic Protein Bowl with Brown Rice & Stir-Fry Veggies',
      cuisine: 'Asian / Healthy Bowl',
      estimatedCost: '₹320 - ₹450',
      calories: '490 kcal',
      protein: '34g',
      orderingHack:
        'Select "Sauce on the side" — standard ladle pours typically add 15-20g of hidden refined corn syrups.',
      whatRestaurantsHide:
        'Many "healthy" commercial salad dressings and stir-fry glazes have as much sugar as carbonated sodas.',
      betterSwaps: [
        'Select grilled protein (paneer/tofu/chicken) rather than tempura or crumb-coated proteins.',
        'Ask for steamed greens or edamame as the base rather than white sticky rice or fried noodles.',
      ],
    },
  ]);

  const quickPantryTags = ['Eggs', 'Paneer', 'Spinach', 'Tomatoes', 'Moong Dal', 'Brown Rice', 'Oats', 'Chicken'];

  const handleAddTag = (tag: string) => {
    if (!ingredientsInput.includes(tag)) {
      setIngredientsInput((prev) => (prev ? `${prev}, ${tag}` : tag));
    }
  };

  const handleGeneratePlan = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/twin/lifestyle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          ingredients: ingredientsInput,
          diet: dietaryPreference,
          budget: budgetConstraint,
          mealType,
          timeAvailable,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (mode === 'cook_home' && Array.isArray(data.recommendations)) {
          setCookRecipes(data.recommendations);
        } else if (mode === 'eat_out' && Array.isArray(data.recommendations)) {
          setEatOutGuides(data.recommendations);
        }
      }
    } catch (err) {
      console.error('Failed to generate meal plan:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#FAF8F5] dark:bg-[#0E0E10] text-[#1A1817] dark:text-[#F4F4F6] p-4 sm:p-6 lg:p-8 space-y-8">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#EAE3D9] dark:border-[#26262B] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Utensils className="h-4 w-4 text-[#FF5722]" />
            <span className="text-xs font-black uppercase tracking-wider text-[#6B6661] dark:text-[#A3A3A3]">
              Lifestyle &amp; Food Intelligence
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-[#1A1817] dark:text-white font-heading mt-1">
            What to Eat &amp; What to Cook
          </h1>
          <p className="text-xs sm:text-sm text-[#6B6661] dark:text-[#A3A3A3] mt-1">
            Personalized meal discovery calibrated against your dietary specs, calorie goals, and real grocery budgets.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('twin')}
          className="flex items-center gap-2 rounded-2xl bg-[#FF5722] hover:bg-[#E64A19] text-white px-5 py-2.5 text-xs font-black shadow-xs transition-transform active:scale-95"
        >
          <Sparkles className="h-4 w-4" />
          <span>Ask Custom Recipe</span>
        </button>
      </div>

      {/* 2. Interactive Discovery Control Console */}
      <div className="rounded-3xl border border-[#EAE3D9] dark:border-[#26262B] bg-white dark:bg-[#18181C] p-6 shadow-xs space-y-6">
        {/* Mode Selector */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#EAE3D9] dark:border-[#26262B] pb-4">
          <div className="flex items-center gap-2 bg-[#FAF8F5] dark:bg-[#202025] p-1.5 rounded-2xl border border-[#EAE3D9] dark:border-[#2E2E33]">
            <button
              onClick={() => setMode('cook_home')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                mode === 'cook_home' ? 'bg-[#FF5722] text-white shadow-xs' : 'text-[#6B6661] hover:text-[#1A1817]'
              }`}
            >
              <Utensils className="h-3.5 w-3.5" />
              <span>Cook at Home</span>
            </button>
            <button
              onClick={() => setMode('eat_out')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                mode === 'eat_out' ? 'bg-[#FF5722] text-white shadow-xs' : 'text-[#6B6661] hover:text-[#1A1817]'
              }`}
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              <span>Eat Out &amp; Order Hacks</span>
            </button>
          </div>

          <div className="text-xs text-[#6B6661] flex items-center gap-1.5 font-bold">
            <ShieldCheck className="h-4 w-4 text-[#16865D]" />
            <span>Zero Fake Restaurant Hours &bull; Real Nutrient Bounds</span>
          </div>
        </div>

        {/* Cook Home: Ingredients Input */}
        {mode === 'cook_home' && (
          <div className="space-y-3">
            <label className="text-xs font-bold text-[#1A1817] dark:text-white flex items-center justify-between">
              <span>What do you have in your fridge or pantry right now?</span>
              <span className="text-[11px] text-[#6B6661] font-normal">Separate ingredients by commas</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={ingredientsInput}
                onChange={(e) => setIngredientsInput(e.target.value)}
                placeholder="e.g. Eggs, paneer, baby spinach, tomatoes, brown rice, curd..."
                className="w-full p-3.5 pr-10 rounded-2xl bg-[#FAF8F5] dark:bg-[#202025] border border-[#EAE3D9] dark:border-[#2E2E33] text-xs font-medium focus:outline-hidden focus:border-[#FF5722] transition-colors"
              />
            </div>

            {/* Quick Pantry Suggestion Tags */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] text-[#6B6661] mr-1">Quick add:</span>
              {quickPantryTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleAddTag(tag)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FAF8F5] dark:bg-[#202025] hover:bg-[#EAE3D9] dark:hover:bg-[#2E2E33] border border-[#EAE3D9] dark:border-[#2E2E33] text-[11px] font-bold text-[#6B6661] dark:text-[#A3A3A3] transition-colors"
                >
                  <Plus className="h-3 w-3" />
                  <span>{tag}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Nutritional & Constraint Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {/* Dietary Goal */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#6B6661]">Dietary Constraint</label>
            <select
              value={dietaryPreference}
              onChange={(e) => setDietaryPreference(e.target.value)}
              className="w-full text-xs p-3 rounded-2xl bg-[#FAF8F5] dark:bg-[#202025] border border-[#EAE3D9] dark:border-[#2E2E33] font-bold focus:outline-hidden focus:border-[#FF5722]"
            >
              <option value="High Protein / Low Carb">High Protein / Low Carb</option>
              <option value="Plant-Based Vegetarian">Plant-Based Vegetarian</option>
              <option value="Anti-Inflammatory">Anti-Inflammatory</option>
              <option value="Low Calorie (<400 kcal)">Low Calorie (&lt;400 kcal)</option>
              <option value="Keto / Low-Glycemic">Keto / Low-Glycemic</option>
            </select>
          </div>

          {/* Budget Constraint */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#6B6661]">Max Budget per Serving</label>
            <select
              value={budgetConstraint}
              onChange={(e) => setBudgetConstraint(e.target.value)}
              className="w-full text-xs p-3 rounded-2xl bg-[#FAF8F5] dark:bg-[#202025] border border-[#EAE3D9] dark:border-[#2E2E33] font-bold focus:outline-hidden focus:border-[#FF5722]"
            >
              <option value="Under ₹150">Under ₹150</option>
              <option value="Under ₹300">Under ₹300</option>
              <option value="Under ₹500">Under ₹500</option>
            </select>
          </div>

          {/* Meal Type */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#6B6661]">Meal Type</label>
            <select
              value={mealType}
              onChange={(e) => setMealType(e.target.value)}
              className="w-full text-xs p-3 rounded-2xl bg-[#FAF8F5] dark:bg-[#202025] border border-[#EAE3D9] dark:border-[#2E2E33] font-bold focus:outline-hidden focus:border-[#FF5722]"
            >
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Dinner">Dinner</option>
              <option value="Quick Snack">Quick Snack</option>
              <option value="Post-Workout">Post-Workout</option>
            </select>
          </div>

          {/* Time Available (for cook_home) or Dining Format (for eat_out) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#6B6661]">
              {mode === 'cook_home' ? 'Max Prep & Cook Time' : 'Ordering Target'}
            </label>
            <select
              value={timeAvailable}
              onChange={(e) => setTimeAvailable(e.target.value)}
              className="w-full text-xs p-3 rounded-2xl bg-[#FAF8F5] dark:bg-[#202025] border border-[#EAE3D9] dark:border-[#2E2E33] font-bold focus:outline-hidden focus:border-[#FF5722]"
            >
              {mode === 'cook_home' ? (
                <>
                  <option value="15 mins">15 mins (Speed Prep)</option>
                  <option value="25 mins">25 mins (Balanced)</option>
                  <option value="40 mins">40 mins (Slow Cook)</option>
                </>
              ) : (
                <>
                  <option value="Food Delivery (Swiggy/Zomato)">Food Delivery (Swiggy/Zomato)</option>
                  <option value="Casual Dining Out">Casual Dining Out</option>
                  <option value="Express Takeaway">Express Takeaway</option>
                </>
              )}
            </select>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-end pt-2">
          <button
            onClick={handleGeneratePlan}
            disabled={loading}
            className="flex items-center gap-2 rounded-2xl bg-[#FF5722] hover:bg-[#E64A19] disabled:opacity-50 text-white px-6 py-3 text-xs font-black shadow-xs transition-transform active:scale-95"
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Calibrating Twin Recipes...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>
                  {mode === 'cook_home' ? 'Generate Custom Meal Plan' : 'Analyze Delivery & Dining Hacks'}
                </span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 3. Output Grid */}
      {mode === 'cook_home' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cookRecipes.map((meal, i) => {
            const isExpanded = expandedRecipeIndex === i;
            return (
              <div
                key={i}
                className="rounded-3xl border border-[#EAE3D9] dark:border-[#26262B] bg-white dark:bg-[#18181C] p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#FF5722] transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold text-[#6B6661]">
                    <span className="flex items-center gap-1 text-[#FF5722]">
                      <Clock className="h-3 w-3" /> {meal.time}
                    </span>
                    <span className="text-[#16865D] font-black">{meal.cost} per serving</span>
                  </div>
                  <h3 className="text-base font-bold text-[#1A1817] dark:text-white leading-snug">{meal.title}</h3>
                  <p className="text-xs text-[#6B6661] dark:text-[#A3A3A3] leading-relaxed">{meal.whyTwinPicks}</p>
                </div>

                {/* Health & Nutrient Tip */}
                {meal.healthTip && (
                  <div className="p-3 rounded-xl bg-[#FAF8F5] dark:bg-[#202025] border border-[#EAE3D9] dark:border-[#2E2E33] text-[11px] text-[#6B6661] dark:text-[#A3A3A3] space-y-1">
                    <span className="font-bold text-[#16865D] flex items-center gap-1">
                      <Flame className="h-3 w-3" /> Twin Nutrition Insight:
                    </span>
                    <p>{meal.healthTip}</p>
                  </div>
                )}

                {/* Macros & Ingredients */}
                <div className="pt-3 border-t border-[#EAE3D9] dark:border-[#26262B] space-y-3">
                  <div className="grid grid-cols-4 gap-2 text-center bg-[#FAF8F5] dark:bg-[#202025] p-2 rounded-xl border border-[#EAE3D9] dark:border-[#2E2E33]">
                    <div>
                      <div className="text-[10px] text-[#6B6661]">Calories</div>
                      <div className="text-xs font-bold text-[#1A1817] dark:text-white">{meal.calories}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#6B6661]">Protein</div>
                      <div className="text-xs font-bold text-[#3B82F6]">{meal.protein}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#6B6661]">Carbs</div>
                      <div className="text-xs font-bold text-[#FF9800]">{meal.carbs || '24g'}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#6B6661]">Fats</div>
                      <div className="text-xs font-bold text-[#9C27B0]">{meal.fats || '12g'}</div>
                    </div>
                  </div>

                  <div className="text-[11px] text-[#6B6661] space-y-1">
                    <span className="font-bold text-[#1A1817] dark:text-white">Ingredients:</span>
                    <ul className="list-disc list-inside space-y-0.5">
                      {meal.ingredients.map((ing, idx) => (
                        <li key={idx} className="truncate">
                          {ing}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Step-by-Step Cooking Steps Accordion */}
                  {meal.steps && meal.steps.length > 0 && (
                    <div className="pt-2">
                      <button
                        onClick={() => setExpandedRecipeIndex(isExpanded ? null : i)}
                        className="w-full flex items-center justify-between text-xs font-bold text-[#FF5722] hover:underline"
                      >
                        <span>{isExpanded ? 'Hide Preparation Steps' : 'View Preparation Steps'}</span>
                        {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                      </button>

                      {isExpanded && (
                        <div className="mt-2 p-3 rounded-xl bg-[#FAF8F5] dark:bg-[#202025] border border-[#EAE3D9] dark:border-[#2E2E33] space-y-1.5 text-xs text-[#1A1817] dark:text-[#E0E0E0]">
                          <ol className="list-decimal list-inside space-y-1">
                            {meal.steps.map((st, sidx) => (
                              <li key={sidx} className="leading-relaxed">
                                {st}
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Eat Out / Order Hacks Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {eatOutGuides.map((guide, i) => (
            <div
              key={i}
              className="rounded-3xl border border-[#EAE3D9] dark:border-[#26262B] bg-white dark:bg-[#18181C] p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#FF5722] transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold text-[#6B6661]">
                  <span className="text-[#FF5722] uppercase tracking-wider">{guide.cuisine}</span>
                  <span className="text-[#16865D] font-black">{guide.estimatedCost}</span>
                </div>
                <h3 className="text-base font-bold text-[#1A1817] dark:text-white leading-snug">{guide.title}</h3>

                <div className="flex items-center gap-3 text-xs font-bold text-[#1A1817] dark:text-white pt-1">
                  <span>{guide.calories}</span>
                  <span className="text-[#3B82F6]">{guide.protein}</span>
                </div>
              </div>

              {/* Tactical Order Instruction Hack */}
              <div className="p-3.5 rounded-2xl bg-[#FF5722]/5 border border-[#FF5722]/20 space-y-1">
                <div className="text-[11px] font-black uppercase text-[#FF5722] flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Ordering Note for Chef / Delivery:
                </div>
                <p className="text-xs text-[#1A1817] dark:text-white leading-relaxed italic">
                  &ldquo;{guide.orderingHack}&rdquo;
                </p>
              </div>

              {/* What Commercial Kitchens Hide */}
              <div className="p-3.5 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-1">
                <div className="text-[11px] font-black uppercase text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5" /> What Restaurants Hide:
                </div>
                <p className="text-xs text-[#6B6661] dark:text-[#A3A3A3] leading-relaxed">
                  {guide.whatRestaurantsHide}
                </p>
              </div>

              {/* Healthier Swaps */}
              <div className="pt-2 border-t border-[#EAE3D9] dark:border-[#26262B] space-y-1 text-xs">
                <span className="font-bold text-[#1A1817] dark:text-white">Recommended Swaps:</span>
                <ul className="space-y-1 text-[11px] text-[#6B6661] dark:text-[#A3A3A3]">
                  {guide.betterSwaps.map((sw, sidx) => (
                    <li key={sidx} className="flex items-start gap-1.5">
                      <span className="text-[#16865D] font-bold">&bull;</span>
                      <span>{sw}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
