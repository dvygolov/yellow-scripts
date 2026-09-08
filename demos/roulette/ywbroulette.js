/* Yellow Scripts 1.0.0. CPARIP wheel artwork; standalone init API. */
(function(global){
  const instances=new WeakMap();
  function initRoulette(options={}){
    const root=typeof options.selectors?.roulette==='string'?document.querySelector(options.selectors.roulette):options.selectors?.roulette;
    const form=typeof options.selectors?.form==='string'?document.querySelector(options.selectors.form):options.selectors?.form;
    if(!root||!form||root===form||root.contains(form))throw new Error('initRoulette: separate roulette and form elements are required');
    if(instances.has(root))return instances.get(root);
    const texts={title:'Испытайте удачу',button:'Крутить',popupTitle:'Ваша скидка — 50%',popupText:'Скидка доступна в форме заказа.',confirm:'Получить скидку',...options.texts};
    const duration=Number.isFinite(options.duration)?Math.max(0,options.duration):4500;
    const angle=Number.isFinite(options.stopAngle)?options.stopAngle:67.5;
    const originalHidden=form.hidden,originalDisplay=form.style.display,originalHTML=root.innerHTML;
    let state='ready',timer,restoreFocus;
    root.classList.add('yws-roulette');
    root.innerHTML='<h2></h2><div class="yws-wheel-stage"><img class="yws-wheel" alt="Колесо скидок"><span class="yws-pointer" aria-hidden="true"></span><button class="yws-spin" type="button"></button></div><p class="yws-wheel-status" role="status"></p><dialog class="yws-result"><h3></h3><p></p><button type="button"></button></dialog>';
    const wheel=root.querySelector('img'),spin=root.querySelector('.yws-spin'),dialog=root.querySelector('dialog'),confirm=dialog.querySelector('button'),status=root.querySelector('[role=status]');
    root.querySelector('h2').textContent=texts.title;spin.textContent=texts.button;
    wheel.src=options.image||'prizewheel.png';
    dialog.querySelector('h3').textContent=texts.popupTitle;dialog.querySelector('p').textContent=texts.popupText;confirm.textContent=texts.confirm;
    form.hidden=true;form.style.display='none';
    function finish(){if(state!=='spinning')return;state='result';status.textContent=texts.popupTitle;dialog.showModal();confirm.focus();options.onResult?.({angle});}
    function start(){if(state!=='ready')return;state='spinning';restoreFocus=document.activeElement;spin.disabled=true;status.textContent='Колесо вращается';const ms=matchMedia('(prefers-reduced-motion: reduce)').matches?0:duration;wheel.style.transition='transform '+ms+'ms cubic-bezier(.12,.7,.16,1)';wheel.style.transform='rotate('+(1800+angle)+'deg)';timer=setTimeout(finish,ms+40);}
    function accept(){if(state!=='result')return;state='complete';dialog.close();root.hidden=true;form.hidden=false;form.style.display=originalDisplay==='none'?'':originalDisplay;form.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'center'});form.querySelector('input:not([type=hidden]),button,[tabindex]')?.focus({preventScroll:true});options.onComplete?.();}
    spin.addEventListener('click',start);confirm.addEventListener('click',accept);dialog.addEventListener('cancel',event=>{event.preventDefault();accept();});
    const api={spin:start,get state(){return state;},destroy(){clearTimeout(timer);dialog.close();form.hidden=originalHidden;form.style.display=originalDisplay;root.hidden=false;root.classList.remove('yws-roulette');root.innerHTML=originalHTML;instances.delete(root);restoreFocus?.focus?.();}};
    instances.set(root,api);return api;
  }
  global.initRoulette=initRoulette;
})(window);
