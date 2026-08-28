
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
 let parts=[`هارمونی بصری ${t.harmony}/100`,`کفش/شلوار ${t.shoeTrouser}/100`,`تکرار هوشمند رنگ ${t.echo}/100`,`فرم کلی لباس ${t.silhouette}/100`];
 if(next&&c.total===next.total){
   const keys=[['harmony','هارمونی بصری'],['shoeTrouser','تناسب کفش و شلوار'],['echo','تکرار هوشمند رنگ'],['silhouette','فرم کلی لباس']];
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
      audit:result.audit,
      reasons:result.reasons,
      audit:result.audit,
      colorStrategy:result.colorStrategy,
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
    audit:c.audit,
    colorStrategy:c.colorStrategy,
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
        <div><div class="score">${c.score}/100</div><div class="score-detail">STYLE SCORE</div><div class="score-detail">استراتژی رنگی: ${c.colorStrategy||"—"}</div></div>
      </div>

      <div class="v31-breakdown">
        <span>رنگ ${b.color}/25</span>
        <span>فرم کلی لباس ${b.silhouette}/20</span>
        <span>موقعیت ${b.occasion}/15</span>
        <span>هوا ${b.season}/15</span>
        <span>کفش/شلوار ${b.shoeTrouser}/10</span>
        <span>رسمیت ${b.formality}/5</span>
        <span>تکرار هوشمند رنگ ${b.echo}/5</span>
        <span>تعادل بصری ${b.visual}/5</span>
      </div>

      <div class="v31-why"><strong>چرا این رتبه؟</strong><br>${v31Why(c,unique[idx+1])}</div>${v321AllAuditCard(c)}${v33ImproveCard(c,occasion,weather)}
      <div class="outfit-items">${c.items.map(itemCard).join('')}</div>
      <div class="outfit-actions-v36">
        <button class="secondary chatgpt-tryon-btn" onclick="prepareChatgptTryon(${idx})">پرو در ChatGPT</button>
        <button class="primary save-outfit-btn" onclick="saveSuggestedOutfit(${idx})">ذخیره در ست‌های من</button>
      </div>
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
    warmthLevel: document.getElementById('warmthLevel')?.value || 'medium',
    layerRole: document.getElementById('layerRole')?.value || 'standalone',
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
  if(!top||!bottom) return {score:13,reasons:['اطلاعات فرم بالاتنه یا پایین‌تنه کامل نیست']};
  const norm=x=>{
    x=String(x||'Regular').toLowerCase();
    if(x.includes('oversize'))return 'oversized';
    if(x.includes('relax')||x.includes('loose')||x.includes('baggy'))return 'relaxed';
    if(x.includes('slim')||x.includes('skinny'))return 'slim';
    return 'regular';
  };
  const a=norm(top.fit), b=norm(bottom.fit);
  const ctx=String(occasion||'casual').toLowerCase();
  const matrices={
    casual:{
      'regular|regular':[18,'فرم مرتب و کم‌ریسک برای استایل روزمره'],
      'regular|relaxed':[19,'بالاتنه مرتب و پایین‌تنه آزاد، اختلاف حجم کنترل‌شده و مدرن ایجاد کرده'],
      'relaxed|regular':[18,'حجم آزاد بالاتنه با پایین‌تنه کنترل‌شده تعادل خوبی ساخته'],
      'relaxed|relaxed':[17,'فرم آزاد در هر دو بخش برای کژوال قابل‌قبول است؛ بهتر است حجم‌ها اغراق‌آمیز نباشند'],
      'slim|relaxed':[16,'کنتراست حجم زیاد است اما در کژوال می‌تواند عمدی و قابل‌قبول باشد'],
      'oversized|regular':[17,'بالاتنه اورسایز با پایین‌تنه کنترل‌شده یک فرم کلی لباس مدرن می‌سازد'],
      'oversized|relaxed':[16,'حجم کلی زیاد است و به کفش و قد لباس وابستگی بیشتری دارد']
    },
    smart:{
      'regular|regular':[20,'فرم تمیز و کنترل‌شده برای اسمارت‌کژوال بسیار مناسب است'],
      'regular|relaxed':[18,'Relaxed کنترل‌شده در پایین با بالاتنه Regular می‌تواند اسمارت‌کژوال مدرن بسازد'],
      'relaxed|regular':[18,'بالاتنه Relaxed کنترل‌شده با پایین‌تنه مرتب قابل‌قبول است'],
      'relaxed|relaxed':[15,'حجم آزاد در هر دو بخش از رسمیت اسمارت‌کژوال کم می‌کند'],
      'slim|regular':[18,'فرم جمع‌وجور و مرتب با اسمارت‌کژوال سازگار است']
    },
    formal:{
      'regular|regular':[20,'فرم کنترل‌شده و متوازن با موقعیت رسمی هماهنگ است'],
      'regular|relaxed':[14,'پایین‌تنه Relaxed برای موقعیت رسمی معمولاً بیش از حد آزاد است'],
      'relaxed|regular':[14,'بالاتنه Relaxed از ساختار رسمی ست کم می‌کند'],
      'relaxed|relaxed':[11,'حجم آزاد در هر دو بخش با رسمیت کلاسیک هم‌خوانی کمی دارد']
    },
    sport:{
      'regular|relaxed':[18,'ترکیب Regular و Relaxed برای استایل اسپرت آزادی حرکت و تعادل خوبی دارد'],
      'relaxed|relaxed':[20,'فرم آزاد در استایل اسپرت طبیعی و هماهنگ است'],
      'relaxed|regular':[18,'حجم آزاد بالا و پایین‌تنه کنترل‌شده برای اسپرت مناسب است'],
      'regular|regular':[17,'فرم Regular در اسپرت مرتب و کاربردی است']
    }
  };
  let group='casual';
  if(ctx.includes('smart')||ctx.includes('اسمارت'))group='smart';
  else if(ctx.includes('formal')||ctx.includes('رسم'))group='formal';
  else if(ctx.includes('sport')||ctx.includes('اسپرت'))group='sport';
  const key=a+'|'+b;
  let hit=matrices[group][key];
  if(!hit){
    const diff={slim:0,regular:1,relaxed:2,oversized:3};
    const d=Math.abs(diff[a]-diff[b]);
    const score=d<=1?17:(d===2?14:12);
    hit=[score,d<=1?'اختلاف حجم بالاتنه و پایین‌تنه کنترل‌شده است':'اختلاف حجم بالاتنه و پایین‌تنه زیاد است و به استایل هدف وابستگی بیشتری دارد'];
  }
  return {score:hit[0],reasons:[hit[1],`ترکیب فرم: ${a} بالا + ${b} پایین؛ ارزیابی متناسب با موقعیت انجام شده`]};
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
  let score=2,reason='تکرار هوشمند رنگ کم است؛ انسجام بیشتر از کنتراست می‌آید';
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
  if(gate.fail) return {hardFail:true,score:0,breakdown:{},reasons:gate.reasons,audit:{}};

  const top=items.find(i=>i.category==='top');
  const bottom=items.find(i=>i.category==='bottom');
  const shoe=items.find(i=>i.category==='shoe');

  const color=v31Color(items);
  const silhouette=v31Silhouette(top,bottom,occasion);
  const occ=v31Occasion(items,occasion);
  const weatherAudit=v32ThermalAudit(items,weather);
  if(weatherAudit.hardFail) return {hardFail:true,score:0,breakdown:{},reasons:weatherAudit.lines,audit:{weather:weatherAudit}};
  const shoeAudit=v32ShoeTrouserAudit(shoe,bottom);
  const formalityAudit=v32FormalityAudit(items,occasion);
  const echo=v31Echo(items);
  const visualAudit=v32VisualAudit(items);

  const score=color.score+silhouette.score+occ.score+weatherAudit.score+shoeAudit.score+formalityAudit.score+echo.score+visualAudit.score;
  const reasons=[...color.reasons,...silhouette.reasons,...shoeAudit.lines,...echo.reasons,...visualAudit.lines];

  return {
    hardFail:false,
    score:Math.max(0,Math.min(100,score)),
    breakdown:{
      color:color.score,
      silhouette:silhouette.score,
      occasion:occ.score,
      season:weatherAudit.score,
      shoeTrouser:shoeAudit.score,
      formality:formalityAudit.score,
      echo:echo.score,
      visual:visualAudit.score
    },
    audit:{
      weather:weatherAudit,
      formality:formalityAudit,
      shoeTrouser:shoeAudit,
      visual:visualAudit
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
      ['silhouette','فرم کلی لباس'],['echo','تکرار هوشمند رنگ'],['formality','رسمیت']
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



// ===== WARDROBE V3.2 — Thermal Layering + Auditable Scoring =====
function warmthFa(v){
  return ({light:'سبک',medium:'متوسط',warm:'گرم'})[v]||'متوسط';
}
function layerRoleFa(v){
  return ({base:'لایه پایه',mid:'لایه میانی',outer:'لایه بیرونی',standalone:'مستقل'})[v]||'مستقل';
}
function v32Warmth(item){
  const v=item?.details?.warmthLevel || item?.warmthLevel || 'medium';
  return v;
}
function v32LayerRole(item){
  return item?.details?.layerRole || item?.layerRole || 'standalone';
}
function v32HasOuter(items){
  return items.some(i=>i.category==='outer' || v32LayerRole(i)==='outer');
}
function v32ThermalAudit(items, weather){
  let score=15;
  const lines=[];
  if(weather==='all'){
    return {score:15, lines:['✓ هوا محدودکننده نیست: +15/15'], hardFail:false};
  }

  const hasOuter=v32HasOuter(items);

  if(weather==='hot'){
    for(const i of items){
      const w=v32Warmth(i);
      const role=v32LayerRole(i);
      if(w==='warm'){
        return {score:0, lines:[`✗ ${i.name||'این لباس'} برای هوای گرم بیش از حد گرم است`], hardFail:true};
      }
      if(w==='medium' && role!=='base'){
        score-=2;
        lines.push(`△ ${i.name||'لباس'} گرمادهی متوسط دارد: −2`);
      }
    }
    if(score===15) lines.push('✓ همه اجزا برای هوای گرم مناسب‌اند: +15/15');
  }

  if(weather==='mild'){
    for(const i of items){
      const w=v32Warmth(i);
      if(w==='warm'){
        score-=2;
        lines.push(`△ ${i.name||'لباس'} برای هوای معتدل کمی گرم است: −2`);
      }
      if(w==='light'){
        score-=1;
        lines.push(`△ ${i.name||'لباس'} کمی سبک است: −1`);
      }
    }
    if(score===15) lines.push('✓ گرمادهی اجزا برای هوای معتدل مناسب است: +15/15');
  }

  if(weather==='cold'){
    for(const i of items){
      const w=v32Warmth(i);
      const role=v32LayerRole(i);

      if(role==='mid' && !hasOuter){
        score-=4;
        lines.push(`△ ${i.name||'لایه میانی'} در هوای سرد بدون رویه است: −4`);
      }
      if(role==='standalone' && w==='medium' && !hasOuter){
        score-=3;
        lines.push(`△ ${i.name||'لباس'} گرمادهی متوسط دارد و رویه ندارد: −3`);
      }
      if(w==='light' && !hasOuter){
        score-=4;
        lines.push(`△ ${i.name||'لباس'} برای سرما سبک است: −4`);
      }
    }
    if(hasOuter){
      lines.push('✓ رویه مناسب برای هوای سرد در ست وجود دارد');
    } else if(score===15){
      lines.push('✓ اجزای ست به‌تنهایی برای هوای سرد کافی‌اند');
    }
  }

  return {score:Math.max(0,Math.min(15,score)), lines, hardFail:false};
}

function v32FormalityAudit(items, occasion){
  const target=targetFormality(occasion);
  const vals=items.map(i=>({name:i.name||'آیتم', val:Number(i.formality||2)})).filter(x=>Number.isFinite(x.val));
  if(!vals.length) return {score:3,lines:['△ اطلاعات رسمیت کافی نیست: 3/5']};

  const avg=vals.reduce((a,b)=>a+b.val,0)/vals.length;
  const delta=Math.abs(avg-target);
  let score=5;
  const lines=[];

  if(delta<0.5){ lines.push('✓ میانگین رسمیت ست با موقعیت هماهنگ است: +5/5'); }
  else if(delta<1.0){ score=4; lines.push('△ سطح رسمیت کمی با موقعیت فاصله دارد: −1'); }
  else if(delta<2.0){ score=3; lines.push('△ سطح رسمیت ست noticeably متفاوت است: −2'); }
  else { score=2; lines.push('△ اختلاف رسمیت زیاد است: −3'); }

  const spread=Math.max(...vals.map(x=>x.val))-Math.min(...vals.map(x=>x.val));
  if(spread>=3 && score>1){
    score-=1;
    const casual=vals.slice().sort((a,b)=>a.val-b.val)[0];
    lines.push(`△ ${casual.name} نسبت به بقیه اجزا کژوال‌تر است: −1`);
  }
  return {score:Math.max(1,score),lines};
}

function v32ShoeTrouserAudit(shoe,bottom){
  if(!shoe||!bottom) return {score:6,lines:['△ کفش یا شلوار برای ارزیابی کامل موجود نیست: 6/10']};

  let score=6;
  const lines=[];
  const styles=v31Styles(shoe).map(x=>String(x).toLowerCase());
  const bf=String(bottom.fit||'Regular').toLowerCase();
  const chunky=styles.some(x=>x.includes('چانکی')||x.includes('chunk')||x.includes('بسکت')||x.includes('basket'));
  const clean=styles.some(x=>x.includes('مینیمال')||x.includes('minimal')||x.includes('کلاسیک')||x.includes('classic')||x.includes('رترو')||x.includes('retro'));

  if(v31Loose(bf)&&chunky){ score+=2; lines.push('✓ حجم کفش با شلوار آزاد هماهنگ است: +2'); }
  else if(v31Loose(bf)&&clean){ score+=2; lines.push('✓ فرم تمیز کفش با Relaxed Fit تعادل خوبی دارد: +2'); }
  else if(v31Slim(bf)&&chunky){ score-=2; lines.push('△ کفش برای شلوار باریک کمی حجیم است: −2'); }
  else { score+=1; lines.push('✓ فرم کلی کفش و شلوار سازگار است: +1'); }

  if(v31Family(bottom.color)==='blue' && v31Family(shoe.color)==='blue'){
    score+=1; lines.push('✓ کفش و جین پل تونال آبی ساخته‌اند: +1');
  } else if(v31Family(bottom.color)==='blue' && shoe.color==='white'){
    score+=1; lines.push('✓ کفش سفید با جین کنتراست کلاسیک ساخته: +1');
  }

  if(v31Loose(bf) && (shoe.details?.ankleHeight==='low' || shoe.ankleHeight==='low')){
    score+=1; lines.push('✓ ساق کوتاه اجازه می‌دهد خط شلوار آزاد طبیعی بماند: +1');
  }

  return {score:Math.max(0,Math.min(10,score)),lines};
}

function v32VisualAudit(items){
  const top=items.find(i=>i.category==='top');
  const bottom=items.find(i=>i.category==='bottom');
  const shoe=items.find(i=>i.category==='shoe');
  const lines=[];
  let score=5;

  const tones=items.map(i=>v31Tone(i.color));
  if(new Set(tones).size>=2){
    lines.push('✓ توزیع روشن/تیره در ست متعادل است: +5/5');
  }else{
    score=4;
    lines.push('△ ست کاملاً تونال است و کنتراست کمتری دارد: −1');
  }

  if(top?.color==='black' && shoe?.color==='black' && ['denim_blue','light_blue','blue'].includes(bottom?.color)){
    score=Math.min(score,3);
    lines.push('△ دو جرم تیره بالا و پایین، جین روشن را محصور کرده‌اند: −2');
  }
  return {score,lines};
}

function v32WhyCard(result){
  const a=result.audit||{};
  const rows=[
    ['هوا',a.weather],
    ['رسمیت',a.formality],
    ['کفش/شلوار',a.shoeTrouser],
    ['تعادل بصری',a.visual]
  ].filter(x=>x[1]?.lines?.length);

  return rows.map(([title,obj])=>`
    <details class="audit-detail">
      <summary>${title} — ${obj.score}/${title==='هوا'?15:title==='رسمیت'?5:title==='کفش/شلوار'?10:5}</summary>
      <div class="audit-lines">${obj.lines.map(x=>`<div>${x}</div>`).join('')}</div>
    </details>
  `).join('');
}


// ===== V3.5: category-aware thermal logic + all 8 auditable criteria =====
function v321PenaltyAudit(maxScore, penalties, positives=[]){
  const totalPenalty = penalties.reduce((s,p)=>s+Math.max(0,p.points||0),0);
  const score = Math.max(0, maxScore-totalPenalty);
  const lines = [
    `امتیاز پایه: ${maxScore}/${maxScore}`,
    ...positives.map(t=>`✓ ${t}`),
    ...penalties.map(p=>`− ${p.points} | ${p.text}`),
    `نتیجه: ${maxScore}${totalPenalty?` − ${totalPenalty}`:''} = ${score}/${maxScore}`
  ];
  return {score, lines};
}
function v321WeatherAudit(items, weather){
  const penalties=[], positives=[];
  if(weather==='all') return v321PenaltyAudit(15,[],['محدودیت آب‌وهوایی انتخاب نشده است']);

  const top=items.find(i=>i.category==='top');
  const outer=items.find(i=>i.category==='outer' || v32LayerRole(i)==='outer');
  const bottom=items.find(i=>i.category==='bottom');
  const shoe=items.find(i=>i.category==='shoe');

  // Layering belongs to upper-body garments only.
  if(top){
    const w=v32Warmth(top), role=v32LayerRole(top);
    if(weather==='cold'){
      if((role==='mid' || (role==='standalone' && w==='medium')) && !outer)
        penalties.push({points:3,text:`${top.name||'بالاتنه'} در سرما به لایه بیرونی نیاز دارد`});
      else positives.push(`${top.name||'بالاتنه'} از نظر گرمادهی مناسب است`);
    } else if(weather==='mild'){
      if(w==='warm') penalties.push({points:2,text:`${top.name||'بالاتنه'} برای هوای معتدل کمی گرم است`});
      else positives.push(`${top.name||'بالاتنه'} برای هوای معتدل مناسب است`);
    } else if(weather==='hot'){
      if(w==='warm') penalties.push({points:8,text:`${top.name||'بالاتنه'} برای هوای گرم بیش از حد گرم است`});
      else if(w==='medium') penalties.push({points:3,text:`${top.name||'بالاتنه'} برای هوای گرم نسبتاً گرم است`});
      else positives.push(`${top.name||'بالاتنه'} برای هوای گرم مناسب است`);
    }
  }
  if(bottom){
    // no "outer layer" concept for trousers
    if(weather==='cold' && v32Warmth(bottom)==='light')
      penalties.push({points:2,text:`${bottom.name||'شلوار'} برای هوای سرد سبک است`});
    else positives.push(`${bottom.name||'شلوار'} از نظر پوشش پا با هوا سازگار است`);
  }
  if(shoe){
    // footwear evaluated independently: warmth/material/coverage, never layering
    const ankle=shoe.details?.ankleHeight||shoe.ankleHeight||'low';
    const mat=String(shoe.material||shoe.details?.material||'').toLowerCase();
    if(weather==='cold' && ankle==='low' && (mat.includes('mesh')||mat.includes('مش')))
      penalties.push({points:2,text:`${shoe.name||'کفش'} ساق کوتاه و رویه مش دارد و برای سرما ضعیف‌تر است`});
    else positives.push(`${shoe.name||'کفش'} از نظر پوشش و جنس با هوا قابل استفاده است`);
  }
  return v321PenaltyAudit(15,penalties,positives);
}
function v321SimpleAudit(title,max,score,goodText){
  const penalty=Math.max(0,max-score);
  return v321PenaltyAudit(max, penalty?[{points:penalty,text:goodText}]:[], penalty?[]:[goodText]);
}
const _v31Evaluate321 = v31Evaluate;
v31Evaluate = function(items,occasion,weather){
  const r=_v31Evaluate321(items,occasion,weather);
  if(r.hardFail) return r;

  const oldWeather=r.breakdown.season||0;
  const weatherAudit=v321WeatherAudit(items,weather);
  r.score = Math.max(0,Math.min(100,r.score-oldWeather+weatherAudit.score));
  r.breakdown.season=weatherAudit.score;

  r.audit=r.audit||{};
  r.audit.color=v321SimpleAudit('رنگ',25,r.breakdown.color,
    r.breakdown.color===25?'خانواده‌های رنگی و کنتراست ست هماهنگ‌اند':'هماهنگی رنگی به امتیاز کامل نرسیده است');
  r.audit.silhouette=v321SimpleAudit('فرم کلی لباس',20,r.breakdown.silhouette,
    r.breakdown.silhouette===20?'تناسب حجم و فرم بالاتنه، پایین‌تنه و کفش متعادل است':'تناسب فرم و حجم اجزای ست کامل نیست');
  r.audit.occasion=v321SimpleAudit('موقعیت',15,r.breakdown.occasion,
    r.breakdown.occasion===15?'سطح استایل اجزا با موقعیت انتخابی کاملاً هماهنگ است':'بعضی اجزا با موقعیت انتخابی فاصله دارند');
  r.audit.weather=weatherAudit;
  r.audit.shoeTrouser=v321SimpleAudit('کفش/شلوار',10,r.breakdown.shoeTrouser,
    r.breakdown.shoeTrouser===10?'حجم، فرم و ارتباط کفش با شلوار مناسب است':'رابطه فرم/حجم کفش و شلوار به امتیاز کامل نرسیده است');
  r.audit.formality=v321SimpleAudit('رسمیت',5,r.breakdown.formality,
    r.breakdown.formality===5?'سطح رسمیت ست با موقعیت هماهنگ است':'سطح رسمیت کمی با موقعیت فاصله دارد');
  r.audit.echo=v321SimpleAudit('تکرار هوشمند رنگ',5,r.breakdown.echo,
    r.breakdown.echo===5?'یک رنگ یا خانواده رنگی به‌صورت کنترل‌شده در ست تکرار شده است':'تکرار رنگی بین اجزا ضعیف‌تر است');
  r.audit.visual=v321SimpleAudit('تعادل بصری',5,r.breakdown.visual,
    r.breakdown.visual===5?'وزن بصری روشن/تیره و توزیع رنگ متعادل است':'توزیع وزن بصری ست کاملاً متعادل نیست');
  return r;
};
function v321AllAuditCard(result){
 const a=result.audit||{};
 const defs=[
  ['رنگ',a.color,25],['فرم کلی لباس',a.silhouette,20],['موقعیت',a.occasion,15],['هوا',a.weather,15],
  ['کفش/شلوار',a.shoeTrouser,10],['رسمیت',a.formality,5],['تکرار هوشمند رنگ',a.echo,5],['تعادل بصری',a.visual,5]
 ];
 return defs.filter(x=>x[1]).map(([title,o,max])=>`
  <details class="audit-detail">
   <summary>${title} — ${o.score}/${max}</summary>
   <div class="audit-lines">${o.lines.map(x=>`<div>${x}</div>`).join('')}</div>
  </details>`).join('');
}

function v321ToggleThermalFields(){
 const cat=document.getElementById('category')?.value;
 const box=document.getElementById('thermalLayerFields');
 if(!box) return;
 box.style.display=(cat==='top'||cat==='outer')?'grid':'none';
}
document.getElementById('category')?.addEventListener('change',v321ToggleThermalFields);
setTimeout(v321ToggleThermalFields,0);


// ===== V3.5 — «چطور این ست بهتر می‌شود؟» =====
function v33ColorName(c){
 const m={black:'مشکی',white:'سفید',charcoal:'زغالی',navy:'سرمه‌ای',denim_blue:'جین آبی',blue:'آبی',
 light_blue:'آبی روشن',gray:'طوسی',gray_light:'طوسی روشن',cream:'کرم',beige:'بژ',camel:'شتری',
 brown:'قهوه‌ای',olive:'زیتونی',jade:'یشمی',burgundy:'زرشکی'};
 return m[c]||c||'نامشخص';
}
function v33CloneWithColor(item,color){return {...item,color};}
function v33ImprovementIdeas(combo,occasion,weather){
 const base=combo.score;
 const items=combo.items;
 const categories=['top','bottom','shoe'];
 const palette=['black','white','charcoal','navy','denim_blue','light_blue','gray_light','cream','beige','camel','brown','olive','burgundy'];
 const candidates=[];
 for(const cat of categories){
   const original=items.find(i=>i.category===cat);
   if(!original) continue;
   for(const color of palette){
     if(color===original.color) continue;
     const testItems=items.map(i=>i===original?v33CloneWithColor(i,color):i);
     const r=v31Evaluate(testItems,occasion,weather);
     if(r.hardFail) continue;
     const gain=r.score-base;
     if(gain>0){
       candidates.push({cat,from:original.color,to:color,gain,score:r.score,breakdown:r.breakdown});
     }
   }
 }
 candidates.sort((a,b)=>b.gain-a.gain || b.score-a.score);
 const chosen=[],used=new Set();
 for(const c of candidates){
   const key=c.cat+':'+c.to;
   if(used.has(key))continue;
   used.add(key);chosen.push(c);
   if(chosen.length===3)break;
 }
 return chosen;
}
function v33CatFa(c){return ({top:'بالاتنه',bottom:'پایین‌تنه',shoe:'کفش'})[c]||c}
function v33ImproveCard(combo,occasion,weather){
 const ideas=v33ImprovementIdeas(combo,occasion,weather);
 if(combo.score>=99){
   return `<div class="v33-improve"><strong>چطور این ست بهتر می‌شود؟</strong><div>این ست از نظر اطلاعات ثبت‌شده تقریباً به سقف امتیاز رسیده است.</div></div>`;
 }
 if(!ideas.length){
   return `<div class="v33-improve"><strong>چطور این ست بهتر می‌شود؟</strong><div>با تغییر فقط رنگِ بالاتنه، پایین‌تنه یا کفش، امتیاز بالاتری پیدا نشد. برای بهتر شدن این ست باید مدل، فرم، جنس یا نوع یکی از اجزا تغییر کند.</div></div>`;
 }
 return `<div class="v33-improve"><strong>چطور این ست بهتر می‌شود؟</strong>
 ${ideas.map(x=>`<div class="v33-tip">
   <b>${v33CatFa(x.cat)}:</b> ${v33ColorName(x.from)} ← ${v33ColorName(x.to)}
   <span>امتیاز پیش‌بینی‌شده: ${x.score}/100 (${x.gain}+)</span>
 </div>`).join('')}
 <small>این پیشنهادها با ثابت نگه‌داشتن سایر مشخصات لباس و تغییر فقط رنگ محاسبه شده‌اند.</small>
 </div>`;
}


// ===== WARDROBE V3.5 — Context-Aware Color Strategy Engine =====

function v35ColorName(c){
  const m={
    black:'مشکی',white:'سفید',ivory:'شیری',cream:'کرم',beige:'بژ',camel:'شتری',
    gray:'طوسی',gray_light:'طوسی روشن',charcoal:'زغالی',navy:'سرمه‌ای',blue:'آبی',
    light_blue:'آبی روشن',denim_blue:'جین آبی',petrol:'آبی نفتی',brown:'قهوه‌ای',
    brown_dark:'قهوه‌ای تیره',khaki:'خاکی',olive:'زیتونی',jade:'یشمی',
    green:'سبز',burgundy:'زرشکی',red:'قرمز',brick:'آجری',mustard:'خردلی',
    yellow:'زرد',orange:'نارنجی',pink:'صورتی',peach:'گلبهی',purple:'بنفش',lilac:'یاسی'
  };
  return m[c]||c||'نامشخص';
}

function v35IsNeutral(c){
  return ['black','white','ivory','cream','beige','camel','gray','gray_light','charcoal','navy','brown'].includes(c);
}
function v35Lum(c){
  const map={
    black:5,charcoal:18,navy:20,brown_dark:22,burgundy:24,jade:26,olive:30,
    brown:32,petrol:34,blue:45,denim_blue:50,green:48,red:50,purple:45,
    gray:55,khaki:58,brick:58,mustard:62,orange:65,pink:72,light_blue:75,
    camel:70,beige:78,gray_light:80,lilac:82,peach:84,cream:90,ivory:94,white:100
  };
  return map[c] ?? 50;
}
function v35Family(c){
  return v31Family ? v31Family(c) : (colorFamily?.[c] || c || 'other');
}
function v35PairCompat(a,b){
  if(!a||!b) return 0.6;
  if(a===b) return 0.9;
  const fa=v35Family(a), fb=v35Family(b);
  if(fa===fb) return 0.9;
  if(v35IsNeutral(a)||v35IsNeutral(b)) return 0.86;
  const complementary = new Set([
    'blue|orange','orange|blue','red|green','green|red','purple|yellow','yellow|purple'
  ]);
  if(complementary.has(`${fa}|${fb}`)) return 0.82;
  return 0.66;
}

function v35DetectStrategy(items){
  const colors=items.map(i=>i.color).filter(Boolean);
  if(colors.length<2) return 'ساده';
  const families=colors.map(v35Family);
  const lums=colors.map(v35Lum);
  const uniqueFamilies=new Set(families);
  const uniqueColors=new Set(colors);
  const neutralCount=colors.filter(v35IsNeutral).length;
  const range=Math.max(...lums)-Math.min(...lums);

  if(uniqueColors.size===1) return 'تک‌رنگ';
  if(uniqueFamilies.size===1) return 'تونال';
  if(neutralCount===colors.length) return range>=45?'خنثی با کنتراست':'خنثی';
  if(neutralCount>=colors.length-1 && range>=40) return 'خنثی با رنگ تأکیدی';
  if(range>=55) return 'کنتراست روشن/تیره';
  return 'ترکیب چندرنگ کنترل‌شده';
}

function v35ColorAudit(items){
  const max=25;
  let score=max;
  const penalties=[], positives=[];
  const colors=items.map(i=>i.color).filter(Boolean);
  const lums=colors.map(v35Lum);
  const strategy=v35DetectStrategy(items);

  // Base harmony
  const pairScores=[];
  for(let i=0;i<colors.length;i++) for(let j=i+1;j<colors.length;j++){
    pairScores.push(v35PairCompat(colors[i],colors[j]));
  }
  const avg=pairScores.length?pairScores.reduce((a,b)=>a+b,0)/pairScores.length:0.8;
  if(avg<0.72) penalties.push({points:4,text:'هماهنگی پایه بین بعضی رنگ‌ها ضعیف است'});
  else if(avg<0.82) penalties.push({points:2,text:'هماهنگی پایه خوب است اما کامل نیست'});
  else positives.push('هماهنگی پایه رنگ‌ها قوی است');

  // Contrast quality
  const range=lums.length?Math.max(...lums)-Math.min(...lums):0;
  if(range<12 && colors.length>=3){
    penalties.push({points:2,text:'کنتراست روشن/تیره خیلی کم است و ست کمی تخت دیده می‌شود'});
  } else if(range>75 && colors.length>=3){
    // High contrast is not automatically bad; only penalize if there is no balancing neutral/echo
    const neutrals=colors.filter(v35IsNeutral).length;
    if(neutrals===0) penalties.push({points:1,text:'کنتراست بسیار شدید است و عامل خنثی‌کننده کمی دارد'});
    else positives.push('کنتراست شدید با حضور رنگ خنثی کنترل شده است');
  } else positives.push('کنتراست روشن/تیره کنترل‌شده است');

  // Light/dark visual balance
  const dark=colors.filter(c=>v35Lum(c)<35).length;
  const light=colors.filter(c=>v35Lum(c)>75).length;
  if(colors.length>=3 && dark===colors.length){
    penalties.push({points:2,text:'همه اجزا تیره‌اند و وزن بصری ست زیاد شده'});
  } else if(colors.length>=3 && light===colors.length){
    penalties.push({points:1,text:'همه اجزا بسیار روشن‌اند و عمق بصری ست کم شده'});
  } else positives.push('توزیع تیرگی و روشنی متعادل است');

  // Accent-point logic
  if(colors.length>=3){
    const counts={};
    colors.forEach(c=>counts[v35Family(c)]=(counts[v35Family(c)]||0)+1);
    const singletons=Object.values(counts).filter(v=>v===1).length;
    if(strategy.includes('رنگ تأکیدی') || (singletons===1 && new Set(Object.values(counts)).size>1)){
      positives.push('یک نقطه تأکیدی کنترل‌شده در ترکیب وجود دارد');
    }
  }

  // Smart repetition / color echo
  let echo=0;
  for(let i=0;i<colors.length;i++) for(let j=i+1;j<colors.length;j++){
    if(colors[i]===colors[j]) echo=Math.max(echo,2);
    else if(v35Family(colors[i])===v35Family(colors[j])) echo=Math.max(echo,1);
  }
  if(echo===2) positives.push('یک رنگ به‌صورت هوشمند در ست تکرار شده');
  else if(echo===1) positives.push('خانواده رنگی در بیش از یک جزء تکرار شده');
  else if(strategy==='تک‌رنگ'||strategy==='تونال') positives.push('استراتژی تونال خودش انسجام رنگی ایجاد کرده');
  else penalties.push({points:1,text:'تکرار هوشمند رنگ محدود است'});

  const totalPenalty=penalties.reduce((s,p)=>s+p.points,0);
  score=Math.max(0,max-totalPenalty);
  return {score,strategy,penalties,positives};
}

function v35VisualAudit(items){
  const max=5;
  let score=max;
  const penalties=[], positives=[];
  const top=items.find(i=>i.category==='top');
  const bottom=items.find(i=>i.category==='bottom');
  const shoe=items.find(i=>i.category==='shoe');

  if(top&&bottom&&shoe){
    const tl=v35Lum(top.color), bl=v35Lum(bottom.color), sl=v35Lum(shoe.color);

    // White/light sneaker balancing darker top + mid denim
    if(tl<30 && bl>=35 && bl<=65 && sl>85){
      positives.push('کفش روشن، وزن بصری بالاتنه تیره را متعادل کرده');
    }

    // Black shoe + black top around light/medium denim can be heavier
    if(tl<20 && sl<20 && bl>=40){
      penalties.push({points:2,text:'بالا و کفش هر دو بسیار تیره‌اند و پایین‌تنه بین دو جرم تیره قرار گرفته'});
    }

    // Blue/navy shoe with blue denim gives tonal continuity
    if(v35Family(bottom.color)==='blue' && v35Family(shoe.color)==='blue'){
      positives.push('کفش و شلوار پیوستگی تونال ایجاد کرده‌اند');
    }

    // all-white or all-light + black shoe can be purposeful accent, not auto-penalized
    if(tl>85 && bl>75 && sl<20){
      positives.push('کفش تیره به‌عنوان نقطه تأکیدی عمدی در ست روشن عمل کرده');
    }
  }

  const totalPenalty=penalties.reduce((s,p)=>s+p.points,0);
  score=Math.max(0,max-totalPenalty);
  return {score,penalties,positives};
}

function v35ExplainColor(colorAudit){
  const lines=[
    `استراتژی رنگی: ${colorAudit.strategy}`,
    'امتیاز پایه: 25/25',
    ...colorAudit.positives.map(t=>`✓ ${t}`),
    ...colorAudit.penalties.map(p=>`− ${p.points} | ${p.text}`),
    `نتیجه: 25${colorAudit.penalties.length?' − '+colorAudit.penalties.reduce((s,p)=>s+p.points,0):''} = ${colorAudit.score}/25`
  ];
  return {score:colorAudit.score,lines};
}

function v35ExplainVisual(v){
  const total=v.penalties.reduce((s,p)=>s+p.points,0);
  return {
    score:v.score,
    lines:[
      'امتیاز پایه: 5/5',
      ...v.positives.map(t=>`✓ ${t}`),
      ...v.penalties.map(p=>`− ${p.points} | ${p.text}`),
      `نتیجه: 5${total?' − '+total:''} = ${v.score}/5`
    ]
  };
}



const _v31Evaluate35 = v31Evaluate;
v31Evaluate = function(items,occasion,weather){
  const r=_v31Evaluate35(items,occasion,weather);
  if(r.hardFail) return r;

  const oldColor=r.breakdown.color||0;
  const oldVisual=r.breakdown.visual||0;

  const c=v35ColorAudit(items);
  const v=v35VisualAudit(items);

  r.breakdown.color=c.score;
  r.breakdown.visual=v.score;
  r.score=Math.max(0,Math.min(100,r.score-oldColor-oldVisual+c.score+v.score));

  r.audit=r.audit||{};
  r.audit.color=v35ExplainColor(c);
  r.audit.visual=v35ExplainVisual(v);
  r.colorStrategy=c.strategy;

  // expose a plain-language reason for ranking
  r.reasons=[`استراتژی رنگی: ${c.strategy}`,...(r.reasons||[])];
  return r;
};



// ===== V3.8.3 — ChatGPT Try-On Handoff (no API) =====
const DEDICATED_TRYON_CHAT_URL = "https://chatgpt.com/g/g-p-6a910b96e16481919c8bf51cbfcaf84d-wardrobe-virtual-try-on/c/6a910b2c-9bf8-83eb-9102-3d7f4a83f84e";
let preparedTryonBlob = null;
let preparedTryonUrl = null;
let preparedTryonPrompt = '';

function openChatgptTryonModal(){
  document.getElementById('chatgptTryonModal')?.classList.add('show');
}
function closeChatgptTryonModal(e, force=false){
  const modal=document.getElementById('chatgptTryonModal');
  if(force || e?.target===modal) modal?.classList.remove('show');
}
function setTryonStatus(text,kind=''){
  const el=document.getElementById('chatgptTryonStatus');
  if(!el)return;
  el.className='chatgpt-tryon-status '+kind;
  el.textContent=text||'';
}
function getTryonOutfitItems(idx){
  const outfit=window.currentSuggestedOutfits?.[idx];
  if(!outfit)return [];
  const all=loadItems();
  return outfit.itemIds.map(id=>all.find(i=>i.id===id)).filter(Boolean);
}
function loadCanvasImage(src){
  return new Promise((resolve,reject)=>{
    const img=new Image();
    img.onload=()=>resolve(img);
    img.onerror=()=>reject(new Error('یکی از تصاویر لباس خوانده نشد.'));
    img.src=src;
  });
}
function roundedRect(ctx,x,y,w,h,r){
  ctx.beginPath();
  ctx.moveTo(x+r,y);
  ctx.arcTo(x+w,y,x+w,y+h,r);
  ctx.arcTo(x+w,y+h,x,y+h,r);
  ctx.arcTo(x,y+h,x,y,r);
  ctx.arcTo(x,y,x+w,y,r);
  ctx.closePath();
}
function canvasWrap(ctx,text,x,y,maxWidth,lineHeight,maxLines=3){
  const words=String(text||'').split(/\s+/);
  const lines=[]; let line='';
  for(const word of words){
    const test=line?line+' '+word:word;
    if(ctx.measureText(test).width>maxWidth && line){
      lines.push(line); line=word;
      if(lines.length>=maxLines-1)break;
    } else line=test;
  }
  if(line && lines.length<maxLines)lines.push(line);
  lines.forEach((ln,i)=>ctx.fillText(ln,x,y+i*lineHeight));
}
async function buildCompositeSet(items,idx){
  const order={top:1,bottom:2,outer:3,shoe:4,accessory:5};
  const list=[...items].sort((a,b)=>(order[a.category]||9)-(order[b.category]||9)).slice(0,5);
  if(!list.length)throw new Error('ست انتخابی پیدا نشد.');

  const canvas=document.createElement('canvas');
  canvas.width=1200; canvas.height=1350;
  const ctx=canvas.getContext('2d');
  ctx.fillStyle='#101012';ctx.fillRect(0,0,1200,1350);

  ctx.textAlign='right';
  ctx.fillStyle='#D9B56B';
  ctx.font='700 42px Arial,sans-serif';
  ctx.fillText(`WARDROBE — SET ${idx+1}`,1130,72);
  ctx.fillStyle='#F5F2EB';
  ctx.font='700 52px Arial,sans-serif';
  ctx.fillText('ست مرجع برای پرو',1130,135);

  const margin=50,gap=18;
  const cardW=Math.floor((1100-gap*(list.length-1))/list.length);
  const cardY=205,cardH=790;

  for(let n=0;n<list.length;n++){
    const item=list[n],x=margin+n*(cardW+gap);
    ctx.fillStyle='#1C1C20'; roundedRect(ctx,x,cardY,cardW,cardH,22);ctx.fill();

    const ix=x+14,iy=cardY+14,iw=cardW-28,ih=510;
    ctx.fillStyle='#F1F0EC';roundedRect(ctx,ix,iy,iw,ih,16);ctx.fill();

    if(item.photo){
      try{
        const img=await loadCanvasImage(item.photo);
        const scale=Math.min(iw/img.naturalWidth,ih/img.naturalHeight);
        const dw=img.naturalWidth*scale,dh=img.naturalHeight*scale;
        ctx.drawImage(img,ix+(iw-dw)/2,iy+(ih-dh)/2,dw,dh);
      }catch(_e){}
    }

    ctx.fillStyle='#F5F2EB';ctx.font='700 25px Arial,sans-serif';ctx.textAlign='right';
    canvasWrap(ctx,item.name||catFa(item.category),x+cardW-16,cardY+575,cardW-32,32,2);
    ctx.fillStyle='#B7B3AB';ctx.font='21px Arial,sans-serif';
    const meta=[catFa(item.category),colorFa(item.color),item.fit||''].filter(Boolean).join(' • ');
    canvasWrap(ctx,meta,x+cardW-16,cardY+655,cardW-32,29,3);
  }

  ctx.fillStyle='#F5F2EB';ctx.font='700 28px Arial,sans-serif';ctx.textAlign='right';
  ctx.fillText('دستور:',1130,1065);
  ctx.fillStyle='#C4C0B8';ctx.font='23px Arial,sans-serif';
  canvasWrap(ctx,'همین لباس‌ها و کفش را روی مانکن ثابت چت پرو کن؛ چهره و اندام مانکن را تغییر نده.',1130,1110,1060,34,4);

  return await new Promise((resolve,reject)=>
    canvas.toBlob(b=>b?resolve(b):reject(new Error('ساخت تصویر ست ناموفق بود.')),'image/jpeg',0.92)
  );
}
function buildTryonPrompt(items){
  const names=items.map(i=>i.name||catFa(i.category)).join(' + ');
  return `این تصویر، ست پیشنهادی Wardrobe من است: ${names}. همین ست را روی مانکن ثابت همین چت پرو کن. مدل، رنگ، فرم، فیت و جزئیات لباس‌ها و کفش را تا حد ممکن دقیق حفظ کن. چهره، مو، اندام، نسبت‌های بدن، سن ظاهری و ظاهر کلی مانکن ثابت را تغییر نده.`;
}
async function prepareChatgptTryon(idx){
  openChatgptTryonModal();
  setTryonStatus('در حال ساخت تصویر واحد ست…','loading');
  const preview=document.getElementById('chatgptTryonPreview');
  if(preview)preview.innerHTML='<div class="chatgpt-tryon-empty">در حال ساخت تصویر…</div>';
  try{
    const items=getTryonOutfitItems(idx);
    if(!items.length)throw new Error('ست انتخابی پیدا نشد.');
    if(preparedTryonUrl)URL.revokeObjectURL(preparedTryonUrl);
    preparedTryonBlob=await buildCompositeSet(items,idx);
    preparedTryonUrl=URL.createObjectURL(preparedTryonBlob);
    preparedTryonPrompt=buildTryonPrompt(items);
    const promptBox=document.getElementById('preparedTryonPromptText'); if(promptBox) promptBox.value=preparedTryonPrompt;
    if(preview)preview.innerHTML=`<img src="${preparedTryonUrl}" alt="تصویر ست">`;
    setTryonStatus('تصویر ست آماده است.','success');
  }catch(e){
    console.error(e);
    setTryonStatus(String(e?.message||e),'error');
  }
}
function savePreparedSetImage(){
  if(!preparedTryonUrl)return setTryonStatus('اول تصویر ست را آماده کن.','error');
  const a=document.createElement('a');
  a.href=preparedTryonUrl;
  a.download=`wardrobe-set-${Date.now()}.jpg`;
  document.body.appendChild(a);a.click();a.remove();
  setTryonStatus('فایل برای ذخیره آماده شد.','success');
}
async function sharePreparedSetImage(){
  if(!preparedTryonBlob)return setTryonStatus('اول تصویر ست را آماده کن.','error');
  const file=new File([preparedTryonBlob],`wardrobe-set-${Date.now()}.jpg`,{type:'image/jpeg'});
  try{
    if(navigator.share && navigator.canShare?.({files:[file]})){
      await navigator.share({title:'Wardrobe Set',files:[file]});
    } else {
      savePreparedSetImage();
    }
  }catch(e){
    if(e?.name!=='AbortError')setTryonStatus('Share انجام نشد.','error');
  }
}
async function copyPreparedTryonPrompt(){
  const text = preparedTryonPrompt || document.getElementById('preparedTryonPromptText')?.value || '';
  if(!text){
    setTryonStatus('اول ست را آماده کن.','error');
    return false;
  }

  // Keep a visible copy in the textarea so the user can verify it exists.
  const ta=document.getElementById('preparedTryonPromptText');
  if(ta) ta.value=text;

  // Modern Clipboard API first.
  try{
    if(navigator.clipboard?.writeText){
      await navigator.clipboard.writeText(text);
      setTryonStatus('متن پرو کپی شد. داخل ChatGPT فقط Paste کن.','success');
      return true;
    }
  }catch(_e){}

  // iOS/Safari fallback: select a real textarea and execCommand('copy').
  try{
    let temp=ta;
    let created=false;
    if(!temp){
      temp=document.createElement('textarea');
      temp.value=text;
      temp.setAttribute('readonly','');
      temp.style.position='fixed';
      temp.style.opacity='0';
      temp.style.left='-9999px';
      document.body.appendChild(temp);
      created=true;
    }
    temp.removeAttribute('readonly');
    temp.focus();
    temp.select();
    temp.setSelectionRange(0, temp.value.length);
    const ok=document.execCommand('copy');
    temp.setAttribute('readonly','');
    if(created) temp.remove();

    if(ok){
      setTryonStatus('متن پرو کپی شد. داخل ChatGPT فقط Paste کن.','success');
      return true;
    }
  }catch(_e){}

  setTryonStatus('iOS اجازه کپی خودکار نداد. متن پایین نمایش داده شده؛ روی آن نگه دار و Copy بزن.','error');
  return false;
}
async function openDedicatedTryonChat(){
  const ok=await copyPreparedTryonPrompt();
  // Open even if copying is blocked; prompt remains visible in the modal.
  window.location.href=DEDICATED_TRYON_CHAT_URL;
}

