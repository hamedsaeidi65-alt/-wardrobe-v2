
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
 const items=loadItems(),occasion=document.getElementById('outfitOccasion').value,season=document.getElementById('outfitSeason').value;
 const eligible=items.filter(x=>seasonMatches(x,season));
 const tops=eligible.filter(x=>x.category==='top'),bottoms=eligible.filter(x=>x.category==='bottom'),shoes=eligible.filter(x=>x.category==='shoe'),outers=eligible.filter(x=>x.category==='outer'),accessories=eligible.filter(x=>x.category==='accessory');
 if(!tops.length||!bottoms.length){document.getElementById('outfitResult').innerHTML=`<div class="empty">برای ساخت ست، حداقل یک بالاتنه و یک پایین‌تنه ثبت کن.</div>`;return;}
 const combos=[],shoeOptions=shoes.length?shoes:[null],ctx={occasion,season};let order=0;
 for(const t of tops)for(const b of bottoms)for(const sh of shoeOptions){
   let arr=[t,b];if(sh)arr.push(sh);const outer=bestExtra(arr,outers,occasion,season);if(outer)arr.push(outer);const accessory=bestExtra(arr,accessories,occasion,season);if(accessory)arr.push(accessory);
   const base=evaluateOutfit(arr,occasion,season),fashion=fashionEvaluateOutfit(arr,ctx);if(fashion.hardFail)continue;
   const total=Math.max(0,Math.min(100,Math.round(base.total*.82+fashion.fashionQuality*.18)));
   combos.push({items:arr,total,breakdown:{...base.breakdown,fashion:fashion.fashionQuality},tie:fashion.tie,order:order++});
 }
 combos.sort(compareFashionRank);
 const qualified=combos.filter(c=>c.total>=MIN_OUTFIT_SCORE),unique=[],seen=new Set();
 for(const c of qualified){const key=c.items.map(i=>i.id).sort().join('|');if(!seen.has(key)){seen.add(key);unique.push(c)}if(unique.length===3)break}
 if(!unique.length){window.currentSuggestedOutfits=[];window.currentSuggestedOutfit=null;document.getElementById('outfitResult').innerHTML=`<div class="empty">برای این شرایط، ست مناسبی در کمدت پیدا نشد.</div>`;return}
 window.currentSuggestedOutfits=unique.map(c=>({id:Date.now().toString(36)+Math.random().toString(36).slice(2,6),itemIds:c.items.map(i=>i.id),total:c.total,breakdown:c.breakdown,occasion,season,createdAt:Date.now()}));window.currentSuggestedOutfit=window.currentSuggestedOutfits[0];
 const labels=['بهترین انتخاب','انتخاب دوم','انتخاب سوم'];
 document.getElementById('outfitResult').innerHTML=unique.map((c,idx)=>`<div class="outfit-card card"><div class="rank-label">${idx+1}. ${labels[idx]}</div><div class="score-row"><div><div class="score">${c.total}/100</div><div class="score-detail">STYLE SCORE</div></div><div class="score-detail score-explain">رنگ ${c.breakdown.color}/30 · فیت ${c.breakdown.fit}/25 · موقعیت ${c.breakdown.occasion}/20 · فصل ${c.breakdown.season}/15 · رسمیت ${c.breakdown.formality}/10</div></div><div class="rank-reason">${rankingExplanation(c,unique[idx+1])}</div><div class="outfit-items">${c.items.map(itemCard).join('')}</div><button class="primary save-outfit-btn" onclick="saveSuggestedOutfit(${idx})">ذخیره در ست‌های من</button></div>`).join('');
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




// ===== WARDROBE V3.0 — Explainable Stylist Engine =====
const V3_MIN_SCORE = 80;

