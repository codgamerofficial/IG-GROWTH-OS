// =============================================================================
// RIIQX Add Asset Modal Component
// Multi-Asset Form with Dynamic Fields for Stocks, Mutual Funds, Bonds, FDs & Gold
// =============================================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRiiqx } from '../../context/RiiqxContext';
import { HoldingItem } from '../../services/calculations';
import { lightColors, darkColors } from '../../theme/colors';

interface AddAssetModalProps {
  visible: boolean;
  onClose: () => void;
}

const ASSET_TYPES: Array<{ id: HoldingItem['assetClass']; label: string; icon: string }> = [
  { id: 'indian_stock', label: 'Indian Stock', icon: 'trending-up' },
  { id: 'mutual_fund', label: 'Mutual Fund', icon: 'pie-chart' },
  { id: 'us_stock', label: 'US Equities', icon: 'globe-outline' },
  { id: 'etf', label: 'ETF', icon: 'layers-outline' },
  { id: 'fixed_deposit', label: 'Fixed Deposit', icon: 'shield-checkmark-outline' },
  { id: 'government_bond', label: 'Govt Bond', icon: 'document-text-outline' },
  { id: 'reit', label: 'REIT / InvIT', icon: 'business-outline' },
  { id: 'gold', label: 'Gold Bullion', icon: 'sparkles' },
];

