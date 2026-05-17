
const checks=['dofollow','nofollow','internal','external'];

const colors=[
'dofollowColor',
'nofollowColor',
'internalColor',
'externalColor'
];

async function getDomain(){
const [tab]=await chrome.tabs.query({active:true,currentWindow:true});
return new URL(tab.url).hostname;
}

function save(){

const data={};

checks.forEach(id=>{
data[id]=document.getElementById(id).checked;
});

colors.forEach(id=>{
data[id]=document.getElementById(id).value;
});

chrome.storage.sync.set(data);
}

function applyTheme(theme) {
  const body = document.body;
  const themeBtn = document.getElementById('themeBtn');
  const isDark = theme === 'dark';
  body.classList.toggle('dark', isDark);
  if (themeBtn) {
    themeBtn.textContent = isDark ? '☀️' : '☾';
  }
}

async function load(){

chrome.storage.sync.get(null,async(data)=>{

checks.forEach(id=>{
document.getElementById(id).checked=data[id] !== false;
});

document.getElementById('dofollowColor').value=data.dofollowColor || '#16a34a';
document.getElementById('nofollowColor').value=data.nofollowColor || '#dc2626';
document.getElementById('internalColor').value=data.internalColor || '#3b82f6';
document.getElementById('externalColor').value=data.externalColor || '#eab308';

const theme = data.theme || 'light';
applyTheme(theme);

const domain=await getDomain();

const paused=(data.pausedSites||[]).includes(domain);
const btn=document.getElementById('pauseBtn');

if(paused){
  btn.textContent='Resume On This Site';
  btn.className='resume';
}else{
  btn.textContent='Pause On This Site';
  btn.className='pause';
}

});

}

checks.forEach(id=>{
document.getElementById(id).addEventListener('change',save);
});

colors.forEach(id=>{
document.getElementById(id).addEventListener('input',save);
});

document.getElementById('pauseBtn').addEventListener('click',async()=>{

const domain=await getDomain();

chrome.storage.sync.get(['pausedSites'],(data)=>{

let sites=data.pausedSites||[];

if(sites.includes(domain)){
sites=sites.filter(x=>x!==domain);
}else{
sites.push(domain);
}

chrome.storage.sync.set({pausedSites:sites},()=>{
load();
});

});

});

const themeBtn = document.getElementById('themeBtn');
if (themeBtn) {
  themeBtn.addEventListener('click',() => {
    const nextTheme = document.body.classList.contains('dark') ? 'light' : 'dark';
    chrome.storage.sync.set({theme: nextTheme}, () => {
      applyTheme(nextTheme);
    });
  });
}

load();
