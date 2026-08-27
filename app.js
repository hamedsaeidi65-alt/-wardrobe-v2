
const KEY='wardrobe_v2_items';
let deferredPrompt=null;
const compat={
 black:['white','gray','beige','blue','navy','green','red','brown','black'],
 white:['black','gray','beige','blue','navy','green','red','brown','white'],
 gray:['black','white','navy','blue','beige','green','gray'],
 navy:['white','gray','beige','brown','blue'],
 blue:['white','black','gray','beige','navy','brown'],
 beige:['white','black','navy','blue','brown','green'],
 brown:['white','beige','navy','blue','green'],
 green:['white','black','beige','brown','gray'],
 red:['black','white','gray','navy'],
 other:['black','white','gray','beige']
};
const fitPairs={
 slim:['straight','regular','relaxed'],
 regular:['slim','straight','regular','relaxed'],
 straight:['slim','regular','oversized'],
 relaxed:['slim','regular','straight'],
 baggy:['slim','regular'],
 oversized:['slim','straight']
};

function loadItems(){return JSON.parse(localStorage.getItem(KEY)||'[]')}
function saveItems(items){localStorage.setItem(KEY,JSON.stringify(items)); renderAll()}
function catFa(c){return ({top:'بالاتنه',bottom:'پایین‌تنه',outer:'رویه',shoe:'کفش',accessory:'اکسسوری'})[c]||c}
function fitFa(f){return f}
function colorFa(c){return ({black:'مشکی',white:'سفید',gray:'طوسی',navy:'سرمه‌ای',blue:'آبی',beige:'بژ',brown:'قهوه‌ای',green:'سبز',red:'قرمز',other:'سایر'})[c]||c}

function goPage(id){
 document.querySelectorAll('.page').forEach(x=>x.classList.remove('active'));
 document.getElementById(id).classList.add('active');
 document.querySelectorAll('.bottom-nav button').forEach(b=>b.classList.toggle('active',b.dataset.page===id));
 if(id==='wardrobe') renderWardrobe();
 window.scrollTo({top:0,behavior:'smooth'});
}

