import '@testing-library/jest-dom';
import React from 'react';

// Mock wouter's hooks for testing
jest.mock('wouter', () => ({
  ...jest.requireActual('wouter'),
  useRoute: jest.fn().mockReturnValue([false, {}]),
  useLocation: jest.fn().mockReturnValue(['/', jest.fn()]),
  Link: ({ children, href, ...props }: any) => React.createElement('a', { href, ...props }, children)
}));