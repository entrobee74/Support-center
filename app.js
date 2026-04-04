/**
 * SupportCenterX — app.js
 * ========================
 * Pure vanilla JS single-page app.
 * - Admin dashboard: create, list, manage generated support microsites.
 * - Support site view: brand-styled, rendered from localStorage config.
 * - Hash-based routing: #site=<id> loads a site view, otherwise shows admin.
 *
 * HOW TO EXTEND:
 * - Add new platforms: add an entry to PLATFORMS below with your colors + emoji logo.
 * - Swap placeholder emojis for real images: set logoPath in the platform config
 *   and update renderLogoHTML() to use <img> tags instead of emoji spans.
 * - Add new contact methods: extend CONTACT_METHODS and handleContactUI().
 */

'use strict';

/* ============================================================
   PLATFORM CONFIGURATIONS
   ============================================================
   To add a new platform: duplicate a block, change the key, and adjust:
     - name, primaryColor, secondaryColor, accentColor
     - logoEmoji (replace with logoPath when you have a real asset)
     - fontFamily (approximate to the brand's real font)
     - bgStyle: CSS for the site's overall background
     - topics: 4 help topic cards shown in the support site
   ============================================================ */
const PLATFORMS = {
  binance: {
    name: 'Binance',
    primaryColor: '#F3BA2F',
    secondaryColor: '#0B0E11',
    accentColor: '#1E2026',
    textColor: '#EAECEF',
    logoEmoji: '🟡',
    // logoPath: 'assets/binance-logo.svg',  ← Drop real logo here
    fontFamily: "'Inter', system-ui, sans-serif",
    bgStyle: 'background: #0B0E11;',
    headerBg: '#181A20',
    chipLabel: 'Exchange',
    chipColor: '#F3BA2F',
  },
  bybit: {
    name: 'Bybit',
    primaryColor: '#F7A600',
    secondaryColor: '#0E0F14',
    accentColor: '#1C1D24',
    textColor: '#E8E8E8',
    logoEmoji: '🔶',
    // logoPath: 'assets/bybit-logo.svg',
    fontFamily: "'DM Sans', system-ui, sans-serif",
    bgStyle: 'background: #0E0F14;',
    headerBg: '#1C1D24',
    chipLabel: 'Exchange',
    chipColor: '#F7A600',
  },
  coinbase: {
    name: 'Coinbase',
    primaryColor: '#0052FF',
    secondaryColor: '#FFFFFF',
    accentColor: '#F5F7FA',
    textColor: '#0A0B0D',
    logoEmoji: '🔵',
    // logoPath: 'assets/coinbase-logo.svg',
    fontFamily: "'Inter', system-ui, sans-serif",
    bgStyle: 'background: #FFFFFF;',
    headerBg: '#FFFFFF',
    chipLabel: 'Exchange',
    chipColor: '#0052FF',
    darkMode: false,
  },
  wazir: {
    name: 'WazirX',
    primaryColor: '#1DAEEC',
    secondaryColor: '#0A0C10',
    accentColor: '#131620',
    textColor: '#E4E9F0',
    logoEmoji: '💠',
    // logoPath: 'assets/wazir-logo.svg',
    fontFamily: "'Poppins', system-ui, sans-serif",
    bgStyle: 'background: #0A0C10;',
    headerBg: '#131620',
    chipLabel: 'Exchange',
    chipColor: '#1DAEEC',
  },
  trustwallet: {
    name: 'Trust Wallet',
    primaryColor: '#3375BB',
    secondaryColor: '#FFFFFF',
    accentColor: '#F0F5FF',
    textColor: '#0D0D2B',
    logoEmoji: '🛡️',
    // logoPath: 'assets/trustwallet-logo.svg',
    fontFamily: "'DM Sans', system-ui, sans-serif",
    bgStyle: 'background: #FFFFFF;',
    headerBg: '#FFFFFF',
    chipLabel: 'Wallet',
    chipColor: '#3375BB',
    darkMode: false,
  },
  metamask: {
    name: 'MetaMask',
    primaryColor: '#FF5C16',
    secondaryColor: '#1A0A00',
    accentColor: '#2E1200',
    textColor: '#FFF0E6',
    logoEmoji: '🦊',
    // logoPath: 'assets/metamask-logo.svg',
    fontFamily: "'Poppins', system-ui, sans-serif",
    bgStyle: 'background: linear-gradient(160deg, #1A0A00, #0D0511);',
    headerBg: 'rgba(26,10,0,0.85)',
    chipLabel: 'Wallet',
    chipColor: '#FF5C16',
  },
  robinhood: {
    name: 'Robinhood',
    primaryColor: '#00C805',
    secondaryColor: '#FFFFFF',
    accentColor: '#F5F5F5',
    textColor: '#0D0D0D',
    logoEmoji: '🪶',
    // logoPath: 'assets/robinhood-logo.svg',
    fontFamily: "'Inter', system-ui, sans-serif",
    bgStyle: 'background: #FFFFFF;',
    headerBg: '#FFFFFF',
    chipLabel: 'Brokerage',
    chipColor: '#00C805',
    darkMode: false,
  },
  phantom: {
    name: 'Phantom Wallet',
    primaryColor: '#AB9FF2',
    secondaryColor: '#141414',
    accentColor: '#1F1F2E',
    textColor: '#EFEFEF',
    logoEmoji: '👻',
    // logoPath: 'assets/phantom-logo.svg',
    fontFamily: "'DM Sans', system-ui, sans-serif",
    bgStyle: 'background: linear-gradient(160deg, #141414, #1A1030);',
    headerBg: 'rgba(20,20,20,0.9)',
    chipLabel: 'Wallet',
    chipColor: '#AB9FF2',
  },
};

