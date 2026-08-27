
const KEY='wardrobe_v2_items';
const SAVED_KEY='wardrobe_v2_saved_outfits';
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


const CATEGORY_FIELDS={
 top:{
  subtype:['تی‌شرت','پولو','پیراهن','هودی','سویشرت','بافت','تاپ'],
  fit:['Slim','Regular','Relaxed','Oversized']
 },
 bottom:{
  subtype:['جین','چینو / کتان','پارچه‌ای','کارگو','جاگر','شلوارک'],
  fit:['Skinny','Slim','Straight','Relaxed','Baggy','Wide']
 },
 outer:{
  subtype:['کت','بلیزر','کاپشن','اورشرت','بارانی','پالتو','جلیقه'],
  fit:['Slim','Regular','Relaxed','Oversized']
 },
 shoe:{subtype:['کتانی','لوفر','کفش رسمی','بوت','صندل'],fit:['Regular']},
 accessory:{subtype:['ساعت','عینک','کمربند','کلاه','کیف','دستبند'],fit:['Regular']}
};
const SUBTYPE_FIELDS={
 'تی‌شرت':[{id:'pattern',label:'طرح',options:['ساده','گرافیکی','راه‌راه','طرح‌دار']},{id:'neck',label:'یقه',options:['گرد','هفت','هنلی']},{id:'sleeve',label:'آستین',options:['کوتاه','بلند']}],
 'پولو':[{id:'pattern',label:'طرح',options:['ساده','راه‌راه','طرح‌دار']},{id:'sleeve',label:'آستین',options:['کوتاه','بلند']}],
 'پیراهن':[{id:'pattern',label:'طرح',options:['ساده','راه‌راه','چهارخانه','طرح‌دار']},{id:'collar',label:'نوع یقه',options:['کلاسیک','باتن‌داون','کمپ / کوبایی','ماندارین']},{id:'sleeve',label:'آستین',options:['کوتاه','بلند']}],
 'هودی':[{id:'pattern',label:'طرح',options:['ساده','گرافیکی','طرح‌دار']},{id:'hoodieType',label:'مدل',options:['جلو بسته','زیپ‌دار']}],
 'سویشرت':[{id:'pattern',label:'طرح',options:['ساده','گرافیکی','طرح‌دار']},{id:'sweatType',label:'مدل',options:['جلو بسته','زیپ‌دار']}],
 'بافت':[{id:'pattern',label:'طرح',options:['ساده','بافت‌دار','راه‌راه','طرح‌دار']},{id:'neck',label:'یقه',options:['گرد','هفت','یقه‌اسکی','کاردیگان']}],
 'جین':[{id:'rise',label:'فاق',options:['کوتاه','متوسط','بلند']},{id:'wash',label:'شست / ظاهر',options:['تیره','متوسط','روشن','سنگ‌شور','زاپ‌دار']}],
 'چینو / کتان':[{id:'rise',label:'فاق',options:['کوتاه','متوسط','بلند']},{id:'pleat',label:'جلوی شلوار',options:['ساده','پیلی‌دار']}],
 'پارچه‌ای':[{id:'rise',label:'فاق',options:['کوتاه','متوسط','بلند']},{id:'pleat',label:'جلوی شلوار',options:['ساده','تک‌پیلی','دوپیلی']}],
 'کارگو':[{id:'rise',label:'فاق',options:['کوتاه','متوسط','بلند']},{id:'cargoStyle',label:'استایل',options:['مینیمال','جیب‌دار کلاسیک','تکنیکال']}],
 'جاگر':[{id:'material',label:'جنس',options:['نخی','دورس','نایلونی / تکنیکال']}],
 'شلوارک':[{id:'length',label:'قد',options:['بالای زانو','روی زانو','زیر زانو']},{id:'styleDetail',label:'استایل',options:['کژوال','ورزشی','چینو','کارگو']}],
 'کت':[{id:'structure',label:'ساختار',options:['بدون ساختار','نیمه‌ساختار','ساختار رسمی']},{id:'weight',label:'وزن لایه',options:['سبک','متوسط','سنگین']}],
 'بلیزر':[{id:'structure',label:'ساختار',options:['بدون ساختار','نیمه‌ساختار','ساختار رسمی']},{id:'buttons',label:'فرم دکمه',options:['تک‌ردیفه','دبل‌برست']}],
 'کاپشن':[{id:'jacketType',label:'مدل',options:['بامبر','پافر','دنیم','چرم','تکنیکال']},{id:'weight',label:'وزن لایه',options:['سبک','متوسط','سنگین']}],
 'اورشرت':[{id:'material',label:'جنس',options:['نخی','فلانل','دنیم','پشمی']},{id:'weight',label:'وزن لایه',options:['سبک','متوسط','سنگین']}],
 'بارانی':[{id:'length',label:'قد',options:['کوتاه','متوسط','بلند']},{id:'weight',label:'وزن لایه',options:['سبک','متوسط']}],
 'پالتو':[{id:'length',label:'قد',options:['کوتاه','متوسط','بلند']},{id:'weight',label:'وزن لایه',options:['متوسط','سنگین']}],
 'کتانی':[{id:'shoeStyle',label:'استایل کفش',options:['مینیمال','رانینگ','رترو','بسکتبال','اسکیت']}],
 'لوفر':[{id:'shoeStyle',label:'مدل',options:['پنی','تسل','هورسبیت']},{id:'shoeFormality',label:'استایل',options:['کژوال','اسمارت کژوال','رسمی']}],
 'کفش رسمی':[{id:'shoeStyle',label:'مدل',options:['آکسفورد','دربی','مونک‌استرپ']},{id:'shoeFormality',label:'استایل',options:['اسمارت کژوال','رسمی']}],
 'بوت':[{id:'shoeStyle',label:'مدل',options:['چلسی','چوکا','ورک','کامبت']},{id:'shoeFormality',label:'استایل',options:['کژوال','اسمارت کژوال']}],
 'ساعت':[{id:'accessoryStyle',label:'استایل',options:['اسپرت','روزمره','کلاسیک','رسمی']}],
 'عینک':[{id:'accessoryStyle',label:'استایل',options:['اسپرت','کژوال','کلاسیک','مینیمال']}],
 'کمربند':[{id:'accessoryStyle',label:'استایل',options:['کژوال','اسمارت','رسمی']}],
 'کلاه':[{id:'accessoryStyle',label:'مدل',options:['کپ','باکت','بینی','فدورا']}],
 'کیف':[{id:'accessoryStyle',label:'مدل',options:['کوله','کراس‌بادی','توت','دستی / اداری']}]
};
function optionsHtml(arr){return arr.map(x=>`<option value="${x}">${x}</option>`).join('')}
function renderDynamicFields(){
 const c=document.getElementById('category').value, s=CATEGORY_FIELDS[c];
 document.getElementById('dynamicFields').innerHTML=`
  <label>نوع دقیق
   <select id="subtype" onchange="renderSubtypeFields()">${optionsHtml(s.subtype)}</select>
  </label>
  ${c!=='shoe'&&c!=='accessory'?`<label>فرم / برش
   <select id="fit">${optionsHtml(s.fit)}</select>
  </label>`:`<input type="hidden" id="fit" value="Regular">`}
  <div id="subtypeFields"></div>`;
 renderSubtypeFields();
}
function renderSubtypeFields(){
 const subtype=document.getElementById('subtype')?.value||'';
 const box=document.getElementById('subtypeFields'); if(!box)return;
 const fields=SUBTYPE_FIELDS[subtype]||[];
 box.innerHTML=fields.map(f=>`<label>${f.label}<select class="smart-detail" data-detail-id="${f.id}">${optionsHtml(f.options)}</select></label>`).join('');
}
function smartDetails(){const o={};document.querySelectorAll('.smart-detail').forEach(el=>o[el.dataset.detailId]=el.value);return o}
function checkedValues(name){return [...document.querySelectorAll(`input[name="${name}"]:checked`)].map(x=>x.value)}
function loadItems(){return JSON.parse(localStorage.getItem(KEY)||'[]')}
function loadSaved(){return JSON.parse(localStorage.getItem(SAVED_KEY)||'[]')}
function saveSaved(items){localStorage.setItem(SAVED_KEY,JSON.stringify(items)); renderSavedOutfits()}
function saveItems(items){localStorage.setItem(KEY,JSON.stringify(items)); renderAll()}
function catFa(c){return ({top:'بالاتنه',bottom:'پایین‌تنه',outer:'رویه',shoe:'کفش',accessory:'اکسسوری'})[c]||c}
function fitFa(f){return f}
function colorFa(c){return ({black:'مشکی',white:'سفید',gray:'طوسی',navy:'سرمه‌ای',blue:'آبی',beige:'بژ',brown:'قهوه‌ای',green:'سبز',red:'قرمز',other:'سایر'})[c]||c}

