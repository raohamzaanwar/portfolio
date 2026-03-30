/* ═════════════════════════════════════════════════════════════════
   PORTFOLIO SCRIPT — hash-based SPA with terminal and shortcuts
═════════════════════════════════════════════════════════════════ */

// ── File icon fallback ──────────────────────────────────────────
function fileIconFallback(ext) {
  const map = {
    jsx:  { bg: '#20d1fe', color: '#1a1a2e', label: 'R' },
    html: { bg: '#e34c26', color: '#fff',    label: 'H' },
    css:  { bg: '#264de4', color: '#fff',    label: 'C' },
    js:   { bg: '#f7df1e', color: '#1a1a1a', label: 'J' },
    json: { bg: '#f7df1e', color: '#1a1a1a', label: '{' },
    md:   { bg: '#4285f4', color: '#fff',    label: 'M' },
  };
  const t = map[ext] || { bg: '#555', color: '#fff', label: '?' };
  return `<span class="fi fi-${ext}" style="background:${t.bg};color:${t.color}">${t.label}</span>`;
}

// ── Routes set ─────────────────────────────────────────────────
const ROUTES = ['home', 'about', 'contact', 'projects', 'articles', 'github', 'experience', 'settings'];

// ── Navigate ───────────────────────────────────────────────────
function navigate(route) {
  if (!ROUTES.includes(route)) route = 'home';

  // update hash
  history.replaceState(null, '', '#' + route);

  // pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const pg = document.getElementById('page-' + route);
  if (pg) pg.classList.add('active');

  // tabs
  document.querySelectorAll('.tab').forEach(t => {
    t.classList.toggle('active', t.dataset.route === route);
  });

  // sidebar icons
  document.querySelectorAll('.icon-container[data-route]').forEach(ic => {
    ic.classList.toggle('active', ic.dataset.route === route);
  });

  // file entries
  document.querySelectorAll('.file-entry').forEach(fe => {
    fe.classList.toggle('active', fe.dataset.route === route);
  });

  // scroll content to top
  document.getElementById('main-editor').scrollTop = 0;

  // update breadcrumb
  const fileNames = {
    home: 'home.jsx', about: 'about.html', contact: 'contact.css',
    projects: 'projects.js', articles: 'articles.json', github: 'github.md',
    experience: 'experience.ts', settings: 'settings'
  };
  const bc = document.getElementById('breadcrumb-file');
  if (bc) bc.textContent = fileNames[route] || route;
}

// ── Route from hash ────────────────────────────────────────────
function routeFromHash() {
  const hash = window.location.hash.replace('#', '') || 'home';
  navigate(hash);
}

// ── Click delegation ───────────────────────────────────────────
document.addEventListener('click', e => {
  const el = e.target.closest('[data-route]');
  if (el && el.dataset.route) {
    navigate(el.dataset.route);
  }
});

// ── Theme switcher ─────────────────────────────────────────────
document.addEventListener('click', e => {
  const btn = e.target.closest('.theme-btn');
  if (!btn) return;
  const theme = btn.dataset.theme;
  document.documentElement.setAttribute('data-theme', theme === 'github-dark' ? '' : theme);
  document.querySelectorAll('.theme-btn').forEach(b => b.classList.toggle('active', b === btn));
});

// ── Terminal ───────────────────────────────────────────────────
let terminalOpen = false;

function toggleTerminal() {
  terminalOpen = !terminalOpen;
  const panel = document.getElementById('terminal-panel');
  panel.style.display = terminalOpen ? 'flex' : 'none';
  if (terminalOpen) {
    const input = document.getElementById('term-input');
    input.focus();
    if (!panel.dataset.initialized) {
      panel.dataset.initialized = 'true';
      printTermLine('Portfolio terminal — type <b>help</b> for commands.', 'system');
    }
  }
}

function printTermLine(html, cls = '') {
  const out = document.getElementById('term-output');
  const d = document.createElement('div');
  d.className = 'term-line ' + cls;
  d.innerHTML = html;
  out.appendChild(d);
  document.querySelector('.terminal-body').scrollTop = 9999;
}

