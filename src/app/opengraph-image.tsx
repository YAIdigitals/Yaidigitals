import { ImageResponse } from 'next/og';

export const contentType = 'image/png';
export const size = { width: 1200, height: 630 };
export const alt = 'YAIdigitals — Apps, Software, Websites & AI';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: '80px',
          backgroundColor: '#050505',
          backgroundImage: 'radial-gradient(circle at 85% 15%, rgba(34,197,94,0.18) 0%, rgba(34,197,94,0) 45%)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 14, height: 14, borderRadius: 9999, backgroundColor: '#22c55e' }} />
          <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: -0.5, display: 'flex' }}>
            <span style={{ color: '#22c55e' }}>YAI</span>
            <span style={{ color: '#ffffff' }}>digitals</span>
          </div>
        </div>
        <div
          style={{
            marginTop: 36,
            fontSize: 68,
            fontWeight: 700,
            color: '#ffffff',
            lineHeight: 1.1,
            letterSpacing: -2,
            maxWidth: 900,
          }}
        >
          We build digital products that move businesses forward
        </div>
        <div style={{ marginTop: 32, fontSize: 30, color: '#c5c5c5' }}>
          Apps · Software · Websites · AI
        </div>
      </div>
    ),
    size
  );
}
