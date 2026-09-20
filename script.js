window.addEventListener('load',()=>{
  setTimeout(()=>document.getElementById('loader').classList.add('done'),1350);
});

const observer = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
},{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

const ring=document.querySelector('.cursor-ring'), dot=document.querySelector('.cursor-dot');
window.addEventListener('pointermove',e=>{
  if(!ring||!dot)return;
  dot.style.left=e.clientX+'px'; dot.style.top=e.clientY+'px';
  ring.animate({left:e.clientX+'px',top:e.clientY+'px'},{duration:350,fill:'forwards'});
});
document.querySelectorAll('a,button,.project').forEach(el=>{
  el.addEventListener('mouseenter',()=>ring?.classList.add('active'));
  el.addEventListener('mouseleave',()=>ring?.classList.remove('active'));
});

document.querySelectorAll('[data-speed]').forEach(el=>{
  const speed=parseFloat(el.dataset.speed);
  window.addEventListener('scroll',()=>{
    const y=window.scrollY;
    el.style.transform=`translate3d(0,${y*speed}px,0)`;
  },{passive:true});
});

document.querySelectorAll('.magnetic').forEach(el=>{
  el.addEventListener('mousemove',e=>{
    const r=el.getBoundingClientRect();
    const x=(e.clientX-r.left-r.width/2)*.16, y=(e.clientY-r.top-r.height/2)*.16;
    el.style.transform=`translate(${x}px,${y}px)`;
  });
  el.addEventListener('mouseleave',()=>el.style.transform='');
});

const projects={
 aurelia:{label:'01 — PREMIUM DESIGN EXPERIENCE',title:'Aurelia Premium Design',text:'A polished premium web experience focused on visual direction, refined typography, immersive presentation and interactive front-end execution.',image:'',demoUrl:'https://aureliapremium.netlify.app',tags:['WEB DESIGN','UI/UX','INTERACTION','RESPONSIVE']},
 interactive:{label:'02 — INTERACTIVE PORTFOLIO',title:'Interactive Portfolio',text:'An experimental interactive portfolio experience built around motion, particles, depth and responsive visual interactions.',image:'',demoUrl:'https://portfoliodemointeractive.netlify.app',tags:['INTERACTION','MOTION','3D','FRONT-END']},
 apex:{label:'03 — AUTOMOTIVE EXPERIENCE',title:'Apex Motors',text:'A premium automotive website concept focused on cinematic presentation, performance-driven art direction and immersive motion.',image:'',demoUrl:'https://apexmoters.netlify.app',tags:['AUTOMOTIVE','WEB DESIGN','MOTION','UI/UX']},
 king:{label:'04 — FITNESS WEBSITE REDESIGN',title:'King Leos Fitness',text:'A visual redesign direction for a fitness center, combining bold typography, dark editorial layouts, gold accents and conversion-focused calls to action.',image:'assets/king-leos-concept.jpg',demoUrl:'https://kingleosgym.netlify.app',tags:['UI/UX','WEB DESIGN','FRONT-END','RESPONSIVE']}
};

const modal=document.getElementById('modal');
function openProject(key){
  const p=projects[key]; if(!p)return;
  document.getElementById('modalLabel').textContent=p.label;
  document.getElementById('modalTitle').textContent=p.title;
  document.getElementById('modalText').textContent=p.text;
  const image=document.getElementById('modalImage');
  image.style.backgroundImage=p.image?`url("${p.image}")`:'';
  image.className='modal-image '+(!p.image?'no-image':'');
  document.getElementById('modalTags').innerHTML=p.tags.map(t=>`<span>${t}</span>`).join('');
  const demo=document.getElementById('modalDemo');
  demo.href=p.demoUrl||'#';
  demo.onclick=(e)=>{
    if(!p.demoUrl||p.demoUrl==='#'){
      e.preventDefault();
      alert('This demo is not published yet. Add the deployed URL to demoUrl in script.js when the site is live.');
    }
  };
  modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.classList.add('lock');
}
document.querySelectorAll('[data-project]').forEach(el=>{
  el.addEventListener('click',e=>{
    if(e.target.closest('[data-demo]'))return;
    openProject(el.dataset.project);
  });
});
document.querySelectorAll('[data-demo]').forEach(el=>{
  el.addEventListener('click',e=>{
    const p=projects[el.dataset.demo];
    if(!p?.demoUrl||p.demoUrl==='#'){
      e.preventDefault();
      alert('This demo is not published yet. Add the deployed URL to demoUrl in script.js when the site is live.');
    }
  });
});

function closeModal(){
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden','true');
  document.body.classList.remove('lock');
}
document.querySelector('.modal-close').addEventListener('click',closeModal);
document.querySelector('.modal-backdrop').addEventListener('click',closeModal);
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});

