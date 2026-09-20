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
 king:{label:'01 — WEBSITE REDESIGN CONCEPT',title:'King Leos Fitness',text:'A visual redesign direction for a fitness center, combining bold typography, dark editorial layouts, gold accents and conversion-focused calls to action. This is a concept project created to demonstrate design and front-end execution.',image:'assets/king-leos-concept.jpg',demoUrl:'#',tags:['UI/UX','WEB DESIGN','FRONT-END','RESPONSIVE']},
 nova:{label:'02 — E-COMMERCE CONCEPT',title:'NOVA',text:'A fictional fashion storefront concept focused on product presentation, whitespace and a clean shopping journey. Built as a portfolio demonstration of e-commerce UI/UX and art direction.',image:'',demoUrl:'#',tags:['E-COMMERCE','UI/UX','ART DIRECTION']},
 forma:{label:'03 — BRAND + WEB CONCEPT',title:'FORMA',text:'A fictional interior studio identity and website direction built around editorial typography, architecture and restrained visual composition.',image:'',demoUrl:'#',tags:['BRANDING','WEB DESIGN','UI/UX']}
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

  /* ---------- Hero 3D space particle field ---------- */
  const canvas = document.getElementById('heroField');
  const hero = document.querySelector('.hero');

  if (canvas && hero && !reducedMotion) {
    const ctx = canvas.getContext('2d', {alpha:true});
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);

    let width = 0, height = 0;
    let particles = [];
    let targetX = .5, targetY = .5;
    let currentX = .5, currentY = .5;

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

      // Layered stars with individual depth values.
      const count = Math.min(760, Math.max(360, Math.floor(width * .52)));

      particles = Array.from({length:count}, () => ({
        x: rand(-1.25,1.25),
        y: rand(-1.0,1.0),
        z: rand(.06,1),
        size: rand(.22,.72),
        alpha: rand(.18,.72),
        twinkle: rand(0,Math.PI*2),
        speed: rand(.00022,.00065),
        drift: rand(-.00012,.00012)
      }));
    }

    function pointerMove(e) {
      const r = hero.getBoundingClientRect();
      targetX = Math.max(0, Math.min(1, (e.clientX-r.left)/r.width));
      targetY = Math.max(0, Math.min(1, (e.clientY-r.top)/r.height));
      hero.style.setProperty('--mx', (targetX*100)+'%');
      hero.style.setProperty('--my', (targetY*100)+'%');
    }

    function draw(time) {
      currentX += (targetX-currentX) * .035;
      currentY += (targetY-currentY) * .035;

      ctx.clearRect(0,0,width,height);

      const centerX = width * .50 + (currentX-.5) * -34;
      const centerY = height * .48 + (currentY-.5) * -22;

      // Almost invisible atmospheric haze behind the stars.
      const haze = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, Math.max(width,height) * .72
      );
      haze.addColorStop(0,'rgba(216,255,50,.025)');
      haze.addColorStop(.42,'rgba(216,255,50,.008)');
      haze.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle = haze;
      ctx.fillRect(0,0,width,height);

      particles.forEach(p => {
        // Move stars continuously through 3D depth toward the viewer.
        p.z -= p.speed;
        p.x += p.drift;
        if (p.z < .035) {
          p.z = 1;
          p.x = rand(-1.25,1.25);
          p.y = rand(-1.0,1.0);
        }

        // Perspective: closer stars become larger and move more.
        const depth = p.z;
        const perspective = 1 / (0.28 + depth * 1.35);

        let x = centerX + p.x * width * .47 * perspective;
        let y = centerY + p.y * height * .70 * perspective;

        // Slow camera drift through the starfield.
        x += Math.sin(time * .00035 + p.twinkle) * (1.2 + (1-depth)*4);
        y += Math.cos(time * .00028 + p.twinkle) * (1.0 + (1-depth)*3);

        // Cursor = subtle camera parallax, not a rotating ring.
        x += (currentX-.5) * depth * 70;
        y += (currentY-.5) * depth * 45;

        // Wrap stars around the viewport.
        if (x < -30) { x += width + 60; p.x += .12; }
        if (x > width+30) { x -= width + 60; p.x -= .12; }
        if (y < -30) { y += height + 60; p.y += .10; }
        if (y > height+30) { y -= height + 60; p.y -= .10; }

        const near = 1 - depth;
        const radius = p.size * (0.65 + near * 2.5);
        const twinkle = .78 + Math.sin(time*.0017 + p.twinkle) * .22;
        const alpha = Math.min(.9, p.alpha * (.38 + near*.9) * twinkle);

        // Mostly cool-white stars, with a restrained portfolio-green tint.
        const tint = p.size > 1.05 ? '216,255,50' : '225,229,222';
        ctx.fillStyle = `rgba(${tint},${alpha})`;
        ctx.beginPath();
        ctx.arc(x,y,Math.max(.3,radius),0,Math.PI*2);
        ctx.fill();

        // A few foreground stars get a tiny atmospheric glow.
        if (near > .72 && p.size > .58) {
          const glowRadius = radius * 5;
          const g = ctx.createRadialGradient(x,y,0,x,y,glowRadius);
          g.addColorStop(0,`rgba(216,255,50,${alpha*.16})`);
          g.addColorStop(1,'rgba(216,255,50,0)');
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(x,y,glowRadius,0,Math.PI*2);
          ctx.fill();
        }
      });

      requestAnimationFrame(draw);
    }

    hero.addEventListener('pointermove', pointerMove, {passive:true});
    window.addEventListener('resize', resize);
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