function itemCard(i){
 const img=i.photo?`<img src="${i.photo}" alt="">`:`<div class="placeholder">👕</div>`;
 return `<div class="item-card">
   <div class="item-img">${img}</div>
   <div class="item-info">
     <strong>${escapeHtml(i.name)}</strong>
     <div class="meta">${catFa(i.category)} · ${colorFa(i.color)}<br>${fitFa(i.fit)} · ${i.occasion}</div>
     <button class="delete" onclick="removeItem('${i.id}')">حذف</button>
   </div>
 </div>`
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
function removeItem(id){if(confirm('این لباس حذف شود؟')) saveItems(loadItems().filter(x=>x.id!==id))}

function renderHome(){
 const items=loadItems();
 document.getElementById('countItems').textContent=items.length;
 document.getElementById('countTops').textContent=items.filter(x=>x.category==='top').length;
 document.getElementById('countBottoms').textContent=items.filter(x=>x.category==='bottom').length;
 const recent=items.slice(-4).reverse();
 document.getElementById('recentItems').innerHTML=recent.length?recent.map(itemCard).join(''):`<div class="empty">هنوز لباسی ثبت نشده.</div>`;
}
function renderWardrobe(){
 let items=loadItems();
 const c=document.getElementById('filterCategory').value;
 const s=document.getElementById('filterSeason').value;
 if(c) items=items.filter(x=>x.category===c);
 if(s) items=items.filter(x=>x.season===s || x.season==='all');
 document.getElementById('wardrobeGrid').innerHTML=items.length?items.slice().reverse().map(itemCard).join(''):`<div class="empty">لباسی با این فیلتر پیدا نشد.</div>`;
}
function renderAll(){renderHome();renderWardrobe()}

function pairScore(a,b,occasion,season){
 let score=50, reasons=[];
 if((compat[a.color]||[]).includes(b.color)){score+=20;reasons.push('هماهنگی رنگ خوب')}
 else {score-=8}
 if((fitPairs[a.fit]||[]).includes(b.fit)){score+=15;reasons.push('تناسب فیت مناسب')}
 if(a.occasion===occasion) score+=6;
 if(b.occasion===occasion) score+=6;
 if(season==='all' || a.season==='all' || a.season===season) score+=3;
 if(season==='all' || b.season==='all' || b.season===season) score+=3;
 return {score:Math.max(0,Math.min(100,score)), reasons};
}
function generateOutfit(){
 const items=loadItems(), occasion=document.getElementById('outfitOccasion').value, season=document.getElementById('outfitSeason').value;
 const tops=items.filter(x=>x.category==='top' && (season==='all'||x.season==='all'||x.season===season));
 const bottoms=items.filter(x=>x.category==='bottom' && (season==='all'||x.season==='all'||x.season===season));
 const shoes=items.filter(x=>x.category==='shoe' && (season==='all'||x.season==='all'||x.season===season));
 if(!tops.length || !bottoms.length){
   document.getElementById('outfitResult').innerHTML=`<div class="empty">برای ساخت ست، حداقل یک بالاتنه و یک پایین‌تنه ثبت کن.</div>`; return;
 }
 let best=null;
 for(const t of tops) for(const b of bottoms){
   const p=pairScore(t,b,occasion,season);
   let total=p.score, shoe=null;
   if(shoes.length){
     shoe=shoes.map(s=>({s, sc:pairScore(b,s,occasion,season).score})).sort((x,y)=>y.sc-x.sc)[0];
     total=Math.round((total*0.75)+(shoe.sc*0.25));
   }
   if(!best || total>best.total) best={t,b,shoe:shoe?.s,total,reasons:p.reasons};
 }
 const arr=[best.t,best.b,best.shoe].filter(Boolean);
 document.getElementById('outfitResult').innerHTML=`
   <div class="outfit-card card">
     <div class="score-row">
       <div><div class="score">${best.total}/100</div><div class="score-detail">STYLE SCORE</div></div>
       <div class="score-detail">${best.reasons.join(' · ')||'ترکیب پیشنهادی'}</div>
     </div>
     <div class="outfit-items">${arr.map(itemCard).join('')}</div>
   </div>`;
}

document.getElementById('itemForm').addEventListener('submit', async e=>{
 e.preventDefault();
 let photoData='';
 const f=document.getElementById('photo').files[0];
 if(f) photoData=await compressImage(f,900,.78);
 const item={
   id:Date.now().toString(36)+Math.random().toString(36).slice(2,6),
   name:document.getElementById('name').value.trim(),
   category:document.getElementById('category').value,
   fit:document.getElementById('fit').value,
   color:document.getElementById('color').value,
   season:document.getElementById('season').value,
   occasion:document.getElementById('occasion').value,
   photo:photoData,
   createdAt:Date.now()
 };
 const items=loadItems(); items.push(item); saveItems(items);
 e.target.reset(); document.getElementById('previewWrap').classList.add('hidden');
 goPage('wardrobe');
});
document.getElementById('photo').addEventListener('change', e=>{
 const f=e.target.files[0]; if(!f)return;
 const u=URL.createObjectURL(f); const p=document.getElementById('preview'); p.src=u;
 document.getElementById('previewWrap').classList.remove('hidden');
});
function compressImage(file,maxW=900,quality=.78){
 return new Promise(resolve=>{
   const img=new Image(), fr=new FileReader();
   fr.onload=()=>img.src=fr.result;
   img.onload=()=>{
     const scale=Math.min(1,maxW/img.width), c=document.createElement('canvas');
     c.width=Math.round(img.width*scale); c.height=Math.round(img.height*scale);
     c.getContext('2d').drawImage(img,0,0,c.width,c.height);
     resolve(c.toDataURL('image/jpeg',quality));
   };
   fr.readAsDataURL(file);
 });
}

window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;document.getElementById('installBtn').hidden=false});
document.getElementById('installBtn').addEventListener('click',async()=>{
 if(!deferredPrompt)return; deferredPrompt.prompt(); await deferredPrompt.userChoice; deferredPrompt=null;
});
if('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js');
renderAll();
