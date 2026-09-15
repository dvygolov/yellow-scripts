window.demoLog=function(value){let log=document.querySelector('#event-log');if(!log){log=document.createElement('output');log.id='event-log';log.setAttribute('aria-live','polite');(document.querySelector('main')||document.body).append(log);}log.textContent=typeof value==='string'?value:JSON.stringify(value,null,2);};
window.addEventListener('error',event=>{if(event.message&&document.body)demoLog('Ошибка примера: '+event.message);});
document.addEventListener('submit',event=>{event.preventDefault();if(event.target.id==='commentForm')return;if(!event.target.reportValidity())return;window.demoLog('Форма заполнена. Отправка отключена в примере.');});
document.addEventListener('DOMContentLoaded',()=>{
  addEventListener('message',event=>{if(event.origin!==location.origin||event.data?.type!=='yellow-demo-height'||!Number.isFinite(event.data.height))return;const frame=[...document.querySelectorAll('iframe')].find(f=>f.contentWindow===event.source);if(frame)frame.style.height=Math.max(100,Math.min(4000,event.data.height))+'px';});
  const report=()=>{const main=document.querySelector('main')||document.body;const rect=main.getBoundingClientRect();const height=Math.ceil(rect.bottom+scrollY+24);if(parent!==window)parent.postMessage({type:'yellow-demo-height',height},location.origin);};
  new ResizeObserver(report).observe(document.querySelector('main')||document.body);
  new MutationObserver(report).observe(document.body,{subtree:true,childList:true});
  addEventListener('load',report);report();
});
