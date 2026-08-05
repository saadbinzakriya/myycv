import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Menu, X, Mail, Phone, MapPin, Linkedin, Github, ExternalLink,
  Play, Upload, Plus, Trash2, Pencil, ArrowRight, ArrowUpRight,
  Download, Cpu, Image as ImageIcon, Save, Loader2, Palette
} from 'lucide-react';

/* =========================================================================
   CONFIG / SEED DATA
   Edit ADMIN_PASSWORD below to set your own admin passcode.
   Everything else (name, bio, skills, experience, projects) is editable
   live from the Admin panel once the site is running -- no code edits needed.
   ========================================================================= */

export const ADMIN_PASSWORD = 'mechatronics2026';

export const CATEGORIES = ['Robotics', 'Automation', 'Embedded Systems', 'IoT', 'Design & CAD', 'Software'];

export function svgPlaceholder(label) {
  const safe = String(label || '').slice(0, 2).toUpperCase();
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='500' viewBox='0 0 800 500'>
    <rect width='800' height='500' fill='#050505'/>
    <g opacity='0.5' stroke='#ffffff' stroke-width='1'>
      <line x1='0' y1='125' x2='800' y2='125'/>
      <line x1='0' y1='250' x2='800' y2='250'/>
      <line x1='0' y1='375' x2='800' y2='375'/>
      <line x1='200' y1='0' x2='200' y2='500'/>
      <line x1='400' y1='0' x2='400' y2='500'/>
      <line x1='600' y1='0' x2='600' y2='500'/>
    </g>
    <circle cx='400' cy='250' r='70' fill='none' stroke='#ffffff' stroke-width='2.5'/>
    <circle cx='400' cy='250' r='6' fill='#ffffff'/>
    <path d='M400 180 L400 120 M400 320 L400 380 M330 250 L270 250 M470 250 L530 250' stroke='#ffffff' stroke-width='2.5'/>
    <text x='400' y='260' font-family='monospace' font-size='22' fill='#ffffff' text-anchor='middle'>${safe}</text>
  </svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

export const NOISE_SVG = "<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>";
export const NOISE_DATA_URI = 'data:image/svg+xml;utf8,' + encodeURIComponent(NOISE_SVG);

export const DEFAULT_PROFILE = {
  name: 'Your Name',
  role: 'Mechatronics Engineer',
  tagline: 'Write one or two sentences about what you build and what makes your work distinct — this shows right under your name.',
  bio: "This is your about section. Talk about what you focus on, the kind of problems you like solving, and what you bring to a team. Two to four sentences is usually enough — specific and concrete beats generic every time.",
  email: 'you@example.com',
  phone: '+1 234 567 8900',
  location: 'Your City, Country',
  linkedin: 'https://linkedin.com/in/your-profile',
  github: 'https://github.com/your-profile',
  resumeUrl: '',
  yearsExperience: '3+',
  education: 'B.Sc. Mechatronics Engineering',
  focusAreas: 'Robotics · Embedded Systems · Automation',
};

export const DEFAULT_SKILLS = {
  'Embedded Systems & Firmware': ['C / C++', 'Arduino', 'STM32', 'Raspberry Pi', 'RTOS', 'I2C / SPI / UART'],
  'Robotics & Control': ['PID Control', 'ROS', 'Kinematics', 'Sensor Fusion', 'Servo / Stepper Control'],
  'CAD & Design': ['SolidWorks', 'AutoCAD', 'Fusion 360', 'GD&T', '3D Printing'],
  'Software & Tools': ['Python', 'MATLAB / Simulink', 'PLC / SCADA', 'Git', 'Linux'],
};

export const DEFAULT_EXPERIENCE = [
  {
    id: 'exp1',
    title: 'Mechatronics Engineer',
    org: 'Example Automation Co.',
    duration: '2023 — Present',
    description: 'Design and commission automated production-line hardware -- mechanical fixtures, sensor integration, and the embedded control logic that runs them.',
  },
  {
    id: 'exp2',
    title: 'Robotics Intern',
    org: 'University Robotics Lab',
    duration: '2022 — 2023',
    description: 'Built and tuned control software for a small autonomous ground vehicle, including sensor fusion for navigation and a PID-based motor control layer.',
  },
  {
    id: 'exp3',
    title: 'B.Sc. Mechatronics Engineering',
    org: 'Your University',
    duration: '2019 — 2023',
    description: 'Coursework across mechanical design, control systems, embedded programming, and robotics, with a final-year project on autonomous navigation.',
  },
];

export const DEFAULT_PROJECTS = [
  {
    id: 'p1',
    title: 'Autonomous Line-Following Robot',
    category: 'Robotics',
    description: 'A two-wheeled autonomous robot that tracks a painted path using an 8-channel IR sensor array, with a tuned PID loop for smooth cornering at speed. Built on an Arduino Mega with a custom motor driver board.',
    tags: ['Arduino', 'PID', 'C++', 'IR Sensors'],
    image: svgPlaceholder('R1'),
    videoUrl: '',
    videoThumbnail: '',
    date: '2024',
  },
  {
    id: 'p2',
    title: 'IoT Industrial Monitoring System',
    category: 'IoT',
    description: 'A Raspberry Pi-based monitoring node that reads vibration, temperature, and current draw from factory equipment and streams it to a live dashboard, with configurable alert thresholds for early failure detection.',
    tags: ['Raspberry Pi', 'Python', 'MQTT', 'Sensors'],
    image: svgPlaceholder('I1'),
    videoUrl: '',
    videoThumbnail: '',
    date: '2024',
  },
  {
    id: 'p3',
    title: '6-DOF Robotic Arm Controller',
    category: 'Robotics',
    description: 'Custom inverse-kinematics solver and servo controller for a 6-degree-of-freedom robotic arm, driving pick-and-place tasks from a simple coordinate-based command interface.',
    tags: ['Kinematics', 'STM32', 'Servos', 'C'],
    image: svgPlaceholder('R2'),
    videoUrl: '',
    videoThumbnail: '',
    date: '2023',
  },
  {
    id: 'p4',
    title: 'PLC-Based Conveyor Sorting System',
    category: 'Automation',
    description: 'A ladder-logic control system for a sorting conveyor that uses inductive and optical sensors to route parts to the correct bin, with a HMI panel for line operators.',
    tags: ['PLC', 'Ladder Logic', 'SCADA', 'Sensors'],
    image: svgPlaceholder('A1'),
    videoUrl: '',
    videoThumbnail: '',
    date: '2023',
  },
];

/* =========================================================================

/* =========================================================================
   THEMES
   Each theme is a set of CSS custom property values applied to the root
   element. "mono" (black & white) is the default / first theme requested.
   ========================================================================= */

export const THEMES = {
  mono: {
    label: 'Monochrome',
    swatch: ['#000000', '#FFFFFF'],
    bg: '#000000', panel: 'rgba(10,10,10,0.62)', panel2: 'rgba(17,17,17,0.62)',
    border: '#2A2A2A', text: '#FFFFFF', textMuted: '#8C8C8C',
    accent: '#FFFFFF', accentText: '#000000',
    font: "'Space Grotesk', sans-serif",
  },
  blueprint: {
    label: 'Blueprint',
    swatch: ['#0A0E14', '#E8934A'],
    bg: '#0A0E14', panel: 'rgba(16,22,31,0.68)', panel2: 'rgba(20,27,37,0.68)',
    border: '#212C39', text: '#E7ECF2', textMuted: '#8194A6',
    accent: '#E8934A', accentText: '#0A0E14',
    font: "'IBM Plex Sans Condensed', sans-serif",
  },
  paper: {
    label: 'Paper',
    swatch: ['#F6F4EE', '#181712'],
    bg: '#F6F4EE', panel: 'rgba(255,255,255,0.72)', panel2: 'rgba(255,255,255,0.55)',
    border: '#DDD7C8', text: '#181712', textMuted: '#6C6759',
    accent: '#181712', accentText: '#F6F4EE',
    font: "'Space Grotesk', sans-serif",
  },
  neon: {
    label: 'Neon',
    swatch: ['#08060F', '#B794F6'],
    bg: '#08060F', panel: 'rgba(21,15,33,0.62)', panel2: 'rgba(27,19,42,0.62)',
    border: '#332A4C', text: '#F4EFFF', textMuted: '#9C8FC2',
    accent: '#B794F6', accentText: '#08060F',
    font: "'Space Grotesk', sans-serif",
  },
  slate: {
    label: 'Slate',
    swatch: ['#0E1720', '#5FC9D8'],
    bg: '#0E1720', panel: 'rgba(22,32,43,0.62)', panel2: 'rgba(27,38,50,0.62)',
    border: '#27384A', text: '#E6EDF4', textMuted: '#7C93A8',
    accent: '#5FC9D8', accentText: '#0E1720',
    font: "'IBM Plex Sans Condensed', sans-serif",
  },
};
export const THEME_ORDER = ['mono', 'blueprint', 'paper', 'neon', 'slate'];

export function themeVars(theme) {
  return {
    '--bg': theme.bg, '--panel': theme.panel, '--panel-2': theme.panel2,
    '--border': theme.border, '--text': theme.text, '--text-muted': theme.textMuted,
    '--accent': theme.accent, '--accent-text': theme.accentText, '--font-display': theme.font,
  };
}



/* =========================================================================
   UTILITIES
   ========================================================================= */

export function extractYouTubeId(url) {
  if (!url) return null;
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{6,})/);
  return m ? m[1] : null;
}
export function extractVimeoId(url) {
  if (!url) return null;
  const m = url.match(/vimeo\.com\/(\d+)/);
  return m ? m[1] : null;
}
export function autoThumbnail(url) {
  const yt = extractYouTubeId(url);
  if (yt) return `https://img.youtube.com/vi/${yt}/hqdefault.jpg`;
  return null;
}
export function videoEmbedUrl(url) {
  const yt = extractYouTubeId(url);
  if (yt) return `https://www.youtube.com/embed/${yt}?autoplay=1`;
  const vm = extractVimeoId(url);
  if (vm) return `https://player.vimeo.com/video/${vm}?autoplay=1`;
  return null;
}
export function compressImage(file, maxWidth = 1000, quality = 0.72) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read file'));
    reader.onload = () => {
      const img = new window.Image();
      img.onerror = () => reject(new Error('Could not decode image'));
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        let dataUrl = canvas.toDataURL('image/jpeg', quality);
        if (dataUrl.length > 900000 && maxWidth > 500) {
          canvas.width = Math.round(w * 0.7);
          canvas.height = Math.round(h * 0.7);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          dataUrl = canvas.toDataURL('image/jpeg', 0.5);
        }
        resolve(dataUrl);
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}
export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