/* ============================================================
   SUPPORT TOPIC DEFINITIONS PER PLATFORM
   (Customize these for each brand's common help areas)
   ============================================================ */
const PLATFORM_TOPICS = {
  binance: [
    { icon: '🚀', name: 'Getting Started', desc: 'Create an account, complete KYC, and set up your first wallet.' },
    { icon: '🔒', name: 'Security & 2FA', desc: 'Enable two-factor authentication and protect your account.' },
    { icon: '💸', name: 'Deposits & Withdrawals', desc: 'Fund your account or withdraw to external wallets.' },
    { icon: '📊', name: 'Trading & Futures', desc: 'Spot trading, margin, and futures product guides.' },
    { icon: '🆔', name: 'Identity Verification', desc: 'KYC levels, document requirements, and verification status.' },
    { icon: '⚙️', name: 'Account Settings', desc: 'Change your email, password, and linked devices.' },
  ],
  bybit: [
    { icon: '🚀', name: 'Getting Started', desc: 'Open your Bybit account and begin trading in minutes.' },
    { icon: '📈', name: 'Derivatives Trading', desc: 'Perpetual contracts, options, and USDT futures guides.' },
    { icon: '💸', name: 'Deposits & Withdrawals', desc: 'Top up your account and withdraw funds quickly.' },
    { icon: '🔒', name: 'Account Security', desc: 'Keep your assets safe with advanced security settings.' },
    { icon: '🏦', name: 'Bybit Earn', desc: 'Flexible and fixed savings, liquidity mining, and staking.' },
    { icon: '🆔', name: 'KYC Verification', desc: 'Identity checks needed to unlock full trading limits.' },
  ],
  coinbase: [
    { icon: '🚀', name: 'Getting Started', desc: 'Buy your first crypto in minutes — no experience needed.' },
    { icon: '💳', name: 'Payment Methods', desc: 'Link your bank, card, or PayPal to buy and sell crypto.' },
    { icon: '🔐', name: 'Account Security', desc: 'Two-step verification, device management, and recovery.' },
    { icon: '💸', name: 'Sending & Receiving', desc: 'Transfer crypto to friends or external wallets.' },
    { icon: '📑', name: 'Taxes & Reports', desc: 'Download transaction history and tax documents.' },
    { icon: '🌐', name: 'Coinbase Pro', desc: 'Advanced trading tools and API documentation.' },
  ],
  wazir: [
    { icon: '🚀', name: 'Getting Started', desc: 'Sign up, verify your identity, and start trading INR pairs.' },
    { icon: '💸', name: 'INR Deposits & Withdrawals', desc: 'Fund via UPI, NEFT, IMPS, and withdraw to your bank.' },
    { icon: '🔒', name: 'Security Centre', desc: '2FA, anti-phishing codes, and account lockdown options.' },
    { icon: '📊', name: 'P2P Trading', desc: 'Buy and sell crypto directly with other users.' },
    { icon: '🆔', name: 'KYC & Compliance', desc: 'Complete your PAN and Aadhaar verification.' },
    { icon: '⚙️', name: 'Account Management', desc: 'Profile, sub-accounts, referral program, and API keys.' },
  ],
  trustwallet: [
    { icon: '🔑', name: 'Wallet Setup', desc: 'Create or import a wallet and back up your recovery phrase.' },
    { icon: '🌐', name: 'Multi-Chain Support', desc: 'Manage BTC, ETH, BNB, SOL and 65+ blockchains.' },
    { icon: '🔁', name: 'Swap & Exchange', desc: 'Swap tokens directly within the app.' },
    { icon: '🔒', name: 'Security & Recovery', desc: 'Protect your seed phrase and restore a lost wallet.' },
    { icon: '🖼️', name: 'NFTs & Collectibles', desc: 'View and manage your NFT collection in-app.' },
    { icon: '🌱', name: 'DeFi & Staking', desc: 'Access DApps and earn staking rewards.' },
  ],
  metamask: [
    { icon: '🦊', name: 'Getting Started', desc: 'Install MetaMask, create a wallet, and stay safe online.' },
    { icon: '🔑', name: 'Seed Phrase & Security', desc: 'Back up your Secret Recovery Phrase and secure your account.' },
    { icon: '⛽', name: 'Gas & Transactions', desc: 'Understand gas fees, stuck transactions, and speed-ups.' },
    { icon: '🌐', name: 'Networks & Tokens', desc: 'Add custom networks, import tokens, and bridge assets.' },
    { icon: '🖼️', name: 'NFTs & DApps', desc: 'Connect to decentralized apps and manage your NFT gallery.' },
    { icon: '🔁', name: 'Swaps & Bridge', desc: 'Trade tokens and bridge assets cross-chain in MetaMask.' },
  ],
  robinhood: [
    { icon: '📈', name: 'Investing Basics', desc: 'Buy stocks, ETFs, and options with no commission fees.' },
    { icon: '💳', name: 'Cash & Transfers', desc: 'Add funds, instant deposits, and withdraw to your bank.' },
    { icon: '🔒', name: 'Account Security', desc: 'Two-factor authentication, biometrics, and PIN setup.' },
    { icon: '📑', name: 'Tax Documents', desc: 'Access 1099 forms and annual tax statement downloads.' },
    { icon: '🪙', name: 'Crypto on Robinhood', desc: 'Buy and hold Bitcoin, Ethereum, and other cryptocurrencies.' },
    { icon: '🏆', name: 'Robinhood Gold', desc: 'Premium features, margin investing, and research tools.' },
  ],
  phantom: [
    { icon: '👻', name: 'Getting Started', desc: 'Install Phantom, create your wallet, and explore Solana.' },
    { icon: '🔑', name: 'Wallet Recovery', desc: 'Restore your wallet using your seed phrase or private key.' },
    { icon: '🔁', name: 'Swapping Tokens', desc: 'Swap SOL, USDC, and SPL tokens in one tap.' },
    { icon: '🖼️', name: 'NFTs & Collections', desc: 'View, send, and burn Solana NFTs directly in the app.' },
    { icon: '🌐', name: 'DApp Connections', desc: 'Connect Phantom to DeFi protocols and games on Solana.' },
    { icon: '⛽', name: 'Transaction Fees', desc: 'How Solana fee priority works and how to set custom fees.' },
  ],
};

