document.addEventListener('DOMContentLoaded',()=>{
 lucide.createIcons();
 let saved;try{saved=new Set(JSON.parse(localStorage.getItem('yellow-scripts:saved')||'[]'));}catch{saved=new Set();}
 const all=[...document.querySelectorAll('.script-card')];let category='',onlySaved=false;
 const search=document.querySelector('#search'),runtime=document.querySelector('#runtime');
 function sync(){document.querySelectorAll('[data-save]').forEach(b=>{const active=saved.has(Number(b.dataset.save));b.setAttribute('aria-pressed',String(active));b.title=active?'Убрать из избранного':'В избранное';});const count=document.querySelector('#saved-count');if(count)count.textContent=saved.size;}
 function filter(){let count=0;const query=(search?.value||'').toLowerCase().trim();all.forEach(c=>{const show=(!category||c.dataset.category===category)&&(!runtime.value||c.dataset.runtime===runtime.value)&&(!onlySaved||saved.has(Number(c.dataset.id)))&&query.split(/\s+/).every(term=>c.dataset.search.includes(term));c.hidden=!show;if(show)count++;});if(document.querySelector('#result-count'))document.querySelector('#result-count').textContent=count+' из 46';if(document.querySelector('#empty'))document.querySelector('#empty').hidden=count>0;}
 document.querySelectorAll('[data-save]').forEach(b=>b.onclick=()=>{const id=Number(b.dataset.save);saved.has(id)?saved.delete(id):saved.add(id);try{localStorage.setItem('yellow-scripts:saved',JSON.stringify([...saved]));}catch{}sync();if(all.length)filter();});
 document.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{category=b.dataset.filter;document.querySelectorAll('[data-filter]').forEach(t=>t.classList.toggle('active',t===b));filter();});
 if(search)search.oninput=filter;if(runtime)runtime.onchange=filter;
 const savedButton=document.querySelector('#saved-only');if(savedButton)savedButton.onclick=()=>{onlySaved=!onlySaved;savedButton.setAttribute('aria-pressed',String(onlySaved));filter();};
 const clear=document.querySelector('#clear-filters');if(clear)clear.onclick=()=>{search.value='';runtime.value='';onlySaved=false;savedButton.setAttribute('aria-pressed','false');document.querySelector('[data-filter=""]').click();};
 sync();
 const surface=document.querySelector('.demo-surface');
 function launch(){if(!surface)return;const frame=document.createElement('iframe');frame.src=surface.dataset.src;frame.title=document.querySelector('h1').textContent;frame.sandbox='allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox';frame.allow='autoplay; fullscreen';surface.replaceChildren(frame);}
 const start=document.querySelector('#launch');if(start)start.onclick=launch;const restart=document.querySelector('#restart');if(restart)restart.onclick=launch;
});
