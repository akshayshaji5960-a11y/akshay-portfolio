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
