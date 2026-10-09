// =============================================================================
// PujaHop Kolkata Mobile: Featured Pandals Horizontal Carousel
// Section 6 & 13: Horizontal swipeable cards with verified data and navigation
// =============================================================================

import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { MapPin, Train, Sparkles } from 'lucide-react-native';
import { Pandal } from '../../../../../src/lib/types/pujahop';
import { colors } from '../../theme/colors';
import { StatusBadge } from '../common/StatusBadge';
import { useHaptics } from '../../hooks/useHaptics';

interface Props {
  pandals: Pandal[];
}

export function FeaturedPandalCarousel({ pandals }: Props) {
  const router = useRouter();
  const haptics = useHaptics();

  const renderItem = ({ item }: { item: Pandal }) => (
    <TouchableOpacity
      onPress={() => {
        haptics.selection();
        router.push(`/pandal/${item.id}`);
      }}
      style={styles.card}
      activeOpacity={0.85}
    >
      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1570700005880-4ecdb8595d4a?auto=format&fit=crop&w=600&q=80' }}
        style={styles.image}
      />

      <View style={styles.cardBody}>
        <View style={styles.badgeRow}>
          <StatusBadge status={item.status} />
          {item.score_breakdown && (
            <View style={styles.scorePill}>
              <Sparkles size={10} color={colors.antiqueGold} />
              <Text style={styles.scoreText}>{item.score_breakdown.editorial_score.toFixed(1)}</Text>
            </View>
          )}
        </View>

        <Text style={styles.title} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.bengaliTitle} numberOfLines={1}>
          {item.name_bn}
        </Text>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <MapPin size={12} color={colors.textSecondary} />
            <Text style={styles.metaText}>{item.area}</Text>
          </View>
          <View style={styles.metaItem}>
            <Train size={12} color={colors.metroBlue} />
            <Text style={styles.metaText}>{item.nearest_metro} ({item.walking_distance}m)</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Featured Pandals</Text>
        <TouchableOpacity
          onPress={() => {
            haptics.selection();
            router.push('/explore');
          }}
        >
          <Text style={styles.seeAllText}>See all ({pandals.length}) &rarr;</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        horizontal
        data={pandals.slice(0, 8)}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  seeAllText: {
    color: colors.antiqueGold,
    fontSize: 12,
    fontWeight: '600',
  },
  listContent: {
    paddingRight: 16,
    gap: 12,
  },
  card: {
    width: 240,
    borderRadius: 18,
    backgroundColor: colors.cardDark,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 120,
    backgroundColor: '#201d36',
  },
  cardBody: {
    padding: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  scorePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(214, 168, 79, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  scoreText: {
    color: colors.softGold,
    fontSize: 10,
    fontWeight: '700',
  },
  title: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  bengaliTitle: {
    color: colors.softGold,
    fontSize: 12,
    marginBottom: 8,
  },
  metaRow: {
    gap: 4,
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
});