/* ============================================================
   CONTACT METHOD CONFIG
   ============================================================ */
const CONTACT_METHODS = {
  email:    { label: 'Email',    icon: '✉️' },
  whatsapp: { label: 'WhatsApp', icon: '💬' },
  telegram: { label: 'Telegram', icon: '✈️' },
  chatbot:  { label: 'Chatbot',  icon: '🤖' },
};

/* ============================================================
   LOCAL STORAGE HELPERS
   ============================================================ */
const STORAGE_KEY = 'supportcenterx_sites';

function loadSites() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveSites(sites) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sites));
}

function getSiteById(id) {
  return loadSites().find(s => s.id === id) || null;
}

function createSiteObject({ platformKey, contactMethod, contactDetails, uptimeDays }) {
  const id = `${platformKey}-${Date.now().toString(36)}`;
  return {
    id,
    platformKey,
    contactMethod,
    contactDetails,
    uptimeDays: parseInt(uptimeDays, 10),
    createdAt: Date.now(),
  };
}

function addSite(site) {
  const sites = loadSites();
  sites.unshift(site);  // newest first
  saveSites(sites);
}

function deleteSite(id) {
  const sites = loadSites().filter(s => s.id !== id);
  saveSites(sites);
}

/* ============================================================
   ROUTING
   ============================================================ */
