
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

function itemSeasons(i){return Array.isArray(i.seasons)&&i.seasons.length?i.seasons:[i.season||'all']}
function itemOccasions(i){return Array.isArray(i.occasions)&&i.occasions.length?i.occasions:[i.occasion||'casual']}
function seasonMatches(i,season){if(season==='all')return true;const ss=itemSeasons(i);if(ss.includes('all'))return true;if(season==='warm')return ss.some(x=>['warm','spring','summer'].includes(x));if(season==='cold')return ss.some(x=>['cold','fall','winter'].includes(x));return ss.includes(season)}
function colorPairScore(a,b){
 if(!a||!b)return 0;
 if(a===b)return ['black','white','gray','navy','beige'].includes(a)?9:6;
 if((compat[a]||[]).includes(b)||(compat[b]||[]).includes(a))return 10;
 return 3;
}
function fitPairScore(top,bottom){
 const a=String(top.fit||'regular').toLowerCase(),b=String(bottom.fit||'regular').toLowerCase();
 const excellent={slim:['straight','regular','relaxed','wide'],regular:['skinny','slim','straight','regular','relaxed','wide'],relaxed:['skinny','slim','straight','regular'],oversized:['skinny','slim','straight','regular']};
 if((excellent[a]||[]).includes(b))return 25;
 if(a===b)return 18;
 return 13;
}
function occasionScore(items,occasion){
 const vals=items.map(i=>itemOccasions(i));
 const hits=vals.filter(v=>v.includes(occasion)).length;
 return Math.round(20*hits/items.length);
}
function seasonScore(items,season){
 if(season==='all')return 15;
 const hits=items.filter(i=>seasonMatches(i,season)).length;
 return Math.round(15*hits/items.length);
}
function targetFormality(occasion){return ({sport:1,casual:2,smart:3,formal:5})[occasion]||2}
function formalityScore(items,occasion){
 const target=targetFormality(occasion),avg=items.reduce((s,i)=>s+Number(i.formality||2),0)/items.length;
 return Math.max(0,10-Math.round(Math.abs(avg-target)*3));
}
function evaluateOutfit(items,occasion,season){
 const top=items.find(i=>i.category==='top'),bottom=items.find(i=>i.category==='bottom');
 const colorPairs=[];for(let i=0;i<items.length;i++)for(let j=i+1;j<items.length;j++)colorPairs.push(colorPairScore(items[i].color,items[j].color));
 const color=Math.round((colorPairs.length?colorPairs.reduce((a,b)=>a+b,0)/colorPairs.length:5)*3); // 30
 const fit=top&&bottom?fitPairScore(top,bottom):15; // 25
 const occ=occasionScore(items,occasion); // 20
 const sea=seasonScore(items,season); // 15
 const formal=formalityScore(items,occasion); // 10
 const total=Math.max(0,Math.min(100,color+fit+occ+sea+formal));
 const reasons=[`رنگ ${color}/30`,`فیت ${fit}/25`,`موقعیت ${occ}/20`,`فصل ${sea}/15`,`رسمیت ${formal}/10`];
 return {total,reasons,breakdown:{color,fit,occasion:occ,season:sea,formality:formal}};
}
function bestExtra(base,candidates,occasion,season){
 if(!candidates.length)return null;
 return candidates.map(x=>({item:x,result:evaluateOutfit([...base,x],occasion,season)})).sort((a,b)=>b.result.total-a.result.total)[0].item;
}
function generateOutfit(){
 const items=loadItems(),occasion=document.getElementById('outfitOccasion').value,season=document.getElementById('outfitSeason').value;
 const eligible=items.filter(x=>seasonMatches(x,season));
 const tops=eligible.filter(x=>x.category==='top'),bottoms=eligible.filter(x=>x.category==='bottom'),shoes=eligible.filter(x=>x.category==='shoe'),outers=eligible.filter(x=>x.category==='outer'),accessories=eligible.filter(x=>x.category==='accessory');
 if(!tops.length||!bottoms.length){document.getElementById('outfitResult').innerHTML=`<div class="empty">برای ساخت ست، حداقل یک بالاتنه و یک پایین‌تنه ثبت کن.</div>`;return;}
 const combos=[];
 for(const t of tops)for(const b of bottoms){
   let arr=[t,b];
   const shoe=bestExtra(arr,shoes,occasion,season);if(shoe)arr.push(shoe);
   const outer=bestExtra(arr,outers,occasion,season);if(outer)arr.push(outer);
   const accessory=bestExtra(arr,accessories,occasion,season);if(accessory)arr.push(accessory);
   const result=evaluateOutfit(arr,occasion,season);
   combos.push({items:arr,...result});
 }
 combos.sort((a,b)=>b.total-a.total);
 const unique=[];const seen=new Set();
 for(const c of combos){const key=c.items.map(i=>i.id).sort().join('|');if(!seen.has(key)){seen.add(key);unique.push(c)}if(unique.length===3)break;}
 window.currentSuggestedOutfits=unique.map(c=>({id:Date.now().toString(36)+Math.random().toString(36).slice(2,6),itemIds:c.items.map(i=>i.id),total:c.total,breakdown:c.breakdown,occasion,season,createdAt:Date.now()}));
 window.currentSuggestedOutfit=window.currentSuggestedOutfits[0];
 const labels=['بهترین انتخاب','انتخاب دوم','انتخاب سوم'];
 document.getElementById('outfitResult').innerHTML=unique.map((c,idx)=>`<div class="outfit-card card"><div class="rank-label">${idx+1}. ${labels[idx]}</div><div class="score-row"><div><div class="score">${c.total}/100</div><div class="score-detail">STYLE SCORE</div></div><div class="score-detail score-explain">${c.reasons.join(' · ')}</div></div><div class="outfit-items">${c.items.map(itemCard).join('')}</div><button class="primary save-outfit-btn" onclick="saveSuggestedOutfit(${idx})">ذخیره در ست‌های من</button></div>`).join('');
}
function saveSuggestedOutfit(idx){window.currentSuggestedOutfit=window.currentSuggestedOutfits?.[idx];saveCurrentOutfit()}

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
