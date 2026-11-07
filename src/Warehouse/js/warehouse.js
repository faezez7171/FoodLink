/* پنل انباردار - Food Link (نسخه ۳ - طراحی مینیمال)
   صفحات: warehouse · deliveries · stock-in · stock-out · stock-status · batches · categories
   وابسته به core.js و common-pages.js (باید قبل از این فایل لود شوند) */

navs.warehouse=[
 ['warehouse','▣','درخواست‌های ورودی'],
 ['deliveries','➤','ارسال و تحویل'],
 ['stock-in','↧','ورود به انبار'],
 ['stock-out','↥','خروج از انبار'],
 ['stock-status','◔','وضعیت موجودی'],
 ['batches','⏱','بچ‌ها و انقضا'],
 ['categories','▦','دسته‌بندی کالاها']
];

/* ================= ظاهر مینیمال پنل ================= */
(function(){const s=document.createElement('style');s.textContent=`
.content{max-width:1240px}
.panel{box-shadow:none;border-radius:14px;padding:16px 18px}
.wh-head{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:18px}
.wh-head h1{font-size:21px;margin:0}.wh-head p{margin:4px 0 0;color:var(--muted);font-size:12px}
.wh-bar{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:14px}
.wh-bar .field{width:auto;min-width:120px;padding:8px 10px;font-size:12px}
.btn.sm{padding:6px 11px;font-size:12px;border-radius:8px}
.btn.ghost{background:transparent;color:var(--muted);border:1px solid var(--line)}
.btn.ghost:hover{color:var(--accent);border-color:var(--accent)}
.wh-tabs{display:flex;gap:2px;border-bottom:1px solid var(--line);margin-bottom:14px;overflow-x:auto}
.wh-tabs button{background:none;border:0;border-bottom:2px solid transparent;padding:9px 14px;color:var(--muted);font-weight:600;white-space:nowrap}
.wh-tabs button.on{color:var(--accent);border-color:var(--accent)}
.wh-tabs b{background:var(--bg);color:var(--muted);border-radius:99px;padding:1px 8px;font-size:11px;margin-right:7px;font-weight:600}
.wh-tabs button.on b{background:var(--accent-soft);color:var(--accent)}
.wh-chips{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px}
.wh-chip{display:inline-flex;gap:7px;align-items:center;padding:6px 13px;border-radius:99px;background:var(--surface);border:1px solid var(--line);font-size:12px}
.wh-chip i{width:8px;height:8px;border-radius:50%;display:inline-block}
.panel table th{background:transparent;font-size:11px;border-bottom:1px solid var(--line)}
.panel table td{padding:11px 10px;vertical-align:middle}
.panel table tbody tr:hover td{background:var(--bg)}
.wh-two{line-height:1.7}.wh-two small{display:block;color:var(--muted);font-size:11px}
.wh-acts{display:flex;gap:6px;flex-wrap:nowrap}
.wh-empty{text-align:center;color:var(--muted);padding:40px 10px}
.wh-hide{display:none}
.panel table tbody tr.wh-sub:hover td{background:var(--bg)}.wh-sub td{background:var(--bg);padding:6px 14px 16px!important}
.wh-day td{background:var(--bg);font-weight:700;font-size:12px;color:var(--muted)}
.wh-pager{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-top:14px;flex-wrap:wrap;font-size:12px;color:var(--muted)}
.wh-pages{display:flex;gap:4px;align-items:center}
.wh-pages button{min-width:32px;height:32px;border:1px solid var(--line);background:var(--surface);color:var(--text);border-radius:8px}
.wh-pages button.on{background:var(--accent);color:#fff;border-color:var(--accent)}
.wh-pages button:disabled{opacity:.35;cursor:default}
.wh-dist{display:flex;height:10px;border-radius:99px;overflow:hidden;background:var(--bg);margin-bottom:14px}
.wh-lv{height:7px;border-radius:99px;background:var(--bg);position:relative;overflow:hidden;min-width:110px}
.wh-lv i{display:block;height:100%;border-radius:99px}
.wh-lv u{position:absolute;top:0;bottom:0;width:2px;background:var(--text);opacity:.3}
.wh-ov{position:fixed;inset:0;background:#0b122066;display:grid;place-items:center;z-index:50;padding:16px}
.wh-md{background:var(--surface);color:var(--text);border-radius:18px;width:min(580px,100%);max-height:92vh;overflow:auto;box-shadow:0 30px 80px #0005}
.wh-mh{display:flex;justify-content:space-between;align-items:center;padding:16px 20px;border-bottom:1px solid var(--line)}
.wh-mh h3{margin:0;font-size:16px}.wh-mb{padding:18px 20px}
.wh-mf{display:flex;gap:8px;justify-content:flex-end;padding:14px 20px;border-top:1px solid var(--line)}
.wh-x{background:none;border:0;font-size:18px;color:var(--muted)}
`;document.head.appendChild(s)})();


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

/* ================= ابزارهای رابط کاربری ================= */
const head=(t,sub,act)=>`<div class="wh-head"><div><h1>${t}</h1>${sub?`<p>${sub}</p>`:''}</div><div class="wh-bar" style="margin:0">${act||''}</div></div>`;
const empty=t=>`<div class="wh-empty">${t}</div>`;
const shortLbl=l=>l.replace(/^(ورود|خروج) - /,'');
const tabsHTML=(items,cur)=>`<div class="wh-tabs">${items.map(([k,t,n])=>`<button data-tab="${k}" class="${cur===k?'on':''}">${t}<b>${fa(n)}</b></button>`).join('')}</div>`;
const itemsShort=o=>{const a=o.items.map(x=>`${esc(prod(x.product)?.name)} × ${fa(x.qty)}`);return a.slice(0,2).join('، ')+(a.length>2?` و ${fa(a.length-2)} مورد دیگر`:'')};
const isoOf=x=>x.iso||parseJ(x.date)||'';

