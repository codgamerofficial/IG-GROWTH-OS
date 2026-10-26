// =============================================================================
// RIIQX Mobile — Task Planner & Execution Screen
// Autonomous Goal Decomposition • Sequential Step DAG • Permission Boundaries
// =============================================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';

interface TaskStep {
  id: string;
  order: number;
  description: string;
  tool: string;
  status: 'pending' | 'running' | 'completed' | 'blocked';
  requiresPermission: boolean;
}

export default function TasksScreen() {
  const [goal, setGoal] = useState('');
  const [isPlanning, setIsPlanning] = useState(false);
  const [steps, setSteps] = useState<TaskStep[]>([
    {
      id: 'step_1',
      order: 1,
      description: 'Audit live system environment & model endpoints',
      tool: 'environment_probe',
      status: 'completed',
      requiresPermission: false,
    },
    {
      id: 'step_2',
      order: 2,
      description: 'Verify AWS Bedrock Claude Sonnet 4 / 3.7 runtime connectivity in ap-southeast-2',
      tool: 'bedrock_verifier',
      status: 'completed',
      requiresPermission: false,
    },
    {
      id: 'step_3',
      order: 3,
      description: 'Validate Meta Instagram Graph API v20.0 publishing token for ID: 596660929655724',
      tool: 'instagram_auth_probe',
      status: 'completed',
      requiresPermission: true,
    },
    {
      id: 'step_4',
      order: 4,
      description: 'Synthesize viral 9:16 vertical storyboard and schedule render',
      tool: 'creator_synthesizer',
      status: 'pending',
      requiresPermission: false,
    },
  ]);

  const handlePlanGoal = () => {
    if (!goal.trim()) return;
    setIsPlanning(true);
    setTimeout(() => {
      setSteps([
        {
          id: `step_${Date.now()}_1`,
          order: 1,
          description: `Analyze objective and constraints: "${goal.trim()}"`,
          tool: 'goal_analyzer',
          status: 'completed',
          requiresPermission: false,
        },
        {
          id: `step_${Date.now()}_2`,
          order: 2,
          description: 'Retrieve real-world data and citations via SearXNG',
          tool: 'search_researcher',
          status: 'running',
          requiresPermission: false,
        },
        {
          id: `step_${Date.now()}_3`,
          order: 3,
          description: 'Execute production changes and verify output integrity',
          tool: 'autonomous_executor',
          status: 'pending',
          requiresPermission: true,
        },
      ]);
      setIsPlanning(false);
      setGoal('');
    }, 600);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        {/* Header */}
        <View style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Ionicons name="checkbox-outline" size={20} color={colors.cyan} />
            <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: '800' }}>
              Autonomous Task Planner
            </Text>
          </View>
          <Text style={{ color: colors.textSecondary, fontSize: 12, marginTop: 4 }}>
            Decompose high-level goals into verifiable, permission-gated execution steps.
          </Text>
        </View>

        {/* Goal Input */}
        <View
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.cardBorder,
            borderWidth: 1,
            borderRadius: 16,
            padding: 16,
            gap: 12,
            marginBottom: 20,
          }}
        >
          <Text style={{ color: colors.textPrimary, fontSize: 12, fontWeight: '700' }}>
            NEW AUTONOMOUS GOAL
          </Text>
          <TextInput
            value={goal}
            onChangeText={setGoal}
            placeholder="e.g. Audit API rate limits and build weekly performance brief"
            placeholderTextColor={colors.textMuted}
            style={{
              backgroundColor: colors.bg,
              color: colors.textPrimary,
              borderRadius: 12,
              padding: 12,
              fontSize: 13,
              borderWidth: 1,
              borderColor: colors.cardBorder,
            }}
          />

          <TouchableOpacity
            onPress={handlePlanGoal}
            disabled={!goal.trim() || isPlanning}
            style={{
              backgroundColor: goal.trim() && !isPlanning ? colors.cyan : colors.card,
              borderRadius: 12,
              paddingVertical: 12,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              gap: 8,
            }}
          >
            {isPlanning ? (
              <ActivityIndicator size="small" color="#030712" />
            ) : (
              <>
                <Ionicons
                  name="play"
                  size={16}
                  color={goal.trim() ? '#030712' : colors.textMuted}
                />
                <Text
                  style={{
                    color: goal.trim() ? '#030712' : colors.textMuted,
                    fontSize: 13,
                    fontWeight: '700',
                  }}
                >
                  Decompose &amp; Plan Goal
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Execution DAG List */}
        <View style={{ gap: 10 }}>
          <Text style={{ color: colors.textSecondary, fontSize: 11, fontWeight: '700' }}>
            EXECUTION PIPELINE DAG ({steps.length} STEPS)
          </Text>

          {steps.map((step) => {
            const isCompleted = step.status === 'completed';
            const isRunning = step.status === 'running';

            return (
              <View
                key={step.id}
                style={{
                  backgroundColor: colors.surface,
                  borderColor: isRunning
                    ? colors.cyan
                    : isCompleted
                    ? 'rgba(16, 185, 129, 0.4)'
                    : colors.cardBorder,
                  borderWidth: 1,
                  borderRadius: 14,
                  padding: 14,
                  gap: 8,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <View
                      style={{
                        backgroundColor: colors.card,
                        width: 22,
                        height: 22,
                        borderRadius: 11,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: 1,
                        borderColor: colors.cardBorder,
                      }}
                    >
                      <Text style={{ color: colors.textPrimary, fontSize: 11, fontWeight: '700' }}>
                        {step.order}
                      </Text>
                    </View>
                    <Text style={{ color: colors.textMuted, fontSize: 10, fontFamily: 'monospace' }}>
                      tool: {step.tool}
                    </Text>
                  </View>

                  <View
                    style={{
                      backgroundColor: isCompleted
                        ? 'rgba(16, 185, 129, 0.15)'
                        : isRunning
                        ? 'rgba(6, 182, 212, 0.15)'
                        : 'rgba(100, 116, 139, 0.15)',
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                      borderRadius: 4,
                    }}
                  >
                    <Text
                      style={{
                        color: isCompleted
                          ? colors.emerald
                          : isRunning
                          ? colors.cyan
                          : colors.textMuted,
                        fontSize: 9,
                        fontWeight: '700',
                        textTransform: 'uppercase',
                      }}
                    >
                      {step.status}
                    </Text>
                  </View>
                </View>

                <Text style={{ color: colors.textPrimary, fontSize: 13, fontWeight: '500' }}>
                  {step.description}
                </Text>

                {step.requiresPermission && (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 4,
                      backgroundColor: 'rgba(245, 158, 11, 0.10)',
                      borderColor: 'rgba(245, 158, 11, 0.25)',
                      borderWidth: 1,
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 6,
                    }}
                  >
                    <Ionicons name="shield-outline" size={12} color={colors.amber} />
                    <Text style={{ color: colors.amber, fontSize: 10, fontWeight: '600' }}>
                      Consequential Gate: Requires explicit authorization before external dispatch
                    </Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
