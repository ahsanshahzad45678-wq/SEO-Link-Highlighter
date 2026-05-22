
if(!window.seoLinkHighlighter){

chrome.runtime.onMessage.addListener((request)=>{

if(request.action==='scan'){
scanLinks(request.settings);
}

if(request.action==='toggleExtension'){
if(request.enabled){
scanLinks(request.settings);
}else{
reset();
}
}

if(request.action==='updateSettings'){
scanLinks(request.settings);
}

});

function scanLinks(settings){

reset();

const root=document.documentElement;

root.style.setProperty('--dofollow-color',settings.dofollowColor || '#16a34a');
root.style.setProperty('--nofollow-color',settings.nofollowColor || '#dc2626');
root.style.setProperty('--internal-color',settings.internalColor || '#3b82f6');
root.style.setProperty('--external-color',settings.externalColor || '#eab308');

const currentHost=window.location.hostname;

document.querySelectorAll('a[href]').forEach(link=>{

  const rel=(link.getAttribute('rel')||'').toLowerCase();
  const isNofollow=rel.includes('nofollow');

  let host='';
  try{
    host=new URL(link.href).hostname;
  }catch(e){}

  const isExternal=host && host !== currentHost;
  const isInternal=!isExternal;

  if(isNofollow && settings.nofollow !== false){
    link.classList.add('nofollow-link');
  }

  if(!isNofollow && settings.dofollow !== false){
    link.classList.add('dofollow-link');
  }

  if(isInternal && settings.internal !== false){
    link.classList.add('internal-link');
  }

  if(isExternal && settings.external !== false){
    link.classList.add('external-link');
  }

});

}

function reset(){

document.querySelectorAll('a[href]').forEach(link=>{

link.classList.remove(
'dofollow-link',
'nofollow-link',
'internal-link',
'external-link'
);

});

}

window.seoLinkHighlighter=true;

}