/* پنجره (مدال): onOk اگر false برگرداند بسته نمی‌شود */
function closeModal(){document.getElementById('whov')?.remove()}
function openModal(title,body,okText,onOk){
 closeModal();
 const ov=document.createElement('div');ov.className='wh-ov';ov.id='whov';
 ov.innerHTML=`<div class="wh-md"><div class="wh-mh"><h3>${title}</h3><button class="wh-x" data-x>✕</button></div><div class="wh-mb">${body}</div><div class="wh-mf"><button class="btn outline" data-x>انصراف</button><button class="btn primary" id="whok">${okText}</button></div></div>`;
 ov.onclick=e=>{if(e.target===ov||e.target.closest('[data-x]'))closeModal()};
 document.body.appendChild(ov);
 $('#whok').onclick=()=>{if(onOk()!==false)closeModal()};
}
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});

/* صفحه‌بندی: st={page,size} */
function pgHTML(n,st){
 const pages=Math.max(1,Math.ceil(n/st.size));st.page=Math.min(Math.max(1,st.page),pages);
 const from=n?(st.page-1)*st.size+1:0,to=Math.min(n,st.page*st.size);
 const arr=[...new Set([1,pages,st.page-1,st.page,st.page+1].filter(x=>x>=1&&x<=pages))].sort((a,b)=>a-b);
 let btn='',prev=0;
 arr.forEach(p=>{if(p-prev>1)btn+='<span>…</span>';btn+=`<button class="${p===st.page?'on':''}" data-pg="${p}">${fa(p)}</button>`;prev=p});
 return `<div class="wh-pager"><span>نمایش ${fa(from)}–${fa(to)} از ${fa(n)}</span>
 <div class="wh-pages"><button data-pg="${st.page-1}" ${st.page<=1?'disabled':''}>›</button>${btn}<button data-pg="${st.page+1}" ${st.page>=pages?'disabled':''}>‹</button></div>
 <label>در هر صفحه <select class="field" data-size style="width:auto;padding:5px 8px;font-size:12px">${[10,20,50].map(s=>`<option ${s===st.size?'selected':''}>${s}</option>`).join('')}</select></label></div>`;
}
function pgClick(e,st,redraw){const b=e.target.closest('[data-pg]');if(b&&!b.disabled){st.page=+b.dataset.pg;redraw();return true}return false}
function pgSize(e,st,redraw){const t=e.target;if(t.dataset&&t.dataset.size!==undefined){st.size=+t.value;st.page=1;redraw();return true}return false}
function exportCSV(name,rows){
 const csv='\ufeff'+rows.map(r=>r.map(v=>`"${String(v??'').replace(/"/g,'""')}"`).join(',')).join('\n');
 const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));a.download=name;a.click();
}

/* =====================================================
   ۱) درخواست‌های ورودی: تأیید ← در حال آماده‌سازی ← آماده ارسال
   ===================================================== */
let qTab='in';const QS={page:1,size:20};
registerPage('warehouse',(c,page)=>{
 sync();
 const G={in:db.orders.filter(o=>o.status==='تأیید شده'),prep:db.orders.filter(o=>o.status==='در حال آماده‌سازی'),rdy:db.orders.filter(o=>o.status==='آماده ارسال')};
 const low=db.products.filter(p=>p.stock<=p.min).length, near=db.batches.filter(b=>expInfo(b.exp)[2]==='near').length, exp=db.batches.filter(b=>expInfo(b.exp)[2]==='expired').length;
 const chips=[[low,'کالا در سطح کمبود','#d9a441','stock-status.html'],[near,'بچ نزدیک انقضا','#e8a33d','batches.html'],[exp,'بچ منقضی','#e0626f','batches.html']]
  .filter(x=>x[0]).map(([n,t,col,h])=>`<a class="wh-chip" href="${h}"><i style="background:${col}"></i>${fa(n)} ${t}</a>`).join('');
 const acts=o=>(qTab==='in'?`<button class="btn primary sm" data-a="confirm" data-id="${o.id}" ${enough(o)?'':'disabled'}>تأیید</button> <button class="btn ghost sm" data-a="back" data-id="${o.id}">بازگشت به مدیریت</button>`
  :qTab==='prep'?`<button class="btn primary sm" data-a="ready" data-id="${o.id}">آماده ارسال شد</button>`
  :`<a class="btn soft sm" href="deliveries.html">ایجاد خروجی ←</a>`)+` <a class="btn ghost sm" href="order-detail.html?id=${o.id}">جزئیات</a>`;
 c.innerHTML=head('درخواست‌های ورودی','سفارش‌های تأییدشده را بررسی و برای ارسال آماده کنید')+
  (chips?`<div class="wh-chips">${chips}</div>`:'')+
  `<section class="panel">${tabsHTML([['in','درخواست جدید',G.in.length],['prep','در حال آماده‌سازی',G.prep.length],['rdy','آماده ارسال',G.rdy.length]],qTab)}<div id="ql"></div></section>`;
 const draw=()=>{
  const list=G[qTab],pg=pgHTML(list.length,QS),f=(QS.page-1)*QS.size,part=list.slice(f,f+QS.size);
  $('#ql').innerHTML=part.length?`<div class="tablewrap"><table><thead><tr><th>فاکتور</th><th>اقلام</th><th>مبلغ</th>${qTab==='in'?'<th>موجودی</th>':''}<th></th></tr></thead><tbody>${
   part.map(o=>`<tr><td><div class="wh-two"><b>FL-${o.id}</b> · ${esc(o.customer)}<small>${esc(o.date)}</small></div></td><td style="white-space:normal;min-width:220px">${itemsShort(o)}</td><td>${money(total(o))}</td>
   ${qTab==='in'?`<td>${enough(o)?pill('کافی','done'):pill('ناکافی','rejected')}</td>`:''}<td><div class="wh-acts">${acts(o)}</div></td></tr>`).join('')}</tbody></table></div>${pg}`:empty('موردی در این مرحله وجود ندارد.');
 };
 draw();
 c.onclick=e=>{
  if(pgClick(e,QS,draw))return;
  const t=e.target.closest('[data-tab]');if(t){qTab=t.dataset.tab;QS.page=1;return render(page)}
  const b=e.target.closest('[data-a]');if(!b)return;
  const o=ordById(b.dataset.id);if(!o)return;
  if(b.dataset.a==='confirm'){
   if(!enough(o))return alert('موجودی قابل فروش برای این سفارش کافی نیست.');
   setStatus(o,'در حال آماده‌سازی',`تأیید انباردار و شروع آماده‌سازی توسط ${WH}`);
  }
  if(b.dataset.a==='ready')setStatus(o,'آماده ارسال',`سفارش آماده ارسال شد (${WH})`);
  if(b.dataset.a==='back'){const why=prompt('علت بازگشت به مدیریت؟');if(why===null)return;setStatus(o,'در انتظار بررسی',`بازگشت از انبار: ${why||'بدون توضیح'}`)}
  save();render(page);
 };
 c.onchange=e=>pgSize(e,QS,draw);
});

