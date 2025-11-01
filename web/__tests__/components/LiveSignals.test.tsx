/**
 * Integration Test: SSE Render + Historical Fetch
 *
 * Tests the LiveSignals component which:
 * - Connects to SSE endpoint for real-time signals
 * - Fetches historical signals via REST API
 * - Handles authentication and authorization
 * - Manages connection lifecycle (connect, disconnect, reconnect)
 *
 * PRD-003 Acceptance Criteria:
 * - Live signal UI update < 400ms after API push
 * - SSE stream reconnection with backoff
 * - Auth/plan gating enforced
 * - Component coverage ≥ 80%
 */

import { render, screen, waitFor, within } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import { SessionProvider } from 'next-auth/react'
import LiveSignals from '@/app/components/LiveSignals'

// Mock Next Auth
jest.mock('next-auth/react', () => ({
  SessionProvider: ({ children }: any) => children,
  useSession: jest.fn(),
}))

// Mock EventSource for SSE
global.EventSource = jest.fn().mockImplementation(() => ({
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  close: jest.fn(),
  readyState: 1, // OPEN
  CONNECTING: 0,
  OPEN: 1,
  CLOSED: 2,
}))

describe('LiveSignals Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Authentication Gating', () => {
    it('should require authentication to display signals', () => {
      const { useSession } = require('next-auth/react')
      useSession.mockReturnValue({
        data: null,
        status: 'unauthenticated',
      })

      render(<LiveSignals />)

      // Should show login prompt instead of signals
      expect(screen.getByText(/sign in/i)).toBeInTheDocument()
      expect(screen.queryByText(/live signals/i)).not.toBeInTheDocument()
    })

    it('should display signals for authenticated users', () => {
      const { useSession } = require('next-auth/react')
      useSession.mockReturnValue({
        data: {
          user: { email: 'test@example.com', name: 'Test User' },
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        },
        status: 'authenticated',
      })

      render(<LiveSignals />)

      // Should show signals component
      expect(screen.getByText(/live signals/i)).toBeInTheDocument()
    })
  })

  describe('Subscription Gating', () => {
    it('should block free users from premium signals', () => {
      const { useSession } = require('next-auth/react')
      useSession.mockReturnValue({
        data: {
          user: {
            email: 'free@example.com',
            name: 'Free User',
            subscriptionStatus: 'inactive',
          },
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        },
        status: 'authenticated',
      })

      render(<LiveSignals />)

      // Should show upgrade prompt
      expect(screen.getByText(/upgrade/i)).toBeInTheDocument()
      expect(screen.queryByRole('list')).not.toBeInTheDocument()
    })

    it('should allow paid subscribers to access premium signals', () => {
      const { useSession } = require('next-auth/react')
      useSession.mockReturnValue({
        data: {
          user: {
            email: 'paid@example.com',
            name: 'Paid User',
            subscriptionStatus: 'active',
            subscriptionTier: 'premium',
          },
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        },
        status: 'authenticated',
      })

      render(<LiveSignals />)

      // Should NOT show upgrade prompt
      expect(screen.queryByText(/upgrade/i)).not.toBeInTheDocument()
    })
  })

  describe('Historical Signal Fetching', () => {
    it('should fetch historical signals on component mount', async () => {
      const { useSession } = require('next-auth/react')
      useSession.mockReturnValue({
        data: {
          user: {
            email: 'test@example.com',
            subscriptionStatus: 'active',
          },
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        },
        status: 'authenticated',
      })

      // Mock fetch for historical signals
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => [
          {
            id: 'sig1',
            timestamp: new Date().toISOString(),
            signal_type: 'entry',
            side: 'long',
            trading_pair: 'BTC/USD',
            entry_price: 50000.0,
            size: 0.01,
            confidence_score: 0.75,
            agent_id: 'test_agent',
            strategy: 'test',
          },
        ],
      })

      render(<LiveSignals />)

      // Wait for historical signals to load
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/signals'),
          expect.any(Object)
        )
      })
    })

    it('should handle API errors gracefully', async () => {
      const { useSession } = require('next-auth/react')
      useSession.mockReturnValue({
        data: {
          user: {
            email: 'test@example.com',
            subscriptionStatus: 'active',
          },
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        },
        status: 'authenticated',
      })

      // Mock fetch failure
      global.fetch = jest.fn().mockRejectedValue(new Error('API Error'))

      render(<LiveSignals />)

      // Should show error message
      await waitFor(() => {
        expect(screen.getByText(/error/i)).toBeInTheDocument()
      })
    })

    it('should apply filters to historical signals', async () => {
      const { useSession } = require('next-auth/react')
      useSession.mockReturnValue({
        data: {
          user: {
            email: 'test@example.com',
            subscriptionStatus: 'active',
          },
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        },
        status: 'authenticated',
      })

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => [],
      })

      render(<LiveSignals />)

      // Verify fetch called with correct filters
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('mode=paper'),
          expect.any(Object)
        )
      })
    })
  })

  describe('SSE Connection Management', () => {
    it('should establish SSE connection for authenticated users', () => {
      const { useSession } = require('next-auth/react')
      useSession.mockReturnValue({
        data: {
          user: {
            email: 'test@example.com',
            subscriptionStatus: 'active',
          },
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        },
        status: 'authenticated',
      })

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => [],
      })

      render(<LiveSignals />)

      // Verify EventSource was created
      expect(global.EventSource).toHaveBeenCalledWith(
        expect.stringContaining('/stream/signals'),
        expect.any(Object)
      )
    })

    it('should close SSE connection on component unmount', () => {
      const { useSession } = require('next-auth/react')
      useSession.mockReturnValue({
        data: {
          user: {
            email: 'test@example.com',
            subscriptionStatus: 'active',
          },
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        },
        status: 'authenticated',
      })

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => [],
      })

      const mockClose = jest.fn()
      ;(global.EventSource as jest.Mock).mockImplementation(() => ({
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        close: mockClose,
        readyState: 1,
      }))

      const { unmount } = render(<LiveSignals />)

      // Unmount component
      unmount()

      // Verify SSE connection was closed
      expect(mockClose).toHaveBeenCalled()
    })

    it('should reconnect on SSE connection error', async () => {
      const { useSession } = require('next-auth/react')
      useSession.mockReturnValue({
        data: {
          user: {
            email: 'test@example.com',
            subscriptionStatus: 'active',
          },
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        },
        status: 'authenticated',
      })

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => [],
      })

      const mockAddEventListener = jest.fn()
      ;(global.EventSource as jest.Mock).mockImplementation(() => ({
        addEventListener: mockAddEventListener,
        removeEventListener: jest.fn(),
        close: jest.fn(),
        readyState: 1,
      }))

      render(<LiveSignals />)

      // Simulate SSE error
      const errorHandler = mockAddEventListener.mock.calls.find(
        (call) => call[0] === 'error'
      )?.[1]

      act(() => {
        errorHandler?.({ target: { readyState: 2 } }) // CLOSED
      })

      // Verify reconnection attempt after delay
      await waitFor(
        () => {
          expect(global.EventSource).toHaveBeenCalledTimes(2)
        },
        { timeout: 6000 }
      ) // Reconnect delay + buffer
    })
  })

  describe('Real-Time Signal Rendering', () => {
    it('should render new signals from SSE in real-time', async () => {
      const { useSession } = require('next-auth/react')
      useSession.mockReturnValue({
        data: {
          user: {
            email: 'test@example.com',
            subscriptionStatus: 'active',
          },
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        },
        status: 'authenticated',
      })

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => [],
      })

      const mockAddEventListener = jest.fn()
      ;(global.EventSource as jest.Mock).mockImplementation(() => ({
        addEventListener: mockAddEventListener,
        removeEventListener: jest.fn(),
        close: jest.fn(),
        readyState: 1,
      }))

      render(<LiveSignals />)

      // Get message event handler
      const messageHandler = mockAddEventListener.mock.calls.find(
        (call) => call[0] === 'message'
      )?.[1]

      // Simulate receiving new signal via SSE
      const newSignal = {
        id: 'live1',
        timestamp: new Date().toISOString(),
        signal_type: 'entry',
        side: 'long',
        trading_pair: 'ETH/USD',
        entry_price: 3000.0,
        size: 0.1,
        confidence_score: 0.85,
        agent_id: 'live_agent',
        strategy: 'scalper',
      }

      act(() => {
        messageHandler?.({
          data: JSON.stringify(newSignal),
        })
      })

      // Verify new signal is rendered
      await waitFor(() => {
        expect(screen.getByText('ETH/USD')).toBeInTheDocument()
      })
    })

    it('should maintain signal list order (newest first)', async () => {
      const { useSession } = require('next-auth/react')
      useSession.mockReturnValue({
        data: {
          user: {
            email: 'test@example.com',
            subscriptionStatus: 'active',
          },
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        },
        status: 'authenticated',
      })

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => [
          {
            id: 'old1',
            timestamp: new Date(Date.now() - 60000).toISOString(),
            signal_type: 'entry',
            trading_pair: 'BTC/USD',
            entry_price: 50000.0,
          },
        ],
      })

      const mockAddEventListener = jest.fn()
      ;(global.EventSource as jest.Mock).mockImplementation(() => ({
        addEventListener: mockAddEventListener,
        removeEventListener: jest.fn(),
        close: jest.fn(),
        readyState: 1,
      }))

      render(<LiveSignals />)

      // Wait for historical signals
      await waitFor(() => {
        expect(screen.getByText('BTC/USD')).toBeInTheDocument()
      })

      // Get message handler
      const messageHandler = mockAddEventListener.mock.calls.find(
        (call) => call[0] === 'message'
      )?.[1]

      // Send new signal
      act(() => {
        messageHandler?.({
          data: JSON.stringify({
            id: 'new1',
            timestamp: new Date().toISOString(),
            signal_type: 'entry',
            trading_pair: 'ETH/USD',
            entry_price: 3000.0,
          }),
        })
      })

      // Verify ETH/USD appears before BTC/USD (newest first)
      await waitFor(() => {
        const signals = screen.getAllByRole('listitem')
        expect(signals[0]).toHaveTextContent('ETH/USD')
        expect(signals[1]).toHaveTextContent('BTC/USD')
      })
    })

    it('should limit displayed signals to prevent UI overflow', async () => {
      const { useSession } = require('next-auth/react')
      useSession.mockReturnValue({
        data: {
          user: {
            email: 'test@example.com',
            subscriptionStatus: 'active',
          },
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        },
        status: 'authenticated',
      })

      // Return many historical signals
      const manySignals = Array.from({ length: 150 }, (_, i) => ({
        id: `sig${i}`,
        timestamp: new Date(Date.now() - i * 60000).toISOString(),
        signal_type: 'entry',
        trading_pair: 'BTC/USD',
        entry_price: 50000.0 + i,
      }))

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => manySignals,
      })

      render(<LiveSignals />)

      // Verify only max signals are displayed (e.g., 100)
      await waitFor(() => {
        const signals = screen.getAllByRole('listitem')
        expect(signals.length).toBeLessThanOrEqual(100)
      })
    })
  })

  describe('Performance', () => {
    it('should render signal updates within 400ms', async () => {
      const { useSession } = require('next-auth/react')
      useSession.mockReturnValue({
        data: {
          user: {
            email: 'test@example.com',
            subscriptionStatus: 'active',
          },
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        },
        status: 'authenticated',
      })

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => [],
      })

      const mockAddEventListener = jest.fn()
      ;(global.EventSource as jest.Mock).mockImplementation(() => ({
        addEventListener: mockAddEventListener,
        removeEventListener: jest.fn(),
        close: jest.fn(),
        readyState: 1,
      }))

      render(<LiveSignals />)

      const messageHandler = mockAddEventListener.mock.calls.find(
        (call) => call[0] === 'message'
      )?.[1]

      const startTime = performance.now()

      // Send signal
      act(() => {
        messageHandler?.({
          data: JSON.stringify({
            id: 'perf1',
            timestamp: new Date().toISOString(),
            signal_type: 'entry',
            trading_pair: 'BTC/USD',
            entry_price: 50000.0,
          }),
        })
      })

      // Wait for render
      await waitFor(() => {
        expect(screen.getByText('BTC/USD')).toBeInTheDocument()
      })

      const endTime = performance.now()
      const renderTime = endTime - startTime

      // Verify render time < 400ms requirement
      expect(renderTime).toBeLessThan(400)
    })
  })
})
