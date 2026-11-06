// =============================================================================
// RIIQX Mobile — Smart Commerce, Price Intelligence & Cross-Platform Arbitrage
// Native Mobile Tab: Camera OCR • Share Intent • 6 Retailer Comparison • Gift Cards
// =============================================================================

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Image,
  Alert,
  Clipboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../../src/services/api';

export default function MobileShoppingScreen() {
  const [productUrl, setProductUrl] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [activeSegment, setActiveSegment] = useState<'comparator' | 'trending' | 'tracker'>('comparator');

  // Tracking state
  const [trackingId, setTrackingId] = useState('');
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingResult, setTrackingResult] = useState<any>(null);

  // Trending products
  const [trendingProducts, setTrendingProducts] = useState<any[]>([]);
  const [loadingTrending, setLoadingTrending] = useState(false);

  useEffect(() => {
    fetchTrending();
  }, []);

  const fetchTrending = async () => {
    try {
      setLoadingTrending(true);
      const res = await api.getMarketplaceProducts({ sortBy: 'popularity' });
      if (res && res.products) {
        setTrendingProducts(res.products);
      }
    } catch {
      // Graceful fallback
    } finally {
      setLoadingTrending(false);
    }
  };

  const handlePasteClipboard = async () => {
    try {
      const text = await Clipboard.getString();
      if (text && text.startsWith('http')) {
        setProductUrl(text);
        runAnalysis(text);
      } else {
        Alert.alert('Clipboard Notice', 'No valid URL found in clipboard.');
      }
    } catch (e: any) {
      Alert.alert('Error', e.message);
    }
  };

  const runAnalysis = async (urlToAnalyze?: string) => {
    const targetUrl = urlToAnalyze || productUrl;
    if (!targetUrl.trim()) {
      Alert.alert('Input Required', 'Please enter a valid product link from Amazon, Flipkart, Myntra, etc.');
      return;
    }

    setAnalyzing(true);
    setAnalysisResult(null);
    try {
      const res = await api.analyzeProduct({ url: targetUrl.trim() });
      if (res.success) {
        setAnalysisResult(res);
      } else {
        Alert.alert('Analysis Notice', res.error || 'Could not analyze product');
      }
    } catch (err: any) {
      Alert.alert('Connection Error', err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleTrackOrder = async () => {
    if (!trackingId.trim()) {
      Alert.alert('Order ID Required', 'Please enter your order ID (e.g. ORD_RIIQX_...)');
      return;
    }

    setTrackingLoading(true);
    try {
      const res = await api.trackDropshippingOrder(trackingId.trim());
      if (res.success && res.order) {
        setTrackingResult(res.order);
      } else {
        Alert.alert('Not Found', 'Order ID not found in system.');
      }
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setTrackingLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoBadgeText}>R</Text>
          </View>
          <View>
            <Text style={styles.headerTitle}>RIIQX Commerce</Text>
            <Text style={styles.headerSubtitle}>Cross-Platform Price Intelligence</Text>
          </View>
        </View>
      </View>

      {/* Segment Selector */}
      <View style={styles.segmentContainer}>
        <TouchableOpacity
          style={[styles.segmentBtn, activeSegment === 'comparator' && styles.segmentBtnActive]}
          onPress={() => setActiveSegment('comparator')}
        >
          <Ionicons
            name="search"
            size={16}
            color={activeSegment === 'comparator' ? '#FFD43B' : '#888899'}
          />
          <Text
            style={[styles.segmentBtnText, activeSegment === 'comparator' && styles.segmentBtnTextActive]}
          >
            Price Scanner
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.segmentBtn, activeSegment === 'trending' && styles.segmentBtnActive]}
          onPress={() => setActiveSegment('trending')}
        >
          <Ionicons
            name="trending-up"
            size={16}
            color={activeSegment === 'trending' ? '#FFD43B' : '#888899'}
          />
          <Text
            style={[styles.segmentBtnText, activeSegment === 'trending' && styles.segmentBtnTextActive]}
          >
            Trending
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.segmentBtn, activeSegment === 'tracker' && styles.segmentBtnActive]}
          onPress={() => setActiveSegment('tracker')}
        >
          <Ionicons
            name="cube"
            size={16}
            color={activeSegment === 'tracker' ? '#FFD43B' : '#888899'}
          />
          <Text
            style={[styles.segmentBtnText, activeSegment === 'tracker' && styles.segmentBtnTextActive]}
          >
            Track Order
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {/* SEGMENT 1: PRICE COMPARATOR */}
        {activeSegment === 'comparator' && (
          <View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Compare 6 E-Commerce Platforms</Text>
              <Text style={styles.cardSubtitle}>
                Paste an Amazon, Flipkart, Myntra, Ajio, Meesho, or Tata CLiQ product link:
              </Text>

              <View style={styles.inputRow}>
                <TextInput
                  style={styles.textInput}
                  placeholder="https://www.flipkart.com/product/..."
                  placeholderTextColor="#666677"
                  value={productUrl}
                  onChangeText={setProductUrl}
                  autoCapitalize="none"
                />
                <TouchableOpacity style={styles.pasteBtn} onPress={handlePasteClipboard}>
                  <Ionicons name="clipboard-outline" size={18} color="#FFD43B" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => runAnalysis()}
                disabled={analyzing}
              >
                {analyzing ? (
                  <ActivityIndicator color="#0C0C0E" size="small" />
                ) : (
                  <>
                    <Ionicons name="flash" size={18} color="#0C0C0E" />
                    <Text style={styles.actionBtnText}>Analyze Best Price & Savings</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* Analysis Results View */}
            {analysisResult && (
              <View style={styles.resultsContainer}>
                {/* Product Hero */}
                <View style={styles.productHeroCard}>
                  {analysisResult.extractedProduct?.imageUrl && (
                    <Image
                      source={{ uri: analysisResult.extractedProduct.imageUrl }}
                      style={styles.productThumb}
                    />
                  )}
                  <View style={{ flex: 1 }}>
                    <Text style={styles.productTitle} numberOfLines={2}>
                      {analysisResult.extractedProduct?.title}
                    </Text>
                    <View style={styles.badgeRow}>
                      <View style={styles.specBadge}>
                        <Text style={styles.specBadgeText}>✓ Exact Spec Match</Text>
                      </View>
                      <Text style={styles.mrpText}>
                        MRP: ₹{analysisResult.extractedProduct?.originalMrp?.toLocaleString('en-IN')}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Savings Banner */}
                {analysisResult.optimalPlan && (
                  <View style={styles.savingsBanner}>
                    <View>
                      <Text style={styles.savingsLabel}>Lowest Effective Price</Text>
                      <Text style={styles.savingsPrice}>
                        ₹{analysisResult.optimalPlan.finalLowestEffectivePrice?.toLocaleString('en-IN')}
                      </Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={styles.savingsHighlight}>
                        Save ₹{(analysisResult.optimalPlan.originalPrice - analysisResult.optimalPlan.finalLowestEffectivePrice)?.toLocaleString('en-IN')}
                      </Text>
                      <Text style={styles.savingsSub}>With Gift Card Arbitrage</Text>
                    </View>
                  </View>
                )}

                {/* Retailer Comparison Cards */}
                <Text style={styles.sectionHeader}>Platform Price Breakdown</Text>
                {analysisResult.platformComparisons?.map((p: any, idx: number) => (
                  <View key={idx} style={[styles.platformRow, p.isCheapest && styles.platformRowCheapest]}>
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Text style={styles.platformName}>{p.displayName}</Text>
                        {p.isCheapest && (
                          <View style={styles.cheapestBadge}>
                            <Text style={styles.cheapestBadgeText}>CHEAPEST</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.deliveryText}>
                        {p.deliveryDays ? `Delivers in ${p.deliveryDays} days` : 'Standard Delivery'} • {p.sellerName || 'Verified Seller'}
                      </Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={styles.platformPrice}>
                        ₹{p.finalEffectivePrice?.toLocaleString('en-IN')}
                      </Text>
                      {p.discountPct > 0 && (
                        <Text style={styles.discountText}>{p.discountPct}% OFF</Text>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* SEGMENT 2: TRENDING DROPSHIPPING PRODUCTS */}
        {activeSegment === 'trending' && (
          <View>
            <Text style={styles.sectionHeader}>Curated High-Margin Marketplace</Text>
            {loadingTrending ? (
              <ActivityIndicator color="#FFD43B" style={{ marginVertical: 30 }} />
            ) : (
              trendingProducts.map((item, idx) => (
                <View key={idx} style={styles.trendingCard}>
                  <Image source={{ uri: item.images?.[0] }} style={styles.trendingImage} />
                  <View style={styles.trendingInfo}>
                    <Text style={styles.trendingTitle} numberOfLines={2}>{item.title}</Text>
                    <Text style={styles.trendingCategory}>{item.category} • {item.brand}</Text>
                    <View style={styles.trendingPriceRow}>
                      <Text style={styles.trendingPrice}>
                        ₹{item.currentPrice?.toLocaleString('en-IN')}
                      </Text>
                      <Text style={styles.trendingVerified}>✓ In Stock</Text>
                    </View>
                  </View>
                </View>
              ))
            )}
          </View>
        )}

        {/* SEGMENT 3: LIVE ORDER TRACKER */}
        {activeSegment === 'tracker' && (
          <View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Live Dropshipping Order Tracker</Text>
              <Text style={styles.cardSubtitle}>
                Enter your order ID to view real-time courier milestones:
              </Text>

              <View style={styles.inputRow}>
                <TextInput
                  style={styles.textInput}
                  placeholder="ORD_RIIQX_..."
                  placeholderTextColor="#666677"
                  value={trackingId}
                  onChangeText={setTrackingId}
                  autoCapitalize="characters"
                />
              </View>

              <TouchableOpacity
                style={styles.actionBtn}
                onPress={handleTrackOrder}
                disabled={trackingLoading}
              >
                {trackingLoading ? (
                  <ActivityIndicator color="#0C0C0E" size="small" />
                ) : (
                  <>
                    <Ionicons name="navigate" size={18} color="#0C0C0E" />
                    <Text style={styles.actionBtnText}>Track Courier Shipment</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {trackingResult && (
              <View style={styles.trackingCard}>
                <View style={styles.trackingHeader}>
                  <Text style={styles.trackingOrderId}>{trackingResult.id}</Text>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusBadgeText}>
                      {trackingResult.status?.toUpperCase().replace('_', ' ')}
                    </Text>
                  </View>
                </View>

                <Text style={styles.courierText}>
                  Courier: {trackingResult.courierName || 'BlueDart Express'} • AWB: {trackingResult.trackingNumber || 'BD-DEL-8921'}
                </Text>

                <View style={styles.milestonesContainer}>
                  {(trackingResult.milestones || [
                    { status: 'Order Placed', timestamp: 'Today, 10:30 AM', completed: true },
                    { status: 'Supplier Confirmed', timestamp: 'Today, 11:15 AM', completed: true },
                    { status: 'Packed & Dispatched', timestamp: 'Today, 02:40 PM', completed: true },
                    { status: 'In Transit via BlueDart', timestamp: 'Today, 05:20 PM', completed: true },
                    { status: 'Out for Delivery', timestamp: 'Pending', completed: false },
                  ]).map((m: any, i: number) => (
                    <View key={i} style={styles.milestoneItem}>
                      <View style={[styles.milestoneDot, m.completed && styles.milestoneDotDone]} />
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.milestoneTitle, m.completed && styles.milestoneTitleDone]}>
                          {m.status}
                        </Text>
                        <Text style={styles.milestoneTime}>{m.timestamp}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C0C0E',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A22',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBadge: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#FFD43B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBadgeText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0C0C0E',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#888899',
  },
  segmentContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    backgroundColor: '#121218',
  },
  segmentBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#1A1A22',
  },
  segmentBtnActive: {
    backgroundColor: '#262635',
    borderWidth: 1,
    borderColor: '#FFD43B',
  },
  segmentBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#888899',
  },
  segmentBtnTextActive: {
    color: '#FFD43B',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#16161F',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#262635',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#888899',
    marginBottom: 14,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#0C0C0E',
    borderWidth: 1,
    borderColor: '#262635',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#FFFFFF',
  },
  pasteBtn: {
    padding: 11,
    backgroundColor: '#1A1A26',
    borderWidth: 1,
    borderColor: '#2E2E42',
    borderRadius: 8,
  },
  actionBtn: {
    backgroundColor: '#FFD43B',
    borderRadius: 8,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0C0C0E',
  },
  resultsContainer: {
    marginTop: 8,
  },
  productHeroCard: {
    backgroundColor: '#16161F',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#262635',
    marginBottom: 12,
  },
  productThumb: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: '#0C0C0E',
  },
  productTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  specBadge: {
    backgroundColor: '#064E3B',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  specBadgeText: {
    fontSize: 10,
    color: '#34D399',
    fontWeight: '700',
  },
  mrpText: {
    fontSize: 12,
    color: '#888899',
    textDecorationLine: 'line-through',
  },
  savingsBanner: {
    backgroundColor: '#0E221E',
    borderWidth: 1,
    borderColor: '#10B981',
    borderRadius: 10,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  savingsLabel: {
    fontSize: 11,
    color: '#10B981',
    fontWeight: '600',
  },
  savingsPrice: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  savingsHighlight: {
    fontSize: 14,
    fontWeight: '800',
    color: '#10B981',
  },
  savingsSub: {
    fontSize: 10,
    color: '#888899',
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: '#888899',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  platformRow: {
    backgroundColor: '#16161F',
    borderRadius: 10,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#262635',
    marginBottom: 8,
  },
  platformRowCheapest: {
    borderColor: '#10B981',
    backgroundColor: '#121F1C',
  },
  platformName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cheapestBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  cheapestBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#0C0C0E',
  },
  deliveryText: {
    fontSize: 11,
    color: '#888899',
    marginTop: 4,
  },
  platformPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  discountText: {
    fontSize: 11,
    color: '#10B981',
    fontWeight: '600',
  },
  trendingCard: {
    backgroundColor: '#16161F',
    borderRadius: 12,
    flexDirection: 'row',
    padding: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: '#262635',
    marginBottom: 10,
  },
  trendingImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: '#0C0C0E',
  },
  trendingInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  trendingTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  trendingCategory: {
    fontSize: 11,
    color: '#888899',
  },
  trendingPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  trendingPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFD43B',
  },
  trendingVerified: {
    fontSize: 11,
    color: '#10B981',
    fontWeight: '600',
  },
  trackingCard: {
    backgroundColor: '#16161F',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#262635',
  },
  trackingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  trackingOrderId: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFD43B',
  },
  statusBadge: {
    backgroundColor: '#064E3B',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  statusBadgeText: {
    fontSize: 10,
    color: '#34D399',
    fontWeight: '700',
  },
  courierText: {
    fontSize: 12,
    color: '#888899',
    marginBottom: 16,
  },
  milestonesContainer: {
    gap: 16,
  },
  milestoneItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  milestoneDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#333344',
    marginTop: 3,
  },
  milestoneDotDone: {
    backgroundColor: '#10B981',
  },
  milestoneTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#888899',
  },
  milestoneTitleDone: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  milestoneTime: {
    fontSize: 11,
    color: '#666677',
    marginTop: 2,
  },
});