function goPage(id){
 document.querySelectorAll('.page').forEach(x=>x.classList.remove('active'));
 document.getElementById(id).classList.add('active');
 document.querySelectorAll('.bottom-nav button').forEach(b=>b.classList.toggle('active',b.dataset.page===id));
 if(id==='wardrobe') renderWardrobe();
 if(id==='saved') renderSavedOutfits();
 window.scrollTo({top:0,behavior:'smooth'});
}

function itemCard(i){
 const img=i.photo?`<img src="${i.photo}" alt="">`:`<div class="placeholder">👕</div>`;
 return `<div class="item-card">
   <div class="item-img">${img}</div>
   <div class="item-info">
     <strong>${escapeHtml(i.name)}</strong>
     <div class="meta">${catFa(i.category)}${i.subtype?' · '+i.subtype:''} · ${colorFa(i.color)}<br>${fitFa(i.fit||'Regular')}${i.extra?' · '+i.extra:''}</div>
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
function renderAll(){renderHome();renderWardrobe();renderSavedOutfits()}

function pairScore(a,b,occasion,season){
 let score=50, reasons=[];
 if((compat[a.color]||[]).includes(b.color)){score+=20;reasons.push('هماهنگی رنگ خوب')}
 else {score-=8}
 if((fitPairs[String(a.fit||'').toLowerCase()]||[]).includes(String(b.fit||'').toLowerCase())){score+=15;reasons.push('تناسب فیت مناسب')}
 if((a.occasions||[a.occasion]).includes(occasion)) score+=6;
 if((b.occasions||[b.occasion]).includes(occasion)) score+=6;
 if(season==='all' || a.season==='all' || a.season===season) score+=3;
 if(season==='all' || b.season==='all' || b.season===season) score+=3;
 return {score:Math.max(0,Math.min(100,score)), reasons};
}
function generateOutfit(){
 const items=loadItems(), occasion=document.getElementById('outfitOccasion').value, season=document.getElementById('outfitSeason').value;
 const tops=items.filter(x=>x.category==='top' && (season==='all'||x.season==='all'||x.season===season));
 const bottoms=items.filter(x=>x.category==='bottom' && (season==='all'||x.season==='all'||x.season===season));
 const shoes=items.filter(x=>x.category==='shoe' && (season==='all'||x.season==='all'||x.season===season));
 if(!tops.length || !bottoms.length){ document.getElementById('outfitResult').innerHTML=`<div class="empty">برای ساخت ست، حداقل یک بالاتنه و یک پایین‌تنه ثبت کن.</div>`; return; }
 let best=null;
 for(const t of tops) for(const b of bottoms){
   const p=pairScore(t,b,occasion,season); let total=p.score, shoe=null;
   if(shoes.length){ shoe=shoes.map(s=>({s,sc:pairScore(b,s,occasion,season).score})).sort((x,y)=>y.sc-x.sc)[0]; total=Math.round((total*.75)+(shoe.sc*.25)); }
   if(!best || total>best.total) best={t,b,shoe:shoe?.s,total,reasons:p.reasons};
 }
 window.currentSuggestedOutfit={id:Date.now().toString(36)+Math.random().toString(36).slice(2,6),itemIds:[best.t.id,best.b.id,best.shoe?.id].filter(Boolean),total:best.total,occasion,season,createdAt:Date.now()};
 const arr=[best.t,best.b,best.shoe].filter(Boolean);
 document.getElementById('outfitResult').innerHTML=`<div class="outfit-card card"><div class="score-row"><div><div class="score">${best.total}/100</div><div class="score-detail">STYLE SCORE</div></div><div class="score-detail">${best.reasons.join(' · ')||'ترکیب پیشنهادی'}</div></div><div class="outfit-items">${arr.map(itemCard).join('')}</div><button class="primary save-outfit-btn" onclick="saveCurrentOutfit()">ذخیره در ست‌های من</button></div>`;
}
function saveCurrentOutfit(){
 if(!window.currentSuggestedOutfit) return;
 const saved=loadSaved();
 if(saved.some(x=>JSON.stringify(x.itemIds)===JSON.stringify(window.currentSuggestedOutfit.itemIds))){alert('این ست قبلاً ذخیره شده.');return;}
 saved.unshift(window.currentSuggestedOutfit); saveSaved(saved); alert('ست ذخیره شد.');
}
function removeSavedOutfit(id){if(confirm('این ست از ذخیره‌شده‌ها حذف شود؟')) saveSaved(loadSaved().filter(x=>x.id!==id))}
function renderSavedOutfits(){
 const saved=loadSaved(), items=loadItems(), box=document.getElementById('savedOutfits'); if(!box)return;
 if(!saved.length){box.innerHTML=`<div class="empty">هنوز ستی ذخیره نکرده‌ای. از بخش پیشنهاد ست، یک ترکیب را ذخیره کن.</div>`;return;}
 box.innerHTML=saved.map((o,idx)=>{const arr=o.itemIds.map(id=>items.find(i=>i.id===id)).filter(Boolean);return `<div class="outfit-card card saved-card"><div class="score-row"><div><div class="score">${o.total}/100</div><div class="score-detail">STYLE SCORE</div></div><div class="score-detail">ست ${saved.length-idx}</div></div><div class="outfit-items">${arr.map(itemCard).join('')}</div><button class="delete saved-delete" onclick="removeSavedOutfit('${o.id}')">حذف این ست</button></div>`}).join('');
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
   subtype:document.getElementById('subtype')?.value||'',
   fit:document.getElementById('fit')?.value||'Regular',
   extra:document.getElementById('extra')?.value||'',
   details:smartDetails(),
   color:document.getElementById('color').value,
   secondaryColor:document.getElementById('secondaryColor').value,
   seasons:checkedValues('seasons'),
   occasions:checkedValues('occasions'),
   formality:Number(document.getElementById('formality').value),
   season:'all',
   occasion:checkedValues('occasions')[0]||'casual',
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
renderDynamicFields();
renderAll();