function v3Arr(v){ return Array.isArray(v)?v:(v?[v]:[]); }
function v3Styles(i){ return v3Arr(i?.styles || i?.shoeStyles || i?.style); }
function v3Seasons(i){ return v3Arr(i?.seasons || i?.season); }
function v3Occ(i){ return v3Arr(i?.occasions || i?.occasion); }
function v3Tone(c){
 const dark=['black','charcoal','navy','darkbrown','burgundy','emerald','olive','مشکی','زغالی','سرمه‌ای','زرشکی','یشمی','زیتونی'];
 const light=['white','ivory','cream','beige','camel','lightgray','lightblue','سفید','شیری','کرم','بژ','شتری','طوسی روشن','آبی روشن'];
 if(dark.includes(c)) return 'dark'; if(light.includes(c)) return 'light'; return 'mid';
}
function v3Neutral(c){
 return ['black','white','ivory','cream','beige','camel','gray','lightgray','charcoal','navy','brown',
 'مشکی','سفید','شیری','کرم','بژ','شتری','طوسی','طوسی روشن','زغالی','سرمه‌ای','قهوه‌ای'].includes(c);
}
function v3ColorFamily(c){
 const map={
  'black':'neutral','white':'neutral','ivory':'neutral','cream':'neutral','beige':'neutral','camel':'neutral','gray':'neutral','lightgray':'neutral','charcoal':'neutral',
  'مشکی':'neutral','سفید':'neutral','شیری':'neutral','کرم':'neutral','بژ':'neutral','شتری':'neutral','طوسی':'neutral','طوسی روشن':'neutral','زغالی':'neutral',
  'navy':'blue','blue':'blue','lightblue':'blue','petrol':'blue','سرمه‌ای':'blue','آبی':'blue','آبی روشن':'blue','آبی نفتی':'blue',
  'green':'green','olive':'green','emerald':'green','سبز':'green','زیتونی':'green','یشمی':'green',
  'brown':'earth','darkbrown':'earth','khaki':'earth','قهوه‌ای':'earth','خاکی':'earth',
  'red':'red','burgundy':'red','brick':'red','قرمز':'red','زرشکی':'red','آجری':'red',
  'pink':'pink','peach':'pink','صورتی':'pink','گلبهی':'pink',
  'purple':'purple','lilac':'purple','بنفش':'purple','یاسی':'purple',
  'yellow':'yellow','mustard':'yellow','زرد':'yellow','خردلی':'yellow','orange':'orange','نارنجی':'orange'
 };
 return map[c]||c||'unknown';
}
function v3Fit(i){ return String(i?.fit||'regular').toLowerCase(); }
function v3Loose(f){ return ['relaxed','oversized','baggy','wide','آزاد','بگ'].some(x=>f.includes(x)); }
function v3Slim(f){ return ['skinny','slim','اسلیم','اسکینی'].some(x=>f.includes(x)); }

function v3ContextGate(item,ctx){
 const seasons=v3Seasons(item), occ=v3Occ(item);
 let hardFail=false, notes=[];
 if(ctx.weather==='hot' && seasons.length && !seasons.some(x=>['summer','all','تابستان','چهارفصل'].includes(x))){
   hardFail=true; notes.push('برای هوای گرم مناسب نیست');
 }
 if(ctx.weather==='cold' && seasons.length===1 && seasons.some(x=>['summer','تابستان'].includes(x))){
   hardFail=true; notes.push('برای هوای سرد مناسب نیست');
 }
 return {hardFail,notes};
}