function getHashSiteId() {
  const hash = window.location.hash;  // e.g. #site=binance-abc123
  const match = hash.match(/^#site=(.+)$/);
  return match ? match[1] : null;
}

function navigateToSite(id) {
  window.location.hash = `site=${id}`;
}

function navigateToDashboard() {
  window.location.hash = '';
}

function handleRouting() {
  const siteId = getHashSiteId();
  if (siteId) {
    const site = getSiteById(siteId);
    if (site) {
      showSupportSiteView(site);
    } else {
      showAdminShell();
      showToast('Site not found — it may have been deleted.', true);
    }
  } else {
    showAdminShell();
  }
}

function showAdminShell() {
  document.getElementById('admin-shell').style.display = 'flex';
  document.getElementById('admin-shell').style.flexDirection = 'column';
  document.getElementById('admin-shell').style.minHeight = '100vh';
  document.getElementById('support-site-view').style.display = 'none';
  document.body.style.background = 'var(--bg-base)';
}

/* ============================================================
   ADMIN UI — FORM INTERACTIONS
   ============================================================ */

// Platform select → update preview card
document.getElementById('platform-select').addEventListener('change', function () {
  const key = this.value;
  updatePreviewCard(key);
  validateForm();
});

// Contact method radio buttons → show relevant input
document.querySelectorAll('input[name="contact-method"]').forEach(radio => {
  radio.addEventListener('change', function () {
    handleContactUI(this.value);
    validateForm();
  });
});

// Uptime slider
document.getElementById('uptime-slider').addEventListener('input', function () {
  document.getElementById('uptime-display').textContent = `${this.value} day${this.value > 1 ? 's' : ''}`;
});

// Generate button
document.getElementById('generate-btn').addEventListener('click', handleGenerate);

// Input changes → validate
document.querySelectorAll('.contact-detail-input, #input-whatsapp, #input-telegram, #input-chatbot').forEach(el => {
  el.addEventListener('input', validateForm);
});

function handleContactUI(method) {
  // Hide all
  document.getElementById('input-email').style.display = 'none';
  document.getElementById('input-whatsapp-wrap').style.display = 'none';
  document.getElementById('input-telegram').style.display = 'none';
  document.getElementById('input-chatbot-wrap').style.display = 'none';
  document.getElementById('contact-details-group').style.display = 'none';

  if (!method) return;

  document.getElementById('contact-details-group').style.display = 'flex';

  const labelEl = document.getElementById('contact-details-label');

  if (method === 'email') {
    labelEl.textContent = 'Support Email Address';
    document.getElementById('input-email').style.display = 'block';
  } else if (method === 'whatsapp') {
    labelEl.textContent = 'WhatsApp Number (with country code)';
    document.getElementById('input-whatsapp-wrap').style.display = 'flex';
  } else if (method === 'telegram') {
    labelEl.textContent = 'Telegram Username or Link';
    document.getElementById('input-telegram').style.display = 'block';
  } else if (method === 'chatbot') {
    labelEl.textContent = 'Chat Widget Embed Code';
    document.getElementById('input-chatbot-wrap').style.display = 'block';
  }
}

function getSelectedMethod() {
  const radio = document.querySelector('input[name="contact-method"]:checked');
  return radio ? radio.value : null;
}

function getContactDetails(method) {
  if (!method) return '';
  if (method === 'email')    return document.getElementById('input-email').value.trim();
  if (method === 'whatsapp') return document.getElementById('input-whatsapp').value.trim();
  if (method === 'telegram') return document.getElementById('input-telegram').value.trim();
  if (method === 'chatbot')  return document.getElementById('input-chatbot').value.trim();
  return '';
}

function validateForm() {
  const platform = document.getElementById('platform-select').value;
  const method = getSelectedMethod();
  const details = getContactDetails(method);
  const valid = platform && method && details.length > 0;
  document.getElementById('generate-btn').disabled = !valid;
}

function updatePreviewCard(platformKey) {
  const emptyEl = document.getElementById('preview-empty');
  const cardEl  = document.getElementById('preview-card');

  if (!platformKey || !PLATFORMS[platformKey]) {
    emptyEl.style.display = 'flex';
    cardEl.style.display  = 'none';
    return;
  }

  const p = PLATFORMS[platformKey];
  emptyEl.style.display = 'none';
  cardEl.style.display  = 'block';

  document.getElementById('preview-band').style.background =
    `linear-gradient(135deg, ${p.secondaryColor}, ${p.accentColor})`;
  document.getElementById('preview-logo').textContent = p.logoEmoji;
  document.getElementById('preview-name').textContent  = p.name;
  document.getElementById('preview-name').style.color  = p.primaryColor;

  const chip = document.getElementById('preview-chip');
  chip.textContent = p.chipLabel;
  chip.style.background = `${p.primaryColor}20`;
  chip.style.color       = p.primaryColor;
  chip.style.border      = `1px solid ${p.primaryColor}40`;

  // Color swatches
  const swatchContainer = document.getElementById('preview-colors');
  swatchContainer.innerHTML = '';
  [p.primaryColor, p.secondaryColor, p.accentColor].forEach(color => {
    const swatch = document.createElement('div');
    swatch.className = 'preview-color-swatch';
    swatch.style.background = color;
    swatch.title = color;
    swatchContainer.appendChild(swatch);
  });
}

function handleGenerate() {
  const platformKey    = document.getElementById('platform-select').value;
  const contactMethod  = getSelectedMethod();
  const contactDetails = getContactDetails(contactMethod);
  const uptimeDays     = document.getElementById('uptime-slider').value;

  if (!platformKey || !contactMethod || !contactDetails) return;

  const site = createSiteObject({ platformKey, contactMethod, contactDetails, uptimeDays });
  addSite(site);
  renderSitesList();
  updateHeaderCount();

  // Visual feedback
  const btn = document.getElementById('generate-btn');
  btn.textContent = '✅ Site Generated!';
  btn.disabled = true;
  setTimeout(() => {
    btn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M3 9H15M10.5 4.5L15 9L10.5 13.5" stroke="white" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      Generate Support Site`;
    validateForm();
  }, 2000);

  // Scroll to sites list
  document.getElementById('sites-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
  showToast(`${PLATFORMS[platformKey].name} site created!`);
}

/* ============================================================
   SITES LIST RENDERING
   ============================================================ */
function renderSitesList() {
  const sites = loadSites();
  const grid = document.getElementById('sites-grid');
  const desc = document.getElementById('sites-count-desc');

  grid.innerHTML = '';

  if (sites.length === 0) {
    desc.textContent = 'No sites yet — create your first one above.';
    grid.innerHTML = `
      <div class="sites-empty">
        <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
          <rect width="56" height="56" rx="16" fill="rgba(255,92,22,0.06)"/>
          <path d="M18 26C18 22.69 20.69 20 24 20H32C35.31 20 38 22.69 38 26V34C38 37.31 35.31 40 32 40H24C20.69 40 18 37.31 18 34V26Z" stroke="#FF5C16" stroke-width="1.4" stroke-opacity="0.35"/>
          <path d="M23 29H33M23 33H28" stroke="#FF5C16" stroke-width="1.4" stroke-linecap="round" stroke-opacity="0.35"/>
        </svg>
        <p>Your generated microsites will appear here.</p>
      </div>`;
    return;
  }

  desc.textContent = `${sites.length} site${sites.length !== 1 ? 's' : ''} generated.`;

  sites.forEach(site => {
    const p = PLATFORMS[site.platformKey];
    if (!p) return;

    const expiryDate = new Date(site.createdAt + site.uptimeDays * 86400000);
    const now = Date.now();
    const daysLeft = Math.ceil((expiryDate - now) / 86400000);
    const isExpiring = daysLeft <= 2 && daysLeft > 0;
    const isExpired  = daysLeft <= 0;
    const statusLabel = isExpired
      ? 'Expired'
      : isExpiring
        ? `Expires in ${daysLeft}d`
        : `Active ${site.uptimeDays}d`;
    const statusClass = (isExpired || isExpiring) ? 'expiring' : 'active';

    const accessLink = `${window.location.origin}${window.location.pathname}#site=${site.id}`;
    const createdDate = new Date(site.createdAt).toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
    });

    const card = document.createElement('div');
    card.className = 'site-card';
    card.innerHTML = `
      <div class="site-card-top" style="background: ${p.primaryColor};"></div>
      <div class="site-card-body">
        <div class="site-card-header">
          <div class="site-card-icon" style="background: ${p.primaryColor}22; border: 1px solid ${p.primaryColor}44;">
            ${p.logoEmoji}
          </div>
          <div class="site-card-info">
            <div class="site-card-platform">${p.name}</div>
            <div class="site-card-method">${CONTACT_METHODS[site.contactMethod]?.icon} ${CONTACT_METHODS[site.contactMethod]?.label}</div>
          </div>
          <span class="site-status ${statusClass}">${statusLabel}</span>
        </div>
        <div class="site-card-meta">
          <div class="meta-item">
            <span class="meta-label">Created</span>
            <span class="meta-value">${createdDate}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Uptime</span>
            <span class="meta-value">${site.uptimeDays} days</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Contact</span>
            <span class="meta-value">${truncate(site.contactDetails, 22)}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">ID</span>
            <span class="meta-value" style="font-family: monospace; font-size: 11px;">${site.id}</span>
          </div>
        </div>
        <div class="site-card-actions">
          <button class="btn btn-secondary" onclick="copyLink('${escapeAttr(accessLink)}')">
            📋 Copy Link
          </button>
          <button class="btn btn-ghost" onclick="navigateToSite('${site.id}')">
            🔗 View Site
          </button>
          <button class="btn btn-secondary" onclick="handleDeleteSite('${site.id}')" title="Delete" style="flex: 0; padding: 8px 12px;">
            🗑️
          </button>
        </div>
      </div>`;
    grid.appendChild(card);
  });
}

