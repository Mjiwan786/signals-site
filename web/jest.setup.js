// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Make EventSource available globally for SSE tests
const EventSource = require('eventsource')
global.EventSource = EventSource

// Set test environment variables
process.env.NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://crypto-signals-api.fly.dev'
process.env.NEXT_PUBLIC_API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'https://crypto-signals-api.fly.dev'
process.env.NEXT_PUBLIC_SIGNALS_MODE = process.env.NEXT_PUBLIC_SIGNALS_MODE || 'paper'

console.log('Jest setup: EventSource configured')

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return []
  }
  unobserve() {}
}

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Suppress console errors in tests
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
}