function v3ColorScore(parts){
 let s=17, notes=[];
 const colors=parts.map(x=>x?.color).filter(Boolean);
 const fam=colors.map(v3ColorFamily);
 const neutralCount=colors.filter(v3Neutral).length;
 if(neutralCount) { s+=3; notes.push('رنگ خنثی، ترکیب را متعادل کرده'); }
 if(new Set(fam).size<=2) { s+=3; notes.push('خانواده‌های رنگی کنترل‌شده‌اند'); }
 const tones=colors.map(v3Tone);
 if(new Set(tones).size>=2) { s+=2; notes.push('کنتراست روشن/تیره مناسب است'); }
 return {score:Math.min(25,s),notes};
}
function v3SilhouetteScore(top,bottom,ctx){
 let s=14,notes=[];
 const a=v3Fit(top), b=v3Fit(bottom);
 if((v3Loose(a)&&!v3Loose(b))||(!v3Loose(a)&&v3Loose(b))){s+=5;notes.push('حجم بالاتنه و پایین‌تنه متعادل است');}
 else if(v3Loose(a)&&v3Loose(b)){
   if(ctx.style==='streetwear'){s+=5;notes.push('حجم آزاد با استریت‌ویر هماهنگ است');}
   else {s+=1;notes.push('هر دو بخش آزادند؛ برای این استایل کمی حجیم است');}
 } else {s+=4;notes.push('سیلوئت کلی متعادل است');}
 return {score:Math.min(20,s),notes};
}
function v3OccasionScore(parts,ctx){
 if(!ctx.occasion) return {score:12,notes:['موقعیت مشخص نشده؛ امتیاز محافظه‌کارانه']};
 let hits=0,known=0;
 parts.forEach(i=>{const o=v3Occ(i); if(o.length){known++; if(o.includes(ctx.occasion))hits++;}});
 if(!known) return {score:11,notes:['اطلاعات موقعیت لباس‌ها کامل نیست']};
 const ratio=hits/known;
 return {score:Math.round(7+8*ratio),notes:[ratio===1?'همه اجزا با موقعیت انتخابی سازگارند':'بعضی اجزا با موقعیت انتخابی سازگاری کمتری دارند']};
}
function v3SeasonScore(parts,ctx){
 if(!ctx.season && !ctx.weather) return {score:12,notes:['شرایط فصل/هوا مشخص نشده']};
 let good=0,known=0;
 parts.forEach(i=>{const ss=v3Seasons(i); if(ss.length){known++; if(!ctx.season || ss.includes(ctx.season)||ss.includes('all')||ss.includes('چهارفصل'))good++;}});
 const ratio=known?good/known:0.75;
 return {score:Math.round(8+7*ratio),notes:[ratio>=.99?'فصل و هوا با اجزای ست هماهنگ است':'سازگاری فصل/هوا کامل نیست']};
}
function v3ShoeTrouserScore(shoe,bottom){
 if(!shoe||!bottom) return {score:6,notes:['اطلاعات کفش/شلوار کامل نیست']};
 let s=6,notes=[];
 const styles=v3Styles(shoe).map(x=>String(x).toLowerCase()), bf=v3Fit(bottom);
 const chunky=styles.some(x=>x.includes('chunk')||x.includes('چانکی')||x.includes('basket')||x.includes('بسکت'));
 const minimal=styles.some(x=>x.includes('minimal')||x.includes('مینیمال')||x.includes('classic')||x.includes('کلاسیک')||x.includes('retro')||x.includes('رترو'));
 if(v3Loose(bf)&&chunky){s+=4;notes.push('وزن بصری کفش با شلوار آزاد هماهنگ است');}
 else if(v3Slim(bf)&&chunky){s-=2;notes.push('کفش برای این فرم شلوار کمی حجیم است');}
 else if(minimal){s+=3;notes.push('فرم کفش با شلوار هماهنگ است');}
 return {score:Math.max(0,Math.min(10,s)),notes};
}
function v3FormalityScore(parts){
 const vals=parts.map(i=>Number(i?.formality)).filter(Number.isFinite);
 if(vals.length<2) return {score:4,notes:['اطلاعات رسمیت محدود است']};
 const spread=Math.max(...vals)-Math.min(...vals);
 return {score:spread<=25?5:spread<=45?4:2,notes:[spread<=25?'سطح رسمیت اجزا هماهنگ است':'سطح رسمیت اجزا کمی فاصله دارد']};
}
function v3EchoScore(parts){
 const colors=parts.map(i=>i?.color).filter(Boolean);
 let best=0;
 for(let i=0;i<colors.length;i++)for(let j=i+1;j<colors.length;j++){
   if(colors[i]===colors[j]) best=Math.max(best,5);
   else if(v3ColorFamily(colors[i])===v3ColorFamily(colors[j])) best=Math.max(best,3);
 }
 return {score:best||2,notes:[best>=5?'تکرار مستقیم رنگ، انسجام ایجاد کرده':best>=3?'تکرار خانواده رنگی دیده می‌شود':'Color Echo محدود است؛ کنتراست نقش بیشتری دارد']};
}
function v3VisualBalance(parts){
 const tones=parts.map(i=>v3Tone(i?.color)).filter(Boolean);
 const varied=new Set(tones).size;
 return {score:varied>=2?5:4,notes:[varied>=2?'وزن روشن/تیره در کل ست متعادل است':'ست تونال است و کنتراست کمتری دارد']};
}

function v3Evaluate(parts,ctx={}){
 const valid=parts.filter(Boolean);
 let hardFail=false, hardNotes=[];
 valid.forEach(i=>{const g=v3ContextGate(i,ctx);hardFail ||= g.hardFail;hardNotes.push(...g.notes);});
 if(hardFail) return {score:0,hardFail:true,reasons:[...new Set(hardNotes)]};

 const top=valid.find(x=>x.category==='top');
 const bottom=valid.find(x=>x.category==='bottom');
 const shoe=valid.find(x=>x.category==='shoe');

 const c=v3ColorScore(valid);
 const si=v3SilhouetteScore(top,bottom,ctx);
 const oc=v3OccasionScore(valid,ctx);
 const se=v3SeasonScore(valid,ctx);
 const sh=v3ShoeTrouserScore(shoe,bottom);
 const fo=v3FormalityScore(valid);
 const ec=v3EchoScore(valid);
 const vb=v3VisualBalance(valid);

 const score=c.score+si.score+oc.score+se.score+sh.score+fo.score+ec.score+vb.score;
 const reasons=[...c.notes,...si.notes,...sh.notes,...ec.notes,...vb.notes];
 return {
  score:Math.max(0,Math.min(100,score)), hardFail:false,
  breakdown:{color:c.score,silhouette:si.score,occasion:oc.score,season:se.score,shoeTrouser:sh.score,formality:fo.score,echo:ec.score,visual:vb.score},
  reasons:[...new Set(reasons)].slice(0,5)
 };
}
function v3RankLabel(i){ return i===0?'بهترین انتخاب':i===1?'انتخاب دوم':'انتخاب سوم'; }
function v3WhyText(result,next){
 let txt=result.reasons.slice(0,3).join('؛ ');
 if(next && result.score>next.score) txt += `؛ ${result.score-next.score} امتیاز بالاتر از گزینه بعدی`;
 return txt || 'ترکیب متعادل و سازگار با شرایط انتخابی';
}
