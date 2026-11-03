// =============================================================================
// RIIQX Mobile 2.0 — Master Creator Home Dashboard (Production Core)
// Matches Web Dashboard Reference Exactly
// AI CREATOR OS • PRODUCTION CORE • Yellow #FFD43B + Obsidian #0C0C0E
// =============================================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  StyleSheet,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useRiiqxMobile } from '../../src/context/RiiqxMobileContext';

export default function MobileHomeScreen() {
  const router = useRouter();
  const {
    sendMessage,
    isGenerating,
    autopilotQueue,
    emergencyStop,
    toggleEmergencyStop,
    refreshAll,
    selectedModel,
    dashboardMetrics,
    isBackendConnected,
    apiBaseUrl,
  } = useRiiqxMobile();

  const [promptInput, setPromptInput] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshAll();
    setTimeout(() => setRefreshing(false), 500);
  };

  const handleDispatchGoal = () => {
    if (!promptInput.trim()) return;
    const text = promptInput.trim();
    setPromptInput('');
    sendMessage(text);
    router.push('/(tabs)/chat' as any);
  };

  const sidebarNavItems = [
    { title: 'Dashboard', icon: 'grid', route: '/(tabs)', active: true },
    { title: 'AI Agent Chat', icon: 'chatbubbles-outline', route: '/(tabs)/chat' },
    { title: 'Creator Studio', icon: 'videocam-outline', route: '/(tabs)/creator' },
    { title: 'AI Video Editor', icon: 'color-wand-outline', route: '/(tabs)/studio' },
    { title: 'Autopilot Center', icon: 'flash-outline', route: '/(tabs)/autopilot' },
    { title: 'Task Planner', icon: 'checkbox-outline', route: '/(tabs)/tasks' },
    { title: 'Deep Research', icon: 'search-outline', route: '/(tabs)/research' },
    { title: 'Code Studio', icon: 'code-slash-outline', route: '/(tabs)/code' },
    { title: 'Integrations', icon: 'git-network-outline', route: '/(tabs)/integrations' },
    { title: 'Analytics & Growth', icon: 'bar-chart-outline', route: '/(tabs)/analytics' },
    { title: 'Library', icon: 'folder-outline', route: '/(tabs)/library' },
    { title: 'Settings', icon: 'settings-outline', route: '/(tabs)/settings' },
  ];

  const workflows = [
    {
      title: 'Creator Studio',
      desc: '14-stage 9:16 Shorts & Reels production...',
      icon: 'videocam',
      color: '#FFD43B',
      route: '/(tabs)/creator',
    },
    {
      title: 'AI Video Editor',
      desc: 'Multi-track timeline, kinetic captions &...',
      icon: 'color-wand',
      color: '#FF6B5E',
      route: '/(tabs)/studio',
    },
    {
      title: 'AI Agent Chat',
      desc: 'Autonomous multi-model intelligence &...',
      icon: 'chatbubble-ellipses',
      color: '#FFD43B',
      route: '/(tabs)/chat',
    },
    {
      title: 'Autopilot Center',
      desc: 'Autonomous 12-state queue, scheduler &...',
      icon: 'time',
      color: '#FF6B5E',
      route: '/(tabs)/autopilot',
    },
    {
      title: 'Deep Research',
      desc: 'Fact-checked citations, viral hook...',
      icon: 'globe',
      color: '#10B981',
      route: '/(tabs)/research',
    },
    {
      title: 'Task Planner',
      desc: 'Goal decomposition & production...',
      icon: 'calendar',
      color: '#F59E0B',
      route: '/(tabs)/tasks',
    },
  ];

  const recentProjects = dashboardMetrics.recentProjects;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Top Global Command Bar matching Web Header Parity */}
      <View style={styles.topGlobalBar}>
        <TouchableOpacity
          style={styles.brandMenuBtn}
          onPress={() => setSidebarOpen(true)}
          activeOpacity={0.7}
        >
          <View style={styles.brandIconSquare}>
            <Text style={styles.brandLetter}>R</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.globalSearchBox}
          activeOpacity={0.8}
          onPress={() => router.push('/(tabs)/tasks' as any)}
        >
          <Ionicons name="search" size={13} color="#737373" />
          <Text style={styles.globalSearchPlaceholder} numberOfLines={1}>
            Search tasks, videos, scripts...
          </Text>
          <View style={styles.cmdKeyBadge}>
            <Text style={styles.cmdKeyText}>⌘K</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.topRightControls}>
          <TouchableOpacity
            style={styles.companionButton}
            onPress={() => router.push('/(tabs)/chat' as any)}
            activeOpacity={0.8}
          >
            <Ionicons name="sparkles" size={11} color="#FFD43B" />
            <Text style={styles.companionText}>Companion</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconCircleButton}
            onPress={() => router.push('/(tabs)/settings' as any)}
          >
            <Ionicons name="sunny-outline" size={14} color="#A1A1AA" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconCircleButton}
            onPress={() => router.push('/(tabs)/autopilot' as any)}
          >
            <Ionicons name="notifications-outline" size={14} color="#A1A1AA" />
            <View style={styles.notificationDot} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.avatarCircle}
            onPress={() => router.push('/(tabs)/settings' as any)}
          >
            <Text style={styles.avatarLetter}>S</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFD43B" />}
      >
        {/* Top Header */}
        <View style={styles.header}>
          <View style={styles.headerTitleRow}>
            <View style={{ flex: 1, paddingRight: 8 }}>
              <Text style={styles.badgeText}>AI CREATOR OS • PRODUCTION CORE</Text>
              <Text style={styles.titleText}>Welcome to RIIQX</Text>
              <Text style={styles.subtitleText}>
                Autonomous vertical video production, multi-model AI routing, and social growth.
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => router.push('/(tabs)/creator' as any)}
              style={styles.newProjectButton}
              activeOpacity={0.85}
            >
              <Ionicons name="add" size={16} color="#0C0C0E" />
              <Text style={styles.newProjectText}>+ New Video Project</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Intelligence Orb & Dispatch Card */}
        <View style={styles.orbCard}>
          <View style={styles.orbRow}>
            {/* 3D Glowing Gradient Orb simulation */}
            <View style={styles.orbContainer}>
              <View style={styles.orbGlow} />
              <View style={styles.orbCore} />
            </View>

            <View style={{ flex: 1, gap: 2 }}>
              <View style={styles.coreTagRow}>
                <Text style={styles.coreTagText}>RIIQX INTELLIGENCE CORE</Text>
                <View style={styles.greenPulseDot} />
              </View>
              <Text style={styles.coreTitle}>Ready to generate, research, or publish.</Text>
              <Text style={styles.coreDesc}>
                State any goal to dispatch across AWS Bedrock, Groq, YouTube Data API, or Meta Graph API v26.0.
              </Text>
            </View>
          </View>

          {/* Goal Dispatcher Bar */}
          <View style={styles.dispatchBar}>
            <TextInput
              value={promptInput}
              onChangeText={setPromptInput}
              placeholder="Type a goal (e.g., 'Plan 3 viral reels')..."
              placeholderTextColor="#737373"
              style={styles.dispatchInput}
              onSubmitEditing={handleDispatchGoal}
            />
            <TouchableOpacity
              onPress={handleDispatchGoal}
              disabled={isGenerating || !promptInput.trim()}
              style={[styles.dispatchButton, !promptInput.trim() && styles.dispatchButtonDisabled]}
            >
              {isGenerating ? (
                <ActivityIndicator size="small" color="#0C0C0E" />
              ) : (
                <Text style={styles.dispatchButtonText}>Dispatch</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* 4 Activity Metric Cards */}
        <View style={styles.metricGrid}>
          {/* Card 1: Active Projects */}
          <View style={styles.metricCard}>
            <View style={styles.metricTopRow}>
              <Text style={styles.metricLabel}>Active Projects</Text>
              <View style={[styles.metricIconBox, { backgroundColor: 'rgba(255, 212, 59, 0.2)' }]}>
                <Ionicons name="videocam" size={14} color="#FFD43B" />
              </View>
            </View>
            <Text style={styles.metricValue}>{dashboardMetrics.activeProjectsCount}</Text>
            <Text style={[styles.metricSub, { color: '#10B981' }]}>Creator Studio Workspace</Text>
          </View>

          {/* Card 2: AI Conversations */}
          <View style={styles.metricCard}>
            <View style={styles.metricTopRow}>
              <Text style={styles.metricLabel}>AI Conversations</Text>
              <View style={[styles.metricIconBox, { backgroundColor: 'rgba(255, 107, 94, 0.2)' }]}>
                <Ionicons name="chatbubble" size={14} color="#FF6B5E" />
              </View>
            </View>
            <Text style={styles.metricValue}>{dashboardMetrics.conversationsCount}</Text>
            <Text style={styles.metricSub}>Active thread memories</Text>
          </View>

          {/* Card 3: AI Runtimes */}
          <View style={styles.metricCard}>
            <View style={styles.metricTopRow}>
              <Text style={styles.metricLabel}>AI Runtimes</Text>
              <View style={[styles.metricIconBox, { backgroundColor: 'rgba(16, 185, 129, 0.2)' }]}>
                <Ionicons name="hardware-chip" size={14} color="#10B981" />
              </View>
            </View>
            <Text style={[styles.metricValue, { color: '#10B981', fontSize: 20 }]}>
              5 Providers
            </Text>
            <Text style={styles.metricSub} numberOfLines={2}>
              Google Gemini, Groq, OpenRouter, Cohere, Bedrock
            </Text>
          </View>

          {/* Card 4: Social Autopilot */}
          <View style={styles.metricCard}>
            <View style={styles.metricTopRow}>
              <Text style={styles.metricLabel}>Social Autopilot</Text>
              <View style={[styles.metricIconBox, { backgroundColor: 'rgba(245, 158, 11, 0.2)' }]}>
                <Ionicons name="share-social" size={14} color="#F59E0B" />
              </View>
            </View>
            <Text style={styles.metricValue}>Level 3</Text>
            <Text style={[styles.metricSub, { color: '#10B981' }]}>
              Autonomous with safety gating
            </Text>
          </View>
        </View>

        {/* Section: Production Workflows */}
        <Text style={styles.sectionHeading}>Production Workflows</Text>
        <View style={styles.workflowGrid}>
          {workflows.map((wf, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => router.push(wf.route as any)}
              activeOpacity={0.8}
              style={styles.workflowCard}
            >
              <View style={[styles.workflowIconBox, { backgroundColor: `${wf.color}20` }]}>
                <Ionicons name={wf.icon as any} size={18} color={wf.color} />
              </View>
              <Text style={styles.workflowTitle}>{wf.title}</Text>
              <Text style={styles.workflowDesc} numberOfLines={2}>
                {wf.desc}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Section: Recent Creator Projects */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeading}>Recent Creator Projects</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/creator' as any)}>
            <Text style={styles.linkText}>Open Studio ↗</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.projectsStack}>
          {recentProjects && recentProjects.length > 0 ? (
            recentProjects.slice(0, 3).map((proj: any, pIdx: number) => {
              const topic = proj.brief?.topic || proj.name || proj.title || 'Autonomous Video Reel';
              const niche = proj.brief?.niche || proj.niche || 'TECH & AI';
              const duration = proj.brief?.durationSeconds || proj.durationSeconds || 30;
              const rawStatus = proj.status || 'ready_to_publish';
              const isReady = rawStatus === 'ready_to_publish';
              const isFailed = rawStatus === 'failed';
              const isPublished = rawStatus === 'published';
              const statusColor = isPublished ? '#10B981' : isFailed ? '#EF4444' : '#FFD43B';
              const displayStatus = isReady ? 'Ready_to_publish' : isFailed ? 'Failed' : isPublished ? 'Published' : rawStatus;

              return (
                <View key={proj.id || pIdx} style={styles.projectCard}>
                  <View style={styles.projectHeaderRow}>
                    <Text style={styles.projectNiche}>{niche.toUpperCase()}</Text>
                    <View style={[styles.projectStatusBadge, { backgroundColor: `${statusColor}20`, borderColor: `${statusColor}40`, borderWidth: 1 }]}>
                      <Text style={[styles.projectStatusText, { color: statusColor }]}>
                        {displayStatus}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.projectTitle} numberOfLines={2}>{topic}</Text>

                  <View style={styles.projectFooterRow}>
                    <Text style={styles.projectDuration}>Duration: {duration}s</Text>
                    <TouchableOpacity
                      onPress={() => router.push('/(tabs)/studio' as any)}
                      style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
                    >
                      <Text style={[styles.editInStudioText, { color: '#FFFFFF', fontWeight: '700' }]}>Edit in Studio</Text>
                      <Ionicons name="chevron-forward" size={12} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          ) : (
            <View style={[styles.projectCard, { alignItems: 'center', paddingVertical: 24, gap: 6 }]}>
              <Ionicons name="film-outline" size={28} color="#737373" />
              <Text style={[styles.projectTitle, { textAlign: 'center', fontSize: 13, color: '#A1A1AA', marginTop: 4 }]}>
                No Active Video Projects Yet
              </Text>
              <Text style={{ fontSize: 11, color: '#737373', textAlign: 'center', maxWidth: 280, lineHeight: 16 }}>
                State a goal above or tap &apos;New Video Project&apos; to generate your first Shorts or Reels storyboard.
              </Text>
              <TouchableOpacity
                onPress={() => router.push('/(tabs)/creator' as any)}
                style={{
                  marginTop: 10,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 12,
                  backgroundColor: '#FFD43B',
                }}
              >
                <Text style={{ color: '#0C0C0E', fontSize: 12, fontWeight: '700' }}>Create Video Reel</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Bottom Section: Social Connectors & AI Engine Health */}
        <View style={styles.doubleCardsRow}>
          {/* Social Channel Connectors */}
          <View style={styles.bottomCard}>
            <View style={styles.bottomCardHeader}>
              <Text style={styles.bottomCardTitle}>Social Channel Connectors</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/settings' as any)}>
                <Text style={styles.bottomCardLink}>Manage</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.connectorItem}>
              <View style={styles.connectorIconBox}>
                <Ionicons name="logo-youtube" size={16} color="#EF4444" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.connectorName}>YouTube Shorts</Text>
                <Text style={styles.connectorSub}>Data API v3 Authorized</Text>
              </View>
              <View style={styles.connectedBadge}>
                <Text style={styles.connectedBadgeText}>Connected</Text>
              </View>
            </View>

            <View style={[styles.connectorItem, { borderBottomWidth: 0 }]}>
              <View style={styles.connectorIconBox}>
                <Ionicons name="logo-instagram" size={16} color="#E1306C" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.connectorName}>Instagram Reels</Text>
                <Text style={styles.connectorSub}>Meta Graph API v26.0</Text>
              </View>
              <View style={styles.connectedBadge}>
                <Text style={styles.connectedBadgeText}>Connected</Text>
              </View>
            </View>
          </View>

          {/* AI Engine Health */}
          <View style={styles.bottomCard}>
            <View style={styles.bottomCardHeader}>
              <Text style={styles.bottomCardTitle}>AI Engine Health</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/settings' as any)}>
                <Text style={styles.bottomCardLink}>Settings</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.connectorItem}>
              <View style={styles.connectorIconBox}>
                <Ionicons name="hardware-chip-outline" size={16} color="#10B981" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.connectorName}>AWS Bedrock Runtime</Text>
                <Text style={styles.connectorSub}>ap-southeast-2 • Claude 3.7</Text>
              </View>
              <View style={styles.connectedBadge}>
                <Text style={styles.connectedBadgeText}>Online Live</Text>
              </View>
            </View>

            <View style={[styles.connectorItem, { borderBottomWidth: 0 }]}>
              <View style={styles.connectorIconBox}>
                <Ionicons name="flash-outline" size={16} color="#FFD43B" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.connectorName}>Groq LPU Free Tier</Text>
                <Text style={styles.connectorSub}>Qwen 3.8 27B • ~460ms</Text>
              </View>
              <View style={styles.connectedBadge}>
                <Text style={styles.connectedBadgeText}>Active</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* RIIQX Master Sidebar Drawer Modal */}
      <Modal
        visible={sidebarOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSidebarOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.drawerSheet}>
            {/* Drawer Header */}
            <View style={styles.drawerHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View style={styles.brandIconSquare}>
                  <Text style={styles.brandLetter}>R</Text>
                </View>
                <View>
                  <Text style={styles.drawerBrandTitle}>RIIQX</Text>
                  <Text style={styles.drawerBrandSubtitle}>Creator OS • AI Agent</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => setSidebarOpen(false)} style={styles.closeDrawerBtn}>
                <Ionicons name="close" size={20} color="#A1A1AA" />
              </TouchableOpacity>
            </View>

            {/* Navigation List */}
            <ScrollView style={{ flex: 1, marginTop: 12 }}>
              {sidebarNavItems.map((item, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => {
                    setSidebarOpen(false);
                    router.push(item.route as any);
                  }}
                  style={[
                    styles.drawerNavItem,
                    item.active && styles.drawerNavItemActive,
                  ]}
                >
                  <Ionicons
                    name={item.icon as any}
                    size={18}
                    color={item.active ? '#0C0C0E' : '#A1A1AA'}
                  />
                  <Text
                    style={[
                      styles.drawerNavText,
                      item.active && styles.drawerNavTextActive,
                    ]}
                  >
                    {item.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* User Status Footer Badge */}
            <View style={styles.drawerFooter}>
              <View style={styles.userStatusRow}>
                <View style={styles.footerAvatarSquare}>
                  <Text style={styles.footerAvatarLetter}>R</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={styles.footerUserName}>RIIQX Studio</Text>
                    <View style={styles.proPill}>
                      <Text style={styles.proPillText}>PRO</Text>
                    </View>
                  </View>
                  <Text style={styles.footerUserSub}>Autonomous Core • Active</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0C0C0E',
  },
  topGlobalBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    backgroundColor: '#0C0C0E',
    gap: 8,
  },
  brandMenuBtn: {
    padding: 2,
  },
  brandIconSquare: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#FFD43B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandLetter: {
    color: '#0C0C0E',
    fontWeight: '900',
    fontSize: 14,
  },
  globalSearchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#141418',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  globalSearchPlaceholder: {
    color: '#737373',
    fontSize: 11,
    flex: 1,
  },
  cmdKeyBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  cmdKeyText: {
    color: '#A1A1AA',
    fontSize: 9,
    fontWeight: '700',
  },
  topRightControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  companionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 212, 59, 0.15)',
    borderColor: 'rgba(255, 212, 59, 0.3)',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  companionText: {
    color: '#FFD43B',
    fontSize: 10,
    fontWeight: '700',
  },
  iconCircleButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#141418',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 4,
    right: 5,
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#EF4444',
  },
  avatarCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F97316',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 12,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  drawerSheet: {
    backgroundColor: '#141418',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 32,
    maxHeight: '80%',
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  drawerBrandTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  drawerBrandSubtitle: {
    color: '#A1A1AA',
    fontSize: 10,
    fontWeight: '600',
  },
  closeDrawerBtn: {
    padding: 6,
  },
  drawerNavItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 11,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginBottom: 2,
  },
  drawerNavItemActive: {
    backgroundColor: '#FFD43B',
  },
  drawerNavText: {
    color: '#A1A1AA',
    fontSize: 13,
    fontWeight: '600',
  },
  drawerNavTextActive: {
    color: '#0C0C0E',
    fontWeight: '800',
  },
  drawerFooter: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  userStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#1C1C20',
    padding: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  footerAvatarSquare: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F97316',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerAvatarLetter: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 14,
  },
  footerUserName: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  proPill: {
    backgroundColor: 'rgba(255, 212, 59, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
  },
  proPillText: {
    color: '#FFD43B',
    fontSize: 9,
    fontWeight: '900',
  },
  footerUserSub: {
    color: '#10B981',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 40,
    gap: 18,
  },
  header: {
    gap: 12,
  },
  badgeText: {
    color: '#A1A1AA',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  freeTierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  freeTierText: {
    color: '#10B981',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  titleText: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.5,
    marginTop: 2,
  },
  subtitleText: {
    color: '#A1A1AA',
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2,
  },
  newProjectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FFD43B',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 14,
    alignSelf: 'flex-start',
  },
  newProjectText: {
    color: '#0C0C0E',
    fontSize: 12,
    fontWeight: '800',
  },
  orbCard: {
    backgroundColor: 'rgba(20, 20, 24, 0.9)',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    gap: 14,
  },
  orbRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  orbContainer: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  orbGlow: {
    position: 'absolute',
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFD43B',
    opacity: 0.25,
  },
  orbCore: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FF9F43',
    borderWidth: 2,
    borderColor: '#FFD43B',
  },
  coreTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  coreTagText: {
    color: '#FFD43B',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  greenPulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  coreTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  coreDesc: {
    color: '#A1A1AA',
    fontSize: 10,
    lineHeight: 14,
  },
  dispatchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C20',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  dispatchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 12,
    paddingVertical: 8,
  },
  dispatchButton: {
    backgroundColor: '#FFD43B',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  dispatchButtonDisabled: {
    backgroundColor: '#3F3F46',
  },
  dispatchButtonText: {
    color: '#0C0C0E',
    fontSize: 11,
    fontWeight: '800',
  },
  metricGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  metricCard: {
    width: '48%',
    backgroundColor: 'rgba(20, 20, 24, 0.85)',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    gap: 6,
  },
  metricTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metricLabel: {
    color: '#A1A1AA',
    fontSize: 11,
    fontWeight: '600',
  },
  metricIconBox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricValue: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  metricSub: {
    color: '#A1A1AA',
    fontSize: 10,
    fontWeight: '600',
  },
  sectionHeading: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  linkText: {
    color: '#FFD43B',
    fontSize: 12,
    fontWeight: '700',
  },
  workflowGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  workflowCard: {
    width: '48%',
    backgroundColor: 'rgba(20, 20, 24, 0.85)',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    gap: 6,
  },
  workflowIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  workflowTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  workflowDesc: {
    color: '#A1A1AA',
    fontSize: 10,
    lineHeight: 14,
  },
  projectsStack: {
    gap: 10,
  },
  projectCard: {
    backgroundColor: 'rgba(20, 20, 24, 0.85)',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    gap: 8,
  },
  projectHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  projectNiche: {
    color: '#A1A1AA',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  projectStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  projectStatusText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  projectTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
  projectFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
  },
  projectDuration: {
    color: '#737373',
    fontSize: 10,
  },
  editInStudioText: {
    color: '#A1A1AA',
    fontSize: 11,
    fontWeight: '700',
  },
  doubleCardsRow: {
    gap: 12,
  },
  bottomCard: {
    backgroundColor: 'rgba(20, 20, 24, 0.85)',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    gap: 10,
  },
  bottomCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bottomCardTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  bottomCardLink: {
    color: '#A1A1AA',
    fontSize: 11,
    fontWeight: '600',
  },
  connectorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  connectorIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#1C1C20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  connectorName: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  connectorSub: {
    color: '#737373',
    fontSize: 10,
    marginTop: 1,
  },
  connectedBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  connectedBadgeText: {
    color: '#10B981',
    fontSize: 9,
    fontWeight: '800',
  },
});
