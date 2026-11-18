(() => {
  const search=document.querySelector('#product-search');
  if(!search)return;
  const cards=[...document.querySelectorAll('.product-card')];
  const buttons=[...document.querySelectorAll('[data-filter]')];
  let selected='all';
  const apply=()=>{
    const query=search.value.trim().toLocaleLowerCase();let visible=0;
    for(const card of cards){const show=(selected==='all'||card.dataset.kind===selected)&&card.dataset.search.includes(query);card.hidden=!show;if(show)visible++;}
    document.querySelector('#result-count').textContent=`${visible} ${visible===1?'product':'products'} to explore`;
    document.querySelector('#empty-state').hidden=visible!==0;
  };
  buttons.forEach(button=>button.addEventListener('click',()=>{selected=button.dataset.filter;buttons.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));apply();}));
  search.addEventListener('input',apply);
  document.querySelector('#reset-search').addEventListener('click',()=>{search.value='';buttons[0].click();search.focus();});
})();

(() => {
  const track=document.querySelector('.carousel-track');
  if(!track)return;
  const slides=[...track.querySelectorAll('.feature-card')];
  const prev=document.querySelector('[data-carousel-prev]');
  const next=document.querySelector('[data-carousel-next]');
  const status=document.querySelector('#carousel-status');
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  slides.forEach((slide,i)=>{slide.setAttribute('aria-label',`${i+1} of ${slides.length}: ${slide.querySelector('h3').textContent}`);});
  const update=()=>{
    const box=track.getBoundingClientRect();
    const visible=slides.map((slide,i)=>({i,box:slide.getBoundingClientRect()})).filter(s=>s.box.right>box.left+8&&s.box.left<box.right-8);
    const first=visible[0]?.i??0,last=visible.at(-1)?.i??0;
    prev.disabled=track.scrollLeft<=2;
    next.disabled=track.scrollLeft>=track.scrollWidth-track.clientWidth-2;
    status.textContent=`${first+1}–${last+1} of ${slides.length} products`;
  };
  const move=direction=>{
    const step=slides.length>1?slides[1].offsetLeft-slides[0].offsetLeft:track.clientWidth;
    const count=Number(getComputedStyle(track).getPropertyValue('--visible'))||1;
    track.scrollBy({left:direction*step*count,behavior:reduced.matches?'instant':'smooth'});
  };
  prev.addEventListener('click',()=>move(-1));next.addEventListener('click',()=>move(1));
  track.addEventListener('keydown',event=>{
    if(event.target!==track)return;
    if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();move(event.key==='ArrowRight'?1:-1);}
    if(event.key==='Home'||event.key==='End'){event.preventDefault();track.scrollTo({left:event.key==='Home'?0:track.scrollWidth,behavior:reduced.matches?'instant':'smooth'});}
  });
  let pending=false;
  track.addEventListener('scroll',()=>{if(!pending){pending=true;requestAnimationFrame(()=>{update();pending=false;});}},{passive:true});
  track.addEventListener('focusin',event=>{
    const slide=event.target.closest('.feature-card');if(!slide)return;
    const box=slide.getBoundingClientRect(),frame=track.getBoundingClientRect();
    if(box.left<frame.left||box.right>frame.right)track.scrollBy({left:box.left-frame.left,behavior:'instant'});
  });
  new ResizeObserver(update).observe(track);update();
})();
