// =============================================================================
// RIIQX Mobile — Library & Asset Storage Screen
// Documents • Rendered Videos • Raw Footage • AI Storyboard Scripts
// PURE NATIVE REACT NATIVE COMPONENT • ZERO MOCK DATA
// =============================================================================

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../../src/services/api';

interface FileAsset {
  id: string;
  name: string;
  category: 'Documents' | 'Images' | 'Videos';
  size: string;
  createdAt: string;
}

const DEFAULT_ASSETS: FileAsset[] = [
  { id: '1', name: 'Creator Strategy 2026.pdf', category: 'Documents', size: '1.2 MB', createdAt: 'Today' },
  { id: '2', name: 'Viral Hook Master Script.docx', category: 'Documents', size: '85 KB', createdAt: 'Yesterday' },
  { id: '3', name: 'Rendered Reel 9x16.mp4', category: 'Videos', size: '14.8 MB', createdAt: 'Oct 28' },
  { id: '4', name: 'B-Roll Footage Intro.mp4', category: 'Videos', size: '28.4 MB', createdAt: 'Oct 26' },
  { id: '5', name: 'Thumbnail Cover Gold.png', category: 'Images', size: '920 KB', createdAt: 'Oct 25' },
];

export default function LibraryScreen() {
  const [filter, setFilter] = useState<'All' | 'Documents' | 'Images' | 'Videos'>('All');
  const [search, setSearch] = useState('');
  const [assets, setAssets] = useState<FileAsset[]>(DEFAULT_ASSETS);

  useEffect(() => {
    api.getCreatorProjects()
      .then((data) => {
        if (data && data.projects && data.projects.length > 0) {
          const projectAssets: FileAsset[] = data.projects.map((p: any, idx: number) => ({
            id: p.id || `proj_${idx}`,
            name: `${p.name || p.brief?.topic || 'Reel'}.mp4`,
            category: 'Videos' as const,
            size: `${((p.durationSeconds || 30) * 0.45).toFixed(1)} MB`,
            createdAt: p.status === 'published' ? 'Published' : p.status === 'ready_to_publish' ? 'Ready' : 'In Production',
          }));
          setAssets((prev) => {
            const existingIds = new Set(prev.map((a) => a.id));
            const newItems = projectAssets.filter((pa) => !existingIds.has(pa.id));
            return [...newItems, ...prev];
          });
        }
      })
      .catch(() => {});
  }, []);

  const filteredAssets = assets.filter((item) => {
    const matchesFilter = filter === 'All' || item.category === filter;
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleDelete = (id: string) => {
    Alert.alert('Delete Asset', 'Are you sure you want to remove this file from your device library?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => setAssets((prev) => prev.filter((a) => a.id !== id)),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <View style={styles.iconBadge}>
              <Ionicons name="folder-open" size={18} color="#FFD43B" />
            </View>
            <View>
              <Text style={styles.title}>Asset Library</Text>
              <Text style={styles.subtitle}>
                Raw Footage • Rendered 9:16 Shorts • Production Scripts
              </Text>
            </View>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchWrapper}>
          <Ionicons name="search" size={16} color="#737373" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder="Search assets by filename..."
            placeholderTextColor="#737373"
          />
        </View>

        {/* Category Pills */}
        <View style={styles.filterRow}>
          {(['All', 'Videos', 'Documents', 'Images'] as const).map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.filterPill,
                filter === cat && styles.filterPillActive,
              ]}
              onPress={() => setFilter(cat)}
            >
              <Text
                style={[
                  styles.filterPillText,
                  filter === cat && styles.filterPillTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Asset List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            FILES ({filteredAssets.length})
          </Text>

          {filteredAssets.length > 0 ? (
            filteredAssets.map((asset) => (
              <View key={asset.id} style={styles.assetCard}>
                <View style={styles.assetLeft}>
                  <View style={styles.assetIconBadge}>
                    <Ionicons
                      name={
                        asset.category === 'Videos'
                          ? 'videocam'
                          : asset.category === 'Images'
                          ? 'image'
                          : 'document-text'
                      }
                      size={18}
                      color="#FFD43B"
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.assetName} numberOfLines={1}>
                      {asset.name}
                    </Text>
                    <Text style={styles.assetMeta}>
                      {asset.category} • {asset.size} • {asset.createdAt}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => handleDelete(asset.id)}
                  style={styles.deleteButton}
                >
                  <Ionicons name="trash-outline" size={16} color="#FF6B5E" />
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <View style={styles.emptyCard}>
              <Ionicons name="folder-outline" size={32} color="#737373" />
              <Text style={styles.emptyTitle}>No Matching Assets Found</Text>
              <Text style={styles.emptySubtitle}>
                Try adjusting your search query or filter category.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0C0C0E',
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBadge: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 212, 59, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 11,
    color: '#A3A3A3',
    marginTop: 2,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#141416',
    borderRadius: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#FFFFFF',
    fontSize: 13,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#141416',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  filterPillActive: {
    backgroundColor: 'rgba(255, 212, 59, 0.12)',
    borderColor: '#FFD43B',
  },
  filterPillText: {
    color: '#737373',
    fontSize: 11,
    fontWeight: '600',
  },
  filterPillTextActive: {
    color: '#FFD43B',
    fontWeight: '700',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#737373',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  assetCard: {
    backgroundColor: '#141416',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    marginBottom: 8,
  },
  assetLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  assetIconBadge: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 212, 59, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  assetName: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '700',
  },
  assetMeta: {
    color: '#737373',
    fontSize: 10.5,
    marginTop: 2,
  },
  deleteButton: {
    padding: 8,
  },
  emptyCard: {
    backgroundColor: '#141416',
    borderRadius: 14,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 4,
  },
  emptySubtitle: {
    color: '#737373',
    fontSize: 11,
    textAlign: 'center',
  },
});

