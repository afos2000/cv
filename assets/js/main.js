(function () {
  'use strict';

  const CONFIG_URL = 'config.json';

  let config = null;

  // ── Matrix Rain ──
  function initMatrix() {
    const canvas = document.getElementById('matrix-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height, columns, drops;

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      columns = Math.floor(width / 16);
      drops = Array(columns).fill(0).map(() => Math.random() * -100);
    }

    resize();
    window.addEventListener('resize', resize);

    const chars = '01{}[]<>/\\|;:=+-*';
    const fontSize = 14;

    function draw() {
      ctx.fillStyle = 'rgba(10, 14, 23, 0.05)';
      ctx.fillRect(0, 0, width, height);
      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * 16;
        const y = drops[i] * fontSize;

        ctx.fillStyle = drops[i] * fontSize > height * 0.75
          ? 'rgba(74, 222, 128, 0.3)'
          : 'rgba(74, 222, 128, 0.1)';
        ctx.fillText(char, x, y);

        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i] += 0.5 + Math.random() * 0.5;
      }
      requestAnimationFrame(draw);
    }

    draw();
  }

  // ── Typewriter effect ──
  function typewriter(el, text, speed, callback) {
    let i = 0;
    el.textContent = '';
    function type() {
      if (i < text.length) {
        el.textContent += text[i];
        i++;
        setTimeout(type, speed);
      } else if (callback) {
        callback();
      }
    }
    type();
  }

  // ── Load config and render ──
  async function loadConfig() {
    try {
      const res = await fetch(CONFIG_URL);
      config = await res.json();
    } catch (e) {
      console.warn('Failed to load config.json, using defaults');
    }
    render();
  }

  function render() {
    if (!config) {
      config = {
        site: { title: 'Andres Fortega', tagline: 'DevOps & Platform Engineer', email: '', url: '' },
        terminal: { user: 'root', host: 'andreskube', promptPath: '~', footerCommand: '' },
        social: { github: '#', linkedin: '#' },
        about: ['DevOps & Platform Engineer.'],
        skills: [],
        experience: [],
        projects: []
      };
    }

    // About
    const aboutBody = document.getElementById('about-body');
    if (aboutBody && config.about) {
      aboutBody.innerHTML = config.about.map(p =>
        `<p class="about-text">${p}</p>`
      ).join('');
    }

    // Skills
    const skillsBody = document.getElementById('skills-body');
    if (skillsBody && config.skills && config.skills.length) {
      skillsBody.innerHTML = `<div class="skills-grid">${config.skills.map(s =>
        `<div class="skill-card">
          <div class="skill-category">${s.category}</div>
          <div class="skill-items">${s.items.map(t =>
            `<span class="skill-tag">${t}</span>`
          ).join('')}</div>
        </div>`
      ).join('')}</div>`;
    }

    // Experience
    const expBody = document.getElementById('experience-body');
    if (expBody && config.experience && config.experience.length) {
      expBody.innerHTML = config.experience.map(e =>
        `<div class="exp-card">
          <div class="exp-header">
            <span><span class="exp-role">${e.role}</span> @ <span class="exp-company">${e.company}</span></span>
            <span class="exp-period">${e.period}</span>
          </div>
          <ul class="exp-highlights">${e.highlights.map(h =>
            `<li>${h}</li>`
          ).join('')}</ul>
        </div>`
      ).join('');
    }

    // Projects
    const projBody = document.getElementById('projects-body');
    if (projBody && config.projects && config.projects.length) {
      projBody.innerHTML = `<div class="projects-grid">${config.projects.map(p =>
        `<a href="${p.url}" class="project-card" target="_blank" rel="noopener noreferrer">
          <div class="project-name">${p.name}</div>
          <div class="project-desc">${p.description}</div>
          <div class="project-tech">${p.tech.map(t =>
            `<span class="project-tech-tag">${t}</span>`
          ).join('')}</div>
        </a>`
      ).join('')}</div>`;
    }

    // Contact
    const contactBody = document.getElementById('contact-body');
    if (contactBody) {
      const links = [];
      if (config.social.github) links.push({ label: 'GitHub', url: config.social.github });
      if (config.social.linkedin) links.push({ label: 'LinkedIn', url: config.social.linkedin });
      if (config.site.email) links.push({ label: 'Email', url: 'mailto:' + config.site.email });
      if (config.site.url) links.push({ label: 'Website', url: config.site.url });

      contactBody.innerHTML = `<div class="contact-links">${links.map(l =>
        `<a href="${l.url}" class="contact-link" target="_blank" rel="noopener noreferrer">
          <span class="arrow">></span> ${l.label}
        </a>`
      ).join('')}</div>`;
    }

    // Footer command
    const footerCmd = document.getElementById('footer-command');
    if (footerCmd && config.terminal.footerCommand) {
      footerCmd.textContent = config.terminal.footerCommand;
    }

    // Typewriter on hero
    const typedEl = document.getElementById('typed-text');
    if (typedEl && config.site.tagline) {
      typewriter(typedEl, config.site.tagline, 40);
    }

    // Page title
    if (config.site.title) {
      document.title = `afos2000@andreskube:~# — ${config.site.title}`;
    }

    // Tagline from config
    const taglineEl = document.querySelector('.tagline');
    if (taglineEl && config.site.tagline) {
    }
  }

  // ── Smooth scroll for nav links ──
  function initNav() {
    document.querySelectorAll('.nav-item[href^="#"]').forEach(link => {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // ── Keybinding: press 1-6 for nav items ──
  function initKeys() {
    document.addEventListener('keydown', function (e) {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      const num = parseInt(e.key);
      if (num >= 1 && num <= 7) {
        const links = document.querySelectorAll('.nav-item');
        const idx = num - 1;
        if (links[idx]) {
          links[idx].click();
          links[idx].focus();
        }
      }
    });
  }

  // ── Init ──
  document.addEventListener('DOMContentLoaded', function () {
    initMatrix();
    initNav();
    initKeys();
    loadConfig();
  });
})();