const COMMANDS = {
  help: () => {
    const lines = [
      '<span style="color:var(--accent-color)">Available commands:</span>',
      '  <b>whoami</b>       — display identity',
      '  <b>ls</b>           — list portfolio sections',
      '  <b>goto &lt;page&gt;</b>  — navigate to a page',
      '  <b>skills</b>       — list skills and tools',
      '  <b>cert</b>         — list certifications',
      '  <b>ctf</b>          — CTF achievements',
      '  <b>exp</b>          — show experience summary',
      '  <b>contact</b>      — show contact info',
      '  <b>clear</b>        — clear terminal',
      '  <b>exit</b>         — close terminal',
    ];
    lines.forEach(l => printTermLine(l, 'info'));
  },
  whoami: () => {
    printTermLine('Muhammad Hamza Anwar', 'result');
    printTermLine('Penetration Tester &amp; Cybersecurity Professional', 'result');
    printTermLine('Rawalpindi, Pakistan 🇵🇰', 'info');
  },
  ls: () => {
    printTermLine('home.jsx &nbsp; about.html &nbsp; contact.css &nbsp; projects.js &nbsp; articles.json &nbsp; github.md', 'result');
  },
  skills: () => {
    printTermLine('<span style="color:var(--accent-color)">Offensive:</span> Burp Suite · Metasploit · Nmap · SQLMap · BloodHound · Impacket · Wireshark · Mimikatz', 'result');
    printTermLine('<span style="color:var(--accent-color)">Defensive:</span> MS Sentinel · ELK Stack · Wazuh · Defender · KQL · Entra ID · Intune', 'result');
    printTermLine('<span style="color:var(--accent-color)">Dev:</span> Python · Bash · C++ · SQL · Git · Azure · AWS', 'info');
  },
  cert: () => {
    const certs = [
      '✓ CEH — Certified Ethical Hacker (EC-Council)',
      '✓ CNSP — Certified Network Security Practitioner (SecOps Group)',
      '✓ CAP — Certified AppSec Practitioner (SecOps Group)',
      '✓ ISO 27001 Lead Implementer (Alnafi)',
      '⏳ SC-200 — Microsoft Security Operations Analyst (in progress)',
    ];
    certs.forEach(c => printTermLine(c, 'result'));
  },
  ctf: () => {
    printTermLine('🏆 17th place — National Cyber Challenge (Igit Pakistan, Delhi)', 'result');
    printTermLine('⚡ HackTheBox: <b>Pro Hacker</b> rank', 'result');
    printTermLine('🔥 TryHackMe: <b>Top 5%</b> globally', 'result');
  },
  contact: () => {
    printTermLine('Email:    hamzaanwarrao@gmail.com', 'result');
    printTermLine('Phone:    +92-321-9520424', 'result');
    printTermLine('LinkedIn: linkedin.com/in/m-hamza-anwar', 'result');
    printTermLine('GitHub:   github.com/hamzaanwarrao', 'result');
    printTermLine('Medium:   @hamzaanwarrao', 'result');
  },
  exp: () => {
    printTermLine('<span style="color:#ff6b6b">[Red Team]</span>  Vulnerability Penetration Tester — CareCloud (Jun 2024 – Present)', 'result');
    printTermLine('<span style="color:#5ab4ff">[Blue Team]</span> SOC Analyst — CareCloud (Jun 2024 – Present)', 'result');
    printTermLine('<span style="color:#d49dff">[GRC]</span>       Compliance &amp; Risk Analyst — CareCloud (Jun 2024 – Present)', 'result');
    printTermLine('<span style="color:#6effd0">[Research]</span>  FYP ShellSage — NUST (Sep 2024 – Jun 2025)', 'result');
    printTermLine('<span style="color:#ff6b6b">[Red Team]</span>  CTF Competitor — HTB Pro Hacker · THM Top 5% (2022 – Present)', 'result');
    printTermLine('Type <b>goto experience</b> to view full 3D experience page.', 'info');
  },
  clear: () => {
    document.getElementById('term-output').innerHTML = '';
  },
  exit: () => {
    toggleTerminal();
  },
};

// Terminal input handler
document.getElementById('term-input').addEventListener('keydown', function(e) {
  if (e.key !== 'Enter') return;
  const raw = this.value.trim();
  if (!raw) return;

  // echo command
  printTermLine(
    `<span class="tp-user">hamza</span><span class="tp-sep">@</span><span class="tp-host">portfolio</span><span class="tp-colon">:</span><span class="tp-path">~/security</span><span class="tp-dollar">$</span> ${escHtml(raw)}`,
    ''
  );

  const [cmd, ...args] = raw.split(' ');

  if (cmd === 'goto' && args[0]) {
    const target = args[0].toLowerCase();
    if (ROUTES.includes(target)) {
      navigate(target);
      printTermLine(`Navigated to <b>${target}</b>`, 'result');
    } else {
      printTermLine(`bash: goto: '${escHtml(args[0])}' not found. Try: ${ROUTES.join(', ')}`, 'error');
    }
  } else if (COMMANDS[cmd]) {
    COMMANDS[cmd]();
  } else {
    printTermLine(`bash: ${escHtml(cmd)}: command not found. Type <b>help</b> for commands.`, 'error');
  }

  this.value = '';
});

function escHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ── Keyboard shortcuts ────────────────────────────────────────
let keyBuf = '';
let keyTimer = null;

document.addEventListener('keydown', e => {
  // Ctrl+Shift+P → command palette
  if (e.key === 'P' && e.ctrlKey && e.shiftKey) {
    e.preventDefault();
    openPalette();
    return;
  }

  // Ctrl+` → toggle terminal
  if (e.key === '`' && e.ctrlKey) {
    e.preventDefault();
    toggleTerminal();
    return;
  }

  // g + key combos
  if (document.activeElement.tagName === 'INPUT' ||
      document.activeElement.tagName === 'TEXTAREA') return;

  keyBuf += e.key.toLowerCase();
  clearTimeout(keyTimer);
  keyTimer = setTimeout(() => { keyBuf = ''; }, 800);

  const combos = {
    'gh': 'home',
    'ga': 'about',
    'gc': 'contact',
    'gp': 'projects',
    'gr': 'articles',
    'gg': 'github',
    'ge': 'experience',
    'gs': 'settings',
  };

  if (combos[keyBuf]) {
    navigate(combos[keyBuf]);
    keyBuf = '';
  }
});

// ── Contact form ──────────────────────────────────────────────
async function handleContact(e) {
  e.preventDefault();
  const name  = document.getElementById('cf-name').value.trim();
  const email = document.getElementById('cf-email').value.trim();
  const msg   = document.getElementById('cf-msg').value.trim();
  const ok    = document.getElementById('cf-ok');
  const btn   = e.target.querySelector('button[type="submit"]');

  if (!name || !email || !msg) return;

  if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message: msg }),
    });
    const data = await res.json();
    if (data.success) {
      ok.style.display = 'block';
      e.target.reset();
      setTimeout(() => { ok.style.display = 'none'; }, 4000);
    } else {
      alert('Error: ' + (data.error || 'Could not send message.'));
    }
  } catch {
    // Flask server not running — fall back to mailto
    window.location.href =
      `mailto:hamzaanwarrao@gmail.com?subject=Portfolio message from ${encodeURIComponent(name)}&body=${encodeURIComponent(msg + '\n\n—' + name + ' <' + email + '>')}`;
    ok.style.display = 'block';
    setTimeout(() => { ok.style.display = 'none'; }, 4000);
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = 'Send Message'; }
  }
}

