
const KEY='wardrobe_v2_items';
const SAVED_KEY='wardrobe_v2_saved_outfits';
let deferredPrompt=null;
let editingItemId=null;
let editingPhotoData='';
const colorFamily={black:'neutral',white:'neutral',ivory:'neutral',gray_light:'neutral',gray:'neutral',charcoal:'neutral',navy:'blue',petrol_blue:'blue',blue:'blue',light_blue:'blue',denim_blue:'blue',cream:'neutral',beige:'earth',camel:'earth',khaki:'earth',brown_light:'earth',brown:'earth',brown_dark:'earth',green:'green',jade:'green',olive:'green',red:'red',burgundy:'red',brick:'red',orange:'warm',mustard:'warm',yellow:'warm',pink:'pink',peach:'pink',purple:'purple',lilac:'purple',other:'other'};
const compat={
 neutral:['neutral','blue','earth','green','red','warm','pink','purple'],
 blue:['neutral','blue','earth','green','red'],
 earth:['neutral','blue','earth','green','warm'],
 green:['neutral','blue','earth','green'],
 red:['neutral','blue','red','pink'],
 warm:['neutral','earth','warm','blue'],
 pink:['neutral','blue','red','pink','purple'],
 purple:['neutral','blue','pink','purple'],
 other:['neutral']
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
 'کتانی':[{id:'shoeStyle',label:'استایل کفش (می‌توانی چند مورد انتخاب کنی)',type:'multi',options:['مینیمال','رانینگ','رترو','بسکتبال','اسکیت','کلاسیک','چانکی','لوکس / فشن','اوت‌دور']},{id:'shoeHeight',label:'ارتفاع ساق',options:['Low / کوتاه','Mid / متوسط','High / بلند']},{id:'shoeMaterial',label:'جنس',options:['چرم','جیر','مش','پارچه / کانواس','ترکیبی','مصنوعی']}],
 'لوفر':[{id:'shoeStyle',label:'مدل',options:['پنی','تسل','هورسبیت']},{id:'shoeMaterial',label:'جنس',options:['چرم','جیر','مصنوعی']},{id:'shoeFormality',label:'استایل',options:['کژوال','اسمارت کژوال','رسمی']}],
 'کفش رسمی':[{id:'shoeStyle',label:'مدل',options:['آکسفورد','دربی','مونک‌استرپ']},{id:'shoeMaterial',label:'جنس',options:['چرم صاف','چرم جیر','چرم ورنی','مصنوعی']},{id:'shoeFormality',label:'استایل',options:['اسمارت کژوال','رسمی']}],
 'صندل':[{id:'shoeStyle',label:'استایل',options:['مینیمال','کژوال','اسپرت','اوت‌دور']},{id:'shoeMaterial',label:'جنس',options:['چرم','پارچه','لاستیکی / EVA','مصنوعی']}],
 'بوت':[{id:'shoeStyle',label:'مدل',options:['چلسی','چوکا','ورک','کامبت']},{id:'shoeHeight',label:'ارتفاع ساق',options:['Low / کوتاه','Mid / متوسط','High / بلند']},{id:'shoeMaterial',label:'جنس',options:['چرم','جیر','پارچه / کانواس','مصنوعی']},{id:'shoeFormality',label:'استایل',options:['کژوال','اسمارت کژوال']}],
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
 box.innerHTML=fields.map(f=>{
  if(f.type==='multi') return `<fieldset class="detail-multi"><legend>${f.label}</legend><div class="check-grid">${f.options.map(x=>`<label class="check-card"><input type="checkbox" class="smart-detail-multi" data-detail-id="${f.id}" value="${x}"><span>${x}</span></label>`).join('')}</div></fieldset>`;
  return `<label>${f.label}<select class="smart-detail" data-detail-id="${f.id}">${optionsHtml(f.options)}</select></label>`;
 }).join('');
}
function smartDetails(){
 const o={};
 document.querySelectorAll('.smart-detail').forEach(el=>o[el.dataset.detailId]=el.value);
 document.querySelectorAll('.smart-detail-multi:checked').forEach(el=>{(o[el.dataset.detailId]??=[]).push(el.value)});
 return o;
}
function checkedValues(name){return [...document.querySelectorAll(`input[name="${name}"]:checked`)].map(x=>x.value)}
function loadItems(){return JSON.parse(localStorage.getItem(KEY)||'[]')}
function loadSaved(){return JSON.parse(localStorage.getItem(SAVED_KEY)||'[]')}
function saveSaved(items){localStorage.setItem(SAVED_KEY,JSON.stringify(items)); renderSavedOutfits()}
function saveItems(items){localStorage.setItem(KEY,JSON.stringify(items)); renderAll()}
function catFa(c){return ({top:'بالاتنه',bottom:'پایین‌تنه',outer:'رویه',shoe:'کفش',accessory:'اکسسوری'})[c]||c}
function fitFa(f){return f}
function colorFa(c){return ({black:'مشکی',white:'سفید',ivory:'شیری',gray_light:'طوسی روشن',gray:'طوسی',charcoal:'زغالی',navy:'سرمه‌ای',petrol_blue:'آبی نفتی',blue:'آبی',light_blue:'آبی روشن',denim_blue:'جین آبی',cream:'کرم',beige:'بژ',camel:'شتری',khaki:'خاکی',brown_light:'قهوه‌ای روشن',brown:'قهوه‌ای',brown_dark:'قهوه‌ای تیره',green:'سبز',jade:'یشمی',olive:'زیتونی',red:'قرمز',burgundy:'زرشکی',brick:'آجری',orange:'نارنجی',mustard:'خردلی',yellow:'زرد',pink:'صورتی',peach:'گلبهی',purple:'بنفش',lilac:'یاسی',other:'سایر'})[c]||c}

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
 return `<div class="item-card clickable-card" onclick="openItemDetail('${i.id}')">
   <div class="item-img">${img}</div>
   <div class="item-info">
     <strong>${escapeHtml(i.name)}</strong>
     <div class="meta">${catFa(i.category)}${i.subtype?' · '+i.subtype:''} · ${colorFa(i.color)}<br>${fitFa(i.fit||'Regular')}${i.extra?' · '+i.extra:''}</div>
     <button class="delete" onclick="event.stopPropagation();removeItem('${i.id}')">حذف</button>
   </div>
 </div>`
}
const seasonFa={spring:'بهار',summer:'تابستان',autumn:'پاییز',fall:'پاییز',winter:'زمستان',all:'چهارفصل',warm:'گرم',cold:'سرد'};
const occasionFa={casual:'روزمره',smart:'اسمارت کژوال',sport:'اسپرت',formal:'رسمی'};
function openItemDetail(id){
 const i=loadItems().find(x=>x.id===id); if(!i)return;
 const details=Object.entries(i.details||{}).map(([k,v])=>`<div class="detail-row"><span>${escapeHtml(detailLabel(k))}</span><strong>${escapeHtml(Array.isArray(v)?v.join('، '):v)}</strong></div>`).join('');
 document.getElementById('itemDetail').innerHTML=`<div class="card detail-card">${i.photo?`<img class="detail-photo" src="${i.photo}" alt="">`:''}<h3>${escapeHtml(i.name)}</h3><div class="detail-row"><span>دسته‌بندی</span><strong>${catFa(i.category)}</strong></div><div class="detail-row"><span>نوع دقیق</span><strong>${escapeHtml(i.subtype||'—')}</strong></div>${i.category!=='shoe'&&i.category!=='accessory'?`<div class="detail-row"><span>فرم / برش</span><strong>${escapeHtml(i.fit||'Regular')}</strong></div>`:''}<div class="detail-row"><span>رنگ اصلی</span><strong>${colorFa(i.color)}</strong></div><div class="detail-row"><span>رنگ دوم</span><strong>${i.secondaryColor?colorFa(i.secondaryColor):'ندارد'}</strong></div>${details}<div class="detail-row"><span>فصل‌ها</span><strong>${itemSeasons(i).map(x=>seasonFa[x]||x).join('، ')}</strong></div><div class="detail-row"><span>موقعیت استفاده</span><strong>${itemOccasions(i).map(x=>occasionFa[x]||x).join('، ')}</strong></div><div class="detail-row"><span>میزان رسمی بودن</span><strong>${i.formality||2} از ۵</strong></div><div class="detail-actions"><button class="primary" onclick="editItem('${i.id}')">ویرایش مشخصات</button><button class="danger-btn" onclick="removeItem('${i.id}');goPage('wardrobe')">حذف لباس</button></div></div>`;
 goPage('detail');
}
function detailLabel(k){return ({shoeStyle:'استایل کفش',shoeHeight:'ارتفاع ساق',shoeMaterial:'جنس',shoeFormality:'استایل استفاده',pattern:'طرح',neck:'یقه',sleeve:'آستین',rise:'فاق',wash:'شست / ظاهر',pleat:'جلوی شلوار',material:'جنس',length:'قد',styleDetail:'استایل'})[k]||k}
function editItem(id){
 const i=loadItems().find(x=>x.id===id); if(!i)return; editingItemId=id; editingPhotoData=i.photo||'';
 goPage('add'); document.getElementById('name').value=i.name||''; document.getElementById('category').value=i.category; renderDynamicFields();
 document.getElementById('subtype').value=i.subtype||CATEGORY_FIELDS[i.category].subtype[0]; renderSubtypeFields();
 if(document.getElementById('fit'))document.getElementById('fit').value=i.fit||'Regular';
 document.getElementById('color').value=i.color||'black'; document.getElementById('secondaryColor').value=i.secondaryColor||''; document.getElementById('formality').value=i.formality||2;
 document.querySelectorAll('input[name="seasons"]').forEach(x=>x.checked=itemSeasons(i).includes(x.value)); document.querySelectorAll('input[name="occasions"]').forEach(x=>x.checked=itemOccasions(i).includes(x.value));
 Object.entries(i.details||{}).forEach(([k,v])=>{const one=document.querySelector(`.smart-detail[data-detail-id="${k}"]`);if(one)one.value=v;document.querySelectorAll(`.smart-detail-multi[data-detail-id="${k}"]`).forEach(x=>x.checked=Array.isArray(v)&&v.includes(x.value))});
 if(i.photo){document.getElementById('preview').src=i.photo;document.getElementById('previewWrap').classList.remove('hidden')}
 document.querySelector('#itemForm .primary[type="submit"]').textContent='ذخیره تغییرات';
}

