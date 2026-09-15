/* Optional configuration API. The existing Comment class remains unchanged. */
function initComments(config) {
  const host = document.querySelector(config.selector);
  if (!host) throw new Error('Comments: container missing');
  const key = config.storageKey || 'ywb-comments';
  const users = new Map((config.users || []).map(u => [String(u.id), u]));
  const valid = c => c && typeof c.id === 'string' && typeof c.text === 'string' && typeof c.userId === 'string' && (c.parentId == null || typeof c.parentId === 'string') && Number.isFinite(Date.parse(c.date));
  let saved = [];
  try { const value = JSON.parse(localStorage.getItem(key) || '[]'); if (Array.isArray(value)) saved = value.filter(valid); } catch {}
  const comments = [...(config.comments || []).filter(valid), ...saved];
  let parentId = null;
  const el = (tag, text, cls) => { const node = document.createElement(tag); if (text) node.textContent = text; if (cls) node.className = cls; return node; };
  const toolbar = el('div', null, 'comments-toolbar'), title = el('h2', 'Комментарии'), sort = el('select');
  sort.setAttribute('aria-label', 'Сортировка комментариев');
  for (const [value, label] of [['new', 'Сначала новые'], ['old', 'Сначала старые']]) { const option = el('option', label); option.value = value; sort.append(option); }
  toolbar.append(title, sort);
  const list = el('div'); list.id = 'commentPushBlock';
  const form = el('form'); form.id = 'commentForm';
  const name = el('input'); name.id = 'inputCommentName'; name.required = true; name.maxLength = 100; name.placeholder = 'Имя'; name.setAttribute('aria-label', 'Имя');
  const text = el('textarea'); text.id = 'inputCommentText'; text.required = true; text.maxLength = 5000; text.placeholder = 'Комментарий'; text.setAttribute('aria-label', 'Комментарий');
  const submit = el('button', 'Отправить'); submit.type = 'submit'; submit.id = 'commentPush';
  const cancel = el('button', 'Отменить ответ'); cancel.type = 'button'; cancel.hidden = true;
  const status = el('output'); status.setAttribute('aria-live', 'polite');
  form.append(name, text, submit, cancel, status); host.replaceChildren(toolbar, list, form);
  function render() {
    list.replaceChildren();
    const ids = new Set(comments.map(c => c.id)), visited = new Set();
    const roots = comments.filter(c => !c.parentId || !ids.has(c.parentId)).sort((a,b) => (Date.parse(a.date)-Date.parse(b.date))*(sort.value==='old'?1:-1));
    function branch(c, parent, depth) {
      if (visited.has(c.id)) return; visited.add(c.id);
      const article = el('article', null, 'comment'); article.dataset.commentId = c.id;
      const user = users.get(c.userId) || {name:c.name || 'Гость'};
      const avatar = el('span', String(user.name || 'Г').slice(0,1), 'comment-avatar');
      if (user.avatar) { let url; try { url = new URL(user.avatar, location.href); } catch { url = new URL(location.href); } if (['http:', 'https:', 'file:'].includes(url.protocol)) { const img = el('img'); img.src = url.href; img.alt = ''; img.onerror = () => img.remove(); avatar.replaceChildren(img); } }
      const body = el('div', null, 'comment-body'); body.append(el('strong',user.name || 'Гость'),el('p',c.text));
      const date = el('time',new Date(c.date).toLocaleString('ru-RU')); date.dateTime = c.date;
      const reply = el('button','Ответить'); reply.type='button'; reply.onclick=()=>{parentId=c.id;cancel.hidden=false;text.focus();};body.append(date,reply);
      article.append(avatar,body);parent.append(article);
      const children=comments.filter(child=>child.parentId===c.id).sort((a,b)=>Date.parse(a.date)-Date.parse(b.date));
      if(children.length){const replies=el('div',null,'comment-replies'); if(depth>=4)replies.style.marginLeft='0';parent.append(replies);children.forEach(child=>branch(child,replies,depth+1));}
    }
    roots.forEach(c=>branch(c,list,0));
  }
  cancel.onclick=()=>{parentId=null;cancel.hidden=true;};sort.onchange=render;
  form.onsubmit=e=>{e.preventDefault();if(!form.reportValidity()||!name.value.trim()||!text.value.trim())return;const id=globalThis.crypto?.randomUUID?.()||Date.now()+'-'+Math.random();const c={id,userId:id,name:name.value.trim(),parentId,text:text.value.trim(),date:new Date().toISOString()};comments.push(c);saved.push(c);status.textContent='Комментарий добавлен';try{localStorage.setItem(key,JSON.stringify(saved));}catch{status.textContent='Комментарий добавлен. Хранилище недоступно: после закрытия страницы он не сохранится.';}text.value='';cancel.onclick();render();};
  render();return {render,comments};
}