export function AddAssetModal({ visible, onClose }: AddAssetModalProps) {
  const { isDarkMode, addHolding, baseCurrency } = useRiiqx();
  const theme = isDarkMode ? darkColors : lightColors;

  const [assetClass, setAssetClass] = useState<HoldingItem['assetClass']>('indian_stock');
  const [symbol, setSymbol] = useState('');
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [currentPrice, setCurrentPrice] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [maturityDate, setMaturityDate] = useState('');
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');

  // Quick preset shortcuts
  const selectPreset = (s: string, n: string, p: number, ac: HoldingItem['assetClass'], c: 'INR' | 'USD' = 'INR') => {
    setAssetClass(ac);
    setSymbol(s);
    setName(n);
    setBuyPrice(p.toString());
    setCurrentPrice(p.toString());
    setCurrency(c);
  };

  const handleSave = () => {
    const qtyNum = parseFloat(quantity);
    const buyPriceNum = parseFloat(buyPrice);
    const currPriceNum = parseFloat(currentPrice) || buyPriceNum;

    if (!symbol.trim() || !name.trim()) {
      Alert.alert('Required Fields', 'Please specify a symbol and an asset name.');
      return;
    }

    if (isNaN(qtyNum) || qtyNum <= 0) {
      Alert.alert('Invalid Quantity', 'Please enter a valid positive quantity or units.');
      return;
    }

    if (isNaN(buyPriceNum) || buyPriceNum <= 0) {
      Alert.alert('Invalid Price', 'Please enter a valid average purchase price or NAV.');
      return;
    }

    addHolding({
      symbol: symbol.trim().toUpperCase(),
      name: name.trim(),
      assetClass,
      quantity: qtyNum,
      averageBuyPrice: buyPriceNum,
      currentPrice: currPriceNum,
      currency,
      interestRatePct: interestRate ? parseFloat(interestRate) : undefined,
      maturityDate: maturityDate || undefined,
    });

    // Reset and close
    setSymbol('');
    setName('');
    setQuantity('');
    setBuyPrice('');
    setCurrentPrice('');
    setInterestRate('');
    setMaturityDate('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <View style={[styles.sheet, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}>
          {/* Header */}
          <View style={styles.sheetHeader}>
            <View>
              <Text style={[styles.sheetTitle, { color: theme.textPrimary }]}>Add Asset to Portfolio</Text>
              <Text style={[styles.sheetSub, { color: theme.textSecondary }]}>
                Manual tracking works 100% offline without mandatory API links
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={theme.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formScroll} showsVerticalScrollIndicator={false}>
            {/* Asset Class Selector Chips */}
            <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>ASSET CLASS</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
              {ASSET_TYPES.map((type) => {
                const isSelected = assetClass === type.id;
                return (
                  <TouchableOpacity
                    key={type.id}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: isSelected ? theme.primary : isDarkMode ? '#252D3D' : '#F3F4F6',
                        borderColor: isSelected ? theme.primary : theme.cardBorder,
                      },
                    ]}
                    onPress={() => {
                      setAssetClass(type.id);
                      if (type.id === 'us_stock') setCurrency('USD');
                      else setCurrency('INR');
                    }}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={type.icon as any}
                      size={14}
                      color={isSelected ? '#FFFFFF' : theme.textPrimary}
                    />
                    <Text
                      style={[
                        styles.chipText,
                        { color: isSelected ? '#FFFFFF' : theme.textPrimary },
                      ]}
                    >
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Quick Catalog Presets */}
            <View style={styles.presetSection}>
              <Text style={[styles.presetLabel, { color: theme.textMuted }]}>Quick Fill from Verified Catalog:</Text>
              <View style={styles.presetRow}>
                {assetClass === 'indian_stock' && (
                  <>
                    <TouchableOpacity
                      style={[styles.presetTag, { backgroundColor: isDarkMode ? '#2D3748' : '#EDE9FE' }]}
                      onPress={() => selectPreset('RELIANCE', 'Reliance Industries Ltd', 2845.50, 'indian_stock')}
                    >
                      <Text style={[styles.presetTagText, { color: theme.primary }]}>+ RELIANCE</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.presetTag, { backgroundColor: isDarkMode ? '#2D3748' : '#EDE9FE' }]}
                      onPress={() => selectPreset('TCS', 'Tata Consultancy Services', 4120.00, 'indian_stock')}
                    >
                      <Text style={[styles.presetTagText, { color: theme.primary }]}>+ TCS</Text>
                    </TouchableOpacity>
                  </>
                )}
                {assetClass === 'mutual_fund' && (
                  <>
                    <TouchableOpacity
                      style={[styles.presetTag, { backgroundColor: isDarkMode ? '#2D3748' : '#EDE9FE' }]}
                      onPress={() => selectPreset('122639', 'Parag Parikh Flexi Cap Fund', 74.82, 'mutual_fund')}
                    >
                      <Text style={[styles.presetTagText, { color: theme.primary }]}>+ PPFAS Flexi</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.presetTag, { backgroundColor: isDarkMode ? '#2D3748' : '#EDE9FE' }]}
                      onPress={() => selectPreset('118989', 'Nippon India Small Cap', 162.45, 'mutual_fund')}
                    >
                      <Text style={[styles.presetTagText, { color: theme.primary }]}>+ Nippon Small</Text>
                    </TouchableOpacity>
                  </>
                )}
                {assetClass === 'fixed_deposit' && (
                  <TouchableOpacity
                    style={[styles.presetTag, { backgroundColor: isDarkMode ? '#2D3748' : '#EDE9FE' }]}
                    onPress={() => {
                      selectPreset('HDFC_FD_3Y', 'HDFC Bank 3Y Term Deposit', 100000, 'fixed_deposit');
                      setInterestRate('7.30');
                      setQuantity('1');
                      setMaturityDate('2027-04-15');
                    }}
                  >
                    <Text style={[styles.presetTagText, { color: theme.primary }]}>+ HDFC Bank 7.30%</Text>
                  </TouchableOpacity>
                )}
                {assetClass === 'us_stock' && (
                  <TouchableOpacity
                    style={[styles.presetTag, { backgroundColor: isDarkMode ? '#2D3748' : '#EDE9FE' }]}
                    onPress={() => selectPreset('NVDA', 'NVIDIA Corporation', 138.25, 'us_stock', 'USD')}
                  >
                    <Text style={[styles.presetTagText, { color: theme.primary }]}>+ NVDA ($138)</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Inputs */}
            <View style={styles.inputGroup}>
              <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>
                {assetClass === 'mutual_fund' ? 'SCHEME CODE / SYMBOL' : 'SYMBOL / TICKER'}
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: isDarkMode ? '#141821' : '#F9FAFB',
                    borderColor: theme.cardBorder,
                    color: theme.textPrimary,
                  },
                ]}
                placeholder={assetClass === 'mutual_fund' ? 'e.g. 122639' : 'e.g. RELIANCE'}
                placeholderTextColor={theme.textMuted}
                value={symbol}
                onChangeText={setSymbol}
                autoCapitalize="characters"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>ASSET NAME</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: isDarkMode ? '#141821' : '#F9FAFB',
                    borderColor: theme.cardBorder,
                    color: theme.textPrimary,
                  },
                ]}
                placeholder="e.g. Reliance Industries Ltd"
                placeholderTextColor={theme.textMuted}
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.rowInputs}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>
                  {assetClass === 'gold' ? 'QUANTITY (GRAMS)' : 'QUANTITY / UNITS'}
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: isDarkMode ? '#141821' : '#F9FAFB',
                      borderColor: theme.cardBorder,
                      color: theme.textPrimary,
                    },
                  ]}
                  placeholder="e.g. 10"
                  placeholderTextColor={theme.textMuted}
                  value={quantity}
                  onChangeText={setQuantity}
                  keyboardType="numeric"
                />
              </View>

              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>
                  CURRENCY
                </Text>
                <View style={styles.currencyToggleRow}>
                  <TouchableOpacity
                    style={[
                      styles.currencyToggleBtn,
                      currency === 'INR' && { backgroundColor: theme.primary },
                    ]}
                    onPress={() => setCurrency('INR')}
                  >
                    <Text
                      style={[
                        styles.currencyToggleBtnText,
                        { color: currency === 'INR' ? '#FFFFFF' : theme.textPrimary },
                      ]}
                    >
                      ₹ INR
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.currencyToggleBtn,
                      currency === 'USD' && { backgroundColor: theme.primary },
                    ]}
                    onPress={() => setCurrency('USD')}
                  >
                    <Text
                      style={[
                        styles.currencyToggleBtnText,
                        { color: currency === 'USD' ? '#FFFFFF' : theme.textPrimary },
                      ]}
                    >
                      $ USD
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={styles.rowInputs}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>
                  {assetClass === 'mutual_fund' ? 'BUY NAV' : 'AVG BUY PRICE'}
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: isDarkMode ? '#141821' : '#F9FAFB',
                      borderColor: theme.cardBorder,
                      color: theme.textPrimary,
                    },
                  ]}
                  placeholder={currency === 'INR' ? '₹ 0.00' : '$ 0.00'}
                  placeholderTextColor={theme.textMuted}
                  value={buyPrice}
                  onChangeText={setBuyPrice}
                  keyboardType="numeric"
                />
              </View>

              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>CURRENT PRICE</Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: isDarkMode ? '#141821' : '#F9FAFB',
                      borderColor: theme.cardBorder,
                      color: theme.textPrimary,
                    },
                  ]}
                  placeholder={currency === 'INR' ? '₹ 0.00' : '$ 0.00'}
                  placeholderTextColor={theme.textMuted}
                  value={currentPrice}
                  onChangeText={setCurrentPrice}
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Fixed Income specific fields */}
            {['fixed_deposit', 'government_bond', 'corporate_bond'].includes(assetClass) && (
              <View style={styles.rowInputs}>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>INTEREST RATE %</Text>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: isDarkMode ? '#141821' : '#F9FAFB',
                        borderColor: theme.cardBorder,
                        color: theme.textPrimary,
                      },
                    ]}
                    placeholder="e.g. 7.30"
                    placeholderTextColor={theme.textMuted}
                    value={interestRate}
                    onChangeText={setInterestRate}
                    keyboardType="numeric"
                  />
                </View>

                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>MATURITY DATE</Text>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: isDarkMode ? '#141821' : '#F9FAFB',
                        borderColor: theme.cardBorder,
                        color: theme.textPrimary,
                      },
                    ]}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor={theme.textMuted}
                    value={maturityDate}
                    onChangeText={setMaturityDate}
                  />
                </View>
              </View>
            )}

            {/* Action Button */}
            <TouchableOpacity
              style={[styles.submitButton, { backgroundColor: theme.primary }]}
              onPress={handleSave}
              activeOpacity={0.8}
            >
              <Text style={styles.submitButtonText}>Save to Portfolio</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    maxHeight: '90%',
    padding: 20,
    paddingBottom: 32,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  sheetSub: {
    fontSize: 11,
    marginTop: 2,
  },
  closeBtn: {
    padding: 4,
  },
  formScroll: {
    marginBottom: 10,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  chipScroll: {
    marginBottom: 12,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  presetSection: {
    marginBottom: 12,
  },
  presetLabel: {
    fontSize: 11,
    marginBottom: 6,
  },
  presetRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  presetTag: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  presetTagText: {
    fontSize: 11,
    fontWeight: '700',
  },
  inputGroup: {
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 6,
    letterSpacing: 0.4,
  },
  input: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 14,
    fontWeight: '500',
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 12,
  },
  currencyToggleRow: {
    flexDirection: 'row',
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  currencyToggleBtn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  currencyToggleBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  submitButton: {
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 20,
    shadowColor: '#6750D8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