/* =========================================================================
   ANIMATION HOOKS + PRIMITIVES
   ========================================================================= */

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = () => setReduced(mq.matches);
    if (mq.addEventListener) mq.addEventListener('change', handler); else mq.addListener(handler);
    return () => { if (mq.removeEventListener) mq.removeEventListener('change', handler); else mq.removeListener(handler); };
  }, []);
  return reduced;
}

export function useIsTouch() {
  const [touch, setTouch] = useState(false);
  useEffect(() => {
    try { setTouch(window.matchMedia('(pointer: coarse)').matches); } catch (e) { setTouch(false); }
  }, []);
  return touch;
}

/* Custom two-part cursor: fast dot + lagging ring, grows + labels on hover targets */
export function CustomCursor({ enabled }) {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const glowRef = useRef(null);
  const target = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const glowPos = useRef({ x: -100, y: -100 });
  const [big, setBig] = useState(false);
  const [label, setLabel] = useState('');

  useEffect(() => {
    if (!enabled) return;
    const move = (e) => { target.current.x = e.clientX; target.current.y = e.clientY; };
    const over = (e) => {
      const el = e.target.closest ? e.target.closest('[data-cursor-hover]') : null;
      if (el) { setBig(true); setLabel(el.getAttribute('data-cursor-text') || ''); }
      else { setBig(false); setLabel(''); }
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseover', over);
    let raf;
    const loop = () => {
      ringPos.current.x += (target.current.x - ringPos.current.x) * 0.18;
      ringPos.current.y += (target.current.y - ringPos.current.y) * 0.18;
      glowPos.current.x += (target.current.x - glowPos.current.x) * 0.07;
      glowPos.current.y += (target.current.y - glowPos.current.y) * 0.07;
      if (dotRef.current) dotRef.current.style.transform = `translate(${target.current.x}px, ${target.current.y}px) translate(-50%,-50%)`;
      if (ringRef.current) ringRef.current.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px) translate(-50%,-50%)`;
      if (glowRef.current) glowRef.current.style.transform = `translate(${glowPos.current.x}px, ${glowPos.current.y}px) translate(-50%,-50%)`;
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', over);
      cancelAnimationFrame(raf);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <>
      <div ref={glowRef} className="cx-glow" />
      <div ref={dotRef} className="cx-dot" />
      <div ref={ringRef} className={`cx-ring ${big ? 'cx-ring-big' : ''}`}>
        {label ? <span className="cx-label">{label}</span> : null}
      </div>
    </>
  );
}

/* Magnetic wrapper: element pulls slightly toward the cursor within its bounds */
export function Magnetic({ children, strength = 16, style = {}, ...rest }) {
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current; if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${(relX / rect.width) * strength}px, ${(relY / rect.height) * strength}px)`;
  };
  const onLeave = () => { if (ref.current) ref.current.style.transform = 'translate(0,0)'; };
  return (
    <span
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ display: 'inline-block', transition: 'transform 0.2s ease-out', ...style }}
      {...rest}
    >
      {children}
    </span>
  );
}

