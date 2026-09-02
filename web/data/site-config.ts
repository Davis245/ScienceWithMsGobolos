import type { SubjectAccent } from '../lib/design-tokens'

export interface CourseConfig {
  displayName: string
  route: '/chemistry-11' | '/chemistry-12' | '/anatomy-physiology' | '/calculus-12'
  description: string
  accent: SubjectAccent
  helpfulSectionKey: 'chem11_helpful' | 'chem12_helpful' | 'anatomy_helpful' | 'calc12_helpful'
  assignmentSectionKey: 'chem11_assignments' | 'chem12_assignments' | 'anatomy_assignments' | 'calc12_assignments'
}

export interface ResourceSectionConfig {
  displayName: string
  route: '/scholarships'
  description: string
  accent: SubjectAccent
  sectionKey: 'newsletters' | 'howTo'
}

export interface ScholarshipQuickLinkConfig {
  displayName: string
  route: '/scholarships'
  description: string
  accent: 'amber'
}

export const courseConfigs: readonly CourseConfig[] = [
  {
    displayName: 'Chemistry 11',
    route: '/chemistry-11',
    description: 'Course updates, assignments, and study materials for Chemistry 11.',
    accent: 'blue',
    helpfulSectionKey: 'chem11_helpful',
    assignmentSectionKey: 'chem11_assignments',
  },
  {
    displayName: 'Chemistry 12',
    route: '/chemistry-12',
    description: 'Course updates, assignments, and study materials for Chemistry 12.',
    accent: 'blue',
    helpfulSectionKey: 'chem12_helpful',
    assignmentSectionKey: 'chem12_assignments',
  },
  {
    displayName: 'Anatomy & Physiology 12',
    route: '/anatomy-physiology',
    description: 'Course updates, assignments, and study materials for Anatomy & Physiology 12.',
    accent: 'green',
    helpfulSectionKey: 'anatomy_helpful',
    assignmentSectionKey: 'anatomy_assignments',
  },
  {
    displayName: 'Calculus 12',
    route: '/calculus-12',
    description: 'Course updates, assignments, and study materials for Calculus 12.',
    accent: 'purple',
    helpfulSectionKey: 'calc12_helpful',
    assignmentSectionKey: 'calc12_assignments',
  },
] as const

export const scholarshipResourceSections: readonly ResourceSectionConfig[] = [
  {
    displayName: 'Newsletters',
    route: '/scholarships',
    description: 'Scholarship newsletters and update documents.',
    accent: 'amber',
    sectionKey: 'newsletters',
  },
  {
    displayName: 'How To',
    route: '/scholarships',
    description: 'Guides for applying to scholarships, bursaries, and awards.',
    accent: 'amber',
    sectionKey: 'howTo',
  },
] as const

export const scholarshipQuickLinkConfig: ScholarshipQuickLinkConfig = {
  displayName: 'Scholarships, Bursaries & Awards',
  route: '/scholarships',
  description: 'Deadlines, opportunities, and application guidance for graduating students.',
  accent: 'amber',
}

export const primaryNavigationItems = [
  { label: 'Home', route: '/' as const },
  { label: 'Scholarships', route: '/scholarships' as const },
  ...courseConfigs.map(({ displayName, route }) => ({ label: displayName, route })),
] as const

export function getCourseConfig(route: CourseConfig['route']) {
  return courseConfigs.find((course) => course.route === route)
}