const menu=document.querySelector('.mobile-menu');
menu?.addEventListener('click',()=>{
  const links=document.querySelector('.nav-center');
  const isOpen=links.classList.toggle('mobile-open');
  menu.setAttribute('aria-expanded',String(isOpen));
  links.style.display=isOpen?'flex':'';
  if(isOpen){
    links.style.position='absolute'; links.style.top='70px'; links.style.left='15px'; links.style.right='15px';
    links.style.padding='20px'; links.style.background='#111'; links.style.border='1px solid #333'; links.style.flexDirection='column'; links.style.gap='20px';
  }else{
    links.style.position=''; links.style.top=''; links.style.left=''; links.style.right=''; links.style.padding=''; links.style.background=''; links.style.border=''; links.style.flexDirection=''; links.style.gap='';
  }
});
document.querySelectorAll('.nav-center a').forEach(link=>link.addEventListener('click',()=>{
  if(window.innerWidth<=760){ menu?.click(); }
}));


/* =========================================================
   V3 — INTERACTIVE MOTION SYSTEM
   ========================================================= */

(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Scroll progress ---------- */
  const progress = document.querySelector('.scroll-progress span');

  const updateScrollUI = () => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    if (progress) progress.style.width = pct + '%';

    // Gentle depth movement for selected elements.
    if (!reducedMotion) {
      document.querySelectorAll('.project').forEach(project => {
        const rect = project.getBoundingClientRect();
        const center = window.innerHeight * .5;
        const distance = (rect.top + rect.height * .5) - center;
        const shift = Math.max(-16, Math.min(16, distance * -0.018));
        project.style.setProperty('--scroll-shift', shift.toFixed(2) + 'px');
      });
    }
  };

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateScrollUI();
        ticking = false;
      });
      ticking = true;
    }
  }, {passive:true});
  updateScrollUI();

  /* ---------- Hero interactive particle field ---------- */
  const canvas = document.getElementById('heroField');
  const hero = document.querySelector('.hero');

  if (canvas && hero && !reducedMotion) {
    const ctx = canvas.getContext('2d', {alpha:true});
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);

    let width = 0, height = 0;
    let particles = [];
    let targetX = .5, targetY = .5;
    let currentX = .5, currentY = .5;
    let scrollOffset = 0;

    const rand = (a,b) => a + Math.random() * (b-a);

    function resize() {
      const rect = hero.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr,0,0,dpr,0,0);

      const count = Math.min(560, Math.max(220, Math.floor(width * .38)));
      particles = Array.from({length:count}, (_,i) => {
        const angle = (i / count) * Math.PI * 2;
        const ring = Math.sqrt(Math.random());
        return {
          angle,
          radius: ring,
          phase: Math.random() * Math.PI * 2,
          speed: rand(.0007,.0017),
          wobble: rand(2,11),
          size: rand(.45,1.25),
          alpha: rand(.16,.58)
        };
      });
    }

    function pointerMove(e) {
      const r = hero.getBoundingClientRect();
      targetX = Math.max(0, Math.min(1, (e.clientX-r.left)/r.width));
      targetY = Math.max(0, Math.min(1, (e.clientY-r.top)/r.height));
      hero.style.setProperty('--mx', (targetX*100)+'%');
      hero.style.setProperty('--my', (targetY*100)+'%');
    }

    function draw(time) {
      currentX += (targetX-currentX) * .045;
      currentY += (targetY-currentY) * .045;

      const cx = width * .72 + (currentX-.5) * 80;
      const cy = height * .50 + (currentY-.5) * 55;
      const baseR = Math.min(width,height) * .30;
      const verticalR = baseR * .78;

      ctx.clearRect(0,0,width,height);

      // soft halo
      const glow = ctx.createRadialGradient(cx,cy,baseR*.55,cx,cy,baseR*1.35);
      glow.addColorStop(0,'rgba(216,255,50,.035)');
      glow.addColorStop(1,'rgba(216,255,50,0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx,cy,baseR*1.35,0,Math.PI*2);
      ctx.fill();

      // latitude-like flowing particles
      particles.forEach((p,i) => {
        const a = p.angle + time*p.speed + Math.sin(time*.0005+p.phase)*.025;
        const radial = baseR * (0.72 + p.radius*.42);
        const wave = Math.sin(a*7 + time*.0015 + p.phase) * p.wobble;
        const x = cx + Math.cos(a) * (radial + wave) * (0.96 + currentX*.08);
        const y = cy + Math.sin(a) * (verticalR + wave*.7) * (0.96 + currentY*.06);

        // hide most particles toward the rear to create depth
        const depth = (Math.sin(a)+1)/2;
        const alpha = p.alpha * (.28 + depth*.72);

        ctx.fillStyle = `rgba(216,255,50,${alpha})`;
        ctx.beginPath();
        ctx.arc(x,y,p.size,0,Math.PI*2);
        ctx.fill();

        // occasional connecting filament
        if (i % 9 === 0) {
          const nx = cx + Math.cos(a+.035) * (radial + wave);
          const ny = cy + Math.sin(a+.035) * (verticalR + wave*.7);
          ctx.strokeStyle = `rgba(216,255,50,${alpha*.18})`;
          ctx.lineWidth = .5;
          ctx.beginPath();
          ctx.moveTo(x,y);
          ctx.lineTo(nx,ny);
          ctx.stroke();
        }
      });

      requestAnimationFrame(draw);
    }

    hero.addEventListener('pointermove', pointerMove, {passive:true});
    window.addEventListener('resize', resize);
    window.addEventListener('scroll', () => { scrollOffset = window.scrollY; }, {passive:true});
    resize();
    requestAnimationFrame(draw);
  }

  /* ---------- Project tilt + parallax ---------- */
  if (!reducedMotion) {
    document.querySelectorAll('.project').forEach(project => {
      const shell = project.querySelector('.browser-shell');
      const screen = project.querySelector('.browser-screen');
      if (!shell) return;

      project.addEventListener('pointermove', e => {
        const r = project.getBoundingClientRect();
        const x = (e.clientX-r.left)/r.width - .5;
        const y = (e.clientY-r.top)/r.height - .5;

        const rotateY = x * 3.2;
        const rotateX = y * -2.4;
        shell.style.transform =
          `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(var(--scroll-shift,0px))`;

        if (screen) {
          project.style.setProperty('--px', ((x+.5)*100)+'%');
          project.style.setProperty('--py', ((y+.5)*100)+'%');
          const img = screen.querySelector('img');
          if (img) img.style.transform =
            `scale(1.035) translate(${x*-8}px,${y*-6}px)`;
        }
      });

      project.addEventListener('pointerleave', () => {
        shell.style.transform = '';
        const img = screen?.querySelector('img');
        if (img) img.style.transform = '';
      });
    });
  }

  /* ---------- Smooth anchor scrolling ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({
        behavior: reducedMotion ? 'auto' : 'smooth',
        block: 'start'
      });
    });
  });

  /* ---------- Active navigation based on section ---------- */
  const navLinks = [...document.querySelectorAll('.nav-center a')];
  const sections = [...document.querySelectorAll('[data-section]')];

  if (navLinks.length && sections.length) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => {
          const active = link.getAttribute('href') === '#' + entry.target.id;
          link.style.color = active ? 'var(--acid)' : '';
        });
      });
    }, {rootMargin:'-35% 0px -55% 0px', threshold:0});
    sections.forEach(section => sectionObserver.observe(section));
  }
})();