function escapeHtml(s){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
function removeItem(id){if(confirm('این لباس حذف شود؟')) saveItems(loadItems().filter(x=>x.id!==id))}

function renderHome(){
 const items=loadItems();
 document.getElementById('countTops').textContent=items.filter(x=>x.category==='top').length;
 document.getElementById('countBottoms').textContent=items.filter(x=>x.category==='bottom').length;
 document.getElementById('countShoes').textContent=items.filter(x=>x.category==='shoe').length;
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
function seasonMatches(i,season){if(season==='all')return true;const ss=itemSeasons(i);if(ss.includes('all'))return true;/* هوا=گرم را مثل شرایط تابستانی در نظر می‌گیریم؛ صرفاً مناسبِ بهار بودن کافی نیست. */if(season==='warm')return ss.some(x=>['warm','summer'].includes(x));if(season==='cold')return ss.some(x=>['cold','fall','winter'].includes(x));return ss.includes(season)}
function colorPairScore(a,b){
 if(!a||!b)return 0;
 const fa=colorFamily[a]||'other',fb=colorFamily[b]||'other';
 if(a===b)return fa==='neutral'?9:7;
 if(fa==='neutral'||fb==='neutral')return 10;
 if((compat[fa]||[]).includes(fb)||(compat[fb]||[]).includes(fa))return 10;
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

// ===== V2.9 Fashion Ranking Engine =====
const MIN_OUTFIT_SCORE = 80;
const DARK_COLORS = new Set(['black','charcoal','navy','brown_dark','burgundy','jade','olive']);
const LIGHT_COLORS = new Set(['white','ivory','cream','beige','camel','gray_light','light_blue','pink','lilac']);
const NEUTRAL_COLORS = new Set(['black','white','ivory','cream','beige','camel','gray','gray_light','charcoal']);
function itemStyles(i){const d=i.details||{};const v=d.shoeStyle||d.styleDetail||i.styles||i.style||[];return Array.isArray(v)?v:[v].filter(Boolean)}
function colorTone(c){if(DARK_COLORS.has(c))return 'dark';if(LIGHT_COLORS.has(c))return 'light';return 'mid'}
function family(c){return colorFamily[c]||'other'}
function isLoose(f){f=String(f||'regular').toLowerCase();return ['relaxed','oversized','baggy','wide'].some(x=>f.includes(x))}
function isSlim(f){f=String(f||'regular').toLowerCase();return ['skinny','slim'].some(x=>f.includes(x))}
function colorHarmonyScore(items){
 let score=0,pairs=0;
 for(let i=0;i<items.length;i++)for(let j=i+1;j<items.length;j++){score+=colorPairScore(items[i].color,items[j].color);pairs++}
 return pairs?Math.round(score/pairs*10):50;
}
function colorEchoScore(items){
 let n=0;for(let i=0;i<items.length;i++)for(let j=i+1;j<items.length;j++)if(items[i].color===items[j].color||family(items[i].color)===family(items[j].color))n++;
 return Math.min(100,n*35);
}
function silhouetteScore(items,ctx){
 const t=items.find(x=>x.category==='top'),b=items.find(x=>x.category==='bottom');if(!t||!b)return 50;
 const street=ctx.occasion==='sport';
 if(isLoose(t.fit)&&isLoose(b.fit))return street?90:65;
 if(isLoose(t.fit)!==isLoose(b.fit))return 95;
 if(isSlim(t.fit)&&isSlim(b.fit))return 72;
 return 85;
}
function shoeTrouserVisualScore(items){
 const b=items.find(x=>x.category==='bottom'),sh=items.find(x=>x.category==='shoe');if(!b||!sh)return 50;
 let score=72;const styles=itemStyles(sh).map(x=>String(x).toLowerCase());
 const chunky=styles.some(x=>x.includes('چانکی')||x.includes('chunk')||x.includes('بسکت')||x.includes('basket'));
 const minimal=styles.some(x=>x.includes('مینیمال')||x.includes('minimal')||x.includes('کلاسیک')||x.includes('classic'));
 if(isLoose(b.fit)&&chunky)score+=18;if(isLoose(b.fit)&&minimal)score+=10;if(isSlim(b.fit)&&chunky)score-=15;if(isSlim(b.fit)&&minimal)score+=15;
 // tonal bridge between denim/blue trousers and navy shoes
 if(family(b.color)==='blue'&&family(sh.color)==='blue')score+=10;
 return Math.max(0,Math.min(100,score));
}
function fashionEvaluateOutfit(items,ctx={}){
 let hardFail=false;
 for(const i of items){
   if(ctx.season&&ctx.season!=='all'&&!seasonMatches(i,ctx.season))hardFail=true;
   if(ctx.occasion&&itemOccasions(i).length&&!itemOccasions(i).includes(ctx.occasion)&&itemOccasions(i).length===1){} // soft mismatch is handled by base score
 }
 const harmony=colorHarmonyScore(items),echo=colorEchoScore(items),silhouette=silhouetteScore(items,ctx),shoeTrouser=shoeTrouserVisualScore(items);
 const fashionQuality=Math.round(harmony*.38+shoeTrouser*.27+echo*.15+silhouette*.20);
 return {hardFail,fashionQuality,tie:{harmony,shoeTrouser,echo,silhouette}};
}
function compareFashionRank(a,b){
 if(b.total!==a.total)return b.total-a.total;
 // Professional tie-break priority: visual harmony > shoe/trouser > color echo > silhouette > formality
 for(const k of ['harmony','shoeTrouser','echo','silhouette']){const d=(b.tie[k]||0)-(a.tie[k]||0);if(d)return d}
 const fd=(b.breakdown.formality||0)-(a.breakdown.formality||0);if(fd)return fd;
 return a.order-b.order;
}
function rankingExplanation(c,next){
 const t=c.tie;
 let parts=[`هارمونی بصری ${t.harmony}/100`,`کفش/شلوار ${t.shoeTrouser}/100`,`Color Echo ${t.echo}/100`,`سیلوئت ${t.silhouette}/100`];
 if(next&&c.total===next.total){
   const keys=[['harmony','هارمونی بصری'],['shoeTrouser','تناسب کفش و شلوار'],['echo','Color Echo'],['silhouette','سیلوئت']];
   const win=keys.find(([k])=>(c.tie[k]||0)!==(next.tie[k]||0));
   if(win)parts.push(`رتبه بالاتر به‌دلیل ${win[1]}`);
 }
 return parts.join(' · ');
}

function generateOutfit(){
  const items=loadItems();
  const occasion=document.getElementById('outfitOccasion').value;
  const weather=document.getElementById('outfitSeason').value;

  // Do not pre-filter silently; V3.1 evaluates weather as a hard constraint.
  const tops=items.filter(x=>x.category==='top');
  const bottoms=items.filter(x=>x.category==='bottom');
  const shoes=items.filter(x=>x.category==='shoe');
  const outers=items.filter(x=>x.category==='outer');
  const accessories=items.filter(x=>x.category==='accessory');

  if(!tops.length||!bottoms.length){
    document.getElementById('outfitResult').innerHTML=
      `<div class="empty">برای ساخت ست، حداقل یک بالاتنه و یک پایین‌تنه ثبت کن.</div>`;
    return;
  }

  const combos=[];
  const shoeOptions=shoes.length?shoes:[null];
  let order=0;

  for(const top of tops) for(const bottom of bottoms) for(const shoe of shoeOptions){
    let arr=[top,bottom];
    if(shoe) arr.push(shoe);

    const outer=v31BestExtra(arr,outers,occasion,weather);
    if(outer) arr.push(outer);
    const accessory=v31BestExtra(arr,accessories,occasion,weather);
    if(accessory) arr.push(accessory);

    const result=v31Evaluate(arr,occasion,weather);
    if(result.hardFail) continue;

    combos.push({
      items:arr,
      score:result.score,
      breakdown:result.breakdown,
      reasons:result.reasons,
      order:order++
    });
  }

  combos.sort(v31Compare);

  const unique=[], seen=new Set();
  for(const c of combos){
    if(c.score<V31_MIN_SCORE) continue;
    const key=c.items.map(i=>i.id).sort().join('|');
    if(seen.has(key)) continue;
    seen.add(key);
    unique.push(c);
    if(unique.length===3) break;
  }

  if(!unique.length){
    window.currentSuggestedOutfits=[];
    window.currentSuggestedOutfit=null;
    document.getElementById('outfitResult').innerHTML=
      `<div class="empty">برای این شرایط، هیچ ست با امتیاز ۸۰ یا بالاتر در کمدت پیدا نشد.</div>`;
    return;
  }

  window.currentSuggestedOutfits=unique.map(c=>({
    id:Date.now().toString(36)+Math.random().toString(36).slice(2,6),
    itemIds:c.items.map(i=>i.id),
    total:c.score,
    breakdown:c.breakdown,
    reasons:c.reasons,
    occasion,
    season:weather,
    engine:'v3.1',
    createdAt:Date.now()
  }));
  window.currentSuggestedOutfit=window.currentSuggestedOutfits[0];

  const labels=['بهترین انتخاب','انتخاب دوم','انتخاب سوم'];
  document.getElementById('outfitResult').innerHTML=unique.map((c,idx)=>{
    const b=c.breakdown;
    return `<div class="outfit-card card">
      <div class="rank-label">${idx+1}. ${labels[idx]}</div>
      <div class="score-row">
        <div><div class="score">${c.score}/100</div><div class="score-detail">STYLE SCORE</div></div>
      </div>

      <div class="v31-breakdown">
        <span>رنگ ${b.color}/25</span>
        <span>سیلوئت ${b.silhouette}/20</span>
        <span>موقعیت ${b.occasion}/15</span>
        <span>هوا ${b.season}/15</span>
        <span>کفش/شلوار ${b.shoeTrouser}/10</span>
        <span>رسمیت ${b.formality}/5</span>
        <span>Color Echo ${b.echo}/5</span>
        <span>تعادل بصری ${b.visual}/5</span>
      </div>

      <div class="v31-why"><strong>چرا این رتبه؟</strong><br>${v31Why(c,unique[idx+1])}</div>
      <div class="outfit-items">${c.items.map(itemCard).join('')}</div>
      <button class="primary save-outfit-btn" onclick="saveSuggestedOutfit(${idx})">ذخیره در ست‌های من</button>
    </div>`;
  }).join('');
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
 let photoData=editingPhotoData||'';
 const f=window.selectedPhotoFile || null;
 if(f) photoData=await compressImage(f,900,.78);
 const item={
   id:editingItemId||Date.now().toString(36)+Math.random().toString(36).slice(2,6),
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
   createdAt:editingItemId?(loadItems().find(x=>x.id===editingItemId)?.createdAt||Date.now()):Date.now()
 };
 const items=loadItems(); if(editingItemId){const n=items.findIndex(x=>x.id===editingItemId);if(n>=0)items[n]=item}else items.push(item); saveItems(items);
 editingItemId=null; editingPhotoData=''; e.target.reset(); removePhoto(); document.querySelector('#itemForm .primary[type="submit"]').textContent='ذخیره در کمد';
 goPage('wardrobe');
});
function handlePhotoSelection(e){
 const f=e.target.files[0]; if(!f)return;
 window.selectedPhotoFile=f;
 const u=URL.createObjectURL(f);
 document.getElementById('preview').src=u;
 document.getElementById('previewWrap').classList.remove('hidden');
}
document.getElementById('cameraPhoto').addEventListener('change',handlePhotoSelection);
document.getElementById('galleryPhoto').addEventListener('change',handlePhotoSelection);
function removePhoto(){
 window.selectedPhotoFile=null;
 document.getElementById('cameraPhoto').value='';
 document.getElementById('galleryPhoto').value='';
 document.getElementById('preview').removeAttribute('src');
 document.getElementById('previewWrap').classList.add('hidden');
}
function changePhoto(){
 removePhoto();
 document.getElementById('galleryPhoto').click();
}
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

renderDynamicFields();
renderAll();


// ===== WARDROBE V3.1 — Wired Explainable Stylist Engine =====
const V31_MIN_SCORE = 80;

function v31Styles(i){
  const d=i?.details||{};
  const v=d.shoeStyle||d.styleDetail||i?.styles||i?.style||[];
  return Array.isArray(v)?v:[v].filter(Boolean);
}
function v31Tone(c){
  if(['black','charcoal','navy','brown_dark','burgundy','jade','olive'].includes(c)) return 'dark';
  if(['white','ivory','cream','beige','camel','gray_light','light_blue'].includes(c)) return 'light';
  return 'mid';
}
function v31Family(c){ return colorFamily[c]||'other'; }
function v31Loose(f){ f=String(f||'Regular').toLowerCase(); return ['relaxed','oversized','baggy','wide'].some(x=>f.includes(x)); }
function v31Slim(f){ f=String(f||'Regular').toLowerCase(); return ['skinny','slim'].some(x=>f.includes(x)); }

function v31HardGate(items, occasion, weather){
  const reasons=[];
  for(const i of items){
    if(weather!=='all' && !seasonMatches(i,weather)){
      reasons.push(`${i.name||catFa(i.category)} برای هوای انتخابی مناسب نیست`);
      return {fail:true,reasons};
    }
  }
  return {fail:false,reasons};
}

function v31Color(items){
  // 25 max, but full marks are deliberately rare.
  const pairs=[];
  for(let i=0;i<items.length;i++) for(let j=i+1;j<items.length;j++){
    pairs.push(colorPairScore(items[i].color,items[j].color));
  }
  const avg=pairs.length ? pairs.reduce((a,b)=>a+b,0)/pairs.length : 7;
  let score=Math.round(14 + avg*0.8); // typical good outfit: 20–22
  const colors=items.map(i=>i.color).filter(Boolean);
  const families=colors.map(v31Family);
  const neutrals=colors.filter(c=>v31Family(c)==='neutral').length;
  const tones=new Set(colors.map(v31Tone)).size;
  const reasons=[];
  if(neutrals) reasons.push('وجود رنگ خنثی، ترکیب را کنترل و متعادل کرده');
  if(new Set(families).size<=2) reasons.push('تعداد خانواده‌های رنگی محدود و منسجم است');
  if(tones>=2) reasons.push('کنتراست روشن/تیره به خوانایی ست کمک کرده');
  // Penalize too much same dark mass.
  if(colors.length>=3 && colors.filter(c=>v31Tone(c)==='dark').length===colors.length){
    score-=2; reasons.push('تمام اجزا تیره‌اند و وزن بصری ست بالا رفته');
  }
  return {score:Math.max(0,Math.min(25,score)),reasons};
}

function v31Silhouette(top,bottom,occasion){
  if(!top||!bottom) return {score:13,reasons:['اطلاعات سیلوئت کامل نیست']};
  const a=String(top.fit||'Regular').toLowerCase();
  const b=String(bottom.fit||'Regular').toLowerCase();
  let score=15, reasons=[];
  if(v31Loose(a)!==v31Loose(b)){
    score=17; reasons.push('تفاوت کنترل‌شده حجم بالا و پایین، سیلوئت متعادلی ساخته');
  }else if(v31Loose(a)&&v31Loose(b)){
    score=occasion==='sport'?18:14;
    reasons.push(occasion==='sport'?'حجم آزاد با استایل اسپرت/استریت سازگار است':'حجم زیاد در هر دو بخش کمی از تعادل کم کرده');
  }else if(v31Slim(a)&&v31Slim(b)){
    score=14; reasons.push('فرم کلی باریک است و تنوع حجمی کمی دارد');
  }else{
    score=16; reasons.push('فرم کلی لباس‌ها متعادل و کم‌ریسک است');
  }
  return {score,reasons};
}

function v31Occasion(items,occasion){
  const known=items.filter(i=>itemOccasions(i).length);
  const hits=known.filter(i=>itemOccasions(i).includes(occasion)).length;
  const ratio=known.length ? hits/known.length : .6;
  const score=Math.round(8 + 5*ratio); // max 13
  return {score,reasons:[ratio===1?'همه اجزا با موقعیت انتخابی سازگارند':'بعضی اجزا برای این موقعیت ایده‌آل نیستند']};
}

function v31Weather(items,weather){
  if(weather==='all') return {score:11,reasons:['هوا محدودکننده انتخاب نیست']};
  const hits=items.filter(i=>seasonMatches(i,weather)).length;
  const ratio=hits/items.length;
  const score=Math.round(8 + 6*ratio); // max 14
  return {score,reasons:[ratio===1?'همه اجزا با هوای انتخابی هماهنگ‌اند':'هماهنگی آب‌وهوایی کامل نیست']};
}

function v31ShoeTrouser(shoe,bottom){
  if(!shoe||!bottom) return {score:6,reasons:['کفش در ست ثبت نشده']};
  const styles=v31Styles(shoe).map(x=>String(x).toLowerCase());
  const bf=String(bottom.fit||'Regular').toLowerCase();
  const chunky=styles.some(x=>x.includes('چانکی')||x.includes('chunk')||x.includes('بسکت')||x.includes('basket'));
  const clean=styles.some(x=>x.includes('مینیمال')||x.includes('minimal')||x.includes('کلاسیک')||x.includes('classic')||x.includes('رترو')||x.includes('retro'));
  let score=7, reasons=[];
  if(v31Loose(bf)&&chunky){ score+=1; reasons.push('حجم کفش با شلوار Relaxed/آزاد هماهنگ است'); }
  if(v31Loose(bf)&&clean){ score+=1; reasons.push('فرم تمیز کفش اجازه داده شلوار آزاد غالب بماند'); }
  if(v31Slim(bf)&&chunky){ score-=2; reasons.push('کفش نسبت به فرم باریک شلوار حجیم است'); }
  if(v31Slim(bf)&&clean){ score+=1; reasons.push('کفش جمع‌وجور با فرم باریک شلوار هماهنگ است'); }

  // Tonal bridge: blue denim + navy/blue shoe.
  if(v31Family(bottom.color)==='blue' && v31Family(shoe.color)==='blue'){
    score+=1; reasons.push('رنگ کفش با جین یک پل تونال ایجاد کرده');
  }
  // White sneaker with denim is a classic clean contrast.
  if(v31Family(bottom.color)==='blue' && shoe.color==='white'){
    score+=1; reasons.push('کفش سفید با جین کنتراست تمیز و کلاسیک ساخته');
  }
  // All-black shoe can visually ground, but may make a light denim outfit heavier.
  if(shoe.color==='black' && ['denim_blue','light_blue','blue'].includes(bottom.color)){
    reasons.push('کفش مشکی ست را سنگین‌تر و جدی‌تر کرده');
  }
  return {score:Math.max(0,Math.min(10,score)),reasons};
}

function v31Formality(items,occasion){
  const target=targetFormality(occasion);
  const vals=items.map(i=>Number(i.formality||2)).filter(Number.isFinite);
  if(!vals.length) return {score:3,reasons:['اطلاعات رسمیت کافی نیست']};
  const avg=vals.reduce((a,b)=>a+b,0)/vals.length;
  const spread=Math.max(...vals)-Math.min(...vals);
  let score=5-Math.min(3,Math.round(Math.abs(avg-target)));
  if(spread>=3) score-=1;
  return {score:Math.max(1,Math.min(5,score)),reasons:[spread<=1?'سطح رسمی‌بودن اجزا هماهنگ است':'سطح رسمی‌بودن اجزا کمی فاصله دارد']};
}

function v31Echo(items){
  const colors=items.map(i=>i.color).filter(Boolean);
  let score=2,reason='Color Echo کم است؛ انسجام بیشتر از کنتراست می‌آید';
  for(let i=0;i<colors.length;i++)for(let j=i+1;j<colors.length;j++){
    if(colors[i]===colors[j]){ score=5; reason='تکرار مستقیم یک رنگ بین اجزا انسجام ساخته'; }
    else if(score<4 && v31Family(colors[i])===v31Family(colors[j])){
      score=4; reason='تکرار خانواده رنگی بین اجزا دیده می‌شود';
    }
  }
  return {score,reasons:[reason]};
}

function v31Visual(items){
  const shoe=items.find(i=>i.category==='shoe');
  const top=items.find(i=>i.category==='top');
  const bottom=items.find(i=>i.category==='bottom');
  let score=4,reasons=[];
  if(!shoe) return {score:3,reasons:['بدون کفش، تعادل بصری کامل ارزیابی نمی‌شود']};

  const tones=items.map(i=>v31Tone(i.color));
  if(new Set(tones).size>=2){ score=5; reasons.push('توزیع روشن/تیره در کل ست متعادل است'); }

  // Too much black at top + shoe around light denim can feel visually book-ended/heavier.
  if(top?.color==='black' && shoe?.color==='black' && ['denim_blue','light_blue'].includes(bottom?.color)){
    score=Math.min(score,3);
    reasons.push('مشکی در بالا و کفش، جین روشن را بین دو جرم تیره محصور کرده');
  }
  return {score,reasons};
}

function v31Evaluate(items,occasion,weather){
  const gate=v31HardGate(items,occasion,weather);
  if(gate.fail) return {hardFail:true,score:0,breakdown:{},reasons:gate.reasons};

  const top=items.find(i=>i.category==='top');
  const bottom=items.find(i=>i.category==='bottom');
  const shoe=items.find(i=>i.category==='shoe');

  const color=v31Color(items);
  const silhouette=v31Silhouette(top,bottom,occasion);
  const occ=v31Occasion(items,occasion);
  const season=v31Weather(items,weather);
  const shoeTrouser=v31ShoeTrouser(shoe,bottom);
  const formality=v31Formality(items,occasion);
  const echo=v31Echo(items);
  const visual=v31Visual(items);

  const score=color.score+silhouette.score+occ.score+season.score+shoeTrouser.score+formality.score+echo.score+visual.score;
  const reasons=[...color.reasons,...silhouette.reasons,...shoeTrouser.reasons,...echo.reasons,...visual.reasons];

  return {
    hardFail:false,
    score:Math.max(0,Math.min(100,score)),
    breakdown:{
      color:color.score, silhouette:silhouette.score, occasion:occ.score, season:season.score,
      shoeTrouser:shoeTrouser.score, formality:formality.score, echo:echo.score, visual:visual.score
    },
    reasons:[...new Set(reasons)].slice(0,6)
  };
}

function v31Compare(a,b){
  if(b.score!==a.score) return b.score-a.score;
  const order=['color','shoeTrouser','visual','silhouette','echo','formality'];
  for(const k of order){
    const d=(b.breakdown[k]||0)-(a.breakdown[k]||0);
    if(d) return d;
  }
  return a.order-b.order;
}

function v31Why(current,next){
  const core=current.reasons.slice(0,3).join('؛ ');
  if(next){
    const gap=current.score-next.score;
    if(gap>0) return `${core}؛ در مجموع ${gap} امتیاز بالاتر از گزینه بعدی`;
    const keys=[
      ['color','هماهنگی رنگ'],['shoeTrouser','تناسب کفش و شلوار'],['visual','تعادل بصری'],
      ['silhouette','سیلوئت'],['echo','Color Echo'],['formality','رسمیت']
    ];
    const win=keys.find(([k])=>(current.breakdown[k]||0)>(next.breakdown[k]||0));
    if(win) return `${core}؛ در امتیاز مساوی، ${win[1]} عامل رتبه بالاتر است`;
  }
  return core||'ترکیب متعادل و سازگار با شرایط انتخابی';
}

function v31BestExtra(base,candidates,occasion,weather){
  if(!candidates.length) return null;
  const evaluated=candidates.map(item=>{
    const r=v31Evaluate([...base,item],occasion,weather);
    return {item,r};
  }).filter(x=>!x.r.hardFail).sort((a,b)=>b.r.score-a.r.score);
  return evaluated[0]?.item||null;
}