/* Tilt wrapper: perspective tilt + cursor-tracked glow following mouse position over the element */
export function TiltCard({ children, className = '', style = {}, ...rest }) {
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current; if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${(-py * 7).toFixed(2)}deg) rotateY(${(px * 7).toFixed(2)}deg) scale3d(1.015,1.015,1.015)`;
    el.style.setProperty('--gx', `${e.clientX - rect.left}px`);
    el.style.setProperty('--gy', `${e.clientY - rect.top}px`);
  };
  const onLeave = () => { if (ref.current) ref.current.style.transform = 'perspective(900px) rotateX(0) rotateY(0) scale3d(1,1,1)'; };
  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
      style={{ transition: 'transform 0.25s ease', willChange: 'transform', ...style }}
      {...rest}
    >
      {children}
    </div>
  );
}

/* Scramble-decode text: resolves from random characters into the real text */
export const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
export function ScrambleText({ text, triggerOnMount = false, as: Tag = 'span', className = '', hoverable = true }) {
  const [display, setDisplay] = useState(triggerOnMount ? '' : text);
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  const run = useCallback(() => {
    let iteration = 0;
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setDisplay(
        text
          .split('')
          .map((ch, idx) => {
            if (ch === ' ') return ' ';
            if (idx < iteration) return text[idx];
            return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
          })
          .join('')
      );
      iteration += text.length / 12;
      if (iteration >= text.length) {
        clearInterval(intervalRef.current);
        setDisplay(text);
      }
    }, 32);
  }, [text]);

  useEffect(() => {
    if (triggerOnMount) timeoutRef.current = setTimeout(run, 200);
    return () => { clearTimeout(timeoutRef.current); clearInterval(intervalRef.current); };
  }, [triggerOnMount, run]);

  return (
    <Tag className={className} onMouseEnter={hoverable ? run : undefined}>
      {display}
    </Tag>
  );
}

/* Infinite marquee ticker */
export function Marquee({ items }) {
  const loop = [...items, ...items];
  return (
    <div className="marquee-wrap">
      <div className="marquee-track">
        {loop.map((it, i) => (
          <span className="marquee-item" key={i}>
            {it}<span className="marquee-dot">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* Fixed top scroll-progress telemetry bar */
export function ScrollProgressBar() {
  const barRef = useRef(null);
  useEffect(() => {
    let ticking = false;
    const update = () => {
      const h = document.documentElement;
      const scrollTop = h.scrollTop || document.body.scrollTop;
      const height = (h.scrollHeight || document.body.scrollHeight) - h.clientHeight;
      const pct = height > 0 ? (scrollTop / height) * 100 : 0;
      if (barRef.current) barRef.current.style.width = pct + '%';
      ticking = false;
    };
    const onScroll = () => { if (!ticking) { requestAnimationFrame(update); ticking = true; } };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', update);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', update); };
  }, []);
  return (
    <div className="scroll-progress">
      <div ref={barRef} className="scroll-progress-bar" />
    </div>
  );
}

/* Subtle animated film-grain overlay */
export function GrainOverlay({ enabled }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!enabled) return;
    let frame = 0;
    const id = setInterval(() => {
      frame = (frame + 1) % 8;
      if (ref.current) ref.current.style.backgroundPosition = `${frame * 7}px ${frame * 11}px`;
    }, 110);
    return () => clearInterval(id);
  }, [enabled]);
  if (!enabled) return null;
  return (
    <div
      ref={ref}
      style={{
        position: 'fixed', inset: -20, zIndex: 40, pointerEvents: 'none',
        opacity: 0.045, mixBlendMode: 'overlay',
        backgroundImage: `url("${NOISE_DATA_URI}")`, backgroundSize: '180px 180px',
      }}
    />
  );
}

/* Cursor-reactive grid spotlight, used behind the hero */
export function SpotlightGrid({ disabled }) {
  const ref = useRef(null);
  useEffect(() => {
    if (disabled) return;
    const el = ref.current; if (!el) return;
    const move = (e) => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty('--mx', (e.clientX - rect.left) + 'px');
      el.style.setProperty('--my', (e.clientY - rect.top) + 'px');
    };
    el.addEventListener('mousemove', move);
    return () => el.removeEventListener('mousemove', move);
  }, [disabled]);
  return <div ref={ref} className="spotlight-grid" />;
}

/* Scroll-reveal wrapper using IntersectionObserver */
export function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold: 0.12 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}
export function Reveal({ children, delay = 0, style = {}, className = '' }) {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(26px)',
        transition: `opacity 0.7s cubic-bezier(.2,.7,.2,1) ${delay}s, transform 0.7s cubic-bezier(.2,.7,.2,1) ${delay}s`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* Counts up from 0 to the leading number in a string once scrolled into view, e.g. "3+" -> 0,1,2,3+ */
export function CountUp({ text }) {
  const [ref, visible] = useReveal();
  const match = String(text || '').match(/^(\d+)(.*)$/);
  const target = match ? parseInt(match[1], 10) : null;
  const suffix = match ? match[2] : '';
  const [val, setVal] = useState(target !== null ? 0 : null);
  useEffect(() => {
    if (!visible || target === null) return;
    const duration = 900;
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      setVal(Math.round(p * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible, target]);
  return <span ref={ref}>{target !== null ? `${val}${suffix}` : text}</span>;
}

/* Section heading that reveals word-by-word with a mask/slide-up motion, Apple-product-page style */
export function HeadingReveal({ text, className = '', style = {} }) {
  const [ref, visible] = useReveal();
  const words = String(text || '').split(' ');
  return (
    <h2 ref={ref} className={className} style={{ ...style, overflow: 'hidden' }}>
      {words.map((w, i) => (
        <span key={i} style={{ display: 'inline-block', overflow: 'hidden', marginRight: '0.28em' }}>
          <span
            style={{
              display: 'inline-block',
              transform: visible ? 'translateY(0)' : 'translateY(110%)',
              transition: `transform 0.65s cubic-bezier(.2,.7,.2,1) ${i * 0.05}s`,
            }}
          >
            {w}
          </span>
        </span>
      ))}
    </h2>
  );
}

export const SECTION_IDS = ['about', 'skills', 'projects', 'experience', 'contact'];

/* Tracks which section is currently centered in the viewport, for the sliding nav indicator */
export function useActiveSection() {
  const [active, setActive] = useState('');
  useEffect(() => {
    const els = SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean);
    if (els.length === 0) return;
    const obs = new IntersectionObserver(
      (entries) => { entries.forEach((entry) => { if (entry.isIntersecting) setActive(entry.target.id); }); },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
  return active;
}

/* Subtle depth-of-field parallax: element drifts opposite to scroll based on distance from viewport center */
export function useParallax(ref, factor, disabled) {
  useEffect(() => {
    if (disabled) return;
    const el = ref.current; if (!el) return;
    let ticking = false;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const center = rect.top + rect.height / 2 - window.innerHeight / 2;
      el.style.transform = `translateY(${(center * -factor).toFixed(2)}px)`;
      ticking = false;
    };
    const onScroll = () => { if (!ticking) { requestAnimationFrame(update); ticking = true; } };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [disabled, factor]);
}

/* Full-screen intro splash: name decodes in, progress bar fills, then curtain-wipes up to reveal the site */
export function IntroLoader({ name, onComplete, skip }) {
  const [phase, setPhase] = useState(skip ? 'done' : 'show');
  useEffect(() => {
    if (skip) { onComplete(); return; }
    const t1 = setTimeout(() => setPhase('exit'), 1100);
    const t2 = setTimeout(() => { setPhase('done'); onComplete(); }, 1100 + 700);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [skip]);

  if (phase === 'done') return null;
  return (
    <div className={`intro-loader ${phase === 'exit' ? 'intro-exit' : ''}`}>
      <div className="intro-mark font-display">
        <ScrambleText text={name || 'PORTFOLIO'} triggerOnMount hoverable={false} />
      </div>
      <div className="intro-bar"><div className="intro-bar-fill" /></div>
    </div>
  );
}

/* Word-by-word stagger reveal, Apple keynote style */
export function SplitReveal({ text, as: Tag = 'h2', className = '' }) {
  const [ref, visible] = useReveal();
  const words = text.split(' ');
  return (
    <Tag ref={ref} className={className}>
      {words.map((w, i) => (
        <span key={i} className={`split-word-wrap ${visible ? 'in-view' : ''}`} style={{ transitionDelay: `${i * 0.05}s` }}>
          <span className="split-word" style={{ transitionDelay: `${i * 0.05}s` }}>{w}</span>
          {i < words.length - 1 ? '\u00A0' : ''}
        </span>
      ))}
    </Tag>
  );
}

/* Count-up number, triggers once when scrolled into view */
export function Counter({ to, suffix = '', duration = 1400, className = '' }) {
  const [ref, visible] = useReveal();
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!visible) return;
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(to * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible, to, duration]);
  return (
    <span ref={ref} className={`stat-number ${className}`}>{value}{suffix}</span>
  );
}

/* Clip-path curtain reveal for images, triggers once in view */
export function RevealImage({ src, alt, style = {} }) {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} className="reveal-image-wrap" style={{ width: '100%', height: '100%' }}>
      <img
        src={src}
        alt={alt}
        className={`reveal-image-inner ${visible ? 'in-view' : ''}`}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', ...style }}
      />
    </div>
  );
}


/* =========================================================================
   GLOBAL STYLE — monochrome, high-animation, futuristic
   ========================================================================= */

export const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans+Condensed:wght@500;600;700&display=swap');

    .mecha-root {
      --bg: #000000;
      --panel: #0A0A0A;
      --panel-2: #111111;
      --border: #2A2A2A;
      --border-soft: #1A1A1A;
      --text: #FFFFFF;
      --text-muted: #8C8C8C;
      --accent: #FFFFFF;
      --accent-text: #000000;
      --font-display: 'Space Grotesk', sans-serif;
      --ease: cubic-bezier(0.16, 1, 0.3, 1);
      background: var(--bg);
      color: var(--text);
      font-family: 'Inter', sans-serif;
      position: relative;
      overflow-x: hidden;
      transition: background 0.4s ease, color 0.4s ease;
    }
    .mecha-root * { box-sizing: border-box; }
    .mecha-root .font-display { font-family: var(--font-display); }
    .mecha-root .font-mono { font-family: 'IBM Plex Mono', monospace; }
    .mecha-root.no-native-cursor, .mecha-root.no-native-cursor * { cursor: none !important; }

    .mecha-root .bg-grid {
      background-image:
        linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px);
      background-size: 42px 42px;
    }
    .mecha-root .spotlight-grid {
      position: absolute; inset: 0; pointer-events: none;
      background-image:
        radial-gradient(360px circle at var(--mx, 60%) var(--my, 35%), rgba(255,255,255,0.16), transparent 60%),
        linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px);
      background-size: 100% 100%, 42px 42px, 42px 42px;
    }

    .mecha-root .panel { background: rgba(10,10,10,0.62); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1px solid var(--border); }
    .mecha-root .panel-2 { background: rgba(17,17,17,0.62); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1px solid var(--border); }
    .mecha-root .text-muted { color: var(--text-muted); }
    .mecha-root .border-hair { border: 1px solid var(--border); }
    .mecha-root .border-t-hair { border-top: 1px solid var(--border); }
    .mecha-root .border-b-hair { border-bottom: 1px solid var(--border); }
    .mecha-root a { color: inherit; text-decoration: none; }

    .mecha-root .btn {
      font-family: 'Inter', sans-serif;
      font-weight: 600;
      font-size: 14px;
      padding: 12px 22px;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      transition: transform 0.15s ease, background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
      border: 1px solid var(--border);
      background: transparent;
      color: var(--text);
      position: relative;
      overflow: hidden;
      isolation: isolate;
    }
    .mecha-root .btn::after {
      content: ''; position: absolute; top: 0; left: -75%; width: 45%; height: 100%;
      background: linear-gradient(120deg, transparent, rgba(255,255,255,0.35), transparent);
      transform: skewX(-20deg);
      transition: left 0.65s cubic-bezier(.2,.7,.2,1);
      z-index: -1;
    }
    .mecha-root .btn-outline::after { background: linear-gradient(120deg, transparent, rgba(255,255,255,0.14), transparent); }
    .mecha-root .btn-primary::after { background: linear-gradient(120deg, transparent, rgba(0,0,0,0.18), transparent); }
    .mecha-root .btn:hover::after { left: 130%; }
    .mecha-root .btn:active { transform: scale(0.96); }
    .mecha-root .btn-primary { background: var(--accent); color: var(--accent-text); border-color: var(--accent); }
    .mecha-root .btn-primary:hover { filter: brightness(0.9); }
    .mecha-root .btn-outline:hover { border-color: var(--accent); color: var(--accent); }
    .mecha-root .btn:disabled { opacity: 0.35; cursor: not-allowed; }
    .mecha-root .btn:focus-visible, .mecha-root button:focus-visible, .mecha-root input:focus-visible,
    .mecha-root textarea:focus-visible, .mecha-root select:focus-visible, .mecha-root a:focus-visible {
      outline: 2px solid var(--accent); outline-offset: 2px;
    }

    .mecha-root .input {
      width: 100%;
      background: var(--bg);
      border: 1px solid var(--border);
      color: var(--text);
      border-radius: 6px;
      padding: 10px 12px;
      font-family: 'Inter', sans-serif;
      font-size: 14px;
    }
    .mecha-root .input:focus { border-color: var(--accent); outline: none; }
    .mecha-root .label {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 11px; letter-spacing: 0.06em; color: var(--text-muted);
      text-transform: uppercase; display: block; margin-bottom: 6px;
    }

    .mecha-root .eyebrow {
      display: inline-flex; align-items: center; gap: 8px;
      font-family: 'IBM Plex Mono', monospace;
      font-size: 12px; letter-spacing: 0.2em; text-transform: uppercase;
      color: var(--text-muted);
    }
    .mecha-root .eyebrow .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); flex-shrink: 0; }

    .mecha-root .dim-divider { display: flex; align-items: center; gap: 10px; color: var(--border); margin: 0 auto; }
    .mecha-root .dim-divider .line { flex: 1; height: 1px; background: var(--border); }
    .mecha-root .dim-divider .diamond { width: 6px; height: 6px; background: var(--border); transform: rotate(45deg); flex-shrink: 0; }

    .mecha-root .chip {
      font-family: 'IBM Plex Mono', monospace; font-size: 11px; padding: 4px 10px;
      border-radius: 999px; border: 1px solid var(--border); color: var(--text-muted);
      display: inline-flex; align-items: center; gap: 6px; white-space: nowrap;
    }

    .mecha-root .card {
      background: var(--panel); border: 1px solid var(--border); border-radius: 14px;
      overflow: hidden; transition: border-color 0.2s ease; position: relative;
    }
    .mecha-root .card:hover { border-color: var(--accent); }
    .mecha-root .card::before {
      content: ''; position: absolute; inset: 0; pointer-events: none; z-index: 0;
      background: radial-gradient(240px circle at var(--gx, 50%) var(--gy, 50%), rgba(255,255,255,0.12), transparent 60%);
      opacity: 0; transition: opacity 0.3s ease;
    }
    .mecha-root .card:hover::before { opacity: 1; }
    .mecha-root .card > * { position: relative; z-index: 1; }

    .mecha-root .glow-wrap { position: relative; border-radius: 15px; padding: 1px; overflow: hidden; }
    .mecha-root .glow-wrap::before {
      content: ''; position: absolute; inset: -60%; z-index: 0;
      background: conic-gradient(from 0deg, transparent 0%, var(--accent) 8%, transparent 22%);
      opacity: 0; transition: opacity 0.35s ease;
      animation: glowSpin 4s linear infinite;
    }
    .mecha-root .glow-wrap:hover::before { opacity: 1; }
    @keyframes glowSpin { to { transform: rotate(360deg); } }

    .mecha-root .scroll-hidden::-webkit-scrollbar { width: 8px; height: 8px; }
    .mecha-root .scroll-hidden::-webkit-scrollbar-track { background: var(--bg); }
    .mecha-root .scroll-hidden::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }

    .mecha-root .admin-grid { display: grid; grid-template-columns: 1fr; }
    @media (min-width: 768px) { .mecha-root .admin-grid { grid-template-columns: 180px 1fr; } }

    /* ---- Cursor ---- */
    .cx-dot {
      position: fixed; top: 0; left: 0; width: 7px; height: 7px; background: #fff;
      border-radius: 50%; pointer-events: none; z-index: 9999; mix-blend-mode: difference;
    }
    .cx-ring {
      position: fixed; top: 0; left: 0; width: 38px; height: 38px;
      border: 1px solid rgba(255,255,255,0.55); border-radius: 50%;
      pointer-events: none; z-index: 9998; display: flex; align-items: center; justify-content: center;
      transition: width 0.25s ease, height 0.25s ease, background 0.25s ease, border-color 0.25s ease;
      mix-blend-mode: difference;
    }
    .cx-ring-big { width: 88px; height: 88px; background: rgba(255,255,255,0.5); }
    .cx-label { font-family: 'IBM Plex Mono', monospace; font-size: 10px; letter-spacing: 0.1em; color: #000; text-transform: uppercase; }

    /* ---- Nav active indicator ---- */
    .nav-indicator {
      position: absolute; bottom: -6px; left: 0; height: 2px; background: var(--accent);
      transition: transform 0.4s cubic-bezier(.2,.7,.2,1), width 0.4s cubic-bezier(.2,.7,.2,1), opacity 0.25s ease;
    }

    /* ---- Intro loader ---- */
    .intro-loader {
      position: fixed; inset: 0; z-index: 10000; background: var(--bg);
      display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 22px;
      transition: transform 0.7s cubic-bezier(.76,0,.24,1);
    }
    .intro-loader.intro-exit { transform: translateY(-100%); }
    .intro-mark { font-size: clamp(1.6rem, 5vw, 2.6rem); font-weight: 600; letter-spacing: 0.02em; color: var(--text); }
    .intro-bar { width: 160px; height: 2px; background: rgba(255,255,255,0.15); overflow: hidden; }
    .intro-bar-fill { height: 100%; width: 100%; background: var(--accent); transform: translateX(-100%); animation: introFill 1.1s cubic-bezier(.6,.2,.2,1) forwards; }
    @keyframes introFill { to { transform: translateX(0); } }

    /* ---- Scroll progress ---- */
    .scroll-progress { position: fixed; top: 0; left: 0; right: 0; height: 2px; z-index: 9997; background: rgba(255,255,255,0.08); }
    .scroll-progress-bar { height: 100%; width: 0%; background: var(--accent); }

    /* ---- Theme switcher ---- */
    .theme-fab {
      position: fixed; bottom: 22px; left: 22px; z-index: 9995;
      width: 46px; height: 46px; border-radius: 50%; background: var(--panel);
      border: 1px solid var(--border); display: flex; align-items: center; justify-content: center;
      cursor: pointer; backdrop-filter: blur(10px); color: var(--text);
    }
    .theme-panel {
      position: fixed; bottom: 76px; left: 22px; z-index: 9995;
      background: var(--panel); border: 1px solid var(--border); border-radius: 12px;
      padding: 10px; display: flex; flex-direction: column; gap: 4px; backdrop-filter: blur(14px);
      min-width: 170px;
    }
    .theme-option {
      display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: 8px;
      cursor: pointer; border: none; background: transparent; color: var(--text); font-size: 12.5px;
      font-family: 'Inter', sans-serif; text-align: left; width: 100%;
    }
    .theme-option:hover { background: var(--panel-2); }
    .theme-option.active { color: var(--accent); }
    .theme-swatch-pair { display: flex; border-radius: 50%; overflow: hidden; width: 18px; height: 18px; flex-shrink: 0; border: 1px solid var(--border); }
    .theme-swatch-pair span { flex: 1; }

    /* ---- Marquee ---- */
    .marquee-wrap { overflow: hidden; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); padding: 20px 0; }
    .marquee-track { display: flex; width: max-content; animation: marquee 26s linear infinite; }
    .marquee-wrap:hover .marquee-track { animation-play-state: paused; }
    .marquee-item {
      font-family: 'Space Grotesk', sans-serif; font-size: 16px; font-weight: 600;
      letter-spacing: 0.01em; white-space: nowrap; display: flex; align-items: center; gap: 40px;
      color: var(--text-muted); padding-right: 40px;
    }
    .marquee-dot { color: var(--border); font-size: 10px; }
    @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }

    @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
    .fade-up { animation: fadeUp 0.8s cubic-bezier(.2,.7,.2,1) both; }

    @keyframes pulse-node { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }
    .pulse { animation: pulse-node 2.2s ease-in-out infinite; }

    @keyframes traceDash { to { stroke-dashoffset: 0; } }
    .trace-anim { stroke-dasharray: 8 6; stroke-dashoffset: 400; animation: traceDash 6s linear infinite; }

    @media (prefers-reduced-motion: reduce) {
      .mecha-root * { animation: none !important; transition: none !important; }
    }

    /* ---- Shine-sweep on primary buttons ---- */
    .mecha-root .btn-primary { position: relative; overflow: hidden; }
    .mecha-root .btn-primary::after {
      content: ''; position: absolute; top: 0; left: -60%; width: 40%; height: 100%;
      background: linear-gradient(115deg, transparent, rgba(0,0,0,0.35), transparent);
      transform: skewX(-20deg);
      transition: left 0.65s var(--ease);
    }
    .mecha-root .btn-primary:hover::after { left: 130%; }

    /* ---- Clip-path image reveal ---- */
    .reveal-image-wrap { overflow: hidden; }
    .reveal-image-inner {
      transition: clip-path 1s var(--ease), transform 1.1s var(--ease), opacity 0.6s ease;
      clip-path: inset(0 0 100% 0);
      transform: scale(1.12);
      opacity: 0;
    }
    .reveal-image-inner.in-view { clip-path: inset(0 0 0% 0); transform: scale(1); opacity: 1; }

    /* ---- Split word stagger reveal ---- */
    .split-word-wrap { display: inline-block; overflow: hidden; padding-bottom: 0.08em; margin-bottom: -0.08em; }
    .split-word {
      display: inline-block;
      transform: translateY(110%);
      transition: transform 0.9s var(--ease);
    }
    .split-word-wrap.in-view .split-word { transform: translateY(0); }

    /* ---- Counters ---- */
    .stat-number { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-variant-numeric: tabular-nums; }

    /* ---- Cursor glow (trailing soft halo) ---- */
    .cx-glow {
      position: fixed; top: 0; left: 0; width: 260px; height: 260px; border-radius: 50%;
      pointer-events: none; z-index: 9997;
      background: radial-gradient(circle, rgba(255,255,255,0.06), transparent 70%);
    }

    /* ---- Intro loader ---- */
    .intro-loader {
      position: fixed; inset: 0; z-index: 10000; background: #000;
      display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 22px;
      transition: opacity 0.6s var(--ease), transform 0.8s var(--ease);
    }
    .intro-loader.leaving { opacity: 0; transform: scale(1.04); pointer-events: none; }
    .intro-loader-mark {
      width: 56px; height: 56px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.25);
      display: flex; align-items: center; justify-content: center;
      animation: introSpin 2.6s linear infinite;
    }
    @keyframes introSpin { to { transform: rotate(360deg); } }
    .intro-loader-bar { width: 160px; height: 1px; background: rgba(255,255,255,0.15); position: relative; overflow: hidden; }
    .intro-loader-bar-fill { position: absolute; inset: 0; background: #fff; transform-origin: left; }
    .intro-loader-pct { font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 0.15em; color: var(--text-muted); }

    @media (prefers-reduced-motion: reduce) {
      .split-word { transform: none; }
      .reveal-image-inner { clip-path: none; transform: none; opacity: 1; }
    }

    .mecha-root .modal-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.9);
      backdrop-filter: blur(4px);
      display: flex; align-items: center; justify-content: center;
      z-index: 100; padding: 20px;
    }
  `}</style>
);

