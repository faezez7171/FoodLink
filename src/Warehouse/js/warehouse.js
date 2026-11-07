/* پنل انباردار - Food Link (نسخه ۲)
   صفحات: warehouse · deliveries · inventory · batches · categories
   وابسته به core.js و common-pages.js (باید قبل از این فایل لود شوند) */

navs.warehouse=[
 ['warehouse','▣','درخواست‌های ورودی'],
 ['deliveries','➤','ارسال و تحویل'],
 ['inventory','⇅','ورود و خروج انبار'],
 ['batches','⏱','بچ‌ها و تاریخ انقضا'],
 ['categories','▦','دسته‌بندی کالاها']
];

/* ================= ابزارهای عمومی ================= */
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const fa=n=>Number(n||0).toLocaleString('fa-IR');
const prod=id=>db.products.find(p=>p.id==id);
const ordById=id=>db.orders.find(o=>o.id==id);
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7);
const WH='انبار مرکزی', NEAR=30; /* NEAR: چند روز مانده به انقضا «نزدیک انقضا» حساب شود */
const unitOf=pid=>prod(pid)?.unit||'عدد';
const pill=(txt,cls)=>`<span class="status ${cls||''}">${txt}</span>`;
const stat=(label,val)=>`<div class="stat"><small>${label}</small><h2>${val}</h2></div>`;
function setStatus(o,s,ev){o.status=s;o.events.push(ev||`تغییر وضعیت به «${s}» توسط ${WH}`);}

