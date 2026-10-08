'use client';

// =============================================================================
// PujaHop Kolkata: One-Day Mode 8-Step Interactive Planner Wizard (Section 15)
// =============================================================================

import React, { useState } from 'react';
import { usePujaHop } from '@/context/PujaHopContext';
import { PUJA_CALENDAR_2026, isPrePujaDate } from '@/lib/data/kolkata-calendar';
import { WalkingTolerance, TransportPreference, RouteType } from '@/lib/types/pujahop';
import {
  X,
  Compass,
  Calendar,
  MapPin,
  Clock,
  Footprints,
  Heart,
  Hash,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';

const START_LOCATIONS = [
  { name: 'Shyambazar Five Point Crossing', lat: 22.6022, lng: 88.3708, area: 'North Kolkata' },
  { name: 'Gariahat Crossing (South Kolkata)', lat: 22.5186, lng: 88.3647, area: 'South Kolkata' },
  { name: 'College Square / Central Metro', lat: 22.5744, lng: 88.3629, area: 'Central Kolkata' },
  { name: 'Kalighat Metro Station Gate 1', lat: 22.5186, lng: 88.3472, area: 'South Kolkata' },
  { name: 'Howrah Railway Station / Green Line Metro', lat: 22.5830, lng: 88.3418, area: 'Howrah / Central' },
  { name: 'Salt Lake Karunamoyee Bus Terminus', lat: 22.5862, lng: 88.4198, area: 'East Kolkata / Salt Lake' },
  { name: 'Esplanade Metro Interchange', lat: 22.5647, lng: 88.3516, area: 'Central Kolkata' },
];

const INTEREST_OPTIONS = [
  { id: 'traditional', label: 'Traditional Idol (একচালা ডাকের সাজ)' },
  { id: 'theme', label: 'Award-Winning Themes (ভাবনা ও শিল্প)' },
  { id: 'lighting', label: 'Chandannagar Illumination (আলোকসজ্জা)' },
  { id: 'architecture', label: 'Grand Temple Replicas (স্থাপত্য)' },
  { id: 'photography', label: 'Photography Friendly' },
  { id: 'food', label: 'Kolkata Food Hopping (বিরিয়ানি ও মিষ্টি)' },
];

export function OneDayWizard() {
  const { wizardOpen, setWizardOpen, generateTrip, selectedDate } = usePujaHop();

  const [step, setStep] = useState(1);
  const [date, setDate] = useState(selectedDate);
  const [startLoc, setStartLoc] = useState(START_LOCATIONS[0]);
  const [startTime, setStartTime] = useState('14:00');
  const [endTime, setEndTime] = useState('22:00');
  const [walkingTolerance, setWalkingTolerance] = useState<WalkingTolerance>('MEDIUM');
  const [transportPreference, setTransportPreference] = useState<TransportPreference>('METRO_AND_WALK');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['traditional', 'theme']);
  const [pandalCount, setPandalCount] = useState(6);
  const [routeType, setRouteType] = useState<RouteType>('BEST OF KOLKATA');
  const [isGenerating, setIsGenerating] = useState(false);

  if (!wizardOpen) return null;

  const handleNext = () => setStep((s) => Math.min(8, s + 1));
  const handleBack = () => setStep((s) => Math.max(1, s - 1));

  const toggleInterest = (id: string) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await generateTrip({
        date,
        startLocation: { name: startLoc.name, lat: startLoc.lat, lng: startLoc.lng },
        startTime,
        endTime,
        walkingTolerance,
        transportPreference,
        interests: selectedInterests,
        maxPandals: pandalCount,
        routeType,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="relative w-full max-w-xl rounded-3xl bg-[#0F0D20] border border-amber-500/20 shadow-2xl p-6 md:p-8 space-y-6">
        {/* Close Button */}
        <button
          onClick={() => setWizardOpen(false)}
          className="absolute top-5 right-5 text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Progress */}
        <div>
          <div className="flex items-center justify-between text-xs font-semibold text-amber-400 mb-1">
            <span>STEP {step} OF 8</span>
            <span>{Math.round((step / 8) * 100)}% COMPLETED</span>
          </div>
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-rose-500 transition-all duration-300"
              style={{ width: `${(step / 8) * 100}%` }}
            />
          </div>
        </div>

        {/* STEP CONTENT */}
        <div className="min-h-[280px]">
          {/* STEP 1: DATE */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-400" />
                Step 1: Select Date (2026 Durga Puja)
              </h2>
              <p className="text-xs text-zinc-400">
                Choose the day of your hopping journey. 13–16 October activate Pre-Puja mode.
              </p>
              <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                {PUJA_CALENDAR_2026.map((cal) => (
                  <button
                    key={cal.date}
                    onClick={() => setDate(cal.date)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      date === cal.date
                        ? 'border-rose-500 bg-rose-500/20 text-white shadow-md'
                        : 'border-white/10 bg-white/5 text-zinc-300 hover:border-white/20'
                    }`}
                  >
                    <div className="text-xs font-bold">{cal.tithi_name}</div>
                    <div className="text-[11px] text-zinc-400">{cal.date}</div>
                    {cal.is_pre_puja && (
                      <span className="inline-block mt-1 text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300">
                        PRE-PUJA
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: START LOCATION */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-400" />
                Step 2: Select Start Location
              </h2>
              <p className="text-xs text-zinc-400">
                Where will you start your Kolkata journey from?
              </p>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {START_LOCATIONS.map((loc) => (
                  <button
                    key={loc.name}
                    onClick={() => setStartLoc(loc)}
                    className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                      startLoc.name === loc.name
                        ? 'border-rose-500 bg-rose-500/20 text-white'
                        : 'border-white/10 bg-white/5 text-zinc-300 hover:border-white/20'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold">{loc.name}</div>
                      <div className="text-[11px] text-zinc-400">{loc.area}</div>
                    </div>
                    {startLoc.name === loc.name && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: START TIME */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-400" />
                Step 3: Select Start Time
              </h2>
              <p className="text-xs text-zinc-400">
                When do you step out to start hopping?
              </p>
              <div className="grid grid-cols-3 gap-2">
                {['10:00', '12:00', '14:00', '16:00', '18:00', '20:00'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setStartTime(t)}
                    className={`p-3 rounded-xl border text-center font-bold text-sm transition-all ${
                      startTime === t
                        ? 'border-rose-500 bg-rose-500/20 text-white'
                        : 'border-white/10 bg-white/5 text-zinc-300 hover:border-white/20'
                    }`}
                  >
                    {t} hrs
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: END TIME */}
          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-400" />
                Step 4: Select End Time
              </h2>
              <p className="text-xs text-zinc-400">
                What time would you like to conclude your journey?
              </p>
              <div className="grid grid-cols-3 gap-2">
                {['20:00', '22:00', '00:00', '02:00', '04:00', '06:00'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setEndTime(t)}
                    className={`p-3 rounded-xl border text-center font-bold text-sm transition-all ${
                      endTime === t
                        ? 'border-rose-500 bg-rose-500/20 text-white'
                        : 'border-white/10 bg-white/5 text-zinc-300 hover:border-white/20'
                    }`}
                  >
                    {t} hrs
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: WALKING PREFERENCE */}
          {step === 5 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Footprints className="w-5 h-5 text-amber-400" />
                Step 5: Walking Tolerance
              </h2>
              <p className="text-xs text-zinc-400">
                How much walking is comfortable for your group?
              </p>
              <div className="space-y-2">
                {[
                  { id: 'LOW', label: 'Low Walking (< 600m per stop)', desc: 'Senior citizens & families; prioritize metro gates and autos' },
                  { id: 'MEDIUM', label: 'Moderate Walking (600m – 1.4 km)', desc: 'Balanced walking with Kolkata street immersion' },
                  { id: 'HIGH', label: 'High Walking Endurance (Up to 2.5 km)', desc: 'Deep neighborhood lane hopping (Kumartuli / Bagbazar lanes)' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setWalkingTolerance(item.id as WalkingTolerance)}
                    className={`w-full p-3.5 rounded-xl border text-left transition-all ${
                      walkingTolerance === item.id
                        ? 'border-rose-500 bg-rose-500/20 text-white'
                        : 'border-white/10 bg-white/5 text-zinc-300 hover:border-white/20'
                    }`}
                  >
                    <div className="text-sm font-bold">{item.label}</div>
                    <div className="text-xs text-zinc-400">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 6: INTERESTS */}
          {step === 6 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Heart className="w-5 h-5 text-amber-400" />
                Step 6: Interests & Priorities
              </h2>
              <p className="text-xs text-zinc-400">
                Select your focus areas for idol and pandal curation.
              </p>
              <div className="grid grid-cols-2 gap-2">
                {INTEREST_OPTIONS.map((opt) => {
                  const isSelected = selectedInterests.includes(opt.id);
                  return (
                    <button
                      key={opt.id}
                      onClick={() => toggleInterest(opt.id)}
                      className={`p-3 rounded-xl border text-left text-xs font-medium transition-all ${
                        isSelected
                          ? 'border-rose-500 bg-rose-500/20 text-white'
                          : 'border-white/10 bg-white/5 text-zinc-400 hover:border-white/20'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 7: NUMBER OF PANDALS */}
          {step === 7 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Hash className="w-5 h-5 text-amber-400" />
                Step 7: Preferred Number of Pandals
              </h2>
              <p className="text-xs text-zinc-400">
                Philosophy: Quality over fatigue. 5 to 7 pandals offer the best balance.
              </p>
              <div className="grid grid-cols-4 gap-2">
                {[4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <button
                    key={num}
                    onClick={() => setPandalCount(num)}
                    className={`p-4 rounded-xl border text-center font-bold text-base transition-all ${
                      pandalCount === num
                        ? 'border-rose-500 bg-rose-500/20 text-white'
                        : 'border-white/10 bg-white/5 text-zinc-300 hover:border-white/20'
                    }`}
                  >
                    {num} Pandals
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 8: REVIEW & GENERATE */}
          {step === 8 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                Step 8: Route Type & Final Review
              </h2>
              <div className="space-y-2 text-xs bg-white/5 p-4 rounded-2xl border border-white/10">
                <div className="flex justify-between text-zinc-300">
                  <span>Date:</span>
                  <span className="font-bold text-white">{date}</span>
                </div>
                <div className="flex justify-between text-zinc-300">
                  <span>Start:</span>
                  <span className="font-bold text-white">{startLoc.name}</span>
                </div>
                <div className="flex justify-between text-zinc-300">
                  <span>Time Window:</span>
                  <span className="font-bold text-white">
                    {startTime} – {endTime}
                  </span>
                </div>
                <div className="flex justify-between text-zinc-300">
                  <span>Walking Limit:</span>
                  <span className="font-bold text-white">{walkingTolerance}</span>
                </div>
                <div className="flex justify-between text-zinc-300">
                  <span>Target Pandals:</span>
                  <span className="font-bold text-amber-400">{pandalCount} Pandals</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">
                  Preset Route Focus:
                </label>
                <select
                  value={routeType}
                  onChange={(e) => setRouteType(e.target.value as RouteType)}
                  className="w-full bg-[#1A182F] border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="BEST OF KOLKATA">BEST OF KOLKATA (Curated Quality)</option>
                  <option value="NORTH KOLKATA">NORTH KOLKATA (Heritage & Kumartuli)</option>
                  <option value="SOUTH KOLKATA">SOUTH KOLKATA (Mega Theme Spectacles)</option>
                  <option value="CENTRAL KOLKATA">CENTRAL KOLKATA (College Square & Illumination)</option>
                  <option value="TRADITIONAL PUJA">TRADITIONAL PUJA (Rajbari & Ekchala)</option>
                  <option value="LOW WALKING">LOW WALKING (Metro Proximity Focus)</option>
                  <option value="PHOTOGRAPHY ROUTE">PHOTOGRAPHY ROUTE (Artisan Focus)</option>
                  <option value="ONE-DAY CHALLENGE">ONE-DAY CHALLENGE (Maximum Coverage)</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER BUTTONS */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          {step > 1 ? (
            <button
              onClick={handleBack}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-zinc-300 hover:bg-white/5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 8 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs shadow-lg shadow-amber-950/40"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-rose-600 to-red-600 text-white font-bold text-xs shadow-xl shadow-rose-950/60 disabled:opacity-50"
            >
              {isGenerating ? (
                <span>Generating Route...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>GENERATE ROUTE</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
