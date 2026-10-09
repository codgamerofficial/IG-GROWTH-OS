// =============================================================================
// PujaHop Kolkata: Pandal Audio Stories & Heritage Narrator Data
// Curated Bilingual Cultural Narratives • English & Bengali Heritage Scripts
// =============================================================================

export interface PandalHeritageStory {
  pandal_id: string;
  pandal_name: string;
  english_title: string;
  bengali_title: string;
  artisan_credits: {
    idol_maker?: string;
    concept_designer?: string;
    lighting_artist?: string;
  };
  english_narrative: string;
  bengali_narrative: string;
  historical_highlight: string;
  duration_minutes: number;
}

export const VERIFIED_PANDAL_STORIES: PandalHeritageStory[] = [
  {
    pandal_id: 'bagbazar-sarbojanin',
    pandal_name: 'Bagbazar Sarbojanin Durgotsav',
    english_title: 'The Cradle of Bengal Community Puja & Netaji Legacy',
    bengali_title: 'বাগবাজার সার্বজনীন: শতবর্ষের ঐতিহ্য ও নেতাজীর স্মৃতি',
    artisan_credits: {
      idol_maker: 'Pradip Rudra Pal (Kumartuli)',
      concept_designer: 'Traditional Ekchala Heritage Architecture',
      lighting_artist: 'Babu Pal (Chandannagar Illumination)',
    },
    english_narrative:
      'Welcome to Bagbazar Sarbojanin, the historic cradle of public Durga Puja in Kolkata. Established in 1919 near the holy banks of the Hooghly River, Bagbazar broke away from aristocratic private palaces to pioneer true community celebration. In 1938 and 1939, Netaji Subhash Chandra Bose served as the president of this historic committee, infusing the festival with the spirit of the Indian freedom movement. Notice the timeless beauty of the traditional Ekchala idol, adorned in dazzling silver-foil Daaker Saaj, crafted by legendary Kumartuli masters.',
    bengali_narrative:
      'বাগবাজার সার্বজনীন দুর্গোৎসবে আপনাকে স্বাগত। ১৯১৯ সালে প্রতিষ্ঠিত এই পুজো উত্তর কলকাতার ঐতিহ্য ও ভারতীয় স্বাধীনতা সংগ্রামের জীবন্ত প্রতীক। ১৯৩৮ ও ১৯৩৯ সালে স্বয়ং নেতাজী সুভাষচন্দ্র বসু এই পুজো কমিটির সভাপতি হিসেবে নেতৃত্ব দেন। কুমারটুলির প্রখ্যাত শিল্পীদের হাতে তৈরি সাবেক একচালা প্রতিমা ও মনমুগ্ধকর ডাকের সাজ আজও সারা বাংলার মানুষের মন জয় করে চলেছে। গঙ্গার স্নিগ্ধ বাতাসের সাথে এই পুজো প্রাঙ্গণ যেন এক অমর ইতিহাসের স্বাক্ষর বহন করে।',
    historical_highlight: 'Netaji Subhash Chandra Bose served as Puja President in 1938-1939.',
    duration_minutes: 2.5,
  },
  {
    pandal_id: 'sovabazar-rajbari',
    pandal_name: 'Sovabazar Rajbari (Nabakrishna Deb)',
    english_title: 'The 1757 Aristocratic Courtyard of Lord Clive Era',
    bengali_title: 'শোভাবাজার রাজবাড়ি: ১৭৫৭ সালের ঐতিহাসিক নাটমন্দিরের মহিমা',
    artisan_credits: {
      idol_maker: 'Hereditary Rajbari Sculptors (Kumartuli lineage)',
      concept_designer: 'Colonial Baroque & Bengal Natmandir Arch',
      lighting_artist: 'Traditional Brass Candelabras & Crystal Chandeliers',
    },
    english_narrative:
      'You are standing in the grand courtyard of Sovabazar Rajbari, established in 1757 by Raja Nabakrishna Deb following the decisive Battle of Plassey. It is celebrated as the birthplace of organized modern Durga festivities in colonial Calcutta, where Lord Clive was once welcomed as a guest. The Natmandir features majestic arched columns where Durga is worshipped in pure Ekchala Shakta-Vaishnava tradition. Notice that lion here bears a horse-like snout, preserving an ancient puranic style seen only in Bengal’s oldest royal households.',
    bengali_narrative:
      'শোভাবাজার রাজবাড়ির ঐতিহাসিক নাটমন্দিরে আপনাকে স্বাগত। ১৭৫৭ সালে পলাশীর যুদ্ধের পর রাজা নবকৃষ্ণ দেব এই বিখ্যাত দুর্গোৎসবের সূচনা করেন। ঔপনিবেশিক কলকাতার রাজকীয় সংস্কৃতির অন্যতম প্রতীক এই রাজবাড়ি। এখানকার প্রতিমার সিংহটি বিশেষ পৌরাণিক অশ্বমুখো রূপ ধারণ করে আছে। শত শত বছরের ঐতিহ্যবাহী বৈষ্ণব ও শাক্ত রীতির মিলন এই নাটমন্দিরকে কলকাতার দুর্গাপূজার অন্যতম আদি পীঠস্থানে পরিণত করেছে।',
    historical_highlight: 'Founded in 1757; preserves ancient horse-headed lion (Ghotok Mukhi Singho).',
    duration_minutes: 2.2,
  },
  {
    pandal_id: 'college-square',
    pandal_name: 'College Square Sarbojanin',
    english_title: 'The Aquatic Mirror & Symphony of Chandannagar Lights',
    bengali_title: 'কলেজ স্কোয়ার: সরোবরের জলে চন্দননগরের আলোর ইন্দ্রজাল',
    artisan_credits: {
      idol_maker: 'Sanatan Rudra Pal',
      concept_designer: 'Vedic Temple Palace Architecture',
      lighting_artist: 'Sridhar Das & Chandannagar Master Guilds',
    },
    english_narrative:
      'College Square represents the pinnacle of Kolkata’s architectural pandal grandeur. Since 1948, the centerpiece of this celebration has been its tranquil swimming pool, which transforms into a mirror reflecting towering temple spires illuminated by millions of micro-LEDs from Chandannagar. Devotees line the stone promenade all night to watch the shimmering waters reflect the majestic glowing deity, making it one of the most photographed heritage pandals on Earth.',
    bengali_narrative:
      'কলেজ স্কোয়ার সর্বজনীন দুর্গোৎসবে আপনাকে স্বাগত। ১৯৪৮ সাল থেকে এই পুজো তার সুবিশাল সরোবরের জলে সুউচ্চ মন্দির ও চন্দননগরের অবিশ্বাস্য আলোর প্রতিফলনের জন্য জগৎবিখ্যাত। দীঘির পাড় ঘেঁষে রাতভর লাখ লাখ ভক্তের পদচারণা আর শান্ত জলে আলোকসজ্জার বিচ্ছুরণ এক জাদুকরী পরিবেশ সৃষ্টি করে, যা কলকাতার শারদীয় উৎসবের অন্যতম প্রধান আকর্ষণ।',
    historical_highlight: 'Famous for its 50-foot temple facade reflecting across the historic lake.',
    duration_minutes: 2.1,
  },
  {
    pandal_id: 'ekdalia-evergreen',
    pandal_name: 'Ekdalia Evergreen Club',
    english_title: 'Southern Grandeur & Timeless Indian Temple Replicas',
    bengali_title: 'একডালিয়া এভারগ্রীন: দক্ষিণ ভারতের ঐতিহ্যবাহী স্থাপত্যের মেলবন্ধন',
    artisan_credits: {
      idol_maker: 'Sanatan Rudra Pal',
      concept_designer: 'Dravidian & Kalinga Temple Guilds',
      lighting_artist: 'German Crystal Chandelier & Chandannagar Lights',
    },
    english_narrative:
      'Ekdalia Evergreen Club in Gariahat has stood steadfast as a temple of classical devotion since 1943. Unlike experimental modern themes, Ekdalia specializes in recreating the majestic stone architecture of India’s most sacred temples—from Thanjavur to Konark—with astonishing mathematical precision. Inside, the deity radiates serenity in pure classical Pratima style beneath immense European crystal chandeliers suspended from the vaulted ceiling.',
    bengali_narrative:
      'একডালিয়া এভারগ্রীন ক্লাবে আপনাকে স্বাগত। ১৯৪৩ সালে প্রতিষ্ঠিত এই পুজো কোনো কৃত্রিম আধুনিক থিমের পরিবর্তে ভারতের সুপ্রাচীন ও বিখ্যাত মন্দির স্থাপত্যের নিখুঁত প্রতিরূপ তুলে ধরার জন্য পরিচিত। ভেতরের সুবিশাল ক্রিস্টাল ঝাড়বাতি এবং সনাতন রুদ্র পালের তৈরি চিরন্তন মমতাময়ী মাতৃরূপ প্রতি বছর কোটি ভক্তের হৃদয় স্পর্শ করে।',
    historical_highlight: 'Renowned for recreating architectural wonders of ancient Indian stone temples.',
    duration_minutes: 2.0,
  },
  {
    pandal_id: 'maddox-square',
    pandal_name: 'Maddox Square Durgotsav',
    english_title: 'The Cultural Heart of Kolkata Adda & Acoustic Dhaak',
    bengali_title: 'ম্যাডক্স স্কোয়ার: নিখাদ আড্ডা আর খোলা আকাশের ঢাকের ছন্দ',
    artisan_credits: {
      idol_maker: 'Mohanbanshi Rudra Pal',
      concept_designer: 'Open-Air Classical Shamiana',
      lighting_artist: 'Traditional Warm Tungsten Canopy',
    },
    english_narrative:
      'Maddox Square is not just a pandal; it is the living emotional heartbeat of Kolkata youth. Established in 1935 in the lush grounds of Ritchie Road, the festival here centers on an open-air pavilion where friends, families, and homecoming Bengalis from across the globe gather on the grassy meadows. The rhythmic cadence of dozens of dhaakis playing in unison creates an acoustic reverie unmatched anywhere in the world.',
    bengali_narrative:
      'ম্যাডক্স স্কোয়ার দুর্গোৎসবে আপনাকে স্বাগত। এটি কেবল একটি পুজো নয়, এটি কলকাতার প্রাণবন্ত আড্ডা সংস্কৃতির প্রাণকেন্দ্র। ১৯৩৫ সাল থেকে এই সবুজ মাঠের মাঝে খোলা শামিয়ানার নিচে দুর্গাপূজা উদযাপিত হয়। এখানে দেশ-বিদেশের বাঙালিরা একত্রিত হয় গান, গল্প আর উৎসবের আনন্দে মাতোয়ারা হতে। ঢাকের গুরুগম্ভীর আওয়াজ এই উন্মুক্ত প্রাঙ্গণকে এক অবিস্মরণীয় অনুভূতিতে ভরিয়ে তোলে।',
    historical_highlight: 'Quintessential open-air cultural park festival celebrated for eternal Kolkata Adda.',
    duration_minutes: 1.8,
  },
];

