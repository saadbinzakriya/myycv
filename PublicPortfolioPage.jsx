import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, Pencil } from 'lucide-react';
import { supabase } from '../lib/supabase.js';
import {
  GlobalStyle, ThemeSwitcher, THEMES, themeVars,
  CustomCursor, ScrollProgressBar, GrainOverlay, IntroLoader, Divider, Marquee,
  Nav, Hero, About, Skills, Projects, Experience, Contact,
  useReducedMotion, useIsTouch, useActiveSection,
} from '../portfolio/lib.jsx';

export default function PublicPortfolioPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [portfolio, setPortfolio] = useState(null);
  const [themeKey, setThemeKey] = useState('mono');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const rootRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const isTouch = useIsTouch();
  const cursorEnabled = !isTouch && !reducedMotion;
  const activeSection = useActiveSection();

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data, error } = await supabase.from('portfolios').select('*').eq('slug', slug).maybeSingle();
      if (!mounted) return;
      if (error || !data) { setNotFound(true); setLoading(false); return; }
      setPortfolio(data);
      setThemeKey(data.theme || 'mono');
      setLoading(false);
    })();
    return () => { mounted = false; };
  }, [slug]);

  const scrollTo = useCallback((id) => {
    if (id === 'hero') { rootRef.current && rootRef.current.scrollIntoView({ behavior: 'smooth' }); return; }
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

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
        <div className="bg-grid" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, padding: '0 24px', textAlign: 'center' }}>
          <h1 className="font-display font-semibold" style={{ fontSize: 22 }}>No portfolio found at "{slug}"</h1>
          <p className="text-muted" style={{ fontSize: 13.5 }}>This address hasn't been claimed yet.</p>
          <button className="btn btn-outline" onClick={() => navigate('/')}>Get your own portfolio</button>
        </div>
      </div>
    );
  }

  const { profile, skills, experience, projects } = portfolio;
  const skillTicker = Object.values(skills || {}).flat();

  return (
    <div className={`mecha-root ${cursorEnabled ? 'no-native-cursor' : ''}`} ref={rootRef} style={{ minHeight: '100vh', ...themeVars(theme) }}>
      <GlobalStyle />
      <CustomCursor enabled={cursorEnabled} />
      <ThemeSwitcher themeKey={themeKey} setThemeKey={setThemeKey} />
      <ScrollProgressBar />
      <GrainOverlay enabled={!reducedMotion} />
      {!introDone && <IntroLoader name={profile.name} skip={reducedMotion} onComplete={() => setIntroDone(true)} />}
      <Nav profile={profile} onNavigate={scrollTo} goAdmin={() => navigate(`/edit/${slug}`)} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} active={activeSection} />
      <Hero profile={profile} onNavigate={scrollTo} reducedMotion={reducedMotion} />
      {skillTicker.length > 0 && <Marquee items={skillTicker} />}
      <Divider />
      <About profile={profile} />
      <Skills skills={skills} />
      <Projects projects={projects} />
      <Experience experience={experience} />
      <Contact profile={profile} />
      <footer className="px-6 py-8 border-t-hair">
        <div className="flex items-center justify-between flex-wrap gap-3 font-mono text-muted" style={{ maxWidth: 1120, margin: '0 auto', fontSize: 11.5 }}>
          <span>© {new Date().getFullYear()} {profile.name}. Built with intent.</span>
          <button onClick={() => navigate(`/edit/${slug}`)} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Pencil size={12} /> Manage this portfolio
          </button>
        </div>
      </footer>
    </div>
  );
}