function handleDeleteSite(id) {
  if (!confirm('Delete this support site?')) return;
  deleteSite(id);
  renderSitesList();
  updateHeaderCount();
  showToast('Site deleted.');
}

function updateHeaderCount() {
  const count = loadSites().length;
  document.getElementById('header-sites-count').textContent = `${count} site${count !== 1 ? 's' : ''}`;
}

/* ============================================================
   SUPPORT SITE VIEW RENDERING
   ============================================================ */
function showSupportSiteView(site) {
  document.getElementById('admin-shell').style.display = 'none';
  const container = document.getElementById('support-site-view');
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.innerHTML = renderSupportSiteHTML(site);
  container.classList.remove('entering');
  void container.offsetWidth;  // reflow
  container.classList.add('entering');

  // Apply dynamic background to body
  const p = PLATFORMS[site.platformKey];
  if (p) document.body.setAttribute('style', p.bgStyle);

  // Apply FAQ accordion behavior
  container.querySelectorAll('.ss-faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.ss-faq-item').classList.toggle('open');
    });
  });

  // Safely inject chatbot embed if needed
  if (site.contactMethod === 'chatbot' && site.contactDetails.trim()) {
    const chatbotWrap = container.querySelector('.ss-chatbot-wrap');
    if (chatbotWrap) {
      // Create a range to parse HTML including scripts
      const fragment = document.createRange().createContextualFragment(site.contactDetails);
      chatbotWrap.appendChild(fragment);
    }
  }
}