export function getStoryForPandal(pandalId: string, pandalName: string, theme: string): PandalHeritageStory {
  const found = VERIFIED_PANDAL_STORIES.find((s) => s.pandal_id === pandalId);
  if (found) return found;

  // Generated fallback for any other pandal
  return {
    pandal_id: pandalId,
    pandal_name: pandalName,
    english_title: `${pandalName} — Cultural Heritage & Artistic Theme`,
    bengali_title: `${pandalName} — ঐতিহ্য ও শিল্পভাবনা`,
    artisan_credits: {
      idol_maker: 'Master Sculptor of Bengal',
      concept_designer: 'Bengal Art & Heritage Guild',
      lighting_artist: 'Chandannagar Electrical Guilds',
    },
    english_narrative: `Welcome to ${pandalName}. This celebration represents a key milestone in Kolkata's vibrant Durga Puja landscape. This year's concept centers on: ${theme}. Notice the intricate interplay of indigenous craftsmanship, lighting, and spiritual iconography that makes this pandal a beloved cultural landmark for devotees and art enthusiasts across the city.`,
    bengali_narrative: `${pandalName}-এ আপনাকে আন্তরিক স্বাগত। এই পুজোর বিশেষ ভাবনায় ফুটে উঠেছে: ${theme}। বাংলার মাটির শিল্পী ও কারিগরদের অক্লান্ত পরিশ্রমে নির্মিত এই মণ্ডপ এবং দেবীর রূপ কলকাতার সার্বজনীন শারদোৎসবের এক উজ্জ্বল নিদর্শন।`,
    historical_highlight: `Celebrated cultural landmark featuring: ${theme}`,
    duration_minutes: 1.5,
  };
}
