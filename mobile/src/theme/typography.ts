// =============================================================================
// PujaHop Kolkata Mobile: Typography System
// Section 7: English display, Bengali emotional serif, UI compact sans
// =============================================================================

import { TextStyle } from 'react-native';

export const typography = {
  hero: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 34,
    letterSpacing: -0.5,
  } as TextStyle,
  h1: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 30,
    letterSpacing: -0.3,
  } as TextStyle,
  h2: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 26,
  } as TextStyle,
  h3: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  } as TextStyle,
  body: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  } as TextStyle,
  bodySmall: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  } as TextStyle,
  caption: {
    fontSize: 11,
    fontWeight: '500',
    lineHeight: 14,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  } as TextStyle,
  bengaliHeadline: {
    fontSize: 22,
    fontWeight: '600',
    lineHeight: 32,
  } as TextStyle,
  bengaliSubhead: {
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 24,
  } as TextStyle,
} as const;