function renderSupportSiteHTML(site) {
  const p = PLATFORMS[site.platformKey];
  if (!p) return '<p style="color:white;padding:40px">Platform not found.</p>';

  const topics = PLATFORM_TOPICS[site.platformKey] || [];
  const isDark = p.darkMode !== false; // default dark unless explicitly false
  const textColor = p.textColor;
  const bgColor   = p.secondaryColor;

  // Build contact CTA
  const contactBlock = buildContactBlock(site, p);

  // Build topics HTML
  const topicsHTML = topics.map(t => `
    <div class="ss-topic-card" style="background: ${p.accentColor}; border: 1px solid ${p.primaryColor}22; color: ${textColor};">
      <div class="ss-topic-icon" style="background: ${p.primaryColor}20;">${t.icon}</div>
      <div class="ss-topic-name">${t.name}</div>
      <div class="ss-topic-desc">${t.desc}</div>
      <div class="ss-topic-arrow" style="color: ${p.primaryColor};">→</div>
    </div>`).join('');

  // Build FAQ
  const faqs = buildFAQs(site.platformKey, p.name);
  const faqHTML = faqs.map(f => `
    <div class="ss-faq-item" style="border-color: ${p.primaryColor}22; background: ${p.accentColor};">
      <div class="ss-faq-q" style="color: ${textColor};">
        ${f.q}
        <svg class="faq-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <div class="ss-faq-a" style="color: ${textColor};">${f.a}</div>
    </div>`).join('');

  // Nav links color scheme
  const navStyle = `color: ${textColor};`;

  return `
    <!-- HEADER -->
    <header class="ss-header" style="background: ${p.headerBg}; backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);">
      <div class="ss-header-inner">
        <div class="ss-logo">
          <div class="ss-logo-icon" style="background: ${p.primaryColor}20; border: 1px solid ${p.primaryColor}40;">
            ${renderLogoHTML(site.platformKey)}
          </div>
          <span class="ss-logo-name" style="${navStyle} font-family: ${p.fontFamily};">${p.name}</span>
        </div>
        <ul class="ss-nav-links" style="${navStyle}">
          <li><a href="#" style="color:${textColor};">Help Center</a></li>
          <li><a href="#" style="color:${textColor};">My Account</a></li>
          <li><a href="#" style="color:${textColor}; font-weight:700; opacity:1; color:${p.primaryColor};">Contact Us</a></li>
        </ul>
      </div>
    </header>

    <!-- HERO -->
    <div class="ss-hero" style="background: linear-gradient(180deg, ${p.accentColor} 0%, transparent 100%); color: ${textColor};">
      <div class="ss-hero-inner">
        <div class="ss-hero-label" style="color: ${p.primaryColor};">${p.name} Support Center</div>
        <h1 class="ss-hero-title" style="font-family: ${p.fontFamily}; color: ${textColor};">
          How can we help you today?
        </h1>
        <p class="ss-hero-sub" style="color: ${textColor};">
          Find answers fast. Browse topics below, search our knowledge base, or reach out to our support team directly.
        </p>
        <div class="ss-search-wrap">
          <input class="ss-search-input" type="text" placeholder="Search for help articles, guides, and FAQs…" style="color: ${textColor};" />
          <button class="ss-search-btn" style="background: ${p.primaryColor}; color: ${isDark ? 'white' : p.secondaryColor}; font-family: ${p.fontFamily};">
            Search
          </button>
        </div>
      </div>
    </div>

    <!-- TOPIC CARDS -->
    <section class="ss-topics" style="color: ${textColor};">
      <h2 class="ss-topics-title" style="font-family: ${p.fontFamily}; color: ${textColor};">Browse Help Topics</h2>
      <div class="ss-topics-grid">${topicsHTML}</div>
    </section>

    <!-- FAQ -->
    <section class="ss-faq" style="color: ${textColor};">
      <h2 class="ss-faq-title" style="font-family: ${p.fontFamily}; color: ${textColor};">Frequently Asked Questions</h2>
      <div class="ss-faq-list">${faqHTML}</div>
    </section>

    <!-- CONTACT CTA -->
    <section class="ss-contact" style="color: ${textColor};">
      <div class="ss-contact-inner" style="background: ${p.accentColor}; border-color: ${p.primaryColor}30;">
        <div class="ss-contact-title" style="font-family: ${p.fontFamily}; color: ${textColor};">
          Still need help?
        </div>
        <p class="ss-contact-sub" style="color: ${textColor};">
          Our support team is here for you. Reach out and we'll get back to you as quickly as possible.
        </p>
        ${contactBlock}
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="ss-footer" style="border-color: ${p.primaryColor}18; color: ${textColor};">
      <p class="ss-disclaimer">
        ⚠️ This is a demo support microsite generated by SupportCenterX and is <strong>not</strong> the official ${p.name} support page. 
        Do not share sensitive account credentials here.
      </p>
      <div class="ss-back-link" onclick="navigateToDashboard()" style="color: ${textColor};">
        ← Return to SupportCenterX Admin
      </div>
    </footer>
  `;
}