/* =========================================================================
   SMALL PRESENTATIONAL PIECES
   ========================================================================= */

export function Eyebrow({ children }) {
  return <div className="eyebrow mb-3"><span className="dot" />{children}</div>;
}
export function Divider() {
  return (
    <div className="dim-divider" style={{ maxWidth: 1120, margin: '0 auto' }}>
      <div className="line" /><div className="diamond" /><div className="line" />
    </div>
  );
}

export function ThemeSwitcher({ themeKey, setThemeKey }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        className="theme-fab"
        onClick={() => setOpen((o) => !o)}
        title="Change theme"
        aria-label="Change theme"
        data-cursor-hover
        data-cursor-text="Theme"
      >
        <Palette size={19} />
      </button>
      {open && (
        <div className="theme-panel">
          {THEME_ORDER.map((key) => {
            const t = THEMES[key];
            return (
              <button
                key={key}
                className={`theme-option ${themeKey === key ? 'active' : ''}`}
                onClick={() => { setThemeKey(key); setOpen(false); }}
              >
                <span className="theme-swatch-pair">
                  <span style={{ background: t.swatch[0] }} />
                  <span style={{ background: t.swatch[1] }} />
                </span>
                {t.label}
              </button>
            );
          })}
        </div>
      )}
    </>
  );
}

