import { ImageResponse } from 'next/og';

/**
 * OpenGraph image generator for social media sharing
 * Generates a 1200x630 image with brand styling
 */
export const runtime = 'edge';
export const alt = 'AI Predicted Signals - Real-time AI Crypto Trading Signals';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0A0B0F',
          backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(110, 231, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(167, 139, 250, 0.1) 0%, transparent 50%)',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Grid pattern */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'linear-gradient(rgba(110, 231, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(110, 231, 255, 0.05) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            padding: '80px',
          }}
        >
          {/* Logo/Icon placeholder */}
          <div
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '24px',
              background: 'linear-gradient(135deg, #6EE7FF 0%, #A78BFA 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '40px',
              boxShadow: '0 0 60px rgba(110, 231, 255, 0.5)',
            }}
          >
            <div
              style={{
                fontSize: '60px',
                fontWeight: 'bold',
                color: '#0A0B0F',
              }}
            >
              AI
            </div>
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: '72px',
              fontWeight: 'bold',
              color: '#E6E8EC',
              textAlign: 'center',
              lineHeight: 1.2,
              marginBottom: '24px',
              maxWidth: '900px',
            }}
          >
            AI Predicted Signals
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: '32px',
              color: '#9AA0AA',
              textAlign: 'center',
              maxWidth: '800px',
              lineHeight: 1.4,
            }}
          >
            Real-time AI-powered cryptocurrency trading signals with &lt;500ms latency
          </div>

          {/* Stats */}
          <div
            style={{
              display: 'flex',
              gap: '60px',
              marginTop: '48px',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#10B981' }}>
                +7.54%
              </div>
              <div style={{ fontSize: '20px', color: '#9AA0AA' }}>12M ROI</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#6EE7FF' }}>
                54.5%
              </div>
              <div style={{ fontSize: '20px', color: '#9AA0AA' }}>Win Rate</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#A78BFA' }}>
                &lt;500ms
              </div>
              <div style={{ fontSize: '20px', color: '#9AA0AA' }}>Latency</div>
            </div>
          </div>
        </div>

        {/* Bottom accent line */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '8px',
            background: 'linear-gradient(90deg, #6EE7FF 0%, #A78BFA 50%, #FF7336 100%)',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}