function buildContactBlock(site, p) {
  const textColor = p.textColor;
  const isDark    = p.darkMode !== false;
  const btnColor  = isDark ? 'white' : p.secondaryColor;

  if (site.contactMethod === 'email') {
    const email = site.contactDetails;
    return `
      <a href="mailto:${email}" class="ss-contact-btn"
         style="background: ${p.primaryColor}; color: ${btnColor}; box-shadow: 0 6px 24px ${p.primaryColor}50;">
        ✉️ Contact via Email
      </a>
      <p style="margin-top: 14px; font-size: 13px; opacity: 0.55; color: ${textColor};">${email}</p>`;
  }

  if (site.contactMethod === 'whatsapp') {
    const number = site.contactDetails.replace(/\D/g, '');
    const waLink = `https://wa.me/${number}`;
    return `
      <a href="${waLink}" target="_blank" rel="noopener noreferrer" class="ss-contact-btn"
         style="background: #25D366; color: white; box-shadow: 0 6px 24px #25D36650;">
        💬 Contact on WhatsApp
      </a>
      <p style="margin-top: 14px; font-size: 13px; opacity: 0.55; color: ${textColor};">+${number}</p>`;
  }

  if (site.contactMethod === 'telegram') {
    let tgLink = site.contactDetails;
    if (!tgLink.startsWith('http')) {
      const username = tgLink.replace(/^@/, '');
      tgLink = `https://t.me/${username}`;
    }
    return `
      <a href="${tgLink}" target="_blank" rel="noopener noreferrer" class="ss-contact-btn"
         style="background: #229ED9; color: white; box-shadow: 0 6px 24px #229ED950;">
        ✈️ Contact on Telegram
      </a>
      <p style="margin-top: 14px; font-size: 13px; opacity: 0.55; color: ${textColor};">${site.contactDetails}</p>`;
  }

  if (site.contactMethod === 'chatbot') {
    return `
      <p style="font-size: 14px; opacity: 0.65; margin-bottom: 12px; color: ${textColor};">Our live chat widget is active below:</p>
      <div class="ss-chatbot-wrap"></div>`;
  }

  return '';
}

