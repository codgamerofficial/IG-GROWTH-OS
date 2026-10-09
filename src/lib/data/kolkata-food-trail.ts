// =============================================================================
// PujaHop Kolkata: Kolkata Bhog & Street Food Trail Engine
// Verified Mahaprasad Schedules, Coupon Guidelines & Legendary Culinary Spots
// =============================================================================

export interface PandalBhogInfo {
  pandal_id: string;
  pandal_name: string;
  area: string;
  days: string[];
  timing_window: string;
  coupon_info: string;
  menu_items: string[];
  is_seated_dining: boolean;
  notes: string;
}

export interface FoodTrailSpot {
  id: string;
  name: string;
  name_bn?: string;
  category: 'BHOG' | 'ROLLS_CABIN' | 'SWEETS_MISHTI' | 'BIRYANI_MUGHLAI' | 'HISTORIC_CAFE';
  area: 'North Kolkata' | 'South Kolkata' | 'Central Kolkata' | 'Salt Lake / East';
  address: string;
  lat: number;
  lng: number;
  specialty: string;
  heritage_year?: number;
  price_range: '₹' | '₹₹' | '₹₹₹';
  timings: string;
  is_pure_veg: boolean;
  google_maps_url: string;
  recommended_with_pandal?: string;
}

export const VERIFIED_PANDAL_BHOG_SCHEDULES: PandalBhogInfo[] = [
  {
    pandal_id: 'bagbazar-sarbojanin',
    pandal_name: 'Bagbazar Sarbojanin Durgotsav',
    area: 'North Kolkata',
    days: ['Maha Saptami', 'Maha Ashtami', 'Maha Navami'],
    timing_window: '1:30 PM – 4:00 PM',
    coupon_info: 'Coupons distributed at pandal tent counter from 9:30 AM daily on first-come basis.',
    menu_items: [
      'Govindobhog Khichuri cooked in pure ghee',
      'Labra (mixed autumn seasonal vegetables)',
      'Beguni & Potol Bhaja',
      'Tomato-Amsotto-Khejur Chutney',
      'Nolen Gurer Payesh',
    ],
    is_seated_dining: true,
    notes: 'One of Bengal’s oldest community Sarbojanin bhog traditions, serving thousands with traditional copper urns.',
  },
  {
    pandal_id: 'maddox-square',
    pandal_name: 'Maddox Square Durgotsav',
    area: 'South Kolkata',
    days: ['Maha Ashtami', 'Maha Navami'],
    timing_window: '1:00 PM – 3:30 PM',
    coupon_info: 'Token counters open at 10:00 AM on park pavilion. Dedicated queue for senior citizens.',
    menu_items: [
      'Moong Dal Bhog Khichuri',
      'Bandhakopir Ghonto',
      'Alu Phulkopir Dalna',
      'Plastic Chutney (Raw Papaya Sweet Chutney)',
      'Rasgulla & Mihidana',
    ],
    is_seated_dining: true,
    notes: 'Famous outdoor park canopy feast accompanied by open-air acoustic dhaak performances.',
  },
  {
    pandal_id: 'ekdalia-evergreen',
    pandal_name: 'Ekdalia Evergreen Club',
    area: 'South Kolkata',
    days: ['Maha Saptami', 'Maha Ashtami', 'Maha Navami'],
    timing_window: '1:30 PM – 3:30 PM',
    coupon_info: 'Bhog vouchers available at club registration desk from Shasthi onwards.',
    menu_items: [
      'Kolkata Heritage Khichuri',
      'Chanar Dalna',
      'Dhokar Dalna',
      'Anarosher Chutney (Pineapple Chutney)',
      'Makha Sandesh',
    ],
    is_seated_dining: true,
    notes: 'Organized under the traditional temple facade with strict hygienic community dining pavilions.',
  },
  {
    pandal_id: 'sovabazar-rajbari',
    pandal_name: 'Sovabazar Rajbari (Nabakrishna Deb)',
    area: 'North Kolkata',
    days: ['Maha Saptami', 'Maha Ashtami', 'Maha Navami'],
    timing_window: '12:30 PM – 2:30 PM (Naivedya Prasad)',
    coupon_info: 'Family trustee prasad distribution for invited visitors and morning darshan devotees.',
    menu_items: [
      'Radhaballabhi stuffed with spicy biulir dal',
      'Chholar Dal with coconut shavings',
      'Jumbo Motichoor Ladoo',
      'Rajbari Khaja & Gaja',
    ],
    is_seated_dining: false,
    notes: 'Historic 1757 Vaishnava-Shakta heritage prasad prepared without boiled rice, cooked exclusively in desi ghee.',
  },
  {
    pandal_id: 'suruchi-sangha',
    pandal_name: 'Suruchi Sangha',
    area: 'South Kolkata',
    days: ['Maha Ashtami', 'Maha Navami'],
    timing_window: '1:00 PM – 3:30 PM',
    coupon_info: 'Passes provided at reception gate counter starting 10:00 AM.',
    menu_items: [
      'Bhog Khichuri',
      'Labra & Begun Bhaja',
      'Aamshotto Khejur Chutney',
      'Papad & Sandesh',
    ],
    is_seated_dining: true,
    notes: 'Air-cooled dining marquee with prompt volunteer service.',
  },
  {
    pandal_id: 'mohammad-ali-park',
    pandal_name: 'Mohammad Ali Park',
    area: 'Central Kolkata',
    days: ['Maha Ashtami', 'Maha Navami'],
    timing_window: '1:30 PM – 4:00 PM',
    coupon_info: 'Devotee coupon distribution on Chittaranjan Avenue entrance counter.',
    menu_items: [
      'Basanti Polao & Chholar Dal',
      'Kumror Chhokka',
      'Mango Chutney',
      'Boondi & Pantua',
    ],
    is_seated_dining: true,
    notes: 'Central Kolkata landmark bhog serving diverse cultural cross-sections of the city.',
  },
];

