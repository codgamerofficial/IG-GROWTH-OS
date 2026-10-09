import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 192,
  height: 192,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(circle at 50% 45%, #24143D 0%, #100C22 65%, #070611 100%)',
          borderRadius: '42px',
          border: '3px solid #F59E0B',
          position: 'relative',
        }}
      >
        <svg
          viewBox="0 0 64 64"
          width="140"
          height="140"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="32" cy="32" r="30" fill="#141028" stroke="#F59E0B" strokeWidth="2" />
          <path
            d="M32 8C33.5 18 46 20 46 32C46 41 39 48 32 54C25 48 18 41 18 32C18 20 30.5 18 32 8Z"
            fill="url(#festiveGradIcon)"
          />
          <circle cx="32" cy="32" r="6" fill="#FDE047" />
          <path
            d="M26 44C29 47 35 47 38 44"
            stroke="#FDE047"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M16 32C20 28 20 36 24 32"
            stroke="#FFFBEB"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M48 32C44 28 44 36 40 32"
            stroke="#FFFBEB"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="festiveGradIcon" x1="18" y1="8" x2="46" y2="54" gradientUnits="userSpaceOnUse">
              <stop stopColor="#E11D48" />
              <stop offset="0.6" stopColor="#F59E0B" />
              <stop offset="1" stopColor="#EA580C" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
