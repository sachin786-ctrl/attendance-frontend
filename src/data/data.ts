// src/data/homeData.ts

import type { LucideIcon } from 'lucide-react';

// ────────────────────────────────────────────────
// Optional: Define allowed icon names as union type
// This gives best autocompletion + type safety
// ────────────────────────────────────────────────
export type IconName =
  | 'Zap'
  | 'ShieldCheck'
  | 'BarChart3'
  | 'Users'
  | 'CheckCircle2'
  | 'ArrowRight';

// ────────────────────────────────────────────────
// Features with typed icon
// ────────────────────────────────────────────────
export const features = [
  {
    icon: 'Zap' as const,
    title: 'Lightning Fast',
    description: 'Sub-second page loads and instant search. Built for scale.',
    color: 'blue',
  },
  {
    icon: 'ShieldCheck' as const,
    title: 'Enterprise Security',
    description: 'SOC 2 Type II, GDPR, end-to-end encryption by default.',
    color: 'emerald',
  },
  {
    icon: 'BarChart3' as const,
    title: 'Advanced Analytics',
    description: 'Real-time insights, custom dashboards, SQL editor.',
    color: 'violet',
  },
  {
    icon: 'Users' as const,
    title: 'Collaboration Suite',
    description: 'Comments, @mentions, version history, approvals.',
    color: 'amber',
  },
  {
    icon: 'CheckCircle2' as const,
    title: '99.99% Uptime',
    description: 'Battle-tested infrastructure used by millions daily.',
    color: 'cyan',
  },
  {
    icon: 'ArrowRight' as const,
    title: 'API-First',
    description: 'Full-featured REST + GraphQL APIs with webhooks.',
    color: 'rose',
  },
] as const;

export type Feature = (typeof features)[number];

// ────────────────────────────────────────────────
// Hero section (split title for easy highlighting)
// ────────────────────────────────────────────────
export const hero = {
  badge: 'New v2.1 — Faster & Smarter',
  title: 'Build better products,',
  titleHighlight: 'faster',
  description:
    'The all-in-one platform trusted by 45,000+ teams to design, develop, ship and scale beautiful digital experiences.',
  trialText: 'Start 14-day free trial',
  demoText: 'Watch demo (2:14)',
  noCardText: 'No credit card required • Cancel anytime',
} as const;

// ────────────────────────────────────────────────
// Trusted by (just strings — very simple)
// ────────────────────────────────────────────────
export const trustedBy = [
  'stripe',
  'notion',
  'vercel',
  'openai',
  'linear',
  'perplexity',
  'figma',
  'webflow',
] as const;

// ────────────────────────────────────────────────
// Final CTA
// ────────────────────────────────────────────────
export const finalCTA = {
  title: 'Ready to build something amazing?',
  subtitle: 'Join thousands of forward-thinking teams shipping 10× faster',
  buttonText: 'Start Building Free →',
  smallText: '14-day trial • No credit card needed',
} as const;

// ────────────────────────────────────────────────
// Icon map — now fully typed
// ────────────────────────────────────────────────
import {
  Zap,
  ShieldCheck,
  BarChart3,
  Users,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

export const iconMap: Record<IconName, LucideIcon> = {
  Zap,
  ShieldCheck,
  BarChart3,
  Users,
  CheckCircle2,
  ArrowRight,
};