/**
 * renderLogoHTML — returns an emoji or <img> tag for the platform logo.
 * TO USE A REAL LOGO: uncomment the logoPath in the platform config above,
 * then update this function to return: <img src="${path}" alt="${name}" style="width:28px;height:28px;" />
 */
function renderLogoHTML(platformKey) {
  const p = PLATFORMS[platformKey];
  if (!p) return '?';
  // If you add a logoPath to the platform config, use this:
  // if (p.logoPath) return `<img src="${p.logoPath}" alt="${p.name}" style="width:28px;height:28px;object-fit:contain;" />`;
  return `<span style="font-size: 22px;">${p.logoEmoji}</span>`;
}

/* ============================================================
   FAQ CONTENT (generic, platform-aware)
   ============================================================ */
function buildFAQs(platformKey, platformName) {
  const base = [
    {
      q: `How do I contact ${platformName} support?`,
      a: `You can reach ${platformName} support through the contact option on this page. Our team typically responds within 24–48 hours.`,
    },
    {
      q: 'I forgot my password. How do I reset it?',
      a: `Navigate to the ${platformName} login page and click "Forgot Password." You'll receive a reset link to your registered email address.`,
    },
    {
      q: 'Why is my account restricted or suspended?',
      a: `Accounts may be suspended for security reasons, failed KYC verification, or suspicious activity. Please contact support with your account details so we can assist.`,
    },
    {
      q: 'My transaction is pending or failed — what should I do?',
      a: `Pending transactions can take up to 60 minutes depending on network congestion. If it's been longer, check the transaction hash on the relevant blockchain explorer and contact support if needed.`,
    },
    {
      q: 'How long does identity verification (KYC) take?',
      a: `Most verifications are completed within a few hours. During peak periods, it may take up to 3 business days. Make sure your documents are clear and unexpired.`,
    },
  ];
  return base;
}

/* ============================================================
   CLIPBOARD & TOAST
   ============================================================ */
function copyLink(link) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(link).then(() => showToast('Link copied to clipboard!'));
  } else {
    // Fallback for non-secure contexts (e.g., file:// or http://)
    const ta = document.createElement('textarea');
    ta.value = link;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast('Link copied!');
  }
}

function showToast(msg, isError = false) {
  const toast = document.getElementById('toast');
  const msgEl = document.getElementById('toast-msg');
  msgEl.textContent = msg;
  toast.style.borderColor = isError ? 'rgba(255,92,22,0.4)' : 'rgba(52,211,153,0.3)';
  toast.style.color        = isError ? '#FFA680' : '#34D399';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2800);
}

/* ============================================================
   UTILITY HELPERS
   ============================================================ */
function truncate(str, maxLen) {
  return str.length > maxLen ? str.slice(0, maxLen) + '…' : str;
}

function escapeAttr(str) {
  return str.replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

/* ============================================================
   INIT
   ============================================================ */
function init() {
  // Initial render
  renderSitesList();
  updateHeaderCount();

  // Handle routing on load and hash change
  handleRouting();
  window.addEventListener('hashchange', handleRouting);

  // Nav links (admin)
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      // Only one view currently; extend here for multi-view admin
    });
  });

  console.log(
    '%cSupportCenterX loaded 🚀',
    'color:#FF5C16;font-size:16px;font-weight:bold;'
  );
  console.log(
    '%cTo add platforms: edit PLATFORMS in app.js. To use real logos: update logoPath and renderLogoHTML().',
    'color:#9896A8;font-size:12px;'
  );
}

// Run on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
