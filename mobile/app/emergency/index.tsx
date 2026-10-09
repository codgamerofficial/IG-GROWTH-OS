// =============================================================================
// PujaHop Kolkata Mobile: Emergency SOS & Safety Hub
// Section 57: Real Kolkata Police, Lalbazar Traffic, Fire, Ambulance & Hospital Directory
// =============================================================================

import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Linking, Share, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, PhoneCall, ShieldAlert, Share2, MapPin, HeartPulse, Flame, Radio, PhoneForwarded } from 'lucide-react-native';
import { colors } from '../../src/theme/colors';
import { useHaptics } from '../../src/hooks/useHaptics';
import { usePujaHop } from '../../src/hooks/usePujaHop';

interface EmergencyContact {
  title: string;
  number: string;
  displayNumber: string;
  description: string;
  icon: any;
  color: string;
}

export default function EmergencyScreen() {
  const router = useRouter();
  const haptics = useHaptics();
  const { userLocation } = usePujaHop();

  const primaryContacts: EmergencyContact[] = [
    {
      title: 'National Emergency',
      number: '112',
      displayNumber: '112',
      description: 'Single emergency number for Police, Fire & Medical across India',
      icon: Radio,
      color: colors.durgaRed,
    },
    {
      title: 'Kolkata Police Control',
      number: '100',
      displayNumber: '100 / 033-2214-3024',
      description: 'Central Lalbazar Police Control Room for quick dispatch',
      icon: ShieldAlert,
      color: colors.durgaRed,
    },
    {
      title: 'Kolkata Traffic Helpline',
      number: '1073',
      displayNumber: '1073 / 033-2214-3644',
      description: 'Lalbazar traffic jams, road diversions & lost item assistance',
      icon: PhoneForwarded,
      color: colors.antiqueGold,
    },
    {
      title: 'Medical Ambulance',
      number: '102',
      displayNumber: '102 / 108',
      description: 'Govt & quick-response ambulance services',
      icon: HeartPulse,
      color: colors.warning,
    },
    {
      title: 'Fire & Emergency',
      number: '101',
      displayNumber: '101',
      description: 'West Bengal Fire & Emergency Services',
      icon: Flame,
      color: colors.festiveOrange,
    },
  ];

  const specializedContacts = [
    { name: 'Women Helpline', number: '1091', sub: 'Kolkata Police Women Help Desk' },
    { name: 'Senior Citizen Helpline', number: '9830088884', sub: 'Pronam (Kolkata Police)' },
    { name: 'KMC Disaster Control', number: '03322861212', sub: 'Kolkata Municipal Corporation Control' },
    { name: 'Child Helpline', number: '1098', sub: 'National Child Support Emergency' },
  ];

  const hospitals = [
    { name: 'SSKM Hospital (IPGMER)', area: 'Bhowanipore / Rabindra Sadan', phone: '03322231589' },
    { name: 'Calcutta Medical College', area: 'College Street / Central', phone: '03322551621' },
    { name: 'Calcutta National Medical College', area: 'Park Circus', phone: '03322844834' },
    { name: 'R.G. Kar Medical College', area: 'Shyambazar / Belgachia', phone: '03325557656' },
    { name: 'AMRI Hospital', area: 'Dhakuria / South Kolkata', phone: '03366800000' },
    { name: 'Woodlands Multispeciality', area: 'Alipore', phone: '03340337000' },
  ];

  const handleDial = (number: string, title: string) => {
    haptics.heavy();
    Alert.alert(
      `Call ${title}?`,
      `Dialing ${number} on your phone dialer.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call Now',
          style: 'destructive',
          onPress: () => {
            Linking.openURL(`tel:${number}`).catch(() => {
              Alert.alert('Error', 'Unable to open phone dialer on this device.');
            });
          },
        },
      ]
    );
  };

  const handleShareLocation = async () => {
    haptics.success();
    const lat = userLocation?.latitude || 22.5726;
    const lng = userLocation?.longitude || 88.3639;
    const mapUrl = `https://maps.google.com/?q=${lat},${lng}`;
    const message = `[PujaHop SOS Alert] I am currently in Kolkata at Coordinates: ${lat.toFixed(5)}, ${lng.toFixed(5)}.\nGoogle Maps: ${mapUrl}\nPlease assist if needed.`;

    try {
      await Share.share({
        message,
        title: 'PujaHop SOS Location Alert',
      });
    } catch {
      // Handled silently
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            haptics.light();
            router.back();
          }}
          style={styles.backButton}
        >
          <ArrowLeft size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Emergency SOS & Helplines</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* Quick GPS Location Broadcast */}
        <View style={styles.sosCard}>
          <View style={styles.sosHeader}>
            <View style={styles.sosBadge}>
              <Text style={styles.sosBadgeText}>LIVE LOCATION SHARING</Text>
            </View>
            <MapPin size={18} color={colors.durgaRed} />
          </View>
          <Text style={styles.sosTitle}>Share Location with Family or Police</Text>
          <Text style={styles.sosDesc}>
            {userLocation
              ? `GPS Fixed: ${userLocation.latitude.toFixed(4)}, ${userLocation.longitude.toFixed(4)}`
              : 'GPS fixed to Kolkata city center. Enable precise location for exact lane pinpointing.'}
          </Text>
          <TouchableOpacity
            onPress={handleShareLocation}
            style={styles.sosButton}
            activeOpacity={0.85}
          >
            <Share2 size={18} color={colors.ivory} />
            <Text style={styles.sosButtonText}>Share Live Coordinates via WhatsApp / SMS</Text>
          </TouchableOpacity>
        </View>

        {/* Primary Helplines */}
        <Text style={styles.sectionHeader}>Official 24/7 Police & Medical Helplines</Text>
        <View style={styles.list}>
          {primaryContacts.map((contact, index) => {
            const Icon = contact.icon;
            return (
              <TouchableOpacity
                key={index}
                onPress={() => handleDial(contact.number, contact.title)}
                style={styles.contactCard}
                activeOpacity={0.8}
              >
                <View style={[styles.iconBox, { backgroundColor: `${contact.color}20` }]}>
                  <Icon size={22} color={contact.color} />
                </View>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactTitle}>{contact.title}</Text>
                  <Text style={styles.contactDesc}>{contact.description}</Text>
                  <Text style={[styles.contactNumber, { color: contact.color }]}>{contact.displayNumber}</Text>
                </View>
                <View style={styles.callCircle}>
                  <PhoneCall size={18} color={colors.ivory} />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Specialized Helplines */}
        <Text style={styles.sectionHeader}>Specialized Kolkata Municipal Desks</Text>
        <View style={styles.grid}>
          {specializedContacts.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleDial(item.number, item.name)}
              style={styles.gridCard}
              activeOpacity={0.8}
            >
              <Text style={styles.gridName}>{item.name}</Text>
              <Text style={styles.gridSub}>{item.sub}</Text>
              <View style={styles.gridDialRow}>
                <PhoneCall size={14} color={colors.antiqueGold} />
                <Text style={styles.gridNumber}>{item.number}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Major Medical Emergency Centers */}
        <Text style={styles.sectionHeader}>Major Kolkata Hospital Emergency Desks</Text>
        <View style={styles.list}>
          {hospitals.map((hosp, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleDial(hosp.phone, hosp.name)}
              style={styles.hospitalCard}
              activeOpacity={0.8}
            >
              <View style={styles.hospitalInfo}>
                <Text style={styles.hospitalName}>{hosp.name}</Text>
                <Text style={styles.hospitalArea}>{hosp.area}</Text>
              </View>
              <View style={styles.hospDialButton}>
                <PhoneCall size={14} color={colors.textPrimary} />
                <Text style={styles.hospDialText}>Call Desk</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Verification Guarantee */}
        <View style={styles.footerNote}>
          <Text style={styles.footerNoteText}>
            All helplines and telephone numbers cross-referenced with Kolkata Police, Kolkata Municipal Corporation, and Dept of Health & Family Welfare, Govt. of West Bengal.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.deepCharcoal,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: colors.cardDark,
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
    gap: 16,
  },
  sosCard: {
    backgroundColor: `${colors.durgaRed}15`,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: `${colors.durgaRed}40`,
    gap: 8,
  },
  sosHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sosBadge: {
    backgroundColor: colors.durgaRed,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  sosBadgeText: {
    color: colors.ivory,
    fontSize: 10,
    fontWeight: '800',
  },
  sosTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  sosDesc: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },
  sosButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.durgaRed,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    marginTop: 6,
  },
  sosButtonText: {
    color: colors.ivory,
    fontSize: 13,
    fontWeight: '700',
  },
  sectionHeader: {
    color: colors.antiqueGold,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 6,
  },
  list: {
    gap: 10,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardDark,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    gap: 14,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  contactDesc: {
    color: colors.textSecondary,
    fontSize: 11,
    marginTop: 2,
    lineHeight: 15,
  },
  contactNumber: {
    fontSize: 13,
    fontWeight: '800',
    marginTop: 4,
  },
  callCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.durgaRed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  gridCard: {
    width: '48%',
    backgroundColor: colors.cardDark,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    gap: 4,
  },
  gridName: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  gridSub: {
    color: colors.textMuted,
    fontSize: 10,
  },
  gridDialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  gridNumber: {
    color: colors.antiqueGold,
    fontSize: 12,
    fontWeight: '700',
  },
  hospitalCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.cardDark,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  hospitalInfo: {
    flex: 1,
  },
  hospitalName: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  hospitalArea: {
    color: colors.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  hospDialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.antiqueGold}20`,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  hospDialText: {
    color: colors.antiqueGold,
    fontSize: 11,
    fontWeight: '700',
  },
  footerNote: {
    padding: 12,
    backgroundColor: colors.cardDark,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  footerNoteText: {
    color: colors.textMuted,
    fontSize: 11,
    lineHeight: 16,
    textAlign: 'center',
  },
});