/* ---------- تاریخ شمسی ↔ میلادی (برای تاریخ انقضا) ---------- */
function j2g(jy,jm,jd){jy+=1595;let days=-355668+(365*jy)+(~~(jy/33))*8+~~(((jy%33)+3)/4)+jd+((jm<7)?(jm-1)*31:((jm-7)*30)+186);let gy=400*~~(days/146097);days%=146097;if(days>36524){gy+=100*~~(--days/36524);days%=36524;if(days>=365)days++;}gy+=4*~~(days/1461);days%=1461;if(days>365){gy+=~~((days-1)/365);days=(days-1)%365;}let gd=days+1;const sal=[0,31,((gy%4==0&&gy%100!=0)||(gy%400==0))?29:28,31,30,31,30,31,31,30,31,30,31];let gm;for(gm=0;gm<13&&gd>sal[gm];gm++)gd-=sal[gm];return [gy,gm,gd];}
const normDigits=s=>String(s).replace(/[۰-۹]/g,d=>'۰۱۲۳۴۵۶۷۸۹'.indexOf(d)).replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d));
const pad=n=>String(n).padStart(2,'0');
function parseJ(s){ /* «۱۴۰۶/۰۵/۱۰» ← «2027-07-30»؛ اگر نامعتبر باشد null */
 const m=normDigits(s).trim().match(/^(\d{4})[\/\-.](\d{1,2})[\/\-.](\d{1,2})$/); if(!m)return null;
 const [y,mo,d]=m.slice(1).map(Number); if(mo<1||mo>12||d<1||d>31)return null;
 const [gy,gm,gd]=j2g(y,mo,d), iso=`${gy}-${pad(gm)}-${pad(gd)}`;
 const p=new Intl.DateTimeFormat('en-u-ca-persian',{year:'numeric',month:'numeric',day:'numeric',timeZone:'UTC'}).formatToParts(new Date(iso+'T12:00:00Z'));
 const g=t=>+p.find(x=>x.type===t).value;
 return (g('year')===y&&g('month')===mo&&g('day')===d)?iso:null; /* بررسی رفت‌وبرگشتی برای رد تاریخ‌های ناممکن */
}
const fmtJ=iso=>iso?new Intl.DateTimeFormat('fa-IR-u-ca-persian').format(new Date(iso+'T12:00:00')):'—';
const todayISO=()=>{const d=new Date();return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`};
const daysLeft=exp=>exp?Math.round((new Date(exp+'T12:00:00')-new Date(todayISO()+'T12:00:00'))/864e5):null;
function expInfo(exp){ /* [متن، کلاس، وضعیت] */
 const d=daysLeft(exp);
 if(d===null)return['بدون تاریخ انقضا','','none'];
 if(d<0)return[`منقضی شده (${fa(-d)} روز پیش)`,'rejected','expired'];
 if(d<=NEAR)return[`نزدیک انقضا (${fa(d)} روز)`,'pending','near'];
 return[`سالم (${fa(d)} روز)`,'done','ok'];
}

/* ================= آماده‌سازی داده‌ها در db ================= */
const DEFAULT_UNITS=['عدد','کارتن عدد','کارتن بسته','بسته','بسته کیلویی','کیلوگرم','لیتر','گونی'];
const byExp=(a,b)=>{const x=a.exp||'9999',y=b.exp||'9999';return x<y?-1:x>y?1:0};
(function initWarehouseData(){
 db.units=db.units||[...DEFAULT_UNITS];
 const defCat=[{name:'روغن و چاشنی',unit:'کارتن عدد'},{name:'کنسرو و رب',unit:'کارتن عدد'},{name:'غلات و برنج',unit:'گونی'},{name:'قند و چای',unit:'بسته کیلویی'}];
 db.categories=(db.categories&&db.categories.length?db.categories:defCat).map(x=>typeof x==='string'?{name:x,unit:'عدد'}:x); /* مهاجرت از نسخه قبل */
 const dc={1:'روغن و چاشنی',2:'کنسرو و رب',3:'غلات و برنج',4:'قند و چای',5:'قند و چای',6:'غلات و برنج'};
 const du={1:'کارتن عدد',2:'کارتن عدد',3:'گونی',4:'بسته کیلویی',5:'بسته',6:'کارتن بسته'};
 const dp={1:12,2:24,6:20};
 db.products.forEach(p=>{
  if(!p.cat||!db.categories.some(c=>c.name===p.cat))p.cat=dc[p.id]||db.categories[0].name;
  if(p.min==null)p.min=30;
  if(!p.unit)p.unit=du[p.id]||db.categories.find(c=>c.name===p.cat)?.unit||'عدد';
  if(p.pack==null)p.pack=dp[p.id]||1;
  if(!db.units.includes(p.unit))db.units.push(p.unit);
 });
 db.categories.forEach(c=>{if(!db.units.includes(c.unit))db.units.push(c.unit)});
 db.stockLog=db.stockLog||[]; db.dispatches=db.dispatches||[]; db.batches=db.batches||[];
 db.drivers=db.drivers||['حسین کرمی','محمد احمدی','رضا نوری'];
 db.distributors=db.distributors||['سعید فتحی','مهدی صادقی','امیر حیدری'];
 sync();save();
})();

/* موجودی هر کالا (p.stock) همیشه باید با جمع بچ‌ها برابر باشد؛ هر مغایرتی (مثلاً ویرایش موجودی در پنل دیگر) اینجا اصلاح می‌شود */
function sync(){
 db.products.forEach(p=>{
  const sum=db.batches.filter(b=>b.pid==p.id).reduce((a,b)=>a+b.qty,0), diff=p.stock-sum;
  if(diff>0){const b=db.batches.find(x=>x.pid==p.id&&x.no==='اولیه');b?b.qty+=diff:db.batches.push({id:uid(),pid:p.id,no:'اولیه',qty:diff,exp:null,date:fmtDate()});}
  else if(diff<0){let rem=-diff;db.batches.filter(b=>b.pid==p.id&&b.qty>0).sort(byExp).reverse().forEach(b=>{const t=Math.min(b.qty,rem);b.qty-=t;rem-=t});}
 });
 db.batches=db.batches.filter(b=>b.qty>0);
}
const avail=pid=>db.batches.filter(b=>b.pid==pid&&!(daysLeft(b.exp)<0)).reduce((a,b)=>a+b.qty,0); /* موجودی قابل فروش (بدون منقضی‌ها) */
const enough=o=>o.items.every(x=>avail(x.product)>=x.qty);
const itemsText=o=>o.items.map(x=>`${esc(prod(x.product)?.name)} × ${fa(x.qty)} ${esc(unitOf(x.product))}`).join('، ');
const nextBatchNo=()=>{db.batchSeq=(db.batchSeq||0)+1;return 'B'+String(db.batchSeq).padStart(4,'0')};

/* ---------- انواع حرکت ---------- */
/* [عنوان، علامت (+ورود / −خروج)، برچسب فیلد شرح] */
const MV={
 purchase:['ورود - خرید از تأمین‌کننده',1,'نام شرکت تأمین‌کننده / شماره فاکتور خرید'],
 customer_return:['ورود - مرجوعی از مشتری',1,'نام مشتری / شماره فاکتور'],
 adjust_in:['ورود - اضافی انبارگردانی',1,'توضیح مغایرت'],
 invoice:['خروج - فاکتور',-1,''],
 return_supplier:['خروج - مرجوع به شرکت فروشنده',-1,'نام شرکت فروشنده و علت مرجوعی'],
 return_factory:['خروج - مرجوع به کارخانه',-1,'نام کارخانه و علت مرجوعی'],
 spoiled:['خروج - فاسدشدگی',-1,'علت فساد (انقضا، خرابی یخچال، ...)'],
 discard:['خروج - دورریز / ضایعات',-1,'علت دورریز (شکستگی، آسیب‌دیدگی، ...)'],
 adjust_out:['خروج - کسری انبارگردانی',-1,'توضیح مغایرت']
};
const mvClass=t=>MV[t][1]>0?(t==='adjust_in'?'pending':'done'):(t==='invoice'?'shipping':(t==='spoiled'||t==='discard'?'rejected':'pending'));

/* ثبت حرکت: ورودی ← ساخت یا افزودن به بچ · خروجی ← برداشت از بچ مشخص یا خودکار با روش FEFO (نزدیک‌ترین انقضا اول)
   o: {batchNo, exp, batchId, sellable, order, driver, dist} */
function logMove(type,pid,qty,ref,doc,o={}){
 const p=prod(pid), sign=MV[type][1], used=[];
 if(sign>0){
  const no=o.batchNo||nextBatchNo(), exp=o.exp||null;
  const b=db.batches.find(x=>x.pid==pid&&x.no===no&&(x.exp||null)===exp);
  b?b.qty+=qty:db.batches.push({id:uid(),pid:+pid,no,qty,exp,date:fmtDate()});
  used.push({no,exp,q:qty});
 }else{
  let rem=qty;
  const src=o.batchId?db.batches.filter(b=>b.id===o.batchId)
   :db.batches.filter(b=>b.pid==pid&&b.qty>0&&!(o.sellable&&daysLeft(b.exp)<0)).sort(byExp); /* در فروش، بچ منقضی برداشته نمی‌شود */
  src.forEach(b=>{if(rem<=0)return;const t=Math.min(b.qty,rem);b.qty-=t;rem-=t;used.push({no:b.no,exp:b.exp,q:t})});
  if(rem>0)throw new Error('موجودی کافی نیست');
 }
 p.stock+=sign*qty;
 used.forEach(x=>db.stockLog.unshift({id:uid(),date:fmtDate(),iso:todayISO(),type,pid:+pid,qty:sign*x.q,batchNo:x.no,exp:x.exp,ref:ref||'',doc:doc||'ثبت دستی',order:o.order||null,driver:o.driver||'',dist:o.dist||'',by:WH}));
 db.batches=db.batches.filter(b=>b.qty>0);
}

/* ================= چاپ ================= */
function printHTML(title,body){
 const w=window.open('','_blank');
 if(!w)return alert('اجازه‌ی باز شدن پنجره (پاپ‌آپ) را برای چاپ بدهید.');
 w.document.write(`<!doctype html><html lang="fa" dir="rtl"><head><meta charset="utf-8"><title>${esc(title)}</title>
<link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;700&display=swap" rel="stylesheet">
<style>@page{size:A4;margin:12mm}*{box-sizing:border-box}body{font-family:Vazirmatn,Tahoma,sans-serif;font-size:12px;color:#111;margin:0}
.pg{page-break-after:always;padding:4px}.pg:last-child{page-break-after:auto}
.hd{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #111;padding-bottom:8px;margin-bottom:10px}
.hd h1{font-size:18px;margin:0 0 4px}.meta{display:flex;flex-wrap:wrap;gap:6px 22px;margin:8px 0 12px}
table{width:100%;border-collapse:collapse;margin:6px 0}th,td{border:1px solid #444;padding:6px 7px;text-align:right}th{background:#eee}
.tot{text-align:left;font-size:14px;font-weight:700;margin:8px 0}.sig{display:flex;gap:16px;margin-top:38px}.sig div{flex:1;border-top:1px solid #444;padding-top:6px;text-align:center}
.sm{font-size:10px;color:#444}</style></head><body>${body}</body></html>`);
 w.document.close();
 setTimeout(()=>{w.focus();w.print()},600);
}
const orderBatchText=(o,pid,d)=>db.stockLog.filter(e=>e.type==='invoice'&&e.order===o.id&&e.pid==pid&&(!d||e.doc==='خروجی '+d.id))
 .map(e=>`${esc(e.batchNo||'—')}${e.exp?` (انقضا ${fmtJ(e.exp)})`:''}`).join('، ')||'—';
const dispHead=(d,title,extra='')=>`<div class="hd"><div><h1>Food Link</h1>${title}</div><div>خروجی شماره ${fa(d.id)}<br>تاریخ: ${esc(d.date)}${extra}</div></div>
 <div class="meta"><span>راننده: <b>${esc(d.driver)}</b></span><span>مأمور پخش: <b>${esc(d.distributor)}</b></span>${d.veh?`<span>خودرو: <b>${esc(d.veh)}</b></span>`:''}</div>`;
const sigs=(a,b,c)=>`<div class="sig"><div>${a}</div><div>${b}</div><div>${c}</div></div>`;

function invoiceSection(o,d){
 const rows=o.items.map((x,i)=>{const p=prod(x.product)||{};return `<tr><td>${fa(i+1)}</td><td>${esc(p.name)}</td><td>${esc(p.unit||'عدد')}</td><td>${fa(x.qty)}</td><td>${money(p.price)}</td><td>${money((p.price||0)*x.qty)}</td><td class="sm">${orderBatchText(o,x.product,d)}</td></tr>`}).join('');
 return `<section class="pg"><div class="hd"><div><h1>Food Link</h1>فاکتور خروج از انبار</div><div>شماره فاکتور: FL-${o.id}<br>تاریخ: ${esc(o.date)}${d?`<br>خروجی شماره ${fa(d.id)}`:''}</div></div>
 <div class="meta"><span>مشتری: <b>${esc(o.customer)}</b></span><span>ثبت‌کننده: ${esc(o.by)}</span>${d?`<span>راننده: <b>${esc(d.driver)}</b></span><span>مأمور پخش: <b>${esc(d.distributor)}</b></span>${d.veh?`<span>خودرو: <b>${esc(d.veh)}</b></span>`:''}`:''}</div>
 <table><thead><tr><th>ردیف</th><th>نام کالا</th><th>نوع کالا</th><th>تعداد</th><th>قیمت واحد</th><th>جمع</th><th>بچ / انقضا</th></tr></thead><tbody>${rows}</tbody></table>
 <div class="tot">جمع کل فاکتور: ${money(total(o))}</div>${sigs('انباردار','راننده','تحویل‌گیرنده (مهر و امضا)')}</section>`;
}
function printOrder(oid,did){const o=ordById(oid),d=db.dispatches.find(x=>x.id==did);if(o)printHTML('فاکتور FL-'+o.id,invoiceSection(o,d))}

/* چاپ خروجی: mode='product' (بر اساس نام و تعداد کالا) یا 'customer' (بر اساس نام مشتری) */
function printDispatch(did,mode){
 const d=db.dispatches.find(x=>x.id==did); if(!d)return;
 const list=d.orders.map(ordById).filter(Boolean), sum=list.reduce((a,o)=>a+total(o),0);
 if(mode==='customer'){
  list.sort((a,b)=>a.customer.localeCompare(b.customer,'fa'));
  const cover=`<section class="pg">${dispHead(d,'فهرست فاکتورهای خروجی (بر اساس مشتری)')}<table><thead><tr><th>ردیف</th><th>مشتری</th><th>فاکتور</th><th>اقلام</th><th>مبلغ</th></tr></thead><tbody>${
   list.map((o,i)=>`<tr><td>${fa(i+1)}</td><td>${esc(o.customer)}</td><td>FL-${o.id}</td><td>${fa(o.items.length)}</td><td>${money(total(o))}</td></tr>`).join('')}</tbody></table>
   <div class="tot">تعداد فاکتور: ${fa(list.length)} · جمع مبلغ خروجی: ${money(sum)}</div>${sigs('انباردار','راننده','مأمور پخش')}</section>`;
  return printHTML('خروجی '+d.id+' - مشتری',cover+list.map(o=>invoiceSection(o,d)).join(''));
 }
 const m={};
 list.forEach(o=>o.items.forEach(x=>{const r=m[x.product]=m[x.product]||{q:0,v:0,b:{}};r.q+=x.qty;r.v+=x.qty*(prod(x.product)?.price||0)}));
 db.stockLog.filter(e=>e.type==='invoice'&&e.doc==='خروجی '+d.id).forEach(e=>{const r=m[e.pid];if(r){const k=`${e.batchNo||'—'}${e.exp?` (انقضا ${fmtJ(e.exp)})`:''}`;r.b[k]=(r.b[k]||0)+Math.abs(e.qty)}});
 const rows=Object.keys(m).sort((a,b)=>prod(a).name.localeCompare(prod(b).name,'fa')).map((pid,i)=>{const r=m[pid],p=prod(pid);
  return `<tr><td>${fa(i+1)}</td><td>${esc(p.name)}</td><td>${esc(p.unit||'عدد')}</td><td><b>${fa(r.q)}</b></td><td class="sm">${Object.entries(r.b).map(([k,q])=>`${esc(k)}: ${fa(q)}`).join('<br>')||'—'}</td><td>${money(r.v)}</td></tr>`}).join('');
 printHTML('خروجی '+d.id+' - کالا',`<section class="pg">${dispHead(d,'لیست بارگیری خروجی (بر اساس نام و تعداد کالا)')}
 <table><thead><tr><th>ردیف</th><th>نام کالا</th><th>نوع کالا</th><th>تعداد کل</th><th>بچ / انقضا</th><th>ارزش</th></tr></thead><tbody>${rows}</tbody></table>
 <div class="tot">تعداد فاکتور: ${fa(list.length)} · جمع مبلغ خروجی: ${money(sum)}</div>
 <p class="sm">فاکتورها: ${list.map(o=>`FL-${o.id} (${esc(o.customer)})`).join('، ')}</p>${sigs('انباردار','راننده','مأمور پخش')}</section>`);
}

/* =====================================================
   ۱) درخواست‌های ورودی: تأیید ← در حال آماده‌سازی ← آماده ارسال
   ===================================================== */
registerPage('warehouse',(c,page)=>{
 sync();
 const by=s=>db.orders.filter(o=>o.status===s);
 const incoming=by('تأیید شده'), prep=by('در حال آماده‌سازی'), ready=by('آماده ارسال'), route=by('در حال ارسال');
 const low=db.products.filter(p=>p.stock<=p.min).length;
 const st=k=>db.batches.filter(b=>expInfo(b.exp)[2]===k);
 const near=st('near'), expired=st('expired');
 const value=db.products.reduce((a,p)=>a+p.stock*p.price,0);

 const table=(list,mode)=>{
  if(!list.length)return '<p class="sub">موردی وجود ندارد.</p>';
  return `<div class="tablewrap"><table><thead><tr><th>شماره</th><th>مشتری</th><th>تاریخ</th><th>اقلام</th><th>مبلغ</th>${mode==='in'?'<th>موجودی قابل فروش</th>':''}<th>عملیات</th></tr></thead><tbody>${
   list.map(o=>`<tr><td>FL-${o.id}</td><td>${esc(o.customer)}</td><td>${o.date}</td><td style="white-space:normal;min-width:220px">${itemsText(o)}</td><td>${money(total(o))}</td>
   ${mode==='in'?`<td>${enough(o)?pill('کافی','done'):pill('ناکافی','rejected')}</td>`:''}
   <td><a class="btn soft" href="order-detail.html?id=${o.id}">جزئیات</a>
   ${mode==='in'?` <button class="btn primary" data-a="confirm" data-id="${o.id}" ${enough(o)?'':'disabled'}>تأیید و شروع آماده‌سازی</button> <button class="btn danger" data-a="back" data-id="${o.id}">بازگشت به مدیریت</button>`:''}
   ${mode==='prep'?` <button class="btn primary" data-a="ready" data-id="${o.id}">آماده ارسال شد</button>`:''}
   ${mode==='rdy'?` <a class="btn outline" href="deliveries.html">ایجاد خروجی ←</a>`:''}</td></tr>`).join('')}</tbody></table></div>`;
 };

 c.innerHTML=pageHead('پنل انباردار','درخواست‌های ورودی را بررسی، تأیید و برای ارسال آماده کنید')+
 `<div class="stats">${stat('درخواست ورودی جدید',fa(incoming.length))}${stat('در حال آماده‌سازی',fa(prep.length))}${stat('آماده ارسال',fa(ready.length))}${stat('در مسیر ارسال',fa(route.length))}
 ${stat('کالاهای دارای کمبود',fa(low))}${stat('بچ‌های نزدیک انقضا',fa(near.length))}${stat('بچ‌های منقضی',fa(expired.length))}${stat('ارزش موجودی انبار',money(value))}</div>
 ${expired.length?`<div class="notice">⛔ ${fa(expired.length)} بچ منقضی شده در انبار است و در فروش استفاده نمی‌شود. <a href="batches.html"><b>بررسی و ثبت فاسدی ←</b></a></div>`:''}
 ${near.length?`<div class="notice">⏳ ${fa(near.length)} بچ تا ${fa(NEAR)} روز آینده منقضی می‌شود. <a href="batches.html"><b>مشاهده ←</b></a></div>`:''}
 ${low?`<div class="notice">⚠ ${fa(low)} کالا به حداقل موجودی رسیده است. <a href="categories.html"><b>مشاهده و پیشنهاد خرید ←</b></a></div>`:''}
 <section class="panel"><h3>۱. درخواست‌های ورودی (تأییدشده توسط مدیریت)</h3>${table(incoming,'in')}</section>
 <section class="panel"><h3>۲. در حال آماده‌سازی</h3>${table(prep,'prep')}</section>
 <section class="panel"><h3>۳. آماده ارسال</h3>${table(ready,'rdy')}</section>`;

 c.onclick=e=>{
  const b=e.target.closest('[data-a]'); if(!b)return;
  const o=ordById(b.dataset.id); if(!o)return;
  if(b.dataset.a==='confirm'){
   if(!enough(o))return alert('موجودی قابل فروش برای این سفارش کافی نیست.');
   setStatus(o,'در حال آماده‌سازی',`تأیید انباردار و شروع آماده‌سازی توسط ${WH}`);
  }
  if(b.dataset.a==='ready')setStatus(o,'آماده ارسال',`سفارش آماده ارسال شد (${WH})`);
  if(b.dataset.a==='back'){
   const why=prompt('علت بازگشت به مدیریت؟'); if(why===null)return;
   setStatus(o,'در انتظار بررسی',`بازگشت از انبار: ${why||'بدون توضیح'}`);
  }
  save();render(page);
 };
});

/* =====================================================
   ۲) ارسال و تحویل: خروجی روزانه · راننده · مأمور پخش · چاپ
   ===================================================== */
registerPage('deliveries',(c,page)=>{
 sync();
 const ready=db.orders.filter(o=>o.status==='آماده ارسال');
 const inDispatch=new Set(db.dispatches.flatMap(d=>d.orders));
 const orphan=db.orders.filter(o=>o.status==='در حال ارسال'&&!inDispatch.has(o.id));
 const days={};db.dispatches.forEach(d=>(days[d.date]=days[d.date]||[]).push(d));
 const dispTotal=d=>d.orders.reduce((a,id)=>a+total(ordById(id)||{items:[]}),0);

 const resultCtl=o=>o.status==='در حال ارسال'
  ?`<select class="field" data-res="${o.id}" style="min-width:120px"><option>تحویل کامل</option><option>تحویل جزئی</option><option>تحویل ناموفق</option></select> <button class="btn primary" data-a="deliver" data-id="${o.id}">ثبت نتیجه</button>`
  :pill(o.status,statusClass(o.status));

 const dispCard=d=>{
  const list=d.orders.map(ordById).filter(Boolean), done=list.every(o=>o.status!=='در حال ارسال');
  return `<div class="panel" style="background:var(--bg)">
   <div class="panelhead"><h3 style="margin:0">خروجی شماره ${fa(d.id)}</h3>${pill(done?'تکمیل شد':'ارسال شد · در مسیر',done?'done':'shipping')}</div>
   <div class="filters"><span>تعداد فاکتور: <b>${fa(list.length)}</b></span><span>راننده: <b>${esc(d.driver)}</b></span><span>مأمور پخش: <b>${esc(d.distributor)}</b></span>${d.veh?`<span>خودرو: <b>${esc(d.veh)}</b></span>`:''}<span>جمع مبلغ خروجی: <b>${money(dispTotal(d))}</b></span></div>
   <div class="filters"><button class="btn soft" data-a="pp" data-id="${d.id}">🖨 چاپ بر اساس کالا (لیست بارگیری)</button><button class="btn soft" data-a="pc" data-id="${d.id}">🖨 چاپ بر اساس مشتری (فاکتورها)</button></div>
   <div class="tablewrap"><table><thead><tr><th>فاکتور</th><th>مشتری</th><th>اقلام</th><th>مبلغ</th><th>چاپ</th><th>وضعیت / ثبت تحویل</th></tr></thead><tbody>${
    list.map(o=>`<tr><td><a href="order-detail.html?id=${o.id}">FL-${o.id}</a></td><td>${esc(o.customer)}</td><td style="white-space:normal;min-width:200px">${itemsText(o)}</td><td>${money(total(o))}</td><td><button class="btn outline" data-a="pi" data-id="${o.id}" data-d="${d.id}">چاپ فاکتور</button></td><td>${resultCtl(o)}</td></tr>`).join('')}</tbody></table></div></div>`;
 };

 c.innerHTML=pageHead('ارسال و تحویل','ثبت خروجی روزانه، راننده، مأمور پخش، چاپ فاکتور و نتیجه تحویل')+
 `<section class="panel"><h3>ایجاد خروجی جدید (سفارش‌های آماده ارسال)</h3>${
  ready.length?`<div class="tablewrap"><table><thead><tr><th></th><th>فاکتور</th><th>مشتری</th><th>اقلام</th><th>مبلغ</th></tr></thead><tbody>${
   ready.map(o=>`<tr><td><input type="checkbox" class="pick" value="${o.id}" checked></td><td>FL-${o.id}</td><td>${esc(o.customer)}</td><td style="white-space:normal">${itemsText(o)}</td><td>${money(total(o))}</td></tr>`).join('')}</tbody></table></div>
  <div class="formgrid" style="margin-top:14px">
   <div class="group"><label>راننده *</label><input class="field" id="drv" list="drvl" placeholder="انتخاب یا نام جدید"><datalist id="drvl">${db.drivers.map(x=>`<option value="${esc(x)}">`).join('')}</datalist></div>
   <div class="group"><label>مأمور پخش همراه *</label><input class="field" id="dst" list="dstl" placeholder="انتخاب یا نام جدید"><datalist id="dstl">${db.distributors.map(x=>`<option value="${esc(x)}">`).join('')}</datalist></div>
   <div class="group"><label>خودرو / پلاک (اختیاری)</label><input class="field" id="veh"></div>
   <div class="group"><label>تاریخ خروج</label><input class="field" id="ddate" value="${fmtDate()}"></div></div>
  <button class="btn primary" id="mkdisp" style="margin-top:14px">ثبت خروجی و ارسال ←</button>
  <p class="sub" style="margin-top:8px">با ثبت خروجی، کالا به روش «نزدیک‌ترین انقضا اول» از بچ‌ها کسر می‌شود (بچ منقضی برداشته نمی‌شود).</p>`
  :'<p class="sub">سفارشی آماده ارسال نیست. ابتدا در «درخواست‌های ورودی» سفارش‌ها را تأیید و آماده کنید.</p>'}</section>
 ${orphan.length?`<section class="panel"><h3>در مسیر (بدون خروجی ثبت‌شده)</h3><div class="tablewrap"><table><tbody>${orphan.map(o=>`<tr><td>FL-${o.id}</td><td>${esc(o.customer)}</td><td>${money(total(o))}</td><td>${resultCtl(o)}</td></tr>`).join('')}</tbody></table></div></section>`:''}
 ${Object.keys(days).map(date=>{
  const ds=days[date], inv=ds.reduce((a,d)=>a+d.orders.length,0), sum=ds.reduce((a,d)=>a+dispTotal(d),0);
  return `<section class="panel"><div class="panelhead"><h3 style="margin:0">خروجی‌های ${date}</h3><span class="sub">${fa(ds.length)} خروجی · ${fa(inv)} فاکتور · جمع روز: <b>${money(sum)}</b></span></div>${ds.map(dispCard).join('')}</section>`;
 }).join('')||'<div class="notice">هنوز خروجی ثبت نشده است.</div>'}`;

 const mk=$('#mkdisp');
 if(mk)mk.onclick=()=>{
  const ids=[...c.querySelectorAll('.pick:checked')].map(x=>+x.value);
  const driver=$('#drv').value.trim(), distributor=$('#dst').value.trim();
  if(!ids.length)return alert('حداقل یک فاکتور انتخاب کنید.');
  if(!driver||!distributor)return alert('راننده و مأمور پخش را مشخص کنید.');
  const orders=ids.map(ordById), need={};
  orders.forEach(o=>o.items.forEach(x=>need[x.product]=(need[x.product]||0)+x.qty));
  const short=Object.keys(need).find(pid=>avail(pid)<need[pid]);
  if(short)return alert('موجودی قابل فروش کافی نیست: '+prod(short).name);
  const id=Math.max(0,...db.dispatches.map(d=>d.id))+1, date=$('#ddate').value.trim()||fmtDate(), veh=$('#veh').value.trim();
  orders.forEach(o=>{
   o.items.forEach(x=>logMove('invoice',x.product,x.qty,`فاکتور FL-${o.id} · ${o.customer}`,`خروجی ${id}`,{sellable:true,order:o.id,driver,dist:distributor}));
   setStatus(o,'در حال ارسال',`ارسال با خروجی ${id} · راننده ${driver} · مأمور پخش ${distributor}`);
  });
  if(!db.drivers.includes(driver))db.drivers.push(driver);
  if(!db.distributors.includes(distributor))db.distributors.push(distributor);
  db.dispatches.unshift({id,date,driver,distributor,veh,orders:ids});
  save();render(page);
 };

 c.onclick=e=>{
  const b=e.target.closest('[data-a]'); if(!b)return;
  const a=b.dataset.a;
  if(a==='pp')return printDispatch(b.dataset.id,'product');
  if(a==='pc')return printDispatch(b.dataset.id,'customer');
  if(a==='pi')return printOrder(b.dataset.id,b.dataset.d);
  if(a==='deliver'){
   const o=ordById(b.dataset.id), res=c.querySelector(`[data-res="${b.dataset.id}"]`).value;
   setStatus(o,res,'ثبت نتیجه: '+res);
   if(res==='تحویل ناموفق'&&confirm('کالاهای این فاکتور به انبار برگردانده شود؟')){
    const d=db.dispatches.find(x=>x.orders.includes(o.id));
    const ent=d?db.stockLog.filter(x=>x.type==='invoice'&&x.order===o.id&&x.doc==='خروجی '+d.id):[];
    if(ent.length)ent.forEach(x=>logMove('customer_return',x.pid,Math.abs(x.qty),`تحویل ناموفق FL-${o.id}`,'برگشت از خروجی '+d.id,{batchNo:x.batchNo,exp:x.exp,order:o.id}));
    else o.items.forEach(x=>logMove('customer_return',x.product,x.qty,`تحویل ناموفق FL-${o.id}`,'برگشت از خروجی',{order:o.id}));
   }
   save();render(page);
  }
 };
});

/* =====================================================
   ۳) ورود و خروج انبار (با بچ و تاریخ انقضا)
   ===================================================== */
let invFilter='all', invSearch='';
function exportCSV(rows){
 const csv='\ufeff'+rows.map(r=>r.map(v=>`"${String(v??'').replace(/"/g,'""')}"`).join(',')).join('\n');
 const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));a.download='stock-ledger.csv';a.click();
}
registerPage('inventory',(c,page)=>{
 sync();
 const log=db.stockLog;
 const sumQ=f=>log.filter(f).reduce((a,x)=>a+Math.abs(x.qty),0);
 const wasteVal=log.filter(x=>x.type==='spoiled'||x.type==='discard').reduce((a,x)=>a+Math.abs(x.qty)*(prod(x.pid)?.price||0),0);
 const q=invSearch.trim();
 const shown=log.filter(x=>(invFilter==='all'||x.type===invFilter)&&(!q||[prod(x.pid)?.name,x.ref,x.doc,x.batchNo,x.driver,x.dist].join(' ').includes(q)));

 c.innerHTML=pageHead('ورود و خروج انبار','دفتر کامل حرکت کالا با شماره بچ و تاریخ انقضا',`<button class="btn outline" id="csv">⬇ خروجی اکسل (CSV)</button>`)+
 `<div class="stats">${stat('جمع ورودی‌ها',fa(sumQ(x=>x.qty>0)))}${stat('خروج با فاکتور',fa(sumQ(x=>x.type==='invoice')))}${stat('مرجوعی به فروشنده/کارخانه',fa(sumQ(x=>x.type==='return_supplier'||x.type==='return_factory')))}${stat('ارزش ضایعات و فاسدی',money(wasteVal))}</div>
 <section class="panel"><h3>ثبت حرکت دستی</h3>
  <div class="formgrid">
   <div class="group"><label>نوع حرکت</label><select class="field" id="mt">${Object.entries(MV).filter(([k])=>k!=='invoice').map(([k,v])=>`<option value="${k}">${v[0]}</option>`).join('')}</select></div>
   <div class="group"><label>کالا</label><select class="field" id="mp">${db.products.map(p=>`<option value="${p.id}">${esc(p.name)} (${fa(p.stock)} ${esc(p.unit)})</option>`).join('')}</select></div>
   <div class="group"><label>تعداد</label><input class="field" id="mq" type="number" min="1" value="1"></div>
   <div class="group"><label id="mrl"></label><input class="field" id="mr"></div>
  </div><div class="formgrid" id="mextra" style="margin-top:14px"></div>
  <button class="btn primary" id="madd" style="margin-top:14px">ثبت در انبار</button></section>
 <section class="panel"><div class="panelhead"><h3 style="margin:0">دفتر ورود و خروج</h3>
  <div class="filters" style="margin:0"><input class="field" id="msq" placeholder="جستجو: کالا، بچ، راننده، شرح..." value="${esc(invSearch)}" style="max-width:240px"><select class="field" id="mf" style="max-width:240px"><option value="all">همه حرکت‌ها</option>${Object.entries(MV).map(([k,v])=>`<option value="${k}" ${invFilter===k?'selected':''}>${v[0]}</option>`).join('')}</select></div></div>
  <div class="tablewrap"><table><thead><tr><th>تاریخ</th><th>نوع حرکت</th><th>کالا</th><th>بچ</th><th>انقضا</th><th>تعداد</th><th>شرح</th><th>سند</th><th>راننده / مأمور پخش</th><th>ارزش</th></tr></thead><tbody>${
   shown.map(x=>{const m=/^خروجی (\d+)$/.exec(x.doc||'');
    return `<tr><td>${x.date}</td><td>${pill(MV[x.type][0],mvClass(x.type))}</td><td>${esc(prod(x.pid)?.name)}</td><td>${esc(x.batchNo||'—')}</td><td>${fmtJ(x.exp)}</td><td dir="ltr" style="text-align:right">${x.qty>0?'+':'−'}${fa(Math.abs(x.qty))} ${esc(unitOf(x.pid))}</td><td>${esc(x.ref)}</td>
    <td>${esc(x.doc)}${m?` <button class="btn soft" data-a="pp" data-id="${m[1]}">چاپ کالا</button> <button class="btn soft" data-a="pc" data-id="${m[1]}">چاپ مشتری</button>`:''}</td>
    <td>${x.driver||x.dist?`${esc(x.driver)} / ${esc(x.dist)}`:'—'}</td><td>${money(Math.abs(x.qty)*(prod(x.pid)?.price||0))}</td></tr>`}).join('')||'<tr><td colspan="10">موردی ثبت نشده است.</td></tr>'}</tbody></table></div></section>`;

 const drawExtra=()=>{
  const t=$('#mt').value, pid=+$('#mp').value, inb=MV[t][1]>0;
  $('#mrl').textContent=MV[t][2]||'شرح';
  $('#mextra').innerHTML=inb
   ?`<div class="group"><label>شماره بچ (خالی = خودکار)</label><input class="field" id="mb"></div><div class="group"><label>تاریخ انقضا (شمسی، مثل ۱۴۰۶/۰۵/۱۰)</label><input class="field" id="mx" placeholder="اختیاری"></div>`
   :`<div class="group"><label>بچ برداشت</label><select class="field" id="mbs"><option value="">خودکار (نزدیک‌ترین انقضا اول)</option>${db.batches.filter(b=>b.pid==pid&&b.qty>0).sort(byExp).map(b=>`<option value="${b.id}">${esc(b.no)} · ${fa(b.qty)} ${esc(unitOf(pid))} · ${b.exp?fmtJ(b.exp):'بدون انقضا'}</option>`).join('')}</select></div>`;
 };
 drawExtra();$('#mt').onchange=drawExtra;$('#mp').onchange=drawExtra;
 $('#mf').onchange=e=>{invFilter=e.target.value;render(page)};
 $('#msq').onchange=e=>{invSearch=e.target.value;render(page)};
 $('#csv').onclick=()=>exportCSV([['تاریخ','نوع حرکت','کالا','شماره بچ','انقضا','تعداد','نوع کالا','شرح','سند','راننده','مأمور پخش']].concat(
  shown.map(x=>[x.date,MV[x.type][0],prod(x.pid)?.name,x.batchNo||'',x.exp?fmtJ(x.exp):'',x.qty,unitOf(x.pid),x.ref,x.doc,x.driver,x.dist])));
 $('#madd').onclick=()=>{
  const type=$('#mt').value, pid=+$('#mp').value, qty=Math.floor(+$('#mq').value), ref=$('#mr').value.trim(), inb=MV[type][1]>0, o={};
  if(!(qty>=1))return alert('تعداد معتبر وارد کنید.');
  if(type!=='purchase'&&!ref)return alert('شرح یا علت را وارد کنید.');
  if(inb){
   const ex=$('#mx').value.trim();
   if(ex){o.exp=parseJ(ex);if(!o.exp)return alert('تاریخ انقضا معتبر نیست. نمونه: ۱۴۰۶/۰۵/۱۰');}
   o.batchNo=$('#mb').value.trim()||undefined;
  }else{
   const bid=$('#mbs').value;
   if(bid){const b=db.batches.find(x=>x.id===bid);if(!b||b.qty<qty)return alert('موجودی بچ انتخاب‌شده کافی نیست.');o.batchId=bid;}
   else if(prod(pid).stock<qty)return alert('موجودی انبار برای این خروج کافی نیست.');
  }
  logMove(type,pid,qty,ref,'ثبت دستی',o);save();render(page);
 };
 c.onclick=e=>{const b=e.target.closest('[data-a]');if(!b)return;printDispatch(b.dataset.id,b.dataset.a==='pp'?'product':'customer')};
});

/* =====================================================
   ۴) بچ‌ها و تاریخ انقضا
   ===================================================== */
let batFilter='all';
registerPage('batches',(c,page)=>{
 sync();
 const all=[...db.batches].sort(byExp), cnt=k=>all.filter(b=>expInfo(b.exp)[2]===k);
 const val=l=>l.reduce((a,b)=>a+b.qty*(prod(b.pid)?.price||0),0);
 const shown=all.filter(b=>batFilter==='all'||expInfo(b.exp)[2]===batFilter);
 const acts={spoiled:'ثبت فاسدی',discard:'دورریز',return_supplier:'مرجوع به فروشنده',return_factory:'مرجوع به کارخانه'};
 c.innerHTML=pageHead('بچ‌ها و تاریخ انقضا','هر ورودی انبار یک بچ با تاریخ انقضای مخصوص خود دارد. فروش به روش نزدیک‌ترین انقضا اول انجام می‌شود.')+
 `<div class="stats">${stat('تعداد بچ فعال',fa(all.length))}${stat('نزدیک انقضا',fa(cnt('near').length))}${stat('منقضی شده',fa(cnt('expired').length))}${stat('ارزش بچ‌های منقضی',money(val(cnt('expired'))))}</div>
 <section class="panel"><div class="panelhead"><h3 style="margin:0">فهرست بچ‌ها (به ترتیب انقضا)</h3>
  <select class="field" id="bf" style="max-width:220px">${[['all','همه'],['expired','منقضی شده'],['near','نزدیک انقضا'],['ok','سالم'],['none','بدون تاریخ انقضا']].map(([k,t])=>`<option value="${k}" ${batFilter===k?'selected':''}>${t}</option>`).join('')}</select></div>
  <div class="tablewrap"><table><thead><tr><th>کالا</th><th>شماره بچ</th><th>موجودی</th><th>تاریخ ورود</th><th>تاریخ انقضا</th><th>وضعیت</th><th>اقدام</th></tr></thead><tbody>${
  shown.map(b=>{const [t,cl]=expInfo(b.exp);return `<tr><td>${esc(prod(b.pid)?.name)}</td><td>${esc(b.no)}</td><td>${fa(b.qty)} ${esc(unitOf(b.pid))}</td><td>${b.date||'—'}</td><td>${fmtJ(b.exp)}</td><td>${pill(t,cl)}</td>
   <td><select class="field" data-bs="${b.id}" style="min-width:150px">${Object.entries(acts).map(([k,v])=>`<option value="${k}" ${k==='spoiled'&&expInfo(b.exp)[2]==='expired'?'selected':''}>${v}</option>`).join('')}</select> <button class="btn outline" data-a="bact" data-id="${b.id}">ثبت</button></td></tr>`}).join('')||'<tr><td colspan="7">موردی نیست.</td></tr>'}</tbody></table></div></section>`;
 $('#bf').onchange=e=>{batFilter=e.target.value;render(page)};
 c.onclick=e=>{
  const bt=e.target.closest('[data-a="bact"]');if(!bt)return;
  const b=db.batches.find(x=>x.id===bt.dataset.id);if(!b)return;
  const type=c.querySelector(`[data-bs="${b.id}"]`).value;
  const qs=prompt(`چند ${unitOf(b.pid)} از بچ ${b.no}؟ (حداکثر ${b.qty})`,b.qty);if(qs===null)return;
  const q=Math.floor(+normDigits(qs));if(!(q>=1&&q<=b.qty))return alert('تعداد معتبر نیست.');
  const why=prompt('شرح / علت:',type==='spoiled'&&expInfo(b.exp)[2]==='expired'?'انقضای تاریخ مصرف':'');if(why===null)return;
  logMove(type,b.pid,q,why||acts[type],'اقدام روی بچ',{batchId:b.id});save();render(page);
 };
});

/* =====================================================
   ۵) دسته‌بندی کالاها (با نوع کالا / بسته‌بندی)
   ===================================================== */
registerPage('categories',(c,page)=>{
 sync();
 const byCat=n=>db.products.filter(p=>p.cat===n);
 const unitSel=(cur,attr)=>`<select class="field" ${attr} style="min-width:130px">${db.units.map(u=>`<option ${u===cur?'selected':''}>${esc(u)}</option>`).join('')}</select>`;
 const suggest=p=>Math.max(0,p.min*2-p.stock);
 c.innerHTML=pageHead('دسته‌بندی کالاها','دسته، نوع کالا (کارتن، بسته، کیلو، ...)، حداقل موجودی و پیشنهاد خرید')+
 `<section class="panel"><h3>افزودن دسته جدید</h3><div class="formgrid">
   <div class="group"><label>نام دسته *</label><input class="field" id="newcat" placeholder="مثلاً لبنیات"></div>
   <div class="group"><label>نوع کالا در این دسته *</label><input class="field" id="newunit" list="unitl" placeholder="انتخاب یا نوشتن نوع جدید" value="${esc(db.units[0])}"><datalist id="unitl">${db.units.map(u=>`<option value="${esc(u)}">`).join('')}</datalist></div>
  </div><button class="btn primary" id="addcat" style="margin-top:14px">＋ افزودن دسته</button></section>
 <section class="panel"><h3>دسته‌ها</h3><div class="tablewrap"><table><thead><tr><th>دسته</th><th>نوع کالا (پیش‌فرض)</th><th>تعداد کالا</th><th>جمع موجودی</th><th>ارزش موجودی</th><th>کمبود</th><th></th></tr></thead><tbody>${
  db.categories.map(cat=>{const a=byCat(cat.name);return `<tr><td><b>${esc(cat.name)}</b></td><td>${unitSel(cat.unit,`data-cu="${esc(cat.name)}"`)}</td><td>${fa(a.length)}</td><td>${fa(a.reduce((s,p)=>s+p.stock,0))}</td><td>${money(a.reduce((s,p)=>s+p.stock*p.price,0))}</td><td>${fa(a.filter(p=>p.stock<=p.min).length)}</td><td>${a.length?'':`<button class="btn danger" data-del="${esc(cat.name)}">حذف</button>`}</td></tr>`}).join('')}</tbody></table></div></section>
 <section class="panel"><h3>خلاصه بر اساس نوع کالا</h3><div class="tablewrap"><table><thead><tr><th>نوع کالا</th><th>تعداد کالا</th><th>جمع موجودی</th></tr></thead><tbody>${
  db.units.map(u=>{const a=db.products.filter(p=>p.unit===u);return a.length?`<tr><td>${esc(u)}</td><td>${fa(a.length)}</td><td>${fa(a.reduce((s,p)=>s+p.stock,0))}</td></tr>`:''}).join('')}</tbody></table></div></section>
 <section class="panel"><h3>کالاها</h3><div class="tablewrap"><table><thead><tr><th>کالا</th><th>دسته</th><th>نوع کالا</th><th>تعداد در کارتن/بسته</th><th>قیمت</th><th>موجودی</th><th>حداقل</th><th>پیشنهاد خرید</th><th>وضعیت</th></tr></thead><tbody>${
  db.products.map(p=>`<tr><td>${p.emoji||''} ${esc(p.name)}</td>
   <td><select class="field" data-cat="${p.id}" style="min-width:140px">${db.categories.map(x=>`<option ${x.name===p.cat?'selected':''}>${esc(x.name)}</option>`).join('')}</select></td>
   <td>${unitSel(p.unit,`data-unit="${p.id}"`)}</td>
   <td><input class="field" type="number" min="1" data-pack="${p.id}" value="${p.pack}" style="max-width:80px"></td>
   <td>${money(p.price)}</td><td>${fa(p.stock)} ${esc(p.unit)}</td>
   <td><input class="field" type="number" min="0" data-min="${p.id}" value="${p.min}" style="max-width:80px"></td>
   <td>${suggest(p)?`${fa(suggest(p))} ${esc(p.unit)}`:'—'}</td>
   <td>${p.stock<=0?pill('ناموجود','rejected'):p.stock<=p.min?pill('کمبود','pending'):pill('کافی','done')}</td></tr>`).join('')}</tbody></table></div></section>`;

 $('#addcat').onclick=()=>{
  const n=$('#newcat').value.trim(), u=$('#newunit').value.trim();
  if(!n||!u)return alert('نام دسته و نوع کالا را وارد کنید.');
  if(db.categories.some(x=>x.name===n))return alert('این دسته قبلاً ثبت شده است.');
  if(!db.units.includes(u))db.units.push(u);
  db.categories.push({name:n,unit:u});save();render(page);
 };
 c.onchange=e=>{
  const d=e.target.dataset;
  if(d.cu!==undefined){db.categories.find(x=>x.name===d.cu).unit=e.target.value}
  else if(d.cat){prod(d.cat).cat=e.target.value}
  else if(d.unit){prod(d.unit).unit=e.target.value}
  else if(d.pack){prod(d.pack).pack=Math.max(1,Math.floor(+e.target.value)||1)}
  else if(d.min){prod(d.min).min=Math.max(0,Math.floor(+e.target.value)||0)}
  else return;
  save();render(page);
 };
 c.onclick=e=>{
  const b=e.target.closest('[data-del]');if(!b)return;
  db.categories=db.categories.filter(x=>x.name!==b.dataset.del);save();render(page);
 };
});