// ── 3D Tilt cards ─────────────────────────────────────────────
function initTilt() {
  document.querySelectorAll('.exp-card[data-tilt]').forEach(card => {
    if (card._tiltInit) return;
    card._tiltInit = true;

    const glow = card.querySelector('.exp-card-glow');

    card.addEventListener('mousemove', e => {
      const rect  = card.getBoundingClientRect();
      const cx    = rect.left + rect.width  / 2;
      const cy    = rect.top  + rect.height / 2;
      const dx    = (e.clientX - cx) / (rect.width  / 2);  // -1 … 1
      const dy    = (e.clientY - cy) / (rect.height / 2);  // -1 … 1
      const tiltX = -(dy * 10).toFixed(2);  // rotate around X
      const tiltY =  (dx * 10).toFixed(2);  // rotate around Y

      card.style.transform =
        `perspective(900px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.035)`;
      card.style.transition = 'transform 0.05s ease-out, box-shadow 0.2s ease';

      // Move glow origin to cursor position
      const px = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
      const py = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
      if (glow) {
        glow.style.background =
          `radial-gradient(circle at ${px}% ${py}%, var(--card-glow) 0%, transparent 60%)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)';
      card.style.transition = 'transform 0.4s ease, box-shadow 0.2s ease';
      if (glow) glow.style.background = '';
    });
  });
}

// ── Matrix Rain Background ────────────────────────────────────
function initMatrixRain() {
  const canvas = document.createElement('canvas');
  canvas.id = 'matrix-canvas';
  document.body.insertBefore(canvas, document.body.firstChild);

  const ctx = canvas.getContext('2d');
  const wrap = document.body;

  // Dark mode: binary + hex + katakana + code symbols
  const DARK_CHARS = '01アイウエカキクコサシスセタチツテナニヌ{}[]<>/\\|;:@#$0123456789ABCDEFabcdef=+-~*!?^&%';

  // Light mode: programming keywords + operators + tokens
  const LIGHT_TOKENS = [
    'function','const','let','var','return','import','export','class','extends',
    'if','else','for','while','try','catch','async','await','new','this','null',
    'true','false','0x','&&','||','!=','===','=>','...','++','--','<<','>>',
    '#!/','python','nmap','ssh','curl','grep','awk','ls -la','chmod','sudo',
    '#include','int main','printf','malloc','SELECT','WHERE','FROM','JOIN',
    'HTTP/1.1','GET','POST','404','200','500','192.168','0.0.0.0','::1',
    'type','interface','void','string','number','boolean','enum','namespace',
  ];

  const FONT = 13;
  let cols, drops, isCyan, lightCols;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    const n = Math.floor(canvas.width / FONT);
    if (n !== cols) {
      cols      = n;
      drops     = Array.from({ length: cols }, () => -(Math.random() * (canvas.height / FONT)));
      isCyan    = Array.from({ length: cols }, () => Math.random() < 0.22);
      lightCols = Math.max(10, Math.floor(canvas.width / 80));
    }
  }
  resize();
  window.addEventListener('resize', resize);

  // Light mode: particle network
  const PARTICLE_COUNT = 90;
  const CONNECT_DIST   = 160;
  let particles = null;

  function initParticles() {
    particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x:  Math.random() * canvas.width,
      y:  Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.55,
      vy: (Math.random() - 0.5) * 0.55,
      r:  2 + Math.random() * 2.5,
    }));
  }

  function drawLight() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!particles) initParticles();

    // Draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECT_DIST) {
          const alpha = (1 - dist / CONNECT_DIST) * 0.22;
          ctx.strokeStyle = `rgba(37,99,235,${alpha.toFixed(3)})`;
          ctx.lineWidth   = 1;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.r > 3.5 ? 'rgba(99,60,180,0.65)' : 'rgba(37,99,235,0.55)';
      ctx.fill();

      // Glow ring
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r + 3, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(37,99,235,0.10)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Move
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
    }
  }

  function drawDark() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.055)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = `bold ${FONT}px "JetBrains Mono", monospace`;

    for (let i = 0; i < cols; i++) {
      const y = drops[i] * FONT;
      if (y < -FONT) { drops[i] += 0.5; continue; }

      const ch = DARK_CHARS[Math.floor(Math.random() * DARK_CHARS.length)];
      const x  = i * FONT;

      const isHead = y >= 0 && y < FONT * 2;
      ctx.fillStyle = isHead ? '#ffffff' : (isCyan[i] ? '#20d1fe' : '#00ff41');
      ctx.fillText(ch, x, Math.max(y, 0));

      if (y > canvas.height && Math.random() > 0.975) {
        drops[i]  = -(Math.random() * 30);
        isCyan[i] = Math.random() < 0.22;
      } else {
        drops[i] += 0.5;
      }
    }
  }

  function draw() {
    const isLight = document.documentElement.getAttribute('data-mode') === 'light';
    if (isLight) drawLight(); else drawDark();
  }

  setInterval(draw, 40);
}

// ── Init ──────────────────────────────────────────────────────
window.addEventListener('hashchange', routeFromHash);
routeFromHash();
initTilt();
initMatrixRain();

// ── Dark / Light mode ────────────────────────────────────────
function toggleLightMode(isLight) {
  if (isLight) {
    document.documentElement.setAttribute('data-mode', 'light');
  } else {
    document.documentElement.removeAttribute('data-mode');
  }
  localStorage.setItem('dl-mode', isLight ? 'light' : 'dark');
  const cb = document.getElementById('dl-checkbox');
  if (cb) cb.checked = isLight;
}

// ── Theme toast helpers ───────────────────────────────────────
function applyThemeChoice(mode) {
  toggleLightMode(mode === 'light');
  dismissThemeToast();
}

function dismissThemeToast() {
  const toast = document.getElementById('theme-toast');
  if (toast) {
    toast.classList.remove('show');
  }
}

// ── Auto-detect system theme + show toast on every load ───────
(function () {
  // 1. Detect system preference
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const systemMode = systemPrefersDark ? 'dark' : 'light';

  // 2. Check if user has a saved preference; if not, apply system default
  const saved = localStorage.getItem('dl-mode');
  const activeMode = saved || systemMode;

  // Apply the resolved theme immediately (no flash)
  const isLight = activeMode === 'light';
  if (isLight) {
    document.documentElement.setAttribute('data-mode', 'light');
  }
  const cb = document.getElementById('dl-checkbox');
  if (cb) cb.checked = isLight;

  // 3. Show the toast on every page load so user can quickly switch
  window.addEventListener('DOMContentLoaded', function () {
    const toast = document.getElementById('theme-toast');
    const label = document.getElementById('theme-detected-label');
    if (!toast) return;

    // Update "Detected: X" label to show the system preference
    if (label) {
      label.textContent = systemPrefersDark ? 'Dark' : 'Light';
    }

    // Highlight the currently active button
    const darkBtn  = toast.querySelector('.dark-btn');
    const lightBtn = toast.querySelector('.light-btn');
    if (darkBtn)  darkBtn.style.borderColor  = activeMode === 'dark'  ? '#00ff41' : '';
    if (lightBtn) lightBtn.style.borderColor = activeMode === 'light' ? '#fbbf24' : '';

    // Slide in after a short delay so page renders first
    setTimeout(function () { toast.classList.add('show'); }, 800);

    // Auto-dismiss after 8 seconds if user ignores it
    setTimeout(function () { dismissThemeToast(); }, 8800);
  });
})();

// ── Command Palette ───────────────────────────────────────────
const PALETTE_ITEMS = [
  { name: 'home.jsx',       route: 'home',       ext: 'jsx',  icon: { bg: '#20d1fe', color: '#1a1a2e', label: 'R'  } },
  { name: 'about.html',     route: 'about',      ext: 'html', icon: { bg: '#e34c26', color: '#fff',    label: 'H'  } },
  { name: 'contact.css',    route: 'contact',    ext: 'css',  icon: { bg: '#264de4', color: '#fff',    label: 'C'  } },
  { name: 'projects.js',    route: 'projects',   ext: 'js',   icon: { bg: '#f7df1e', color: '#1a1a1a', label: 'J'  } },
  { name: 'articles.json',  route: 'articles',   ext: 'json', icon: { bg: '#f7df1e', color: '#1a1a1a', label: '{'  } },
  { name: 'github.md',      route: 'github',     ext: 'md',   icon: { bg: '#4285f4', color: '#fff',    label: 'M'  } },
  { name: 'experience.ts',  route: 'experience', ext: 'ts',   icon: { bg: '#3178c6', color: '#fff',    label: 'TS' } },
  { name: 'settings',       route: 'settings',   ext: '',     icon: { bg: '#555',    color: '#fff',    label: '⚙'  } },
];

let paletteActiveIdx = 0;

function openPalette() {
  const overlay = document.getElementById('cmd-palette-overlay');
  overlay.style.display = 'flex';
  const input = document.getElementById('cmd-input');
  input.value = '';
  renderPaletteItems('');
  setTimeout(() => input.focus(), 30);
}

function closePalette(e) {
  if (!e || e.target === document.getElementById('cmd-palette-overlay')) {
    document.getElementById('cmd-palette-overlay').style.display = 'none';
  }
}

function renderPaletteItems(query) {
  const list = document.getElementById('cmd-list');
  const filtered = query
    ? PALETTE_ITEMS.filter(i => i.name.toLowerCase().includes(query.toLowerCase()))
    : PALETTE_ITEMS;

  list.innerHTML = filtered.map((item, idx) => {
    const ic = item.icon;
    return `<li data-route="${item.route}" data-idx="${idx}"
               onclick="navigate('${item.route}'); closePalette()">
      <span class="cmd-item-icon" style="background:${ic.bg};color:${ic.color}">${ic.label}</span>
      <span class="cmd-item-name">${item.name}</span>
      <span class="cmd-item-hint">${item.route}</span>
    </li>`;
  }).join('');

  paletteActiveIdx = 0;
  markPaletteActive();
  document.getElementById('cmd-instructions').textContent =
    query ? 'results' : 'recently opened';
}

function markPaletteActive() {
  document.querySelectorAll('#cmd-list li').forEach((li, i) => {
    li.classList.toggle('cmd-active', i === paletteActiveIdx);
  });
}

document.getElementById('cmd-input').addEventListener('input', function () {
  renderPaletteItems(this.value);
});

document.getElementById('cmd-input').addEventListener('keydown', function (e) {
  const items = document.querySelectorAll('#cmd-list li');
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    paletteActiveIdx = Math.min(paletteActiveIdx + 1, items.length - 1);
    markPaletteActive();
    items[paletteActiveIdx]?.scrollIntoView({ block: 'nearest' });
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    paletteActiveIdx = Math.max(paletteActiveIdx - 1, 0);
    markPaletteActive();
    items[paletteActiveIdx]?.scrollIntoView({ block: 'nearest' });
  } else if (e.key === 'Enter') {
    const active = items[paletteActiveIdx];
    if (active) {
      navigate(active.dataset.route);
      closePalette();
    }
  } else if (e.key === 'Escape') {
    closePalette();
  }
});

// View menu click → open palette
document.getElementById('cmd-palette-trigger').addEventListener('click', openPalette);
