'use client';

// =============================================================================
// RIIQX — Food & Lifestyle Decision Assistant View
// What to Eat • What to Cook • Honest Dietary Intelligence
// =============================================================================

import React, { useState } from 'react';
import { Utensils, Coffee, Compass, Sparkles, Clock, CheckCircle2, ChevronRight, Search } from 'lucide-react';
import { useRiiqx } from '@/context/RiiqxContext';

export function TwinLifestyleView() {
  const { setActiveTab } = useRiiqx();
  const [dietaryPreference, setDietaryPreference] = useState('High Protein / Low Carb');
  const [budgetConstraint, setBudgetConstraint] = useState('Under ₹400');
  const [mode, setMode] = useState<'eat_out' | 'cook_home'>('cook_home');

  const foodRecommendations = [
    {
      title: 'Tofu / Paneer Tikka Salad with Spiced Mint Dressing',
      time: '15 mins',
      cost: '₹140',
      calories: '320 kcal',
      protein: '24g',
      whyTwinPicks: 'Matches your low-glycemic, anti-inflammatory dietary preference. Fast to prep without high-sodium restaurant sauces.',
      ingredients: ['Firm Tofu / Low-fat Paneer (200g)', 'Cucumber & Cherry Tomatoes', 'Greek Yogurt & Fresh Mint'],
    },
    {
      title: 'Masoor Dal Khichdi with Steamed Broccoli',
      time: '25 mins',
      cost: '₹85',
      calories: '390 kcal',
      protein: '18g',
      whyTwinPicks: 'Comfort food with complete amino acid profile; light on digestion for high-humidity climates.',
      ingredients: ['Red Lentils (Masoor)', 'Brown Basmati Rice', 'Broccoli Florets', 'Jeera & Turmeric'],
    },
    {
      title: 'Stir-Fried Veggies with Sesame-Garlic Tamari',
      time: '12 mins',
      cost: '₹110',
      calories: '210 kcal',
      protein: '9g',
      whyTwinPicks: 'Zero seed oil oxidation; packed with micronutrients for skin hydration.',
      ingredients: ['Bell Peppers', 'French Beans', 'Toasted Sesame', 'Tamari Soy'],
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#FAF8F5] dark:bg-[#0E0E10] text-[#1A1817] dark:text-[#F4F4F6] p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
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
            Personalized meal discovery calibrated against your dietary specs, calorie goals, and budget.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('twin')}
          className="flex items-center gap-2 rounded-2xl bg-[#FF5722] hover:bg-[#E64A19] text-white px-5 py-2.5 text-xs font-black shadow-xs"
        >
          <Sparkles className="h-4 w-4" />
          <span>Ask Custom Recipe</span>
        </button>
      </div>

      {/* Filter Controls */}
      <div className="rounded-3xl border border-[#EAE3D9] dark:border-[#26262B] bg-white dark:bg-[#18181C] p-6 shadow-xs flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMode('cook_home')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              mode === 'cook_home' ? 'bg-[#FF5722] text-white' : 'bg-[#FAF8F5] dark:bg-[#202025] text-[#6B6661]'
            }`}
          >
            Cook at Home
          </button>
          <button
            onClick={() => setMode('eat_out')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              mode === 'eat_out' ? 'bg-[#FF5722] text-white' : 'bg-[#FAF8F5] dark:bg-[#202025] text-[#6B6661]'
            }`}
          >
            Eat Out / Order
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#6B6661]">Diet:</span>
          <select
            value={dietaryPreference}
            onChange={(e) => setDietaryPreference(e.target.value)}
            className="text-xs p-2 rounded-xl bg-[#FAF8F5] dark:bg-[#202025] border border-[#EAE3D9] dark:border-[#2E2E33] font-bold"
          >
            <option value="High Protein / Low Carb">High Protein / Low Carb</option>
            <option value="Plant-Based Vegetarian">Plant-Based Vegetarian</option>
            <option value="Anti-Inflammatory">Anti-Inflammatory</option>
            <option value="Low Calorie (<400 kcal)">Low Calorie (&lt;400 kcal)</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#6B6661]">Budget:</span>
          <select
            value={budgetConstraint}
            onChange={(e) => setBudgetConstraint(e.target.value)}
            className="text-xs p-2 rounded-xl bg-[#FAF8F5] dark:bg-[#202025] border border-[#EAE3D9] dark:border-[#2E2E33] font-bold"
          >
            <option value="Under ₹200">Under ₹200</option>
            <option value="Under ₹400">Under ₹400</option>
            <option value="Under ₹700">Under ₹700</option>
          </select>
        </div>
      </div>

      {/* Food Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {foodRecommendations.map((meal, i) => (
          <div
            key={i}
            className="rounded-3xl border border-[#EAE3D9] dark:border-[#26262B] bg-white dark:bg-[#18181C] p-6 shadow-xs flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-[#6B6661]">
                <span className="flex items-center gap-1 text-[#FF5722]">
                  <Clock className="h-3 w-3" /> {meal.time}
                </span>
                <span className="text-[#16865D]">{meal.cost} per serving</span>
              </div>
              <h3 className="text-base font-bold text-[#1A1817] dark:text-white">{meal.title}</h3>
              <p className="text-xs text-[#6B6661] dark:text-[#A3A3A3] leading-relaxed">{meal.whyTwinPicks}</p>
            </div>

            <div className="pt-3 border-t border-[#EAE3D9] dark:border-[#26262B] space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-[#1A1817] dark:text-white">
                <span>{meal.calories}</span>
                <span className="text-[#3B82F6]">{meal.protein} Protein</span>
              </div>

              <div className="text-[11px] text-[#6B6661] space-y-1">
                <span className="font-bold text-[#1A1817] dark:text-white">Pantry Essentials:</span>
                <ul className="list-disc list-inside space-y-0.5">
                  {meal.ingredients.map((ing, idx) => (
                    <li key={idx}>{ing}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
