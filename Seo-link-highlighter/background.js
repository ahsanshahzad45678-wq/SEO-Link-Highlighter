
chrome.tabs.onUpdated.addListener((tabId,changeInfo,tab)=>{

if(changeInfo.status!=='complete'||!tab.url)return;

chrome.storage.sync.get(null,(data)=>{

try{

const domain=new URL(tab.url).hostname;

if((data.pausedSites||[]).includes(domain)){
return;
}

chrome.scripting.insertCSS({
target:{tabId},
files:['style.css']
});

chrome.scripting.executeScript({
target:{tabId},
files:['content.js']
},()=>{

chrome.tabs.sendMessage(tabId,{
action:'scan',
settings:data
});

});

}catch(e){}

});

});
