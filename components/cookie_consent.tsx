import React, { useEffect, useState } from 'react';

const COOKIE_NAME = 'eio_cookie_consent';

function setCookie(name: string, value: string, days = 365) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function getCookie(name: string) {
  return document.cookie.split('; ').reduce((r, v) => {
    const parts = v.split('=');
    return parts[0] === name ? decodeURIComponent(parts[1]) : r;
  }, '');
}

const CookieConsent: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const existing = getCookie(COOKIE_NAME) || localStorage.getItem(COOKIE_NAME);
    if (!existing) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem(COOKIE_NAME, 'accepted');
    setCookie(COOKIE_NAME, 'accepted');
    setVisible(false);
  };

  const reject = () => {
    localStorage.setItem(COOKIE_NAME, 'rejected');
    setCookie(COOKIE_NAME, 'rejected');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div style={{ position: 'fixed', bottom: 16, left: 16, right: 16, background: 'rgba(0,0,0,0.8)', color: 'white', padding: '12px 16px', borderRadius: 8, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ marginRight: '1rem' }}>
        Este site usa cookies mínimos para funcionamento. Ao continuar, você aceita o uso conforme a nossa política.
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={reject} style={{ background: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.3)', padding: '8px 12px', borderRadius: 6 }}>Recusar</button>
        <button onClick={accept} style={{ background: 'linear-gradient(135deg,#667eea,#764ba2)', color: 'white', border: 'none', padding: '8px 12px', borderRadius: 6 }}>Aceitar</button>
      </div>
    </div>
  );
};

export default CookieConsent;
