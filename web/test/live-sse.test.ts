/**
 * Live SSE Connection Test
 * Tests real-time EventSource connection to signals API
 *
 * Requirements:
 * - Connect to ${NEXT_PUBLIC_API_URL}/v1/signals/stream
 * - Receive at least one "data:" event within 5 seconds
 * - Status === Connected
 * - No exceptions thrown
 */

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';

// API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ||
                     process.env.NEXT_PUBLIC_API_BASE ||
                     'https://crypto-signals-api.fly.dev';

const SSE_ENDPOINT = `${API_BASE_URL}/v1/signals/stream?mode=paper`;
const TIMEOUT_MS = 5000; // 5 seconds

describe('Live SSE Connection Test', () => {
  let eventSource: EventSource | null = null;

  afterAll(() => {
    if (eventSource) {
      eventSource.close();
    }
  });

  it('should connect to SSE endpoint and receive signals within 5 seconds', (done) => {
    const startTime = Date.now();
    let receivedSignal = false;
    let connectionEstablished = false;

    // Create EventSource connection
    eventSource = new EventSource(SSE_ENDPOINT);

    // Set timeout
    const timeout = setTimeout(() => {
      if (!receivedSignal) {
        eventSource?.close();
        done(new Error(`Timeout: No signal received within ${TIMEOUT_MS}ms`));
      }
    }, TIMEOUT_MS);

    // Handle connection open
    eventSource.onopen = () => {
      connectionEstablished = true;
      console.log('✅ SSE connection established');
      console.log(`Connection time: ${Date.now() - startTime}ms`);
    };

    // Handle messages
    eventSource.onmessage = (event) => {
      const elapsed = Date.now() - startTime;

      try {
        const data = JSON.parse(event.data);

        // Check for connected event
        if (data.status === 'connected') {
          console.log('✅ Received connected event:', data);
          return; // Wait for actual signal
        }

        // Check for signal event
        if (data.id && data.pair) {
          receivedSignal = true;
          console.log('✅ Received signal event:', {
            id: data.id,
            pair: data.pair,
            side: data.side,
            confidence: data.confidence,
            elapsed: `${elapsed}ms`
          });

          clearTimeout(timeout);
          eventSource?.close();

          // Verify all requirements
          expect(connectionEstablished).toBe(true);
          expect(receivedSignal).toBe(true);
          expect(elapsed).toBeLessThan(TIMEOUT_MS);
          expect(data).toHaveProperty('id');
          expect(data).toHaveProperty('pair');
          expect(data).toHaveProperty('side');
          expect(data).toHaveProperty('entry');

          done();
        }
      } catch (error) {
        clearTimeout(timeout);
        eventSource?.close();
        done(error as Error);
      }
    };

    // Handle errors
    eventSource.onerror = (error) => {
      clearTimeout(timeout);
      eventSource?.close();
      done(new Error(`SSE connection error: ${JSON.stringify(error)}`));
    };
  });

  it('should reconnect after disconnect', (done) => {
    let reconnectCount = 0;
    const maxReconnects = 2;

    eventSource = new EventSource(SSE_ENDPOINT);

    eventSource.onopen = () => {
      reconnectCount++;
      console.log(`✅ Connection attempt ${reconnectCount}`);

      if (reconnectCount === 1) {
        // Force disconnect after first connection
        setTimeout(() => {
          console.log('Forcing disconnect...');
          eventSource?.close();

          // Reconnect
          setTimeout(() => {
            eventSource = new EventSource(SSE_ENDPOINT);
          }, 1000);
        }, 1000);
      } else if (reconnectCount === maxReconnects) {
        eventSource?.close();
        expect(reconnectCount).toBe(maxReconnects);
        done();
      }
    };

    eventSource.onerror = (error) => {
      console.log('Connection error (expected during reconnect test)');
    };

    // Timeout safety
    setTimeout(() => {
      eventSource?.close();
      if (reconnectCount < maxReconnects) {
        done(new Error('Reconnect test timeout'));
      }
    }, 10000);
  });
});

