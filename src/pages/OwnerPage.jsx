import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Copy, ExternalLink, LogOut, Plus, RotateCcw, ShieldCheck, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase.js';
import { GlobalStyle, ThemeSwitcher, THEMES, themeVars } from '../portfolio/lib.jsx';

const OWNER_PASSWORD = import.meta.env.VITE_OWNER_PASSWORD || 'change-me';

function genCode() {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  let s = '';
  for (let i = 0; i < 8; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s.slice(0, 4) + '-' + s.slice(4);
}

export default function OwnerPage() {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState('');
  const [pwError, setPwError] = useState('');
  const [themeKey, setThemeKey] = useState('mono');

  const [tokens, setTokens] = useState([]);
  const [portfolios, setPortfolios] = useState([]);
  const [customCode, setCustomCode] = useState('');
  const [copied, setCopied] = useState('');
  const [status, setStatus] = useState('');
  const [loadingData, setLoadingData] = useState(false);

  const loadAll = async () => {
    setLoadingData(true);
    const [{ data: tk }, { data: pf }] = await Promise.all([
      supabase.from('tokens').select('*').order('created_at', { ascending: false }),
      supabase.from('portfolios').select('slug, created_at, updated_at').order('created_at', { ascending: false }),
    ]);
    setTokens(tk || []);
    setPortfolios(pf || []);
    setLoadingData(false);
  };

  useEffect(() => { if (authed) loadAll(); }, [authed]);

  const tryLogin = () => {
    if (pw === OWNER_PASSWORD) setAuthed(true);
    else setPwError('Incorrect password.');
  };

  const flash = (msg) => { setStatus(msg); setTimeout(() => setStatus(''), 1500); };

  const addOne = async () => {
    const code = genCode();
    const { error } = await supabase.from('tokens').insert({ code, status: 'unused' });
    flash(error ? 'Failed' : 'Generated');
    loadAll();
  };
  const addFive = async () => {
    const rows = Array.from({ length: 5 }, () => ({ code: genCode(), status: 'unused' }));
    const { error } = await supabase.from('tokens').insert(rows);
    flash(error ? 'Failed' : 'Generated 5');
    loadAll();
  };
  const addCustom = async () => {
    const code = customCode.trim().toUpperCase();
    if (!code) return;
    const { error } = await supabase.from('tokens').insert({ code, status: 'unused' });
    if (error) flash('Code already exists');
    else { flash('Added'); setCustomCode(''); }
    loadAll();
  };
  const remove = async (code) => {
    await supabase.from('tokens').delete().eq('code', code);
    loadAll();
  };
  const resetToken = async (code) => {
    await supabase.from('tokens').update({ status: 'unused', used_at: null, slug: null }).eq('code', code);
    loadAll();
  };
  const copyCode = (code) => {
    if (navigator.clipboard) navigator.clipboard.writeText(code).catch(() => {});
    setCopied(code);
    setTimeout(() => setCopied(''), 1200);
  };
  const deletePortfolio = async (slug) => {
    if (!window.confirm(`Delete the portfolio at "${slug}"? This can't be undone.`)) return;
    await supabase.from('portfolios').delete().eq('slug', slug);
    loadAll();
  };

  const theme = THEMES[themeKey] || THEMES.mono;
  const unusedCount = tokens.filter((t) => t.status === 'unused').length;

  if (!authed) {
    return (
      <div className="mecha-root no-native-cursor" style={themeVars(theme)}>
        <GlobalStyle />
        <ThemeSwitcher themeKey={themeKey} setThemeKey={setThemeKey} />
        <div className="bg-grid" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 24px' }}>
          <div className="panel rounded-lg p-8" style={{ maxWidth: 380, width: '100%' }}>
            <div className="flex items-center gap-2 mb-5"><ShieldCheck size={17} /><span className="font-display font-semibold" style={{ fontSize: 18 }}>Owner Access</span></div>
            <label className="label">Owner password</label>
            <input type="password" className="input" value={pw} onChange={(e) => { setPw(e.target.value); setPwError(''); }} onKeyDown={(e) => e.key === 'Enter' && tryLogin()} autoFocus />
            {pwError && <div className="flex items-center gap-2 mt-2" style={{ fontSize: 12.5, color: 'var(--accent)' }}><AlertCircle size={13} />{pwError}</div>}
            <div className="flex gap-3 mt-6">
              <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={tryLogin}>Log in</button>
              <button className="btn btn-outline" onClick={() => navigate('/')}>Back</button>
            </div>
            <p className="text-muted mt-5" style={{ fontSize: 11.5, lineHeight: 1.6 }}>
              Set via the VITE_OWNER_PASSWORD environment variable at build time.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mecha-root no-native-cursor" style={{ minHeight: '100vh', ...themeVars(theme) }}>
      <GlobalStyle />
      <ThemeSwitcher themeKey={themeKey} setThemeKey={setThemeKey} />
      <header className="border-b-hair px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2"><ShieldCheck size={17} /><span className="font-display font-semibold" style={{ fontSize: 16 }}>Owner Dashboard</span></div>
        <button onClick={() => navigate('/')} className="btn btn-outline"><LogOut size={14} /> Log out</button>
      </header>
      <div className="p-6" style={{ maxWidth: 900, margin: '0 auto' }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-semibold" style={{ fontSize: 20 }}>Access Tokens</h2>
          {status && <span className="font-mono" style={{ fontSize: 12, color: 'var(--accent)' }}>{status}</span>}
        </div>
        <div className="flex flex-wrap gap-3 mb-5">
          <div className="panel-2 rounded-lg p-4" style={{ minWidth: 100 }}><div className="label">Total codes</div><div style={{ fontSize: 20 }}>{tokens.length}</div></div>
          <div className="panel-2 rounded-lg p-4" style={{ minWidth: 100 }}><div className="label">Unused</div><div style={{ fontSize: 20 }}>{unusedCount}</div></div>
          <div className="panel-2 rounded-lg p-4" style={{ minWidth: 100 }}><div className="label">Portfolios created</div><div style={{ fontSize: 20 }}>{portfolios.length}</div></div>
        </div>
        <div className="flex flex-wrap gap-3 mb-4">
          <button className="btn btn-primary" onClick={addOne}><Plus size={14} /> Generate 1 code</button>
          <button className="btn btn-outline" onClick={addFive}><Plus size={14} /> Generate 5 codes</button>
        </div>
        <div className="flex gap-2 mb-6">
          <input className="input font-mono" placeholder="Or set a custom code..." value={customCode} onChange={(e) => setCustomCode(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addCustom()} />
          <button className="btn btn-outline" onClick={addCustom}><Plus size={14} /></button>
        </div>
        <div className="flex flex-col gap-2 mb-10">
          {loadingData && <div className="text-muted" style={{ fontSize: 13 }}>Loading...</div>}
          {!loadingData && tokens.length === 0 && <div className="panel-2 rounded-lg p-6 text-center text-muted" style={{ fontSize: 13 }}>No codes yet — generate one above.</div>}
          {tokens.map((t) => (
            <div key={t.code} className="panel-2 rounded-lg p-3 flex items-center justify-between gap-3 flex-wrap">
              <div>
                <div className="font-mono" style={{ fontSize: 14, letterSpacing: '0.06em' }}>{t.code}</div>
                <div className="text-muted font-mono" style={{ fontSize: 10.5 }}>
                  {t.status === 'used' ? `Used by "${t.slug || '?'}" ${t.used_at ? new Date(t.used_at).toLocaleDateString() : ''}` : 'Not used yet'}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="chip" style={{ borderColor: t.status === 'unused' ? 'var(--accent)' : 'var(--border)', color: t.status === 'unused' ? 'var(--accent)' : 'var(--text-muted)' }}>
                  {t.status === 'unused' ? 'Active' : 'Used'}
                </span>
                <button onClick={() => copyCode(t.code)} title="Copy code" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <Copy size={14} className={copied === t.code ? '' : 'text-muted'} style={copied === t.code ? { color: 'var(--accent)' } : {}} />
                </button>
                {t.status === 'used' && (
                  <button onClick={() => resetToken(t.code)} title="Reset to unused" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    <RotateCcw size={14} className="text-muted" />
                  </button>
                )}
                <button onClick={() => remove(t.code)} title="Delete code" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <Trash2 size={14} className="text-muted" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <h2 className="font-display font-semibold mb-6" style={{ fontSize: 20 }}>Portfolios</h2>
        <div className="flex flex-col gap-2">
          {portfolios.length === 0 && <div className="panel-2 rounded-lg p-6 text-center text-muted" style={{ fontSize: 13 }}>No portfolios created yet.</div>}
          {portfolios.map((p) => (
            <div key={p.slug} className="panel-2 rounded-lg p-3 flex items-center justify-between gap-3 flex-wrap">
              <div className="font-mono" style={{ fontSize: 13 }}>/{p.slug}</div>
              <div className="flex items-center gap-3">
                <a href={`/${p.slug}`} target="_blank" rel="noopener noreferrer" className="chip"><ExternalLink size={12} /> View</a>
                <button onClick={() => deletePortfolio(p.slug)} title="Delete portfolio" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <Trash2 size={14} className="text-muted" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
