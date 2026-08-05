import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, KeyRound, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase.js';
import {
  GlobalStyle, ThemeSwitcher, Magnetic, Eyebrow,
  DEFAULT_PROFILE, DEFAULT_SKILLS, DEFAULT_EXPERIENCE, DEFAULT_PROJECTS,
  themeVars, THEMES,
} from '../portfolio/lib.jsx';

const SLUG_RE = /^[a-z0-9](?:[a-z0-9-]{1,38}[a-z0-9])?$/;

function slugify(input) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 40);
}

export default function TokenGatePage() {
  const navigate = useNavigate();
  const [step, setStep] = useState('token'); // 'token' | 'onboard'
  const [themeKey] = useState('mono');

  const [code, setCode] = useState('');
  const [tokenError, setTokenError] = useState('');
  const [checkingToken, setCheckingToken] = useState(false);

  const [slug, setSlug] = useState('');
  const [password, setPassword] = useState('');
  const [onboardError, setOnboardError] = useState('');
  const [creating, setCreating] = useState(false);

  const verifyToken = async () => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) { setTokenError('Enter your access code.'); return; }
    setCheckingToken(true);
    setTokenError('');
    const { data, error } = await supabase.from('tokens').select('*').eq('code', trimmed).maybeSingle();
    setCheckingToken(false);
    if (error) { setTokenError('Something went wrong checking that code. Try again.'); return; }
    if (!data) { setTokenError('That code was not recognized.'); return; }
    if (data.status === 'used') { setTokenError('That code has already been used.'); return; }
    setSlug(slugify(''));
    setStep('onboard');
  };

  const createPortfolio = async () => {
    const trimmedCode = code.trim().toUpperCase();
    const cleanSlug = slugify(slug);
    setOnboardError('');

    if (!SLUG_RE.test(cleanSlug)) {
      setOnboardError('Choose a URL name using letters, numbers, and dashes (3+ characters).');
      return;
    }
    if (cleanSlug.length < 3) {
      setOnboardError('Your URL name needs to be at least 3 characters.');
      return;
    }
    if (!password || password.length < 4) {
      setOnboardError('Choose an edit password with at least 4 characters -- you\'ll use it to update your portfolio later.');
      return;
    }
    if (['owner', 'edit', 'api'].includes(cleanSlug)) {
      setOnboardError('That name is reserved. Please choose another.');
      return;
    }

    setCreating(true);

    // Re-verify the token is still unused (defensive re-check)
    const { data: freshToken, error: tokenErr } = await supabase.from('tokens').select('*').eq('code', trimmedCode).maybeSingle();
    if (tokenErr || !freshToken || freshToken.status === 'used') {
      setOnboardError('That code is no longer valid. Please start over.');
      setCreating(false);
      setStep('token');
      return;
    }

    // Check slug availability
    const { data: existing } = await supabase.from('portfolios').select('slug').eq('slug', cleanSlug).maybeSingle();
    if (existing) {
      setOnboardError('That URL name is already taken -- try another.');
      setCreating(false);
      return;
    }

    const { error: insertErr } = await supabase.from('portfolios').insert({
      slug: cleanSlug,
      token_code: trimmedCode,
      edit_password: password,
      theme: 'mono',
      profile: DEFAULT_PROFILE,
      skills: DEFAULT_SKILLS,
      experience: DEFAULT_EXPERIENCE,
      projects: DEFAULT_PROJECTS,
    });
    if (insertErr) {
      setOnboardError('Could not create your portfolio (that name may already be taken). Try another name.');
      setCreating(false);
      return;
    }

    await supabase.from('tokens').update({ status: 'used', used_at: new Date().toISOString(), slug: cleanSlug }).eq('code', trimmedCode);

    try { sessionStorage.setItem(`myycv-authed-${cleanSlug}`, 'true'); } catch (e) { /* ignore */ }
    setCreating(false);
    navigate(`/edit/${cleanSlug}`);
  };

  const theme = THEMES[themeKey] || THEMES.mono;

  return (
    <div className="mecha-root no-native-cursor" style={{ minHeight: '100vh', ...themeVars(theme) }}>
      <GlobalStyle />
      <ThemeSwitcher themeKey={themeKey} setThemeKey={() => {}} />
      <div className="bg-grid" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 24px' }}>
        <div className="panel rounded-lg p-8 fade-up" style={{ maxWidth: 420, width: '100%' }}>
          {step === 'token' && (
            <>
              <div className="eyebrow mb-4"><span className="dot" />MyyCV — Student Portfolio Builder</div>
              <h1 className="font-display font-semibold" style={{ fontSize: 26, marginBottom: 10 }}>Enter your access code</h1>
              <p className="text-muted" style={{ fontSize: 13.5, lineHeight: 1.6, marginBottom: 20 }}>
                Each code works once. After this, you'll choose your own portfolio address and a password to edit it later.
              </p>
              <input
                className="input font-mono"
                style={{ letterSpacing: '0.12em', textTransform: 'uppercase', fontSize: 16, textAlign: 'center' }}
                value={code}
                onChange={(e) => { setCode(e.target.value); setTokenError(''); }}
                onKeyDown={(e) => e.key === 'Enter' && verifyToken()}
                placeholder="XXXX-XXXX"
                maxLength={20}
                autoFocus
              />
              {tokenError && <div className="flex items-center gap-2 mt-3" style={{ fontSize: 12.5, color: 'var(--accent)' }}><AlertCircle size={13} />{tokenError}</div>}
              <Magnetic style={{ width: '100%', display: 'block', marginTop: 20 }}>
                <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={verifyToken} disabled={checkingToken}>
                  {checkingToken ? <Loader2 size={15} className="animate-spin" /> : <KeyRound size={15} />} {checkingToken ? 'Checking...' : 'Continue'}
                </button>
              </Magnetic>
            </>
          )}

          {step === 'onboard' && (
            <>
              <Eyebrow>Almost there</Eyebrow>
              <h1 className="font-display font-semibold" style={{ fontSize: 24, marginBottom: 10 }}>Set up your portfolio</h1>
              <label className="label">Your portfolio address</label>
              <div className="flex items-center gap-0 mb-1" style={{ fontSize: 13 }}>
                <span className="text-muted font-mono" style={{ whiteSpace: 'nowrap' }}>{typeof window !== 'undefined' ? window.location.host : 'myycv.netlify.app'}/</span>
                <input
                  className="input font-mono"
                  style={{ flex: 1 }}
                  value={slug}
                  onChange={(e) => setSlug(slugify(e.target.value))}
                  placeholder="your-name"
                />
              </div>
              <p className="text-muted mb-4" style={{ fontSize: 11 }}>Letters, numbers, and dashes only. This becomes your shareable link.</p>

              <label className="label">Set an edit password</label>
              <input
                type="password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && createPortfolio()}
                placeholder="Choose a password"
              />
              <p className="text-muted mb-4 mt-1" style={{ fontSize: 11 }}>You'll need this to come back and update your portfolio later.</p>

              {onboardError && <div className="flex items-center gap-2 mt-2 mb-2" style={{ fontSize: 12.5, color: 'var(--accent)' }}><AlertCircle size={13} />{onboardError}</div>}

              <Magnetic style={{ width: '100%', display: 'block', marginTop: 12 }}>
                <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={createPortfolio} disabled={creating}>
                  {creating ? <Loader2 size={15} className="animate-spin" /> : null} {creating ? 'Creating...' : 'Create my portfolio'}
                </button>
              </Magnetic>
            </>
          )}

          <div style={{ textAlign: 'center', marginTop: 18 }}>
            <a href="/owner" className="text-muted" style={{ fontSize: 10.5, textDecoration: 'underline', opacity: 0.6 }}>Owner login</a>
          </div>
        </div>
      </div>
    </div>
  );
}
