/**
 * Jest Test Setup
 * Configures global test environment for SSE testing
 */

import EventSource from 'eventsource';

// Make EventSource available globally for tests
// @ts-ignore
global.EventSource = EventSource;

// Set test environment variables
process.env.NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://crypto-signals-api.fly.dev';
process.env.NEXT_PUBLIC_API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'https://crypto-signals-api.fly.dev';
process.env.NEXT_PUBLIC_SIGNALS_MODE = process.env.NEXT_PUBLIC_SIGNALS_MODE || 'paper';

console.log('Test environment configured:');
console.log('- API URL:', process.env.NEXT_PUBLIC_API_URL);
console.log('- Signals Mode:', process.env.NEXT_PUBLIC_SIGNALS_MODE);
