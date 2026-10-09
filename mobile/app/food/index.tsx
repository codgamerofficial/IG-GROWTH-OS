// =============================================================================
// PujaHop Kolkata Mobile: Kolkata Food Trail Screen
// Section 31 & 56: Verified gastronomy pitstops (Nizam's, Aminia, Balaram Mullick, Mitra Cafe)
// =============================================================================

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Linking, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Utensils, MapPin, Navigation, Clock, Star } from 'lucide-react-native';
import { colors } from '../../src/theme/colors';
import { useHaptics } from '../../src/hooks/useHaptics';

export function FoodScreen() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('ALL');
  const haptics = useHaptics();

  const categories = ['ALL', 'STREET FOOD', 'BENGALI', 'MISHTI', 'LATE NIGHT'];

  const foodPlaces = [
    {
      id: 'nizams',
      name: "Nizam's Restaurant",
      nameBn: 'নিজাম রেস্তোরাঁ',
      area: 'New Market, Central Kolkata',
      category: 'STREET FOOD',
      specialty: 'Original Kolkata Kathi Rolls (Mutton & Chicken)',
      lat: 22.5601,
      lng: 88.3524,
      hours: '11:30 - 23:00',
    },
    {
      id: 'aminia',
      name: 'Aminia Restaurant',
      nameBn: 'আমিনিয়া',
      area: 'Esplanade & Golpark',
      category: 'BENGALI',
      specialty: 'Kolkata Mutton Biryani with Aloo & Egg',
      lat: 22.5626,
      lng: 88.3533,
      hours: '11:00 - 23:30',
    },
    {
      id: 'balaram',
      name: 'Balaram Mullick & Radharaman Mullick',
      nameBn: 'বলরাম মল্লিক ও রাধারমণ মল্লিক',
      area: 'Bhowanipore, South Kolkata',
      category: 'MISHTI',
      specialty: 'Baked Rosogolla, Mishti Doi & Sandesh',
      lat: 22.5284,
      lng: 88.3475,
      hours: '08:00 - 22:30',
    },
    {
      id: 'mitra',
      name: 'Mitra Cafe',
      nameBn: 'মিত্র কাফে',
      area: 'Shobhabazar, North Kolkata',
      category: 'LATE NIGHT',
      specialty: 'Diamond Fish Fry, Brain Chop & Mutton Kabiraji',
      lat: 22.5975,
      lng: 88.3698,
      hours: '16:00 - 23:00',
    },
  ];

  const filtered = foodPlaces.filter(
    (p) => activeCategory === 'ALL' || p.category === activeCategory
  );

  const openNavigation = (lat: number, lng: number, name: string) => {
    haptics.heavy();
    const url = Platform.select({
      ios: `http://maps.apple.com/?daddr=${lat},${lng}`,
      android: `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
    });
    Linking.openURL(url || `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              haptics.selection();
              router.back();
            }}
            style={styles.backButton}
          >
            <ArrowLeft size={20} color={colors.textPrimary} />
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>Kolkata Food Trail</Text>
            <Text style={styles.subtitle}>Puja is not just pandals — it is also Kolkata&apos;s flavours</Text>
          </View>
        </View>

        {/* Categories Bar */}
        <View style={styles.categoriesBar}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
            {categories.map((c) => (
              <TouchableOpacity
                key={c}
                onPress={() => {
                  haptics.selection();
                  setActiveCategory(c);
                }}
                style={[styles.categoryChip, activeCategory === c && styles.categoryChipActive]}
              >
                <Text style={[styles.categoryText, activeCategory === c && styles.categoryTextActive]}>{c}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Food Places List */}
        <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
          {filtered.map((place) => (
            <View key={place.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.iconCircle}>
                  <Utensils size={18} color={colors.festiveOrange} />
                </View>
                <View style={styles.headerText}>
                  <Text style={styles.placeName}>{place.name}</Text>
                  <Text style={styles.placeNameBn}>{place.nameBn}</Text>
                </View>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryBadgeText}>{place.category}</Text>
                </View>
              </View>

              <Text style={styles.specialtyText}>Specialty: {place.specialty}</Text>

              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <MapPin size={12} color={colors.textSecondary} />
                  <Text style={styles.metaText}>{place.area}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Clock size={12} color={colors.textSecondary} />
                  <Text style={styles.metaText}>{place.hours}</Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => openNavigation(place.lat, place.lng, place.name)}
                style={styles.navButton}
              >
                <Navigation size={14} color="#FFFFFF" />
                <Text style={styles.navButtonText}>DIRECTIONS</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

export default FoodScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.deepCharcoal,
  },
  container: {
    flex: 1,
    backgroundColor: colors.deepCharcoal,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
    gap: 12,
  },
  backButton: {
    padding: 6,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 11,
    marginTop: 1,
  },
  categoriesBar: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  categoryScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.cardDark,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  categoryChipActive: {
    backgroundColor: colors.festiveOrange,
    borderColor: colors.festiveOrange,
  },
  categoryText: {
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: '700',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 12,
  },
  card: {
    backgroundColor: colors.cardDark,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    gap: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 138, 61, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
  },
  placeName: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  placeNameBn: {
    color: colors.softGold,
    fontSize: 12,
  },
  categoryBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryBadgeText: {
    color: colors.textSecondary,
    fontSize: 9,
    fontWeight: '800',
  },
  specialtyText: {
    color: colors.antiqueGold,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    color: colors.textSecondary,
    fontSize: 11,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 138, 61, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 138, 61, 0.4)',
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 6,
  },
  navButtonText: {
    color: colors.festiveOrange,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
