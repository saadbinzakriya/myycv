import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AlertCircle, Loader2, LogOut, Settings, Copy, ExternalLink } from 'lucide-react';
import { supabase } from '../lib/supabase.js';
import {
  GlobalStyle, ThemeSwitcher, THEMES, themeVars,
  ProfileTab, SkillsTab, ExperienceTab, ProjectsTab,
} from '../portfolio/lib.jsx';

export default function EditorPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [portfolio, setPortfolio] = useState(null);
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState('');
  const [pwError, setPwError] = useState('');
  const [tab, setTab] = useState('profile');
  const [copied, setCopied] = useState(false);
  const [themeKey, setThemeKeyState] = useState('mono');

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data, error } = await supabase.from('portfolios').select('*').eq('slug', slug).maybeSingle();
      if (!mounted) return;
      if (error || !data) { setNotFound(true); setLoading(false); return; }
      setPortfolio(data);
      setThemeKeyState(data.theme || 'mono');
      try {
        if (sessionStorage.getItem(`myycv-authed-${slug}`) === 'true') setAuthed(true);
      } catch (e) { /* ignore */ }
      setLoading(false);
    })();
    return () => { mounted = false; };
  }, [slug]);

  const tryLogin = () => {
    if (!portfolio) return;
    if (pw === portfolio.edit_password) {
      setAuthed(true);
      try { sessionStorage.setItem(`myycv-authed-${slug}`, 'true'); } catch (e) { /* ignore */ }
    } else {
      setPwError('Incorrect password.');
    }
  };

  const saveField = async (field, value) => {
    const { error } = await supabase.from('portfolios').update({ [field]: value, updated_at: new Date().toISOString() }).eq('slug', slug);
    if (!error) setPortfolio((p) => ({ ...p, [field]: value }));
    return !error;
  };

  const changeTheme = async (key) => {
    setThemeKeyState(key);
    await supabase.from('portfolios').update({ theme: key, updated_at: new Date().toISOString() }).eq('slug', slug);
  };

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/${slug}` : `/${slug}`;
  const copyLink = () => {
    if (navigator.clipboard) navigator.clipboard.writeText(shareUrl).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const theme = THEMES[themeKey] || THEMES.mono;

  if (loading) {
    return (
      <div className="mecha-root" style={themeVars(THEMES.mono)}>
        <GlobalStyle />
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Loader2 size={22} className="animate-spin" />
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="mecha-root" style={themeVars(THEMES.mono)}>
        <GlobalStyle />
        <div className="bg-grid" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
          <h1 className="font-display font-semibold" style={{ fontSize: 22 }}>No portfolio at "{slug}"</h1>
          <button className="btn btn-outline" onClick={() => navigate('/')}>Go to homepage</button>
        </div>
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="mecha-root no-native-cursor" style={themeVars(theme)}>
        <GlobalStyle />
        <ThemeSwitcher themeKey={themeKey} setThemeKey={changeTheme} />
        <div className="bg-grid" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 24px' }}>
          <div className="panel rounded-lg p-8" style={{ maxWidth: 380, width: '100%' }}>
            <h1 className="font-display font-semibold mb-4" style={{ fontSize: 20 }}>Edit "{slug}"</h1>
            <label className="label">Password</label>
            <input type="password" className="input" value={pw} onChange={(e) => { setPw(e.target.value); setPwError(''); }} onKeyDown={(e) => e.key === 'Enter' && tryLogin()} autoFocus />
            {pwError && <div className="flex items-center gap-2 mt-2" style={{ fontSize: 12.5, color: 'var(--accent)' }}><AlertCircle size={13} />{pwError}</div>}
            <div className="flex gap-3 mt-6">
              <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={tryLogin}>Log in</button>
              <button className="btn btn-outline" onClick={() => navigate(`/${slug}`)}>View portfolio</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [{ id: 'profile', label: 'Profile' }, { id: 'skills', label: 'Skills' }, { id: 'experience', label: 'Experience' }, { id: 'projects', label: 'Projects' }];

  return (
    <div className="mecha-root no-native-cursor" style={{ minHeight: '100vh', ...themeVars(theme) }}>
      <GlobalStyle />
      <ThemeSwitcher themeKey={themeKey} setThemeKey={changeTheme} />
      <header className="border-b-hair px-6 py-4 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Settings size={17} />
          <span className="font-display font-semibold" style={{ fontSize: 16 }}>Edit Your Portfolio</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(`/${slug}`)} className="btn btn-outline"><ExternalLink size={14} /> View live</button>
          <button onClick={() => navigate('/')} className="btn btn-outline"><LogOut size={14} /> Exit</button>
        </div>
      </header>
      <div className="px-6 py-4 border-b-hair">
        <div className="panel-2 rounded-lg p-4 flex items-center justify-between gap-3 flex-wrap" style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div>
            <div className="label" style={{ marginBottom: 2 }}>Your live portfolio</div>
            <div className="font-mono" style={{ fontSize: 13 }}>{shareUrl}</div>
          </div>
          <button className="btn btn-outline" onClick={copyLink}><Copy size={14} /> {copied ? 'Copied!' : 'Copy link'}</button>
        </div>
      </div>
      <div className="admin-grid" style={{ maxWidth: 1000, margin: '0 auto' }}>
        <nav className="flex md:flex-col gap-1 p-5 overflow-x-auto">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className="font-mono" style={{ textAlign: 'left', padding: '10px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', background: tab === t.id ? 'var(--panel)' : 'transparent', color: tab === t.id ? 'var(--accent)' : 'var(--text-muted)', fontSize: 12.5, letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
              {t.label.toUpperCase()}
            </button>
          ))}
        </nav>
        <div className="p-5 md:p-6">
          {tab === 'profile' && <ProfileTab profile={portfolio.profile} onSave={(v) => saveField('profile', v)} />}
          {tab === 'skills' && <SkillsTab skills={portfolio.skills} onSave={(v) => saveField('skills', v)} />}
          {tab === 'experience' && <ExperienceTab experience={portfolio.experience} onSave={(v) => saveField('experience', v)} />}
          {tab === 'projects' && <ProjectsTab projects={portfolio.projects} onSave={(v) => saveField('projects', v)} />}
        </div>
      </div>
    </div>
  );
}