describe('SSE Data Validation', () => {
  let eventSource: EventSource | null = null;

  afterAll(() => {
    if (eventSource) {
      eventSource.close();
    }
  });

  it('should receive valid signal schema', (done) => {
    eventSource = new EventSource(SSE_ENDPOINT);

    const timeout = setTimeout(() => {
      eventSource?.close();
      done(new Error('Timeout waiting for signal'));
    }, 5000);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        // Skip connected event
        if (data.status === 'connected') return;

        // Validate signal schema
        expect(data).toHaveProperty('id');
        expect(data).toHaveProperty('ts');
        expect(data).toHaveProperty('pair');
        expect(data).toHaveProperty('side');
        expect(data).toHaveProperty('entry');
        expect(data).toHaveProperty('sl');
        expect(data).toHaveProperty('tp');
        expect(data).toHaveProperty('strategy');
        expect(data).toHaveProperty('confidence');
        expect(data).toHaveProperty('mode');

        // Validate types
        expect(typeof data.id).toBe('string');
        expect(typeof data.ts).toBe('number');
        expect(typeof data.pair).toBe('string');
        expect(['buy', 'sell']).toContain(data.side);
        expect(typeof data.entry).toBe('number');
        expect(typeof data.confidence).toBe('number');
        expect(['paper', 'live']).toContain(data.mode);

        // Validate confidence range
        expect(data.confidence).toBeGreaterThanOrEqual(0);
        expect(data.confidence).toBeLessThanOrEqual(1);

        clearTimeout(timeout);
        eventSource?.close();
        done();
      } catch (error) {
        clearTimeout(timeout);
        eventSource?.close();
        done(error as Error);
      }
    };

    eventSource.onerror = (error) => {
      clearTimeout(timeout);
      eventSource?.close();
      done(new Error('SSE connection error'));
    };
  });

  it('should receive signals with recent timestamps', (done) => {
    eventSource = new EventSource(SSE_ENDPOINT);

    const timeout = setTimeout(() => {
      eventSource?.close();
      done(new Error('Timeout waiting for signal'));
    }, 5000);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        // Skip connected event
        if (data.status === 'connected') return;

        const now = Date.now();
        const signalTime = data.ts * 1000; // Convert to milliseconds
        const ageSeconds = (now - signalTime) / 1000;

        console.log(`Signal age: ${ageSeconds.toFixed(2)}s`);

        // Signal should be less than 15 seconds old
        expect(ageSeconds).toBeLessThan(15);

        clearTimeout(timeout);
        eventSource?.close();
        done();
      } catch (error) {
        clearTimeout(timeout);
        eventSource?.close();
        done(error as Error);
      }
    };

    eventSource.onerror = (error) => {
      clearTimeout(timeout);
      eventSource?.close();
      done(new Error('SSE connection error'));
    };
  });
});

describe('Production Environment Checks', () => {
  it('should have correct API URL configured', () => {
    expect(API_BASE_URL).toBeTruthy();
    expect(API_BASE_URL).toContain('crypto-signals-api.fly.dev');
    console.log('✅ API URL:', API_BASE_URL);
  });

  it('should have correct SSE endpoint', () => {
    expect(SSE_ENDPOINT).toContain('/v1/signals/stream');
    expect(SSE_ENDPOINT).toContain('mode=paper');
    console.log('✅ SSE Endpoint:', SSE_ENDPOINT);
  });
});

// Helper function to test connection manually
export async function testSSEConnection(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const eventSource = new EventSource(SSE_ENDPOINT);
    let received = false;

    const timeout = setTimeout(() => {
      eventSource.close();
      if (!received) {
        reject(new Error('Connection timeout'));
      }
    }, 5000);

    eventSource.onopen = () => {
      console.log('✅ Connection established');
    };

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.id || data.status === 'connected') {
        received = true;
        clearTimeout(timeout);
        eventSource.close();
        resolve(true);
      }
    };

    eventSource.onerror = () => {
      clearTimeout(timeout);
      eventSource.close();
      reject(new Error('Connection error'));
    };
  });
}
