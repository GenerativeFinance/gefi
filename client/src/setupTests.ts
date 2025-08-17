import '@testing-library/jest-dom';

// Mock wouter's useRoute hooks
jest.mock('wouter', () => ({
  ...jest.requireActual('wouter'),
  useRoute: jest.fn(),
  useLocation: jest.fn(() => ['/', jest.fn()]),
  Link: ({ children, href }: any) => <a href={href}>{children}</a>
}));