/* =====================================================
   ۲) ارسال و تحویل: خروجی روزانه · راننده · مأمور پخش · چاپ
   ===================================================== */
let dayLimit=7;
registerPage('deliveries',(c,page)=>{
 sync();
 const ready=db.orders.filter(o=>o.status==='آماده ارسال');
 const inDispatch=new Set(db.dispatches.flatMap(d=>d.orders));
 const orphan=db.orders.filter(o=>o.status==='در حال ارسال'&&!inDispatch.has(o.id));
 const days={};db.dispatches.forEach(d=>(days[d.date]=days[d.date]||[]).push(d));
 const dk=Object.keys(days);
 const dispTotal=d=>d.orders.reduce((a,id)=>a+total(ordById(id)||{items:[]}),0);
 const resultCtl=o=>o.status==='در حال ارسال'
  ?`<div class="wh-acts"><select class="field" data-res="${o.id}" style="min-width:110px;padding:6px 8px;font-size:12px"><option>تحویل کامل</option><option>تحویل جزئی</option><option>تحویل ناموفق</option></select><button class="btn primary sm" data-a="deliver" data-id="${o.id}">ثبت</button></div>`
  :pill(o.status,statusClass(o.status));
 const dispRow=d=>{
  const list=d.orders.map(ordById).filter(Boolean),done=list.every(o=>o.status!=='در حال ارسال');
  const inv=list.map(o=>`<tr><td><a href="order-detail.html?id=${o.id}">FL-${o.id}</a></td><td>${esc(o.customer)}</td><td style="white-space:normal">${itemsShort(o)}</td><td>${money(total(o))}</td><td><button class="btn ghost sm" data-a="pi" data-id="${o.id}" data-d="${d.id}">🖨</button></td><td>${resultCtl(o)}</td></tr>`).join('');
  return `<tr><td><b>${fa(d.id)}</b></td><td>${esc(d.driver)}</td><td>${esc(d.distributor)}</td><td>${fa(list.length)}</td><td>${money(dispTotal(d))}</td><td>${pill(done?'تکمیل شد':'در مسیر',done?'done':'shipping')}</td>
  <td><div class="wh-acts"><button class="btn ghost sm" data-a="pp" data-id="${d.id}">🖨 کالا</button><button class="btn ghost sm" data-a="pc" data-id="${d.id}">🖨 مشتری</button><button class="btn soft sm" data-a="tg" data-id="${d.id}">فاکتورها ▾</button></div></td></tr>
  <tr id="dd${d.id}" class="wh-sub wh-hide"><td colspan="7">${d.veh?`<p class="sub" style="margin:8px 0">خودرو: ${esc(d.veh)}</p>`:''}<table><thead><tr><th>فاکتور</th><th>مشتری</th><th>اقلام</th><th>مبلغ</th><th></th><th>وضعیت / ثبت تحویل</th></tr></thead><tbody>${inv}</tbody></table></td></tr>`;
 };
 const dayRows=dk.slice(0,dayLimit).map(date=>{
  const ds=days[date],n=ds.reduce((a,d)=>a+d.orders.length,0),sum=ds.reduce((a,d)=>a+dispTotal(d),0);
  return `<tr class="wh-day"><td colspan="7">${esc(date)} · ${fa(ds.length)} خروجی · ${fa(n)} فاکتور · جمع روز: ${money(sum)}</td></tr>${ds.map(dispRow).join('')}`;
 }).join('');
 c.innerHTML=head('ارسال و تحویل','خروجی‌های روزانه با فاکتور، راننده و مأمور پخش',`<button class="btn primary" id="dnew">＋ ثبت خروجی جدید${ready.length?` (${fa(ready.length)} آماده)`:''}</button>`)+
 (orphan.length?`<section class="panel"><b>در مسیر (بدون خروجی ثبت‌شده)</b><div class="tablewrap"><table><tbody>${orphan.map(o=>`<tr><td>FL-${o.id}</td><td>${esc(o.customer)}</td><td>${money(total(o))}</td><td>${resultCtl(o)}</td></tr>`).join('')}</tbody></table></div></section>`:'')+
 `<section class="panel">${dk.length?`<div class="tablewrap"><table><thead><tr><th>خروجی</th><th>راننده</th><th>مأمور پخش</th><th>فاکتور</th><th>جمع مبلغ</th><th>وضعیت</th><th></th></tr></thead><tbody>${dayRows}</tbody></table></div>
  ${dk.length>dayLimit?`<div style="text-align:center;margin-top:14px"><button class="btn outline" data-a="more">نمایش روزهای قبل</button></div>`:''}`:empty('هنوز خروجی ثبت نشده است.')}</section>`;

 $('#dnew').onclick=()=>{
  if(!ready.length)return alert('سفارشی آماده ارسال نیست. ابتدا در «درخواست‌های ورودی» سفارش‌ها را تأیید و آماده کنید.');
  openModal('ثبت خروجی جدید',
   `<div class="tablewrap"><table><thead><tr><th></th><th>فاکتور</th><th>مشتری</th><th>مبلغ</th></tr></thead><tbody>${ready.map(o=>`<tr><td><input type="checkbox" class="pick" value="${o.id}" checked></td><td>FL-${o.id}</td><td>${esc(o.customer)}</td><td>${money(total(o))}</td></tr>`).join('')}</tbody></table></div>
   <div class="formgrid" style="margin-top:14px">
    <div class="group"><label>راننده *</label><input class="field" id="drv" list="drvl" placeholder="انتخاب یا نام جدید"><datalist id="drvl">${db.drivers.map(x=>`<option value="${esc(x)}">`).join('')}</datalist></div>
    <div class="group"><label>مأمور پخش همراه *</label><input class="field" id="dst" list="dstl" placeholder="انتخاب یا نام جدید"><datalist id="dstl">${db.distributors.map(x=>`<option value="${esc(x)}">`).join('')}</datalist></div>
    <div class="group"><label>خودرو / پلاک (اختیاری)</label><input class="field" id="veh"></div>
    <div class="group"><label>تاریخ خروج</label><input class="field" id="ddate" value="${fmtDate()}"></div></div>
   <p class="sub" style="margin:12px 0 0">کالا به روش «نزدیک‌ترین انقضا اول» از بچ‌ها کسر می‌شود (بچ منقضی برداشته نمی‌شود).</p>`,
   'ثبت خروجی و ارسال',()=>{
    const ids=[...document.querySelectorAll('.pick')].filter(x=>x.checked).map(x=>+x.value);
    const driver=$('#drv').value.trim(),distributor=$('#dst').value.trim();
    if(!ids.length){alert('حداقل یک فاکتور انتخاب کنید.');return false}
    if(!driver||!distributor){alert('راننده و مأمور پخش را مشخص کنید.');return false}
    const orders=ids.map(ordById),need={};
    orders.forEach(o=>o.items.forEach(x=>need[x.product]=(need[x.product]||0)+x.qty));
    const short=Object.keys(need).find(pid=>avail(pid)<need[pid]);
    if(short){alert('موجودی قابل فروش کافی نیست: '+prod(short).name);return false}
    const id=Math.max(0,...db.dispatches.map(d=>d.id))+1,date=$('#ddate').value.trim()||fmtDate(),veh=$('#veh').value.trim();
    orders.forEach(o=>{
     o.items.forEach(x=>logMove('invoice',x.product,x.qty,`فاکتور FL-${o.id} · ${o.customer}`,`خروجی ${id}`,{sellable:true,order:o.id,driver,dist:distributor}));
     setStatus(o,'در حال ارسال',`ارسال با خروجی ${id} · راننده ${driver} · مأمور پخش ${distributor}`);
    });
    if(!db.drivers.includes(driver))db.drivers.push(driver);
    if(!db.distributors.includes(distributor))db.distributors.push(distributor);
    db.dispatches.unshift({id,date,driver,distributor,veh,orders:ids});
    save();render(page);
   });
 };

 c.onclick=e=>{
  const b=e.target.closest('[data-a]');if(!b)return;
  const a=b.dataset.a;
  if(a==='more'){dayLimit+=7;return render(page)}
  if(a==='tg'){document.getElementById('dd'+b.dataset.id)?.classList.toggle('wh-hide');return}
  if(a==='pp')return printDispatch(b.dataset.id,'product');
  if(a==='pc')return printDispatch(b.dataset.id,'customer');
  if(a==='pi')return printOrder(b.dataset.id,b.dataset.d);
  if(a==='deliver'){
   const o=ordById(b.dataset.id),res=c.querySelector(`[data-res="${b.dataset.id}"]`).value;
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
   ۳) ورود به انبار / خروج از انبار (دو صفحه جدا، با فیلتر، مدال و صفحه‌بندی)
   ===================================================== */
const blankLF=()=>({from:'',to:'',fromT:'',toT:'',pid:'',cat:'',type:'',q:'',page:1,size:20});
const LF={in:blankLF(),out:blankLF()};
let preUsed=false;
function ledgerPage(kind){
 const isIn=kind==='in',st=LF[kind],sign=isIn?1:-1;
 const types=Object.keys(MV).filter(k=>MV[k][1]===sign);
 const manual=types.filter(k=>k!=='invoice');
 return (c,page)=>{
  sync();
  const rows=()=>db.stockLog.filter(x=>{
   if(!MV[x.type]||MV[x.type][1]!==sign)return false;
   const p=prod(x.pid),iso=isoOf(x);
   if(st.from&&iso<st.from)return false;
   if(st.to&&iso>st.to)return false;
   if(st.pid&&x.pid!=st.pid)return false;
   if(st.cat&&p?.cat!==st.cat)return false;
   if(st.type&&x.type!==st.type)return false;
   return !st.q||[p?.name,x.ref,x.doc,x.batchNo,x.driver,x.dist].join(' ').includes(st.q);
  });
  c.innerHTML=head(isIn?'ورود به انبار':'خروج از انبار',isIn?'خرید، مرجوعی مشتری و اضافی انبارگردانی':'فاکتور، مرجوعی، فاسدشدگی، دورریز و کسری انبارگردانی',
   `<button class="btn primary" id="wnew">＋ ثبت ${isIn?'ورود':'خروج'} جدید</button><button class="btn outline" id="wcsv">⬇ خروجی اکسل</button>`)+
  `<section class="panel"><div class="wh-bar">
   <input class="field" data-f="q" placeholder="جستجو: کالا، بچ، شرح، راننده..." value="${esc(st.q)}" style="min-width:190px">
   <select class="field" data-f="pid"><option value="">همه کالاها</option>${db.products.map(p=>`<option value="${p.id}" ${st.pid==p.id?'selected':''}>${esc(p.name)}</option>`).join('')}</select>
   <select class="field" data-f="cat"><option value="">همه دسته‌ها</option>${db.categories.map(x=>`<option ${st.cat===x.name?'selected':''}>${esc(x.name)}</option>`).join('')}</select>
   <select class="field" data-f="type"><option value="">همه انواع</option>${types.map(k=>`<option value="${k}" ${st.type===k?'selected':''}>${shortLbl(MV[k][0])}</option>`).join('')}</select>
   <input class="field" data-f="from" placeholder="از تاریخ" value="${esc(st.fromT)}" style="width:105px"><input class="field" data-f="to" placeholder="تا تاریخ" value="${esc(st.toT)}" style="width:105px">
   <button class="btn ghost sm" id="wclr" hidden>پاک‌کردن فیلترها</button></div><div id="wl"></div></section>`;

  const active=()=>st.from||st.to||st.pid||st.cat||st.type||st.q;
  const draw=()=>{
   const all=rows(),pg=pgHTML(all.length,st),f=(st.page-1)*st.size,part=all.slice(f,f+st.size);
   $('#wclr').hidden=!active();
   $('#wl').innerHTML=part.length?`<div class="tablewrap"><table><thead><tr><th>تاریخ</th><th>کالا</th><th>نوع</th><th>تعداد</th><th>بچ / انقضا</th><th>شرح و سند</th><th></th></tr></thead><tbody>${
    part.map(x=>{const p=prod(x.pid),m=/^خروجی (\d+)$/.exec(x.doc||'');
     return `<tr><td>${esc(x.date)}</td><td><div class="wh-two">${esc(p?.name)}<small>${esc(p?.cat||'')}</small></div></td><td>${pill(shortLbl(MV[x.type][0]),mvClass(x.type))}</td>
     <td dir="ltr" style="text-align:right"><b>${x.qty>0?'+':'−'}${fa(Math.abs(x.qty))}</b> <small>${esc(unitOf(x.pid))}</small></td>
     <td><div class="wh-two">${esc(x.batchNo||'—')}<small>${x.exp?'انقضا '+fmtJ(x.exp):'بدون انقضا'}</small></div></td>
     <td><div class="wh-two">${esc(x.ref||'—')}<small>${esc(x.doc||'')}${x.driver||x.dist?` · راننده ${esc(x.driver||'—')} · مأمور ${esc(x.dist||'—')}`:''}</small></div></td>
     <td>${m?`<div class="wh-acts"><button class="btn ghost sm" data-a="pp" data-id="${m[1]}">🖨 کالا</button><button class="btn ghost sm" data-a="pc" data-id="${m[1]}">🖨 مشتری</button></div>`:''}</td></tr>`}).join('')}</tbody></table></div>${pg}`
    :empty('موردی با این فیلترها یافت نشد.');
  };
  draw();

  const openNew=(pre={})=>{
   openModal(isIn?'ثبت ورود جدید':'ثبت خروج جدید',
    `<div class="formgrid">
     <div class="group"><label>نوع ثبت</label><select class="field" id="mt">${manual.map(k=>`<option value="${k}">${shortLbl(MV[k][0])}</option>`).join('')}</select></div>
     <div class="group"><label>کالا</label><select class="field" id="mp">${db.products.map(p=>`<option value="${p.id}" ${p.id==pre.pid?'selected':''}>${esc(p.name)} (${fa(p.stock)} ${esc(p.unit)})</option>`).join('')}</select></div>
     <div class="group"><label>تعداد</label><input class="field" id="mq" type="number" min="1" value="1"></div>
     <div class="group"><label id="mrl"></label><input class="field" id="mr"></div></div>
     <div class="formgrid" id="mextra" style="margin-top:14px"></div>`,
    'ثبت در انبار',()=>{
     const type=$('#mt').value,pid=+$('#mp').value,qty=Math.floor(+normDigits($('#mq').value)),ref=$('#mr').value.trim(),o={};
     if(!(qty>=1)){alert('تعداد معتبر وارد کنید.');return false}
     if(type!=='purchase'&&!ref){alert('شرح یا علت را وارد کنید.');return false}
     if(isIn){
      const ex=$('#mx').value.trim();
      if(ex){o.exp=parseJ(ex);if(!o.exp){alert('تاریخ انقضا معتبر نیست. نمونه: ۱۴۰۶/۰۵/۱۰');return false}}
      o.batchNo=$('#mb').value.trim()||undefined;
     }else{
      const bid=$('#mbs').value;
      if(bid){const b=db.batches.find(x=>x.id===bid);if(!b||b.qty<qty){alert('موجودی بچ انتخاب‌شده کافی نیست.');return false}o.batchId=bid}
      else if(prod(pid).stock<qty){alert('موجودی انبار برای این خروج کافی نیست.');return false}
     }
     logMove(type,pid,qty,ref,'ثبت دستی',o);save();
     Object.assign(st,{from:'',to:'',fromT:'',toT:'',pid:'',cat:'',type:'',q:'',page:1});render(page);
    });
   const drawExtra=()=>{
    const t=$('#mt').value,pid=+$('#mp').value;
    $('#mrl').textContent=MV[t][2]||'شرح';
    $('#mextra').innerHTML=isIn
     ?`<div class="group"><label>شماره بچ (خالی = خودکار)</label><input class="field" id="mb"></div><div class="group"><label>تاریخ انقضا (شمسی، مثل ۱۴۰۶/۰۵/۱۰)</label><input class="field" id="mx" placeholder="اختیاری"></div>`
     :`<div class="group" style="grid-column:1/-1"><label>بچ برداشت</label><select class="field" id="mbs"><option value="">خودکار (نزدیک‌ترین انقضا اول)</option>${db.batches.filter(b=>b.pid==pid&&b.qty>0).sort(byExp).map(b=>`<option value="${b.id}">${esc(b.no)} · ${b.exp?'انقضا '+fmtJ(b.exp):'بدون انقضا'} · ${fa(b.qty)} ${esc(unitOf(pid))}</option>`).join('')}</select></div>`;
   };
   drawExtra();$('#mt').onchange=drawExtra;$('#mp').onchange=drawExtra;
  };
  $('#wnew').onclick=()=>openNew();
  $('#wcsv').onclick=()=>exportCSV(`stock-${kind}.csv`,[['تاریخ','کالا','دسته','نوع','تعداد','نوع کالا','شماره بچ','انقضا','شرح','سند','راننده','مأمور پخش']].concat(
   rows().map(x=>[x.date,prod(x.pid)?.name,prod(x.pid)?.cat,MV[x.type][0],x.qty,unitOf(x.pid),x.batchNo||'',x.exp?fmtJ(x.exp):'',x.ref,x.doc,x.driver,x.dist])));
  $('#wclr').onclick=()=>{Object.assign(st,{from:'',to:'',fromT:'',toT:'',pid:'',cat:'',type:'',q:'',page:1});render(page)};
  c.oninput=e=>{if(e.target.dataset.f==='q'){st.q=e.target.value.trim();st.page=1;draw()}};
  c.onchange=e=>{
   if(pgSize(e,st,draw))return;
   const f=e.target.dataset.f;if(!f||f==='q')return;
   const v=e.target.value.trim();
   if(f==='from'||f==='to'){
    if(v){const iso=parseJ(v);if(!iso){alert('تاریخ معتبر نیست. نمونه: ۱۴۰۵/۰۸/۱۵');e.target.value=st[f+'T'];return}st[f]=iso;st[f+'T']=v}
    else{st[f]='';st[f+'T']=''}
   }else st[f]=v;
   st.page=1;draw();
  };
  c.onclick=e=>{
   if(pgClick(e,st,draw))return;
   const b=e.target.closest('[data-a]');if(b)printDispatch(b.dataset.id,b.dataset.a==='pp'?'product':'customer');
  };
  const pre=new URLSearchParams(location.search).get('pid');
  if(isIn&&pre&&!preUsed){preUsed=true;openNew({pid:+pre})}
 };
}
registerPage('stock-in',ledgerPage('in'));
registerPage('stock-out',ledgerPage('out'));
registerPage('inventory',()=>{location.replace('stock-in.html')}); /* سازگاری با صفحه‌ی قدیمی */

/* =====================================================
   ۴) وضعیت موجودی: هر کالا به چه سطحی رسیده است
   ===================================================== */
function level(p){
 const s=p.stock,m=p.min;
 if(s<=0)return 'out';
 if(m<=0)return 'ok';
 return s<=m*0.5?'crit':s<=m?'low':s<=m*3?'ok':'high';
}
const LVL={out:['تمام شده','rejected','#e0626f'],crit:['بحرانی','rejected','#e0626f'],low:['کمبود','pending','#d9a441'],ok:['مناسب','done','#159b78'],high:['موجودی زیاد','shipping','#4a8fd9']};
const LORDER=['out','crit','low','ok','high'];
const SS={tab:'all',q:'',cat:'',page:1,size:20};
const levelGrp=p=>{const l=level(p);return l==='out'||l==='crit'?'crit':l};
registerPage('stock-status',(c,page)=>{
 sync();
 const cnt=k=>k==='all'?db.products.length:db.products.filter(p=>levelGrp(p)===k).length;
 const rows=()=>db.products.filter(p=>(SS.tab==='all'||levelGrp(p)===SS.tab)&&(!SS.cat||p.cat===SS.cat)&&(!SS.q||(p.name+p.cat).includes(SS.q)))
  .sort((a,b)=>LORDER.indexOf(level(a))-LORDER.indexOf(level(b))||a.name.localeCompare(b.name,'fa'));
 const suggest=p=>Math.max(0,p.min*2-p.stock);
 const dist=LORDER.map(k=>[k,db.products.filter(p=>level(p)===k).length]).filter(x=>x[1]);
 c.innerHTML=head('وضعیت موجودی','سطح موجودی هر کالا نسبت به حداقل تعیین‌شده',`<button class="btn outline" id="scsv">⬇ خروجی اکسل</button>`)+
 `<section class="panel"><div class="wh-dist">${dist.map(([k,n])=>`<span title="${LVL[k][0]}: ${fa(n)}" style="width:${n/db.products.length*100}%;background:${LVL[k][2]}"></span>`).join('')}</div>
  ${tabsHTML([['all','همه',cnt('all')],['crit','تمام‌شده / بحرانی',cnt('crit')],['low','کمبود',cnt('low')],['ok','مناسب',cnt('ok')],['high','موجودی زیاد',cnt('high')]],SS.tab)}
  <div class="wh-bar"><input class="field" data-f="q" placeholder="جستجوی کالا..." value="${esc(SS.q)}" style="min-width:190px">
  <select class="field" data-f="cat"><option value="">همه دسته‌ها</option>${db.categories.map(x=>`<option ${SS.cat===x.name?'selected':''}>${esc(x.name)}</option>`).join('')}</select></div><div id="sl"></div></section>`;
 const draw=()=>{
  const all=rows(),pg=pgHTML(all.length,SS),f=(SS.page-1)*SS.size,part=all.slice(f,f+SS.size);
  $('#sl').innerHTML=part.length?`<div class="tablewrap"><table><thead><tr><th>کالا</th><th>موجودی</th><th>حداقل</th><th style="width:170px">سطح</th><th>وضعیت</th><th>پیشنهاد خرید</th><th></th></tr></thead><tbody>${
   part.map(p=>{const l=level(p),pct=Math.min(100,Math.round(p.stock/Math.max(p.min*3,1)*100)),av=avail(p.id);
    return `<tr><td><div class="wh-two">${esc(p.name)}<small>${esc(p.cat)}</small></div></td>
    <td><div class="wh-two"><b>${fa(p.stock)}</b> ${esc(p.unit)}${av!==p.stock?`<small>قابل فروش: ${fa(av)}</small>`:''}</div></td><td>${fa(p.min)}</td>
    <td><div class="wh-lv"><i style="width:${pct}%;background:${LVL[l][2]}"></i><u style="right:33.3%"></u></div></td>
    <td>${pill(LVL[l][0],LVL[l][1])}</td><td>${suggest(p)&&(l==='out'||l==='crit'||l==='low')?`${fa(suggest(p))} ${esc(p.unit)}`:'—'}</td>
    <td><a class="btn ghost sm" href="stock-in.html?pid=${p.id}">＋ ثبت ورود</a></td></tr>`}).join('')}</tbody></table></div>${pg}`:empty('کالایی یافت نشد.');
 };
 draw();
 $('#scsv').onclick=()=>exportCSV('stock-status.csv',[['کالا','دسته','نوع کالا','موجودی','قابل فروش','حداقل','وضعیت','پیشنهاد خرید']].concat(
  rows().map(p=>[p.name,p.cat,p.unit,p.stock,avail(p.id),p.min,LVL[level(p)][0],suggest(p)])));
 c.oninput=e=>{if(e.target.dataset.f==='q'){SS.q=e.target.value.trim();SS.page=1;draw()}};
 c.onchange=e=>{if(pgSize(e,SS,draw))return;if(e.target.dataset.f==='cat'){SS.cat=e.target.value;SS.page=1;draw()}};
 c.onclick=e=>{
  if(pgClick(e,SS,draw))return;
  const t=e.target.closest('[data-tab]');if(t){SS.tab=t.dataset.tab;SS.page=1;render(page)}
 };
});

/* =====================================================
   ۵) بچ‌ها و تاریخ انقضا
   ===================================================== */
const BS={tab:'all',q:'',page:1,size:20};
registerPage('batches',(c,page)=>{
 sync();
 const all=[...db.batches].sort(byExp),cnt=k=>k==='all'?all.length:all.filter(b=>expInfo(b.exp)[2]===k).length;
 const rows=()=>all.filter(b=>(BS.tab==='all'||expInfo(b.exp)[2]===BS.tab)&&(!BS.q||(prod(b.pid)?.name+b.no).includes(BS.q)));
 const acts={spoiled:'ثبت فاسدی',discard:'دورریز',return_supplier:'مرجوع به فروشنده',return_factory:'مرجوع به کارخانه'};
 c.innerHTML=head('بچ‌ها و تاریخ انقضا','فروش به روش نزدیک‌ترین انقضا اول انجام می‌شود و بچ منقضی فروخته نمی‌شود')+
 `<section class="panel">${tabsHTML([['all','همه',cnt('all')],['expired','منقضی',cnt('expired')],['near','نزدیک انقضا',cnt('near')],['ok','سالم',cnt('ok')],['none','بدون تاریخ',cnt('none')]],BS.tab)}
  <div class="wh-bar"><input class="field" data-f="q" placeholder="جستجوی کالا یا شماره بچ..." value="${esc(BS.q)}" style="min-width:210px"></div><div id="bl"></div></section>`;
 const draw=()=>{
  const list=rows(),pg=pgHTML(list.length,BS),f=(BS.page-1)*BS.size,part=list.slice(f,f+BS.size);
  $('#bl').innerHTML=part.length?`<div class="tablewrap"><table><thead><tr><th>کالا</th><th>شماره بچ</th><th>موجودی</th><th>تاریخ ورود</th><th>انقضا</th><th>وضعیت</th><th></th></tr></thead><tbody>${
   part.map(b=>{const [t,cl]=expInfo(b.exp);return `<tr><td><div class="wh-two">${esc(prod(b.pid)?.name)}<small>${esc(prod(b.pid)?.cat||'')}</small></div></td><td>${esc(b.no)}</td><td>${fa(b.qty)} ${esc(unitOf(b.pid))}</td><td>${esc(b.date||'—')}</td><td>${fmtJ(b.exp)}</td><td>${pill(t,cl)}</td>
   <td><button class="btn ghost sm" data-a="bact" data-id="${b.id}">اقدام</button></td></tr>`}).join('')}</tbody></table></div>${pg}`:empty('بچی یافت نشد.');
 };
 draw();
 c.oninput=e=>{if(e.target.dataset.f==='q'){BS.q=e.target.value.trim();BS.page=1;draw()}};
 c.onchange=e=>pgSize(e,BS,draw);
 c.onclick=e=>{
  if(pgClick(e,BS,draw))return;
  const t=e.target.closest('[data-tab]');if(t){BS.tab=t.dataset.tab;BS.page=1;return render(page)}
  const bt=e.target.closest('[data-a="bact"]');if(!bt)return;
  const b=db.batches.find(x=>x.id===bt.dataset.id);if(!b)return;
  const isExp=expInfo(b.exp)[2]==='expired';
  openModal(`اقدام روی بچ ${esc(b.no)}`,
   `<p class="sub" style="margin-top:0">${esc(prod(b.pid)?.name)} · موجودی ${fa(b.qty)} ${esc(unitOf(b.pid))} · ${b.exp?'انقضا '+fmtJ(b.exp):'بدون انقضا'}</p>
   <div class="formgrid"><div class="group"><label>نوع اقدام</label><select class="field" id="bt">${Object.entries(acts).map(([k,v])=>`<option value="${k}">${v}</option>`).join('')}</select></div>
   <div class="group"><label>تعداد (حداکثر ${fa(b.qty)})</label><input class="field" id="bq" type="number" min="1" max="${b.qty}" value="${b.qty}"></div></div>
   <div class="group" style="margin-top:12px"><label>شرح / علت</label><input class="field" id="bw" value="${isExp?'انقضای تاریخ مصرف':''}"></div>`,
   'ثبت اقدام',()=>{
    const type=$('#bt').value,q=Math.floor(+normDigits($('#bq').value));
    if(!(q>=1&&q<=b.qty)){alert('تعداد معتبر نیست.');return false}
    logMove(type,b.pid,q,$('#bw').value.trim()||acts[type],'اقدام روی بچ',{batchId:b.id});save();render(page);
   });
 };
});

/* =====================================================
   ۶) دسته‌بندی کالاها (دسته، نوع کالا، حداقل موجودی)
   ===================================================== */
const CS={tab:'products',q:'',cat:'',page:1,size:20};
registerPage('categories',(c,page)=>{
 sync();
 const unitSel=(cur,attr)=>`<select class="field" ${attr} style="min-width:120px;padding:6px 8px;font-size:12px">${db.units.map(u=>`<option ${u===cur?'selected':''}>${esc(u)}</option>`).join('')}</select>`;
 const rows=()=>db.products.filter(p=>(!CS.cat||p.cat===CS.cat)&&(!CS.q||p.name.includes(CS.q)));
 c.innerHTML=head('دسته‌بندی کالاها','دسته‌ها، نوع کالا (کارتن، بسته، کیلو، ...) و حداقل موجودی هر کالا',`<button class="btn primary" id="cnew">＋ دسته جدید</button>`)+
 `<section class="panel">${tabsHTML([['products','کالاها',db.products.length],['cats','دسته‌ها',db.categories.length]],CS.tab)}
  <div class="wh-bar" ${CS.tab==='products'?'':'hidden'}><input class="field" data-f="q" placeholder="جستجوی کالا..." value="${esc(CS.q)}" style="min-width:190px">
  <select class="field" data-f="cat"><option value="">همه دسته‌ها</option>${db.categories.map(x=>`<option ${CS.cat===x.name?'selected':''}>${esc(x.name)}</option>`).join('')}</select></div><div id="cl"></div></section>`;
 const draw=()=>{
  if(CS.tab==='cats'){
   $('#cl').innerHTML=`<div class="tablewrap"><table><thead><tr><th>دسته</th><th>نوع کالا (پیش‌فرض)</th><th>تعداد کالا</th><th>جمع موجودی</th><th></th></tr></thead><tbody>${
    db.categories.map(cat=>{const a=db.products.filter(p=>p.cat===cat.name);return `<tr><td><b>${esc(cat.name)}</b></td><td>${unitSel(cat.unit,`data-cu="${esc(cat.name)}"`)}</td><td>${fa(a.length)}</td><td>${fa(a.reduce((s,p)=>s+p.stock,0))}</td><td>${a.length?'':`<button class="btn ghost sm" data-del="${esc(cat.name)}">حذف</button>`}</td></tr>`}).join('')}</tbody></table></div>`;
   return;
  }
  const all=rows(),pg=pgHTML(all.length,CS),f=(CS.page-1)*CS.size,part=all.slice(f,f+CS.size);
  $('#cl').innerHTML=part.length?`<div class="tablewrap"><table><thead><tr><th>کالا</th><th>دسته</th><th>نوع کالا</th><th>تعداد در کارتن/بسته</th><th>حداقل موجودی</th></tr></thead><tbody>${
   part.map(p=>`<tr><td>${p.emoji||''} ${esc(p.name)}</td>
   <td><select class="field" data-cat="${p.id}" style="min-width:130px;padding:6px 8px;font-size:12px">${db.categories.map(x=>`<option ${x.name===p.cat?'selected':''}>${esc(x.name)}</option>`).join('')}</select></td>
   <td>${unitSel(p.unit,`data-unit="${p.id}"`)}</td>
   <td><input class="field" type="number" min="1" data-pack="${p.id}" value="${p.pack}" style="max-width:80px;padding:6px 8px"></td>
   <td><input class="field" type="number" min="0" data-min="${p.id}" value="${p.min}" style="max-width:80px;padding:6px 8px"></td></tr>`).join('')}</tbody></table></div>${pg}`:empty('کالایی یافت نشد.');
 };
 draw();
 $('#cnew').onclick=()=>openModal('دسته جدید',
  `<div class="formgrid"><div class="group"><label>نام دسته *</label><input class="field" id="newcat" placeholder="مثلاً لبنیات"></div>
  <div class="group"><label>نوع کالا در این دسته *</label><input class="field" id="newunit" list="unitl" value="${esc(db.units[0])}"><datalist id="unitl">${db.units.map(u=>`<option value="${esc(u)}">`).join('')}</datalist></div></div>`,
  'افزودن دسته',()=>{
   const n=$('#newcat').value.trim(),u=$('#newunit').value.trim();
   if(!n||!u){alert('نام دسته و نوع کالا را وارد کنید.');return false}
   if(db.categories.some(x=>x.name===n)){alert('این دسته قبلاً ثبت شده است.');return false}
   if(!db.units.includes(u))db.units.push(u);
   db.categories.push({name:n,unit:u});save();render(page);
  });
 c.oninput=e=>{if(e.target.dataset.f==='q'){CS.q=e.target.value.trim();CS.page=1;draw()}};
 c.onchange=e=>{
  if(pgSize(e,CS,draw))return;
  const d=e.target.dataset;
  if(d.f==='cat'){CS.cat=e.target.value;CS.page=1;return draw()}
  if(d.cu!==undefined)db.categories.find(x=>x.name===d.cu).unit=e.target.value;
  else if(d.cat)prod(d.cat).cat=e.target.value;
  else if(d.unit)prod(d.unit).unit=e.target.value;
  else if(d.pack)prod(d.pack).pack=Math.max(1,Math.floor(+e.target.value)||1);
  else if(d.min)prod(d.min).min=Math.max(0,Math.floor(+e.target.value)||0);
  else return;
  save();render(page);
 };
 c.onclick=e=>{
  if(pgClick(e,CS,draw))return;
  const t=e.target.closest('[data-tab]');if(t){CS.tab=t.dataset.tab;CS.page=1;return render(page)}
  const b=e.target.closest('[data-del]');if(b){db.categories=db.categories.filter(x=>x.name!==b.dataset.del);save();render(page)}
 };
});