/* =========================================================================
   NAV
   ========================================================================= */

export function Nav({ profile, onNavigate, goAdmin, mobileOpen, setMobileOpen, active }) {
  const links = ['About', 'Skills', 'Projects', 'Experience', 'Contact'];
  const navRef = useRef(null);
  const btnRefs = useRef({});
  const [indicator, setIndicator] = useState({ left: 0, width: 0, opacity: 0 });

  useEffect(() => {
    const el = btnRefs.current[active];
    if (el && navRef.current) {
      const navRect = navRef.current.getBoundingClientRect();
      const rect = el.getBoundingClientRect();
      setIndicator({ left: rect.left - navRect.left, width: rect.width, opacity: 1 });
    } else {
      setIndicator((s) => ({ ...s, opacity: 0 }));
    }
  }, [active]);

  return (
    <header className="border-b-hair" style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto' }} className="flex items-center justify-between px-6 py-4">
        <button data-cursor-hover data-cursor-text="Top" onClick={() => onNavigate('hero')} className="flex items-center gap-2" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <Cpu size={18} />
          <span className="font-display font-semibold" style={{ fontSize: 17, letterSpacing: '0.01em' }}>
            {(profile.name || 'Your Name').split(' ')[0]}<span style={{ opacity: 0.4 }}>.</span>
          </span>
        </button>
        <nav ref={navRef} className="hidden md:flex items-center gap-7 font-mono" style={{ fontSize: 12.5, letterSpacing: '0.08em', position: 'relative' }}>
          <div className="nav-indicator" style={{ transform: `translateX(${indicator.left}px)`, width: indicator.width, opacity: indicator.opacity }} />
          {links.map((l) => {
            const key = l.toLowerCase();
            return (
              <button
                key={l}
                ref={(el) => (btnRefs.current[key] = el)}
                data-cursor-hover
                onClick={() => onNavigate(key)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', textTransform: 'uppercase', color: active === key ? 'var(--accent)' : 'var(--text-muted)', transition: 'color 0.2s ease' }}
              >
                {l}
              </button>
            );
          })}
          <button data-cursor-hover data-cursor-text="Edit" onClick={goAdmin} title="Edit your portfolio" className="text-muted" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <Pencil size={14} />
          </button>
        </nav>
        <button className="md:hidden" style={{ background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer' }} onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {mobileOpen && (
        <div className="md:hidden border-t-hair px-6 py-4 flex flex-col gap-4 font-mono" style={{ fontSize: 13 }}>
          {links.map((l) => (
            <button key={l} onClick={() => { onNavigate(l.toLowerCase()); setMobileOpen(false); }} className="text-muted text-left" style={{ background: 'none', border: 'none', cursor: 'pointer', textTransform: 'uppercase' }}>
              {l}
            </button>
          ))}
          <button onClick={goAdmin} className="text-muted text-left flex items-center gap-2" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <Pencil size={14} /> EDIT PORTFOLIO
          </button>
        </div>
      )}
    </header>
  );
}

/* =========================================================================
   HERO
   ========================================================================= */

export function SchematicArt() {
  const accent = { stroke: 'var(--accent)' };
  const accentFill = { fill: 'var(--accent)' };
  return (
    <svg viewBox="0 0 420 420" style={{ width: '100%', maxWidth: 420 }}>
      <g opacity="0.4" stroke="#2A2A2A" strokeWidth="1">
        <line x1="0" y1="105" x2="420" y2="105" /><line x1="0" y1="210" x2="420" y2="210" /><line x1="0" y1="315" x2="420" y2="315" />
        <line x1="105" y1="0" x2="105" y2="420" /><line x1="210" y1="0" x2="210" y2="420" /><line x1="315" y1="0" x2="315" y2="420" />
      </g>
      <circle cx="210" cy="150" r="46" fill="none" style={accent} strokeWidth="2" />
      <circle cx="210" cy="150" r="6" style={accentFill} className="pulse" />
      <path d="M210 104 L210 60 L300 60" fill="none" style={accent} strokeWidth="1.5" className="trace-anim" opacity="0.8" />
      <circle cx="300" cy="60" r="4" style={accentFill} className="pulse" />
      <path d="M164 150 L90 150 L90 260" fill="none" style={accent} strokeWidth="1.5" className="trace-anim" opacity="0.8" />
      <circle cx="90" cy="260" r="4" style={accentFill} className="pulse" />
      <path d="M210 196 L210 260 L210 320" fill="none" style={accent} strokeWidth="1.5" className="trace-anim" opacity="0.8" />
      <rect x="180" y="320" width="60" height="34" rx="3" fill="none" style={accent} strokeWidth="2" />
      <path d="M256 150 L340 150 L340 300" fill="none" style={accent} strokeWidth="1.5" className="trace-anim" opacity="0.8" />
      <circle cx="340" cy="300" r="4" style={accentFill} className="pulse" />
      <rect x="70" y="240" width="40" height="24" rx="3" fill="none" style={accent} strokeWidth="2" opacity="0.8" />
      <rect x="320" y="284" width="40" height="24" rx="3" fill="none" style={accent} strokeWidth="2" opacity="0.8" />
      <text x="210" y="154" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="11" style={accentFill}>CTRL</text>
    </svg>
  );
}

export function Hero({ profile, onNavigate, reducedMotion }) {
  const artRef = useRef(null);
  useParallax(artRef, 0.1, reducedMotion);
  return (
    <section id="hero" style={{ position: 'relative', overflow: 'hidden' }} className="px-6 pt-16 pb-20 md:pt-24 md:pb-28">
      <SpotlightGrid disabled={reducedMotion} />
      <div style={{ maxWidth: 1120, margin: '0 auto', position: 'relative' }} className="grid md:grid-cols-2 gap-12 items-center">
        <div className="fade-up">
          <div className="eyebrow mb-5"><span className="dot" />{profile.role || 'Mechatronics Engineer'}</div>
          <h1 className="font-display font-semibold" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.6rem)', lineHeight: 1.04, letterSpacing: '-0.02em' }}>
            <ScrambleText text={profile.name || 'Your Name'} triggerOnMount hoverable={false} />
          </h1>
          <p className="text-muted mt-5" style={{ fontSize: 16.5, lineHeight: 1.65, maxWidth: 480 }}>{profile.tagline}</p>
          <div className="flex flex-wrap gap-3 mt-8">
            <Magnetic>
              <button data-cursor-hover data-cursor-text="Go" className="btn btn-primary" onClick={() => onNavigate('projects')}>
                View Projects <ArrowRight size={15} />
              </button>
            </Magnetic>
            {profile.resumeUrl ? (
              <Magnetic>
                <a data-cursor-hover href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                  <Download size={15} /> Resume
                </a>
              </Magnetic>
            ) : null}
            <Magnetic>
              <button data-cursor-hover className="btn btn-outline" onClick={() => onNavigate('contact')}>Contact</button>
            </Magnetic>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-3 mt-10 font-mono text-muted" style={{ fontSize: 12 }}>
            <div><span style={{ color: 'var(--accent)' }}><CountUp text={profile.yearsExperience} /></span> EXPERIENCE</div>
            <div>{profile.education}</div>
          </div>
        </div>
        <div ref={artRef} className="flex justify-center fade-up" style={{ animationDelay: '0.15s' }}>
          <SchematicArt />
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   ABOUT
   ========================================================================= */

export function About({ profile }) {
  const facts = [
    { label: 'Focus', value: profile.focusAreas },
    { label: 'Education', value: profile.education },
    { label: 'Location', value: profile.location },
    { label: 'Experience', value: profile.yearsExperience },
  ];
  return (
    <section id="about" className="px-6 py-20">
      <div style={{ maxWidth: 1120, margin: '0 auto' }} className="grid md:grid-cols-5 gap-12">
        <div className="md:col-span-3">
          <Reveal><Eyebrow>About</Eyebrow></Reveal>
          <HeadingReveal text="How I approach the work" className="font-display font-semibold" style={{ fontSize: 30 }} />
          <Reveal delay={0.1}>
            <p className="text-muted mt-5" style={{ fontSize: 15.5, lineHeight: 1.75 }}>{profile.bio}</p>
          </Reveal>
        </div>
        <div className="md:col-span-2 grid grid-cols-2 gap-4 content-start">
          {facts.map((f, i) => (
            <Reveal key={f.label} delay={i * 0.06}>
              <div className="panel rounded-lg p-4">
                <div className="label">{f.label}</div>
                <div style={{ fontSize: 14 }}>{f.value}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   SKILLS
   ========================================================================= */

export function Skills({ skills }) {
  const cats = Object.keys(skills || {});
  return (
    <section id="skills" className="px-6 py-20 border-t-hair">
      <div style={{ maxWidth: 1120, margin: '0 auto' }}>
        <Reveal><Eyebrow>Skills</Eyebrow></Reveal>
        <HeadingReveal text="Tools of the trade" className="font-display font-semibold mb-10" style={{ fontSize: 30 }} />
        <div className="grid md:grid-cols-2 gap-5">
          {cats.map((cat, i) => (
            <Reveal key={cat} delay={i * 0.07}>
              <TiltCard className="panel rounded-lg p-6">
                <div className="font-mono mb-4" style={{ fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent)' }}>{cat}</div>
                <div className="flex flex-wrap gap-2">
                  {(skills[cat] || []).map((s) => <span key={s} className="chip">{s}</span>)}
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   PROJECTS
   ========================================================================= */

export function ProjectCard({ project, onOpen }) {
  const thumb = project.videoUrl ? (project.videoThumbnail || autoThumbnail(project.videoUrl) || project.image) : project.image;
  return (
    <div className="glow-wrap">
    <TiltCard className="card" style={{ cursor: 'pointer' }}>
      <div data-cursor-hover data-cursor-text={project.videoUrl ? 'Play' : 'View'} onClick={() => onOpen(project)}>
        <div style={{ position: 'relative', aspectRatio: '16/10', overflow: 'hidden', background: '#050505' }}>
          {thumb ? <img src={thumb} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(1) contrast(1.05)' }} /> : null}
          {project.videoUrl ? (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)' }}>
              <div style={{ width: 46, height: 46, borderRadius: '50%', background: 'rgba(0,0,0,0.6)', border: '1px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Play size={18} color="#fff" style={{ marginLeft: 2 }} />
              </div>
            </div>
          ) : null}
          <div className="chip" style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(0,0,0,0.7)' }}>{project.category}</div>
        </div>
        <div className="p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-semibold" style={{ fontSize: 17 }}>{project.title}</h3>
            <span className="font-mono text-muted" style={{ fontSize: 11 }}>{project.date}</span>
          </div>
          <p className="text-muted mt-2" style={{ fontSize: 13.5, lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            {(project.tags || []).slice(0, 3).map((t) => <span key={t} className="chip">{t}</span>)}
          </div>
        </div>
      </div>
    </TiltCard>
    </div>
  );
}

export function ProjectModal({ project, onClose }) {
  const [playing, setPlaying] = useState(false);
  if (!project) return null;
  const embed = videoEmbedUrl(project.videoUrl);
  const thumb = project.videoThumbnail || autoThumbnail(project.videoUrl) || project.image;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="panel scroll-hidden" style={{ maxWidth: 720, width: '100%', maxHeight: '88vh', overflowY: 'auto', borderRadius: 14 }} onClick={(e) => e.stopPropagation()}>
        <div style={{ position: 'relative', aspectRatio: '16/9', background: '#000' }}>
          {playing && embed ? (
            <iframe src={embed} title={project.title} style={{ width: '100%', height: '100%', border: 'none' }} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
          ) : (
            <>
              {thumb ? <img src={thumb} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(1)' }} /> : null}
              {project.videoUrl ? (
                <button onClick={() => (embed ? setPlaying(true) : window.open(project.videoUrl, '_blank', 'noopener'))} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(0,0,0,0.7)', border: '1px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Play size={24} color="#fff" style={{ marginLeft: 3 }} />
                  </div>
                </button>
              ) : null}
            </>
          )}
          <button onClick={onClose} className="btn" style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,0.75)', padding: 8, borderRadius: 8 }}>
            <X size={16} />
          </button>
        </div>
        <div className="p-7">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="chip">{project.category}</span>
            <span className="font-mono text-muted" style={{ fontSize: 12 }}>{project.date}</span>
          </div>
          <h3 className="font-display font-semibold mt-4" style={{ fontSize: 24 }}>{project.title}</h3>
          <p className="text-muted mt-3" style={{ fontSize: 14.5, lineHeight: 1.75 }}>{project.description}</p>
          <div className="flex flex-wrap gap-2 mt-5">
            {(project.tags || []).map((t) => <span key={t} className="chip">{t}</span>)}
          </div>
          {project.videoUrl && !embed ? (
            <a href={project.videoUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline mt-5">Watch demo <ExternalLink size={14} /></a>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function Projects({ projects }) {
  const [filter, setFilter] = useState('All');
  const [active, setActive] = useState(null);
  const cats = ['All', ...Array.from(new Set(projects.map((p) => p.category)))];
  const shown = filter === 'All' ? projects : projects.filter((p) => p.category === filter);

  return (
    <section id="projects" className="px-6 py-20 border-t-hair">
      <div style={{ maxWidth: 1120, margin: '0 auto' }}>
        <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
          <div>
            <Reveal><Eyebrow>Projects</Eyebrow></Reveal>
            <HeadingReveal text="Selected work" className="font-display font-semibold" style={{ fontSize: 30 }} />
          </div>
          <Reveal delay={0.1}>
            <div className="flex flex-wrap gap-2">
              {cats.map((c) => (
                <button key={c} data-cursor-hover onClick={() => setFilter(c)} className="chip" style={{ cursor: 'pointer', borderColor: filter === c ? 'var(--accent)' : 'var(--border)', color: filter === c ? 'var(--accent)' : 'var(--text-muted)' }}>
                  {c}
                </button>
              ))}
            </div>
          </Reveal>
        </div>
        {shown.length === 0 ? (
          <div className="panel rounded-lg p-10 text-center text-muted">No projects in this category yet.</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shown.map((p, i) => (
              <Reveal key={p.id} delay={(i % 3) * 0.08}>
                <ProjectCard project={p} onOpen={setActive} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
      <ProjectModal project={active} onClose={() => setActive(null)} />
    </section>
  );
}

/* =========================================================================
   EXPERIENCE
   ========================================================================= */

export function Experience({ experience }) {
  return (
    <section id="experience" className="px-6 py-20 border-t-hair">
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <Reveal><Eyebrow>Experience</Eyebrow></Reveal>
        <HeadingReveal text="Where I've worked and studied" className="font-display font-semibold mb-10" style={{ fontSize: 30 }} />
        <div className="flex flex-col">
          {experience.map((e, i) => (
            <Reveal key={e.id || i} delay={i * 0.08}>
              <div className="flex gap-6 pb-9" style={{ borderLeft: i === experience.length - 1 ? 'none' : '1px solid var(--border)', marginLeft: 5, paddingLeft: 26, position: 'relative' }}>
                <div style={{ position: 'absolute', left: -4, top: 4, width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)' }} />
                <div>
                  <div className="font-mono text-muted" style={{ fontSize: 11.5, letterSpacing: '0.04em' }}>{e.duration}</div>
                  <h3 className="font-display font-semibold mt-1" style={{ fontSize: 17 }}>{e.title}</h3>
                  <div className="font-mono" style={{ fontSize: 12.5, marginTop: 2, color: 'var(--accent)' }}>{e.org}</div>
                  <p className="text-muted mt-2" style={{ fontSize: 14, lineHeight: 1.7, maxWidth: 620 }}>{e.description}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   CONTACT
   ========================================================================= */

export function Contact({ profile }) {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const send = () => {
    const subject = encodeURIComponent(`Portfolio inquiry from ${form.name || 'a visitor'}`);
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`);
    window.open(`mailto:${profile.email}?subject=${subject}&body=${body}`, '_blank');
  };
  return (
    <section id="contact" className="px-6 py-20 border-t-hair" style={{ position: 'relative' }}>
      <div className="bg-grid" style={{ position: 'absolute', inset: 0, opacity: 0.5 }} />
      <div style={{ maxWidth: 1120, margin: '0 auto', position: 'relative' }} className="grid md:grid-cols-2 gap-12">
        <div>
          <Reveal><Eyebrow>Contact</Eyebrow></Reveal>
          <HeadingReveal text="Let's build something" className="font-display font-semibold" style={{ fontSize: 30 }} />
          <Reveal delay={0.1}>
          <p className="text-muted mt-4" style={{ fontSize: 15, lineHeight: 1.7, maxWidth: 420 }}>
            Open to new projects, collaborations, and full-time roles in robotics, automation, and embedded systems.
          </p>
          <div className="flex flex-col gap-4 mt-8">
            {profile.email && <a data-cursor-hover href={`mailto:${profile.email}`} className="flex items-center gap-3 text-muted"><Mail size={16} /> {profile.email}</a>}
            {profile.phone && <div className="flex items-center gap-3 text-muted"><Phone size={16} /> {profile.phone}</div>}
            {profile.location && <div className="flex items-center gap-3 text-muted"><MapPin size={16} /> {profile.location}</div>}
            <div className="flex gap-4 mt-2">
              {profile.linkedin && <a data-cursor-hover href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="chip"><Linkedin size={13} /> LinkedIn</a>}
              {profile.github && <a data-cursor-hover href={profile.github} target="_blank" rel="noopener noreferrer" className="chip"><Github size={13} /> GitHub</a>}
            </div>
          </div>
        </Reveal>
        </div>
        <Reveal delay={0.1}>
          <div className="panel rounded-lg p-6">
            <div className="mb-4"><label className="label">Name</label><input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" /></div>
            <div className="mb-4"><label className="label">Email</label><input className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@company.com" /></div>
            <div className="mb-5"><label className="label">Message</label><textarea className="input" rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell me about the project..." /></div>
            <Magnetic style={{ width: '100%' }}>
              <button data-cursor-hover data-cursor-text="Send" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={send}>
                Send message <ArrowUpRight size={15} />
              </button>
            </Magnetic>
            <p className="text-muted mt-3" style={{ fontSize: 11.5 }}>Opens your email client with this message pre-filled.</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Footer({ profile, goAdmin, goOwner }) {
  return (
    <footer className="px-6 py-8 border-t-hair">
      <div className="flex items-center justify-between flex-wrap gap-3 font-mono text-muted" style={{ maxWidth: 1120, margin: '0 auto', fontSize: 11.5 }}>
        <span>© {new Date().getFullYear()} {profile.name}. Built with intent.</span>
        <div className="flex items-center gap-4">
          <button onClick={goAdmin} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>Edit portfolio</button>
          <button onClick={goOwner} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: 10, opacity: 0.55 }}>Owner</button>
        </div>
      </div>
    </footer>
  );
}
export function ProfileTab({ profile, onSave }) {
  const [draft, setDraft] = useState(profile);
  const [saving, setSaving] = useState(false);
  useEffect(() => setDraft(profile), [profile]);
  const field = (key, label, area) => (
    <div className="mb-4">
      <label className="label">{label}</label>
      {area ? <textarea className="input" rows={4} value={draft[key] || ''} onChange={(e) => setDraft({ ...draft, [key]: e.target.value })} /> : <input className="input" value={draft[key] || ''} onChange={(e) => setDraft({ ...draft, [key]: e.target.value })} />}
    </div>
  );
  const save = async () => { setSaving(true); await onSave(draft); setSaving(false); };
  return (
    <div>
      <h3 className="font-display font-semibold mb-6" style={{ fontSize: 20 }}>Profile</h3>
      <div className="grid md:grid-cols-2 gap-x-6">{field('name', 'Full name')}{field('role', 'Role / title')}</div>
      {field('tagline', 'Hero tagline', true)}
      {field('bio', 'About bio', true)}
      <div className="grid md:grid-cols-2 gap-x-6">
        {field('email', 'Email')}{field('phone', 'Phone')}{field('location', 'Location')}{field('resumeUrl', 'Resume link (URL)')}
        {field('linkedin', 'LinkedIn URL')}{field('github', 'GitHub URL')}{field('yearsExperience', 'Years of experience (e.g. 3+)')}{field('education', 'Education (short)')}
      </div>
      {field('focusAreas', 'Focus areas (short, e.g. "Robotics · IoT")')}
      <button className="btn btn-primary mt-2" onClick={save} disabled={saving}>
        {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />} Save changes
      </button>
    </div>
  );
}

export function SkillsTab({ skills, onSave }) {
  const [draft, setDraft] = useState(skills);
  const [newCat, setNewCat] = useState('');
  const [newSkill, setNewSkill] = useState({});
  const [status, setStatus] = useState('');
  const persist = async (next) => { setDraft(next); const ok = await onSave(next); setStatus(ok ? 'Saved' : 'Save failed'); setTimeout(() => setStatus(''), 1500); };
  const addSkill = (cat) => { const val = (newSkill[cat] || '').trim(); if (!val) return; persist({ ...draft, [cat]: [...(draft[cat] || []), val] }); setNewSkill({ ...newSkill, [cat]: '' }); };
  const removeSkill = (cat, skill) => persist({ ...draft, [cat]: draft[cat].filter((s) => s !== skill) });
  const addCategory = () => { const val = newCat.trim(); if (!val || draft[val]) return; persist({ ...draft, [val]: [] }); setNewCat(''); };
  const removeCategory = (cat) => { const next = { ...draft }; delete next[cat]; persist(next); };
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display font-semibold" style={{ fontSize: 20 }}>Skills</h3>
        {status && <span className="font-mono" style={{ fontSize: 12, color: 'var(--accent)' }}>{status}</span>}
      </div>
      <div className="flex flex-col gap-5">
        {Object.keys(draft).map((cat) => (
          <div key={cat} className="panel-2 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono" style={{ fontSize: 12.5 }}>{cat}</span>
              <button onClick={() => removeCategory(cat)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={14} className="text-muted" /></button>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              {(draft[cat] || []).map((s) => (
                <span key={s} className="chip">{s}<button onClick={() => removeSkill(cat, s)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}><X size={11} /></button></span>
              ))}
            </div>
            <div className="flex gap-2">
              <input className="input" placeholder="Add a skill..." value={newSkill[cat] || ''} onChange={(e) => setNewSkill({ ...newSkill, [cat]: e.target.value })} onKeyDown={(e) => e.key === 'Enter' && addSkill(cat)} />
              <button className="btn btn-outline" onClick={() => addSkill(cat)}><Plus size={14} /></button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-5">
        <input className="input" placeholder="New category name..." value={newCat} onChange={(e) => setNewCat(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addCategory()} />
        <button className="btn btn-primary" onClick={addCategory}><Plus size={14} /> Add category</button>
      </div>
    </div>
  );
}

export function ExperienceTab({ experience, onSave }) {
  const [draft, setDraft] = useState(experience);
  const [editing, setEditing] = useState(null);
  const [status, setStatus] = useState('');
  const persist = async (next) => { setDraft(next); const ok = await onSave(next); setStatus(ok ? 'Saved' : 'Save failed'); setTimeout(() => setStatus(''), 1500); };
  const startNew = () => setEditing({ id: uid(), title: '', org: '', duration: '', description: '' });
  const saveEntry = (entry) => { const exists = draft.some((e) => e.id === entry.id); persist(exists ? draft.map((e) => (e.id === entry.id ? entry : e)) : [entry, ...draft]); setEditing(null); };
  const remove = (id) => persist(draft.filter((e) => e.id !== id));
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display font-semibold" style={{ fontSize: 20 }}>Experience</h3>
        {status && <span className="font-mono" style={{ fontSize: 12, color: 'var(--accent)' }}>{status}</span>}
      </div>
      {editing ? (
        <div className="panel-2 rounded-lg p-5 mb-6">
          <div className="grid md:grid-cols-2 gap-3">
            <div><label className="label">Title</label><input className="input" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></div>
            <div><label className="label">Organization</label><input className="input" value={editing.org} onChange={(e) => setEditing({ ...editing, org: e.target.value })} /></div>
          </div>
          <div className="mt-3"><label className="label">Duration (e.g. 2023 — Present)</label><input className="input" value={editing.duration} onChange={(e) => setEditing({ ...editing, duration: e.target.value })} /></div>
          <div className="mt-3"><label className="label">Description</label><textarea className="input" rows={3} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></div>
          <div className="flex gap-3 mt-4">
            <button className="btn btn-primary" onClick={() => saveEntry(editing)}><Save size={14} /> Save entry</button>
            <button className="btn btn-outline" onClick={() => setEditing(null)}>Cancel</button>
          </div>
        </div>
      ) : (
        <button className="btn btn-primary mb-6" onClick={startNew}><Plus size={14} /> Add experience</button>
      )}
      <div className="flex flex-col gap-3">
        {draft.map((e) => (
          <div key={e.id} className="panel-2 rounded-lg p-4 flex items-start justify-between gap-4">
            <div>
              <div className="font-mono text-muted" style={{ fontSize: 11 }}>{e.duration}</div>
              <div className="font-display font-semibold" style={{ fontSize: 15 }}>{e.title}</div>
              <div className="font-mono" style={{ fontSize: 12 }}>{e.org}</div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => setEditing(e)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><Pencil size={14} className="text-muted" /></button>
              <button onClick={() => remove(e.id)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={14} className="text-muted" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProjectForm({ initial, onSave, onCancel }) {
  const [draft, setDraft] = useState(initial);
  const [uploading, setUploading] = useState(false);
  const [uploadingThumb, setUploadingThumb] = useState(false);
  const fileRef = useRef(null);
  const thumbRef = useRef(null);

  const handleImage = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    setUploading(true);
    try { const dataUrl = await compressImage(file); setDraft((d) => ({ ...d, image: dataUrl })); } catch (err) { console.error(err); }
    setUploading(false);
  };
  const handleThumb = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    setUploadingThumb(true);
    try { const dataUrl = await compressImage(file, 600, 0.7); setDraft((d) => ({ ...d, videoThumbnail: dataUrl })); } catch (err) { console.error(err); }
    setUploadingThumb(false);
  };
  const previewThumb = draft.videoThumbnail || autoThumbnail(draft.videoUrl);

  return (
    <div className="panel-2 rounded-lg p-5 mb-6">
      <div className="grid md:grid-cols-2 gap-3">
        <div><label className="label">Title</label><input className="input" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></div>
        <div><label className="label">Category</label><select className="input" value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })}>{CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}</select></div>
      </div>
      <div className="mt-3"><label className="label">Description</label><textarea className="input" rows={3} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} /></div>
      <div className="grid md:grid-cols-2 gap-3 mt-3">
        <div><label className="label">Tags (comma separated)</label><input className="input" value={(draft.tags || []).join(', ')} onChange={(e) => setDraft({ ...draft, tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) })} /></div>
        <div><label className="label">Year</label><input className="input" value={draft.date} onChange={(e) => setDraft({ ...draft, date: e.target.value })} /></div>
      </div>
      <div className="mt-4">
        <label className="label">Project image</label>
        <div className="flex items-center gap-4">
          {draft.image && <img src={draft.image} alt="preview" style={{ width: 80, height: 56, objectFit: 'cover', borderRadius: 6, border: '1px solid var(--border)' }} />}
          <button className="btn btn-outline" onClick={() => fileRef.current.click()} disabled={uploading}>
            {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />} {uploading ? 'Processing...' : 'Upload image'}
          </button>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImage} />
        </div>
      </div>
      <div className="mt-4 grid md:grid-cols-2 gap-3">
        <div><label className="label">Video link (YouTube / Vimeo / other)</label><input className="input" value={draft.videoUrl} onChange={(e) => setDraft({ ...draft, videoUrl: e.target.value })} placeholder="https://youtube.com/watch?v=..." /></div>
        <div>
          <label className="label">Video thumbnail (auto-detected for YouTube)</label>
          <div className="flex items-center gap-3">
            {previewThumb && <img src={previewThumb} alt="thumb" style={{ width: 64, height: 40, objectFit: 'cover', borderRadius: 6, border: '1px solid var(--border)' }} />}
            <button className="btn btn-outline" onClick={() => thumbRef.current.click()} disabled={uploadingThumb}>
              {uploadingThumb ? <Loader2 size={14} className="animate-spin" /> : <ImageIcon size={14} />} {uploadingThumb ? 'Processing...' : 'Upload thumbnail'}
            </button>
            <input ref={thumbRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleThumb} />
          </div>
        </div>
      </div>
      <div className="flex gap-3 mt-5">
        <button className="btn btn-primary" onClick={() => onSave(draft)}><Save size={14} /> Save project</button>
        <button className="btn btn-outline" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

export function ProjectsTab({ projects, onSave }) {
  const [draft, setDraft] = useState(projects);
  const [editing, setEditing] = useState(null);
  const [status, setStatus] = useState('');
  const persist = async (next) => { setDraft(next); const ok = await onSave(next); setStatus(ok ? 'Saved' : 'Save failed'); setTimeout(() => setStatus(''), 1500); };
  const startNew = () => setEditing({ id: uid(), title: '', category: CATEGORIES[0], description: '', tags: [], image: '', videoUrl: '', videoThumbnail: '', date: String(new Date().getFullYear()) });
  const saveEntry = (entry) => { const exists = draft.some((p) => p.id === entry.id); persist(exists ? draft.map((p) => (p.id === entry.id ? entry : p)) : [entry, ...draft]); setEditing(null); };
  const remove = (id) => persist(draft.filter((p) => p.id !== id));
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display font-semibold" style={{ fontSize: 20 }}>Projects</h3>
        {status && <span className="font-mono" style={{ fontSize: 12, color: 'var(--accent)' }}>{status}</span>}
      </div>
      {editing ? <ProjectForm initial={editing} onSave={saveEntry} onCancel={() => setEditing(null)} /> : (
        <button className="btn btn-primary mb-6" onClick={startNew}><Plus size={14} /> Add project</button>
      )}
      <div className="flex flex-col gap-3">
        {draft.map((p) => (
          <div key={p.id} className="panel-2 rounded-lg p-4 flex items-center gap-4">
            <img src={p.image} alt={p.title} style={{ width: 64, height: 44, objectFit: 'cover', borderRadius: 6, flexShrink: 0, filter: 'grayscale(1)' }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="font-display font-semibold" style={{ fontSize: 15 }}>{p.title}</div>
              <div className="text-muted font-mono" style={{ fontSize: 11.5 }}>{p.category} · {p.date}{p.videoUrl ? ' · has video' : ''}</div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => setEditing(p)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><Pencil size={14} className="text-muted" /></button>
              <button onClick={() => remove(p.id)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={14} className="text-muted" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