export const VERIFIED_LEGENDARY_FOOD_TRAIL: FoodTrailSpot[] = [
  {
    id: 'mitra-cafe',
    name: 'Mitra Cafe (Sovabazar)',
    name_bn: 'মিত্র ক্যাফে',
    category: 'ROLLS_CABIN',
    area: 'North Kolkata',
    address: '47 Jatindra Mohan Ave, Sovabazar, Kolkata 700005',
    lat: 22.5977,
    lng: 88.3698,
    specialty: 'Mutton Kabiraji Cutlet, Diamond Fish Fry, Brain Chop',
    heritage_year: 1910,
    price_range: '₹₹',
    timings: '4:30 PM – 11:30 PM (All-Night during Puja)',
    is_pure_veg: false,
    google_maps_url: 'https://www.google.com/maps/search/?api=1&query=Mitra+Cafe+Sovabazar+Kolkata',
    recommended_with_pandal: 'bagbazar-sarbojanin',
  },
  {
    id: 'paramount-sherbets',
    name: 'Paramount Cold Drinks & Sherbets',
    name_bn: 'প্যারামাউন্ট শরবত',
    category: 'HISTORIC_CAFE',
    area: 'Central Kolkata',
    address: '1/1/1D Bankim Chatterjee St, College Square, Kolkata 700073',
    lat: 22.5746,
    lng: 88.3638,
    specialty: 'Daab Sherbet (tender coconut malai), Malai Passion, Kesar Sherbet',
    heritage_year: 1918,
    price_range: '₹',
    timings: '11:00 AM – 11:00 PM (Late night Puja hours)',
    is_pure_veg: true,
    google_maps_url: 'https://www.google.com/maps/search/?api=1&query=Paramount+Cold+Drinks+College+Square+Kolkata',
    recommended_with_pandal: 'college-square',
  },
  {
    id: 'nakur-sweets',
    name: 'Girish Chandra Dey & Nakur Chandra Nandy',
    name_bn: 'গিরিশ চন্দ্র দে ও নাকুর চন্দ্র নন্দী',
    category: 'SWEETS_MISHTI',
    area: 'North Kolkata',
    address: '56 Ramdulal Sarkar St, Hedua, Kolkata 700006',
    lat: 22.5898,
    lng: 88.3685,
    specialty: 'Jolbhora Sandesh, Chocolate Sandesh, Parijat, Kaju Barfi Sandesh',
    heritage_year: 1844,
    price_range: '₹₹',
    timings: '7:00 AM – 11:00 PM',
    is_pure_veg: true,
    google_maps_url: 'https://www.google.com/maps/search/?api=1&query=Nakur+Chandra+Nandy+Kolkata',
    recommended_with_pandal: 'chalta-bagan',
  },
  {
    id: 'golbari-kosha-mangsho',
    name: 'New Punjabi Hotel (Golbari)',
    name_bn: 'গোলবাড়ি কষা মাংস',
    category: 'ROLLS_CABIN',
    area: 'North Kolkata',
    address: 'Acharya Prafulla Chandra Rd, Shyambazar Five Point Crossing, Kolkata 700004',
    lat: 22.6025,
    lng: 88.3712,
    specialty: 'Iconic pitch-black spicy Kosha Mangsho with piping hot Triangle Porota',
    heritage_year: 1922,
    price_range: '₹₹',
    timings: '12:30 PM – 11:30 PM (Midnight queues during Puja)',
    is_pure_veg: false,
    google_maps_url: 'https://www.google.com/maps/search/?api=1&query=Golbari+Shyambazar+Kolkata',
    recommended_with_pandal: 'bagbazar-sarbojanin',
  },
  {
    id: 'nizams-restaurant',
    name: "Nizam's (The Birthplace of the Kathi Roll)",
    name_bn: 'নিজামস',
    category: 'ROLLS_CABIN',
    area: 'Central Kolkata',
    address: '23/24 Hogg St, New Market, Kolkata 700087',
    lat: 22.5601,
    lng: 88.3524,
    specialty: 'Original Double Egg Double Chicken Kathi Roll, Mutton Seekh Roll',
    heritage_year: 1932,
    price_range: '₹₹',
    timings: '11:00 AM – 1:30 AM (Puja midnight service)',
    is_pure_veg: false,
    google_maps_url: 'https://www.google.com/maps/search/?api=1&query=Nizams+New+Market+Kolkata',
    recommended_with_pandal: 'md-ali-park',
  },
  {
    id: 'arsalan-park-circus',
    name: 'Arsalan Park Circus',
    name_bn: 'আরসালান',
    category: 'BIRYANI_MUGHLAI',
    area: 'Central Kolkata',
    address: '191 Marina Garden Court, 7-Point Crossing, Park Circus, Kolkata 700017',
    lat: 22.5434,
    lng: 88.3662,
    specialty: 'Kolkata Mutton Biryani (with melt-in-mouth Aloo), Chicken Chaap, Firni',
    heritage_year: 2002,
    price_range: '₹₹',
    timings: '11:00 AM – 3:00 AM (All-night during Puja)',
    is_pure_veg: false,
    google_maps_url: 'https://www.google.com/maps/search/?api=1&query=Arsalan+Park+Circus+Kolkata',
    recommended_with_pandal: 'ballygunge-cultural',
  },
  {
    id: 'kusum-rolls',
    name: 'Kusum Rolls (Park Street)',
    name_bn: 'কুসুম রোলস',
    category: 'ROLLS_CABIN',
    area: 'Central Kolkata',
    address: '21 Park St, Taltala, Kolkata 700016',
    lat: 22.5518,
    lng: 88.3533,
    specialty: 'Crispy flaky paratha rolls: Double Mutton Roll, Paneer Cheese Roll',
    heritage_year: 1971,
    price_range: '₹',
    timings: '11:30 AM – 2:00 AM',
    is_pure_veg: false,
    google_maps_url: 'https://www.google.com/maps/search/?api=1&query=Kusum+Rolls+Park+Street+Kolkata',
    recommended_with_pandal: 'tridhara-sammilani',
  },
  {
    id: 'peter-cat',
    name: 'Peter Cat',
    name_bn: 'পিটার ক্যাট',
    category: 'HISTORIC_CAFE',
    area: 'South Kolkata',
    address: '18A Park St, Kolkata 700071',
    lat: 22.5526,
    lng: 88.3529,
    specialty: 'Original Chelo Kebab with poached egg & dollop of butter',
    heritage_year: 1975,
    price_range: '₹₹₹',
    timings: '12:00 PM – 11:30 PM',
    is_pure_veg: false,
    google_maps_url: 'https://www.google.com/maps/search/?api=1&query=Peter+Cat+Park+Street+Kolkata',
    recommended_with_pandal: 'ballygunge-cultural',
  },
  {
    id: 'chittaranjan-mistanna',
    name: 'Chittaranjan Mistanna Bhandar',
    name_bn: 'চিত্তরঞ্জন মিষ্টান্ন ভাণ্ডার',
    category: 'SWEETS_MISHTI',
    area: 'North Kolkata',
    address: '34B Shyambazar St, Kolkata 700004',
    lat: 22.5982,
    lng: 88.3705,
    specialty: 'Spongy White Rosogolla, Madhumancha, Rajbhog, Chamcham',
    heritage_year: 1907,
    price_range: '₹',
    timings: '7:00 AM – 10:30 PM',
    is_pure_veg: true,
    google_maps_url: 'https://www.google.com/maps/search/?api=1&query=Chittaranjan+Mistanna+Bhandar+Shyambazar+Kolkata',
    recommended_with_pandal: 'bagbazar-sarbojanin',
  },
  {
    id: 'balwant-singh-dhaba',
    name: 'Balwant Singh Eating House',
    name_bn: 'বলবন্ত সিং ধাবা',
    category: 'HISTORIC_CAFE',
    area: 'South Kolkata',
    address: '10/1 Harish Mukherjee Rd, Bhawanipur, Kolkata 700025',
    lat: 22.5312,
    lng: 88.3448,
    specialty: 'Kesar Chai in earthen Bhar, Doodh Cola, Aloo Paratha with white butter',
    heritage_year: 1926,
    price_range: '₹',
    timings: 'Open 24 Hours (Iconic 3 AM Puja Adda Spot)',
    is_pure_veg: true,
    google_maps_url: 'https://www.google.com/maps/search/?api=1&query=Balwant+Singh+Eating+House+Bhawanipur+Kolkata',
    recommended_with_pandal: 'chetla-agrani',
  },
];
