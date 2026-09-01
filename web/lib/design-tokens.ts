export const colorTokens = {
  page: '#F8FAFC',
  surface: '#FFFFFF',
  text: '#0F172A',
  textMuted: '#64748B',
  border: '#E2E8F0',
  blue: '#2563EB',
  green: '#16A34A',
  purple: '#7C3AED',
  amber: '#D97706',
  focus: '#1D4ED8',
} as const

export const shadowTokens = {
  surface: '0 1px 2px rgba(15, 23, 42, 0.08), 0 12px 32px rgba(15, 23, 42, 0.04)',
  soft: '0 1px 2px rgba(15, 23, 42, 0.06), 0 4px 12px rgba(15, 23, 42, 0.04)',
} as const

export const radiusTokens = {
  panel: '1rem',
  pill: '9999px',
} as const

export const maxWidthTokens = {
  content: '75rem',
} as const

export type SubjectAccent = 'blue' | 'green' | 'purple' | 'amber'

export const subjectAccentColors: Record<SubjectAccent, string> = {
  blue: colorTokens.blue,
  green: colorTokens.green,
  purple: colorTokens.purple,
  amber: colorTokens.amber,
}

export const themeColors = {
  background: colorTokens.page,
  surface: colorTokens.surface,
  primary: colorTokens.blue,
  accent: colorTokens.border,
  textPrimary: colorTokens.text,
  textSecondary: colorTokens.textMuted,
} as const
