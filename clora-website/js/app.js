/* CLORA demo site — accessible client-side interactions; no analytics or hidden data submission. */
(() => {
  'use strict';
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const config = window.CLORA_CONFIG || { contactEmail: 'hello@clora.example', formEndpoint: '' };
  // Centralize the configured email across every page, not just the contact form.
  const configuredEmail = config.contactEmail || 'hello@clora.example';
  $$('a[href^="mailto:hello@clora.example"]').forEach(anchor => {
    anchor.href = `mailto:${configuredEmail}`;
    if (anchor.textContent.trim() === 'hello@clora.example') anchor.textContent = configuredEmail;
  });
  const toast = $('#toast');
  let toastTimer;
  const notify = message => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 4200);
  };
  const storage = {
    get: key => { try { return localStorage.getItem(key); } catch { return null; } },
    set: (key, value) => { try { localStorage.setItem(key, value); } catch { /* restricted browser */ } }
  };

  $$('[data-year]').forEach(n => n.textContent = new Date().getFullYear());
  const progress = $('.scroll-progress');
  const back = $('.back-top');
  let ticking = false;
  const updateScroll = () => {
    const distance = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    if (progress) progress.style.width = `${Math.min(100, 100 * window.scrollY / distance)}%`;
    if (back) back.classList.toggle('visible', window.scrollY > 550);
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(updateScroll); }
  }, { passive: true });
  updateScroll();
  back?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // Sticky responsive nav and service dropdown.
  const nav = $('#primaryNav');
  const menu = $('.menu-toggle');
  const dropdown = $('.nav-dropdown');
  const dropTrigger = $('.dropdown-trigger');
  const closeDrop = () => {
    dropdown?.classList.remove('open');
    dropTrigger?.setAttribute('aria-expanded','false');
  };
  const closeNav = () => {
    nav?.classList.remove('is-open');
    menu?.setAttribute('aria-expanded','false');
    menu?.setAttribute('aria-label','Open navigation');
    closeDrop();
  };
  menu?.addEventListener('click', () => {
    const open = !nav.classList.contains('is-open');
    nav.classList.toggle('is-open',open);
    menu.setAttribute('aria-expanded',String(open));
    menu.setAttribute('aria-label',open?'Close navigation':'Open navigation');
    if (!open) closeDrop();
  });
  dropTrigger?.addEventListener('click', () => {
    const open = !dropdown.classList.contains('open');
    dropdown.classList.toggle('open',open);
    dropTrigger.setAttribute('aria-expanded',String(open));
  });
  document.addEventListener('click', event => {
    if (dropdown && !dropdown.contains(event.target)) closeDrop();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeNav();
  });
  $$('.primary-nav a').forEach(link => link.addEventListener('click', closeNav));
  window.addEventListener('resize', () => { if (window.innerWidth > 900) closeNav(); });

  // Cookie preference UI; no non-essential cookies/scripts are actually used.
  const cookie = $('#cookieBar');
  const showCookie = () => { if (cookie) cookie.hidden = false; };
  if (!storage.get('clora_cookie_preference')) showCookie();
  $$('[data-cookie]').forEach(button => button.addEventListener('click', () => {
    storage.set('clora_cookie_preference',button.dataset.cookie);
    if (cookie) cookie.hidden = true;
    notify('Preference saved locally. No tracking scripts are loaded.');
  }));
  $$('[data-open-consent]').forEach(button => button.addEventListener('click', showCookie));

  // Portfolio filtering and concept previews.
  const projects = {
    aurora: { category:'BRAND & WEB · CONCEPT PROJECT', title:'Aurora Studio', text:'A speculative visual identity and editorial web experience. The concept explores a highly distinctive brand system, a purposeful home page and expressive digital storytelling.', design:'project-aurora' },
    nexa: { category:'WEB & AI · CONCEPT PROJECT', title:'Nexa Interface', text:'A product-led experience for an imagined AI company, with clean UX, simple conversion flows and an identity that feels technical without feeling cold.', design:'project-nexa' },
    muse: { category:'SOCIAL & BRAND · CONCEPT PROJECT', title:'Muse Collective', text:'A social-first creative launch system built around flexible typography, motion-ready compositions and reusable content templates.', design:'project-muse' },
    orbit: { category:'GROWTH & WEB · CONCEPT PROJECT', title:'Orbit Commerce', text:'An ecommerce journey emphasizing intuitive product discovery, clear benefit messaging and a high-contrast digital design system.', design:'project-orbit' }
  };
  const projectDialog = $('#projectDialog');
  $$('[data-project]').forEach(button => button.addEventListener('click', () => {
    const p = projects[button.dataset.project];
    if (!p || !projectDialog) return;
    $('#projectDialogMeta').textContent = p.category;
    $('#projectDialogTitle').textContent = p.title;
    $('#projectDialogDesc').textContent = p.text;
    const visual = $('#projectDialogGraphic');
    visual.className = 'dialog-graphic ' + p.design;
    visual.textContent = p.title;
    projectDialog.showModal();
  }));
  $$('[data-filter-group]').forEach(group => {
    const type = group.dataset.filterGroup;
    const cards = type === 'work' ? $$('.all-work .work-card') : $$('.article-grid .article-card');
    const empty = type === 'work' ? $('#workEmpty') : $('#insightEmpty');
    const buttons = $$('[data-filter]',group);
    const perform = () => {
      const active = group.querySelector('.is-active')?.dataset.filter || 'all';
      const query = type === 'insights' ? ($('#insightSearch')?.value || '').toLowerCase().trim() : '';
      let count=0;
      cards.forEach(card => {
        const category = card.dataset.category || '';
        const visible = (active === 'all' || category.includes(active)) && (!query || card.textContent.toLowerCase().includes(query));
        card.hidden = !visible;
        if (visible) count++;
      });
      if (empty) empty.hidden = count > 0;
    };
    buttons.forEach(button => button.addEventListener('click',() => {
      buttons.forEach(b => { b.classList.remove('is-active'); b.setAttribute('aria-pressed','false'); });
      button.classList.add('is-active'); button.setAttribute('aria-pressed','true');
      perform();
    }));
    if (type === 'insights') $('#insightSearch')?.addEventListener('input',perform);
  });

  // Local sample editorial content. No scraped or copied third-party articles.
  const articles = {
    strategy:{ category:'BRAND STRATEGY', title:'Why a strong digital brand needs more than a logo', intro:'A recognizable identity becomes more valuable when every touchpoint moves in the same direction.', content:'Identity is the visual beginning, not the end. Start with a clear audience and a compelling promise. Then build repeatable choices: type, color, voice, imagery, motion and the way your website behaves. Consistency is not about making everything identical—it is about making everything unmistakably yours.' },
    web:{ category:'WEB DESIGN', title:'Designing a homepage that actually helps people decide', intro:'Make the right information easy to find, then make the next step obvious.', content:'An effective homepage gives visitors a reason to stay within seconds. Lead with a sharp promise, show the work behind it, offer simple routes to important information, and keep primary actions unmistakable. Test the mobile experience before polishing desktop animation.' },
    growth:{ category:'DIGITAL GROWTH', title:'Less noise. Better measurement.', intro:'Choose metrics that connect to decisions, not just beautiful dashboards.', content:'Likes, visits and impressions can be useful signals, but they are not the whole story. Decide which actions matter for your business, install privacy-aware measurement, agree on a reporting rhythm, and ask what you will actually change based on what you learn.' },
    ai:{ category:'AI & AUTOMATION', title:'Where AI belongs in a creative workflow', intro:'Use systems to speed up repetitive work, while people stay responsible for taste and trust.', content:'The most useful automation starts with a process you already understand. Define its inputs, outputs and review steps. Use AI where it saves time, review claims and visuals before publishing, and give customers a clear human point of contact when they need one.' }
  };
  const articleDialog = $('#articleDialog');
  let activeArticle = null;
  $$('[data-article]').forEach(button => button.addEventListener('click',() => {
    const a = articles[button.dataset.article];
    if (!a || !articleDialog) return;
    activeArticle = a;
    $('#articleDialogMeta').textContent = a.category;
    $('#articleDialogTitle').textContent = a.title;
    $('#articleDialogIntro').textContent = a.intro;
    $('#articleDialogContent').textContent = a.content;
    articleDialog.showModal();
  }));
  $('#copyArticle')?.addEventListener('click',async () => {
    if (!activeArticle) return;
    try {
      await navigator.clipboard.writeText(`${activeArticle.title}\n\n${activeArticle.intro}\n\n${activeArticle.content}`);
      notify('Article summary copied.');
    } catch { notify('Copy is unavailable in this browser.'); }
  });
  $$('[data-close-dialog]').forEach(button => button.addEventListener('click',() => button.closest('dialog')?.close()));
  $$('dialog').forEach(dialog => dialog.addEventListener('click',event => { if (event.target === dialog) dialog.close(); }));

  // Search FAQs on the home page.
  const faqSearch = $('#faqSearch');
  faqSearch?.addEventListener('input', () => {
    const query = faqSearch.value.trim().toLowerCase();
    let visibleCount=0;
    $$('[data-faq]').forEach(row => {
      const show = row.textContent.toLowerCase().includes(query);
      row.hidden = !show;
      if (show) visibleCount++;
    });
    const empty = $('#faqEmpty');
    if (empty) empty.hidden = visibleCount !== 0;
  });

  // Fit Finder: honest, rules-based service recommendations (no AI or website crawl).
  const auditForm = $('#auditForm');
  const catalog = {
    brand:{ title:'Brand identity & creative', info:'Build a recognizable visual and verbal direction.' },
    web:{ title:'Websites & digital experiences', info:'Create a clear, useful home for your brand.' },
    social:{ title:'Social & content', info:'Connect with people through repeatable stories.' },
    growth:{ title:'Search & growth', info:'Make your work discoverable and easier to act on.' },
    automation:{ title:'AI & automation', info:'Give repetitive tasks a smarter process.' },
    analytics:{ title:'Insights & optimization', info:'Learn what is working and where to improve.' }
  };
  auditForm?.addEventListener('submit', event => {
    event.preventDefault();
    if (!auditForm.reportValidity()) return;
    const data = new FormData(auditForm);
    const score = Object.fromEntries(Object.keys(catalog).map(key => [key, 0]));
    const stage = data.get('stage');
    const goal = data.get('goal');
    const stageMap = {new:['brand','web'], growing:['growth','analytics'], refresh:['brand','web']};
    (stageMap[stage] || []).forEach(v => score[v]+=1);
    const goalMap = { identity:'brand',website:'web',audience:'social',leads:'growth',time:'automation' };
    if (goalMap[goal]) score[goalMap[goal]]+=4;
    for (const gap of data.getAll('gaps')) {
      const key = gap === 'data' ? 'analytics' : gap;
      if (key in score) score[key]+=2;
    }
    if (goal === 'leads') score.web++;
    if (goal === 'audience') score.analytics++;
    const selected = Object.keys(score).sort((a,b)=>score[b]-score[a]).slice(0,3);
    const primary = selected[0];
    const h = $('#auditHeadline');
    const rationale = $('#auditRationale');
    const list = $('#auditSuggestions');
    h.textContent = `Start with ${catalog[primary].title.toLowerCase()}.`;
    rationale.textContent = `Based on your stated priorities, this looks like a useful starting point. A real project discovery conversation would refine the scope and budget.`;
    list.replaceChildren();
    selected.forEach((id,index) => {
      const item = document.createElement('div');
      item.className = 'recommendation';
      const number = document.createElement('b');number.textContent=String(index+1).padStart(2,'0');
      const body=document.createElement('div');
      const title=document.createElement('strong');title.textContent=catalog[id].title;
      const desc=document.createElement('p');desc.textContent=catalog[id].info;
      body.append(title,desc); item.append(number,body); list.append(item);
    });
    const contact = $('#auditContact');
    if (contact) contact.href = `contact.html?source=fit-finder&service=${encodeURIComponent(primary)}`;
    auditForm.hidden=true;
    $('#auditResult').hidden=false;
    $('#auditResult').scrollIntoView({ behavior:'smooth',block:'center' });
  });
  $('#auditReset')?.addEventListener('click', () => {
    auditForm.reset(); auditForm.hidden=false; $('#auditResult').hidden=true;
    auditForm.scrollIntoView({ behavior:'smooth',block:'start' });
  });

  // Contact: validates all fields and either POSTs to a deliberately configured endpoint
  // or opens a clear pre-filled email draft. It never claims a draft was sent.
  const contactForm=$('#contactForm');
  if (contactForm) {
    const params=new URLSearchParams(window.location.search);
    if (params.get('service') && [...$('#contactService').options].some(o => o.value===params.get('service')))
      $('#contactService').value=params.get('service');
    if (params.get('source')==='fit-finder') $('#contactMessage').placeholder='Tell us more about your Project Fit Finder results and what you would like to create...';
    contactForm.addEventListener('submit', async event => {
      event.preventDefault();
      const error=$('#contactError');error.hidden=true;
      if ($('#contactWebsite')?.value) return; // honeypot
      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        error.textContent='Please complete the required fields and review your email address.';
        error.hidden=false;return;
      }
      const data=new FormData(contactForm);
      const fields={
        name:String(data.get('name')||'').trim(),email:String(data.get('email')||'').trim(),
        company:String(data.get('company')||'').trim(),service:String(data.get('service')||''),
        budget:String(data.get('budget')||''),timeline:String(data.get('timeline')||''),
        message:String(data.get('message')||'').trim()
      };
      const submit=contactForm.querySelector('[type="submit"]');
      if (config.formEndpoint) {
        submit.disabled=true;submit.textContent='Sending…';
        try {
          const resp=await fetch(config.formEndpoint,{method:'POST',body:JSON.stringify(fields),headers:{'Content-Type':'application/json','Accept':'application/json'}});
          if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
          contactForm.reset(); notify('Your inquiry was submitted to the configured form service.');
        } catch(err) { error.hidden=false;error.textContent='The form service could not be reached. Please try again or contact us by email.'; }
        finally { submit.disabled=false;submit.innerHTML='Prepare my inquiry <span>↗</span>'; }
        return;
      }
      const recipient=config.contactEmail || 'hello@clora.example';
      const subject=`CLORA project inquiry — ${fields.company || fields.name}`;
      const body=`Hello CLORA,\n\nName: ${fields.name}\nEmail: ${fields.email}\nCompany: ${fields.company || 'Not provided'}\nService: ${fields.service}\nIndicative budget: ${fields.budget || 'Not specified'}\nTimeline: ${fields.timeline || 'Flexible'}\n\nProject details:\n${fields.message}\n\n— Sent from the CLORA website inquiry draft`;
      const mailto=`mailto:${encodeURIComponent(recipient)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      notify('Opening your email app with a prepared draft. Review and send it there.');
      window.location.href=mailto;
    });
  }
})();
