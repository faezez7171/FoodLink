/* پنل انباردار - Food Link (نسخه ۴)
   صفحات: warehouse · deliveries · stock-in · stock-out · stock-table · batches · categories
   وابسته به core.js و common-pages.js (باید قبل از این فایل لود شوند) */

/* ⚙ تنظیم دسترسی انباردار: چه انواعی را می‌تواند «ورود» یا «خروج» ثبت کند */
const ENTRY_TYPES=['purchase','customer_return','adjust_in'];
const EXIT_TYPES=['invoice','return_supplier','return_factory','spoiled','discard','adjust_out'];

navs.warehouse=[
 ['warehouse','▣','سفارش‌ها'],
 ['deliveries','➤','ارسال و تحویل'],
 ['stock-in','↧','ورود به انبار'],
 ['stock-out','↥','خروج از انبار'],
 ['stock-table','▤','موجودی انبار'],
 ['batches','⏱','بچ‌ها و انقضا'],
 ['categories','◈','کالاها و واحدها']
];

/* ================= ظاهر مدرن و بزرگ‌تر پنل ================= */
(function(){const s=document.createElement('style');s.textContent=`
:root{--wh-g:linear-gradient(135deg,#7654b7,#4f6bed)}
@supports (color:color-mix(in srgb,red,blue)){:root{--wh-g:linear-gradient(135deg,var(--accent),color-mix(in srgb,var(--accent) 55%,#3b82f6))}}
*{scrollbar-width:thin;scrollbar-color:var(--line) transparent}
body{font-size:15px;background:radial-gradient(1100px 520px at 90% -8%,color-mix(in srgb,var(--accent) 11%,transparent),transparent),var(--bg);accent-color:var(--accent)}
@media(min-width:901px){.sidebar{width:276px}.main{margin-right:276px}}
.sidebar{background:color-mix(in srgb,var(--surface) 90%,transparent);backdrop-filter:blur(16px);padding:26px 18px}
.brand{font-size:21px}.brand .logo{width:44px;height:44px;border-radius:15px;background:var(--wh-g);box-shadow:0 10px 22px -8px var(--accent)}
.nav a{position:relative;border-radius:14px;padding:11px 12px;font-size:15px;align-items:center;transition:background .2s,color .2s}
.nav a span{width:34px;height:34px;border-radius:11px;display:grid;place-items:center;background:var(--bg);font-size:16px;flex:none;transition:.2s}
.nav a:hover,.nav a.active{background:linear-gradient(270deg,var(--accent-soft),transparent)}
.nav a.active span{background:var(--wh-g);color:#fff;box-shadow:0 8px 16px -8px var(--accent)}
.nav a.active:before{content:'';position:absolute;right:-18px;top:20%;bottom:20%;width:4px;border-radius:4px 0 0 4px;background:var(--accent)}
.topbar{height:76px;padding:0 40px;background:color-mix(in srgb,var(--surface) 78%,transparent);backdrop-filter:saturate(1.5) blur(16px)}
.content{max-width:1680px;padding:34px 40px 60px}
.panel{border-radius:22px;padding:24px 26px;border:1px solid color-mix(in srgb,var(--line) 70%,transparent);box-shadow:0 1px 2px #1018280a,0 18px 40px -26px #10182855;animation:whIn .35s ease both;margin-bottom:22px}
@keyframes whIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
.btn{border-radius:13px;padding:12px 20px;font-size:14px;transition:transform .15s,box-shadow .2s,background .2s,border-color .2s}
.btn:hover{transform:translateY(-1px)}
.btn.primary{background:var(--wh-g);box-shadow:0 12px 22px -12px var(--accent)}
.btn.sm{padding:7px 13px;font-size:12.5px;border-radius:10px}
.btn.ghost{background:transparent;color:var(--muted);border:1px solid var(--line)}
.btn.ghost:hover{color:var(--accent);border-color:var(--accent);background:var(--accent-soft)}
.btn:disabled{opacity:.5;cursor:not-allowed;transform:none}
.field{border-radius:13px;padding:12px 14px;font-size:14px;transition:border-color .2s,box-shadow .2s;background:var(--surface)}
.field:focus,.field:focus-visible{border-color:var(--accent);box-shadow:0 0 0 4px color-mix(in srgb,var(--accent) 16%,transparent)}
.group label{font-size:13px;color:var(--muted);font-weight:600}
.status{display:inline-flex;align-items:center;gap:6px;padding:5px 12px;border-radius:99px;font-size:12px;font-weight:600}
.status:before{content:'';width:6px;height:6px;border-radius:50%;background:currentColor}
.panel table th{background:transparent;font-size:12px;letter-spacing:.2px;color:var(--muted);padding:12px 12px;border-bottom:1px solid var(--line)}
.panel table td{padding:15px 12px;font-size:14px;vertical-align:middle}
.panel table tbody tr{transition:background .15s}
.panel table tbody tr:hover td{background:color-mix(in srgb,var(--accent) 5%,transparent)}
.wh-head{display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap;margin-bottom:26px}
.wh-head h1{font-size:30px;margin:0;letter-spacing:-.3px}.wh-head p{margin:6px 0 0;color:var(--muted);font-size:14px}
.wh-bar{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-bottom:18px}
.wh-bar .field{width:auto;min-width:130px;padding:10px 12px;font-size:13.5px}
.wh-hero{background:var(--wh-g);color:#fff;border-radius:26px;padding:30px 34px;margin-bottom:24px;display:flex;justify-content:space-between;align-items:center;gap:24px;flex-wrap:wrap;position:relative;overflow:hidden;box-shadow:0 26px 50px -28px var(--accent)}
.wh-hero:before{content:'';position:absolute;left:-60px;top:-90px;width:300px;height:300px;border-radius:50%;background:#ffffff1c}
.wh-hero:after{content:'';position:absolute;left:180px;bottom:-110px;width:220px;height:220px;border-radius:50%;background:#ffffff12}
.wh-hero h1{margin:4px 0 8px;font-size:30px}.wh-hero p{margin:0;opacity:.92}.wh-hero small{opacity:.8}
.wh-hstats{display:flex;gap:14px;flex-wrap:wrap;position:relative;z-index:1}
.wh-hstats div{background:#ffffff26;backdrop-filter:blur(8px);border:1px solid #ffffff30;border-radius:18px;padding:14px 20px;min-width:118px;text-align:center}
.wh-hstats b{display:block;font-size:26px}.wh-hstats span{font-size:12px;opacity:.9}
.wh-tabs{display:inline-flex;gap:4px;background:var(--bg);padding:5px;border-radius:16px;margin-bottom:20px;overflow-x:auto;max-width:100%}
.wh-tabs button{background:none;border:0;padding:10px 18px;border-radius:12px;color:var(--muted);font-weight:600;white-space:nowrap;font-size:14px;transition:.2s}
.wh-tabs button.on{background:var(--surface);color:var(--accent);box-shadow:0 4px 14px -6px #1018283d}
.wh-tabs b{background:var(--surface);color:var(--muted);border-radius:99px;padding:1px 9px;font-size:11.5px;margin-right:8px}
.wh-tabs button.on b{background:var(--accent-soft);color:var(--accent)}
.wh-chips{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:20px}
.wh-chip{display:inline-flex;gap:8px;align-items:center;padding:9px 16px;border-radius:99px;background:var(--surface);border:1px solid var(--line);font-size:13px;transition:.2s}
.wh-chip:hover{border-color:var(--accent);transform:translateY(-1px)}.wh-chip i{width:9px;height:9px;border-radius:50%;display:inline-block}
.wh-two{line-height:1.75}.wh-two small{display:block;color:var(--muted);font-size:12px}
.wh-acts{display:flex;gap:6px;flex-wrap:nowrap}
.wh-empty{text-align:center;color:var(--muted);padding:56px 10px;font-size:15px}
.wh-empty:before{content:'🗂';display:block;font-size:44px;margin-bottom:10px;opacity:.75}
.wh-hide{display:none}
.panel table tbody tr.wh-sub:hover td{background:var(--bg)}.wh-sub td{background:var(--bg);padding:10px 18px 20px!important}
.wh-day td{background:var(--bg);font-weight:700;font-size:13px;color:var(--muted)}
.wh-pager{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-top:18px;flex-wrap:wrap;font-size:13px;color:var(--muted)}
.wh-pages{display:flex;gap:5px;align-items:center}
.wh-pages button{min-width:38px;height:38px;border:1px solid var(--line);background:var(--surface);color:var(--text);border-radius:11px;transition:.2s}
.wh-pages button:hover:not(:disabled){border-color:var(--accent);color:var(--accent)}
.wh-pages button.on{background:var(--wh-g);color:#fff;border-color:transparent}.wh-pages button:disabled{opacity:.35;cursor:default}
.wh-dist{display:flex;height:12px;border-radius:99px;overflow:hidden;background:var(--bg);margin-bottom:18px}
.wh-lv{height:9px;border-radius:99px;background:var(--bg);position:relative;overflow:hidden;min-width:130px}
.wh-lv i{display:block;height:100%;border-radius:99px}.wh-lv u{position:absolute;top:0;bottom:0;width:2px;background:var(--text);opacity:.3}
.wh-tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:16px;margin-bottom:22px}
.wh-tile{background:var(--surface);border:1px solid var(--line);border-radius:20px;padding:18px 20px;display:flex;gap:14px;align-items:center}
.wh-tile i{font-style:normal;width:46px;height:46px;border-radius:15px;display:grid;place-items:center;background:var(--accent-soft);font-size:21px;flex:none}
.wh-tile small{color:var(--muted);display:block}.wh-tile b{font-size:21px}
.wh-ov{position:fixed;inset:0;background:#0b122080;backdrop-filter:blur(6px);display:grid;place-items:center;z-index:50;padding:18px;animation:whFade .2s}
@keyframes whFade{from{opacity:0}to{opacity:1}}@keyframes whPop{from{opacity:0;transform:translateY(16px) scale(.97)}to{opacity:1;transform:none}}
.wh-md{background:var(--surface);color:var(--text);border-radius:24px;width:min(720px,100%);max-height:92vh;overflow:auto;box-shadow:0 40px 90px #0006;animation:whPop .28s cubic-bezier(.2,.9,.3,1.1)}
.wh-md.wide{width:min(980px,100%)}
.wh-mh{display:flex;justify-content:space-between;align-items:center;padding:20px 26px;border-bottom:1px solid var(--line)}
.wh-mh h3{margin:0;font-size:18px}.wh-mb{padding:24px 26px}
.wh-mf{display:flex;gap:10px;justify-content:flex-end;padding:18px 26px;border-top:1px solid var(--line)}
.wh-x{background:var(--bg);border:0;width:36px;height:36px;border-radius:12px;font-size:16px;color:var(--muted)}
.wh-toast{background:linear-gradient(135deg,#159b78,#34c79b);color:#fff;border-radius:16px;padding:14px 20px;margin-bottom:20px;font-weight:600;animation:whIn .3s}
.wh-user{display:flex;gap:12px;align-items:center;background:var(--bg);padding:12px 14px;border-radius:16px;color:var(--text)}
.wh-user small{display:block;color:var(--muted);font-size:11.5px}
.wh-av{width:40px;height:40px;border-radius:14px;background:var(--wh-g);color:#fff;display:grid;place-items:center;font-weight:800;flex:none}
.wz-steps{display:flex;margin-bottom:30px;gap:0}
.wz-step{flex:1;display:flex;align-items:center;gap:12px;color:var(--muted);font-weight:600;position:relative}
.wz-step b{width:38px;height:38px;border-radius:50%;display:grid;place-items:center;background:var(--bg);border:2px solid var(--line);flex:none;transition:.2s}
.wz-step:not(:last-child):after{content:'';flex:1;height:2px;background:var(--line);margin:0 14px;border-radius:2px}
.wz-step.on{color:var(--accent)}.wz-step.on b{background:var(--wh-g);color:#fff;border-color:transparent;box-shadow:0 8px 18px -8px var(--accent)}
.wz-step.done{color:var(--text)}.wz-step.done b{background:var(--accent-soft);color:var(--accent);border-color:var(--accent)}.wz-step.done:after{background:var(--accent)}
.wz-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:18px}
.wz-box{background:var(--bg);border-radius:20px;padding:20px 22px;margin-bottom:20px}
.wz-nav{display:flex;justify-content:space-between;gap:12px;margin-top:26px;padding-top:22px;border-top:1px dashed var(--line)}
.wz-unit{display:inline-flex;align-items:center;padding:12px 14px;border-radius:13px;background:var(--accent-soft);color:var(--accent);font-weight:700;min-height:46px}
.wz-kv{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px 24px}.wz-kv div{display:flex;flex-direction:column}.wz-kv small{color:var(--muted);font-size:12px}
tr:has(.pick:checked) td{background:var(--accent-soft)}
@media(max-width:900px){.content{padding:20px 16px 50px}.wh-head h1{font-size:24px}.wz-step span{display:none}.panel{padding:18px}.topbar{padding:0 16px}}
@media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
`;document.head.appendChild(s)})();


/* ================= ابزارهای عمومی ================= */
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const fa=n=>Number(n||0).toLocaleString('fa-IR');
const prod=id=>db.products.find(p=>p.id==id);
const ordById=id=>db.orders.find(o=>o.id==id);
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7);
const r3=n=>Math.round(n*1000)/1000; /* گرد کردن برای واحدهای اعشاری (کیلو، لیتر) */
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
const DEFAULT_UNITS=['عدد','قلم','کارتن','کارتن عدد','کارتن بسته','بسته','بسته کیلویی','کیلوگرم','لیتر','گونی','پالت'];
const byExp=(a,b)=>{const x=a.exp||'9999',y=b.exp||'9999';return x<y?-1:x>y?1:0};
(function initWarehouseData(){
 db.units=[...new Set([...(db.units||[]),...DEFAULT_UNITS])];
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
  const sum=r3(db.batches.filter(b=>b.pid==p.id).reduce((a,b)=>a+b.qty,0)), diff=r3(p.stock-sum);
  if(diff>0){const b=db.batches.find(x=>x.pid==p.id&&x.no==='اولیه');b?b.qty=r3(b.qty+diff):db.batches.push({id:uid(),pid:p.id,no:'اولیه',qty:diff,exp:null,date:fmtDate()});}
  else if(diff<0){let rem=-diff;db.batches.filter(b=>b.pid==p.id&&b.qty>0).sort(byExp).reverse().forEach(b=>{const t=Math.min(b.qty,rem);b.qty=r3(b.qty-t);rem=r3(rem-t)});}
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
 adjust_out:['خروج - کسری انبارگردانی',-1,'توضیح مغایرت'],
 opening:['ورود - موجودی اولیه',1,'']
};
const mvClass=t=>MV[t][1]>0?(t==='adjust_in'?'pending':t==='opening'?'shipping':'done'):(t==='invoice'?'shipping':(t==='spoiled'||t==='discard'?'rejected':'pending'));

/* ثبت حرکت: ورودی ← ساخت یا افزودن به بچ · خروجی ← برداشت از بچ مشخص یا خودکار با روش FEFO (نزدیک‌ترین انقضا اول)
   o: {batchNo, exp, batchId, sellable, order, driver, dist} */
function logMove(type,pid,qty,ref,doc,o={}){
 const p=prod(pid), sign=MV[type][1], used=[];
 if(sign>0){
  const no=o.batchNo||nextBatchNo(), exp=o.exp||null;
  const b=db.batches.find(x=>x.pid==pid&&x.no===no&&(x.exp||null)===exp);
  b?b.qty=r3(b.qty+qty):db.batches.push({id:uid(),pid:+pid,no,qty,exp,date:o.date||fmtDate()});
  used.push({no,exp,q:qty});
 }else{
  let rem=qty;
  const src=o.batchId?db.batches.filter(b=>b.id===o.batchId)
   :db.batches.filter(b=>b.pid==pid&&b.qty>0&&!(o.sellable&&daysLeft(b.exp)<0)).sort(byExp); /* در فروش، بچ منقضی برداشته نمی‌شود */
  src.forEach(b=>{if(rem<=0)return;const t=Math.min(b.qty,rem);b.qty=r3(b.qty-t);rem=r3(rem-t);used.push({no:b.no,exp:b.exp,q:t})});
  if(rem>0)throw new Error('موجودی کافی نیست');
 }
 p.stock=r3(p.stock+sign*qty);
 used.forEach(x=>db.stockLog.unshift({id:uid(),date:o.date||fmtDate(),iso:o.iso||todayISO(),type,pid:+pid,qty:sign*x.q,batchNo:x.no,exp:x.exp,ref:ref||'',doc:doc||'ثبت دستی',order:o.order||null,driver:o.driver||'',dist:o.dist||'',city:o.city||'',by:WH}));
 db.batches=db.batches.filter(b=>b.qty>0);
 return used;
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
 <div class="meta">${d.city?`<span>شهر مقصد: <b>${esc(d.city)}</b></span>`:''}<span>راننده: <b>${esc(d.driver)}</b></span><span>مأمور پخش: <b>${esc(d.distributor)}</b></span>${d.veh?`<span>خودرو: <b>${esc(d.veh)}</b></span>`:''}</div>`;
const sigs=(a,b,c)=>`<div class="sig"><div>${a}</div><div>${b}</div><div>${c}</div></div>`;

function invoiceSection(o,d){
 const rows=o.items.map((x,i)=>{const p=prod(x.product)||{};return `<tr><td>${fa(i+1)}</td><td>${esc(p.name)}</td><td>${esc(p.unit||'عدد')}</td><td>${fa(x.qty)}</td><td>${money(p.price)}</td><td>${money((p.price||0)*x.qty)}</td><td class="sm">${orderBatchText(o,x.product,d)}</td></tr>`}).join('');
 return `<section class="pg"><div class="hd"><div><h1>Food Link</h1>فاکتور خروج از انبار</div><div>شماره فاکتور: FL-${o.id}<br>تاریخ: ${esc(o.date)}${d?`<br>خروجی شماره ${fa(d.id)}`:''}</div></div>
 <div class="meta"><span>مشتری: <b>${esc(o.customer)}</b></span><span>شهر: <b>${esc((d&&d.city)||custCity(o)||'—')}</b></span><span>ثبت‌کننده: ${esc(o.by)}</span>${d?`<span>راننده: <b>${esc(d.driver)}</b></span><span>مأمور پخش: <b>${esc(d.distributor)}</b></span>${d.veh?`<span>خودرو: <b>${esc(d.veh)}</b></span>`:''}`:''}</div>
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
  const cover=`<section class="pg">${dispHead(d,'فهرست فاکتورهای خروجی (بر اساس مشتری)')}<table><thead><tr><th>ردیف</th><th>مشتری</th><th>شهر</th><th>فاکتور</th><th>اقلام</th><th>مبلغ</th></tr></thead><tbody>${
   list.map((o,i)=>`<tr><td>${fa(i+1)}</td><td>${esc(o.customer)}</td><td>${esc(custCity(o)||'—')}</td><td>FL-${o.id}</td><td>${fa(o.items.length)}</td><td>${money(total(o))}</td></tr>`).join('')}</tbody></table>
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
let FLASH='';
const takeFlash=()=>{const f=FLASH;FLASH='';return f?`<div class="wh-toast">✓ ${f}</div>`:''};
const head=(t,sub,act)=>`${takeFlash()}<div class="wh-head"><div><h1>${t}</h1>${sub?`<p>${sub}</p>`:''}</div><div class="wh-bar" style="margin:0">${act||''}</div></div>`;
const empty=t=>`<div class="wh-empty">${t}</div>`;
const shortLbl=l=>l.replace(/^(ورود|خروج) - /,'');
const tabsHTML=(items,cur)=>`<div class="wh-tabs">${items.map(([k,t,n])=>`<button data-tab="${k}" class="${cur===k?'on':''}">${t}${n==null?'':`<b>${fa(n)}</b>`}</button>`).join('')}</div>`;
const itemsShort=o=>{const a=o.items.map(x=>`${esc(prod(x.product)?.name)} × ${fa(x.qty)}`);return a.slice(0,2).join('، ')+(a.length>2?` و ${fa(a.length-2)} مورد دیگر`:'')};
const isoOf=x=>x.iso||parseJ(x.date)||'';
const custCity=o=>db.customers.find(x=>x.name===o.customer)?.city||'';
const cities=()=>[...new Set([...db.customers.map(x=>x.city),...db.dispatches.map(d=>d.city),...db.exits.map(d=>d.city)].filter(Boolean))];
const isDec=u=>/کیلو|لیتر|گرم/.test(u||'');
function qtyOf(v,unit){const n=Number(normDigits(v));if(!(n>0))return null;if(!isDec(unit)&&!Number.isInteger(n))return null;return r3(n)}
const todayFa=()=>fmtJ(todayISO());

function decorate(){
 const f=document.querySelector('.sidebarfoot');
 if(f)f.innerHTML=`<div class="wh-user"><span class="wh-av">ا</span><div><b>${WH}</b><small>انباردار · ${todayFa()}</small></div></div>`;
}
const reg=(n,fn)=>registerPage(n,(c,p)=>{decorate();return fn(c,p)});

/* پنجره (مدال): onOk اگر false برگرداند بسته نمی‌شود؛ okText=null یعنی فقط دکمه‌ی بستن */
function closeModal(){document.getElementById('whov')?.remove()}
function openModal(title,body,okText,onOk,wide){
 closeModal();
 const ov=document.createElement('div');ov.className='wh-ov';ov.id='whov';
 ov.innerHTML=`<div class="wh-md${wide?' wide':''}"><div class="wh-mh"><h3>${title}</h3><button class="wh-x" data-x>✕</button></div><div class="wh-mb">${body}</div><div class="wh-mf"><button class="btn outline" data-x>${okText===null?'بستن':'انصراف'}</button>${okText===null?'':`<button class="btn primary" id="whok">${okText}</button>`}</div></div>`;
 ov.onclick=e=>{if(e.target===ov||e.target.closest('[data-x]'))closeModal()};
 document.body.appendChild(ov);
 if(okText!==null)$('#whok').onclick=()=>{if(onOk()!==false)closeModal()};
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
 <label>در هر صفحه <select class="field" data-size style="width:auto;padding:6px 10px;font-size:13px">${[10,20,50].map(s=>`<option ${s===st.size?'selected':''}>${s}</option>`).join('')}</select></label></div>`;
}
function pgClick(e,st,redraw){const b=e.target.closest('[data-pg]');if(b&&!b.disabled){st.page=+b.dataset.pg;redraw();return true}return false}
function pgSize(e,st,redraw){const t=e.target;if(t.dataset&&t.dataset.size!==undefined){st.size=+t.value;st.page=1;redraw();return true}return false}
function exportCSV(name,rows){
 const csv='\ufeff'+rows.map(r=>r.map(v=>`"${String(v??'').replace(/"/g,'""')}"`).join(',')).join('\n');
 const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));a.download=name;a.click();
}

/* ================= داده‌های اسناد ورود/خروج، پیام به مدیریت ================= */
(function initDocs(){
 db.receipts=db.receipts||[];   /* اسناد ورود: {id,no,date,type,inv,party,note,lines:[{pid,qty,batchNo,exp,note}],status,source,by,events} */
 db.exits=db.exits||[];         /* اسناد خروج */
 db.notifs=db.notifs||[];       /* پیام‌ها به مدیریت */
 if(!db.openingDone){           /* ثبت «موجودی اولیه» تا مجموع دفتر حرکت‌ها با موجودی واقعی یکی شود */
  db.products.forEach(p=>{
   const L=r3(db.stockLog.filter(x=>x.pid==p.id).reduce((a,x)=>a+x.qty,0)),B=r3(db.batches.filter(b=>b.pid==p.id).reduce((a,b)=>a+b.qty,0));
   if(L!==B)db.stockLog.push({id:uid(),date:fmtDate(),iso:todayISO(),type:'opening',pid:p.id,qty:r3(B-L),batchNo:'اولیه',exp:null,ref:'موجودی اولیه',doc:'موجودی اولیه',order:null,driver:'',dist:'',city:'',by:WH});
  });
  db.openingDone=true;
 }
 if(!db.demoReq&&!db.receipts.length){ /* نمونه: فاکتور خریدی که مدیریت به انبار ارسال کرده است */
  db.receipts.push({id:1,no:'ورود 1',date:fmtDate(),type:'purchase',inv:'PI-5001',party:'شرکت پگاه',note:'ارسال‌شده از مدیریت',lines:[{pid:1,qty:100},{pid:2,qty:60}],status:'ارسال به انبار',source:'مدیریت',by:'مدیر سیستم',events:['ثبت فاکتور خرید و ارسال به انبار توسط مدیر سیستم']});
  db.demoReq=true;
 }
 save();
})();
function notify(text,ref){db.notifs.unshift({id:uid(),to:'admin',from:WH,text,date:fmtDate(),read:false,ref:ref||''})}
const nextId=arr=>Math.max(0,...arr.map(x=>x.id))+1;

/* ثبت خروجی (فاکتور فروش): کسر موجودی از بچ‌ها (نزدیک‌ترین انقضا اول) و ساخت رکورد خروجی */
function createDispatch({ids,driver,distributor,veh,date,city}){
 const orders=ids.map(ordById),need={};
 orders.forEach(o=>o.items.forEach(x=>need[x.product]=(need[x.product]||0)+x.qty));
 const short=Object.keys(need).find(pid=>avail(pid)<need[pid]);
 if(short)return{error:'موجودی قابل فروش کافی نیست: '+prod(short).name};
 const id=nextId(db.dispatches),iso=parseJ(date)||todayISO(),dstr=fmtJ(iso);
 orders.forEach(o=>{
  o.items.forEach(x=>logMove('invoice',x.product,x.qty,`فاکتور FL-${o.id} · ${o.customer}`,`خروجی ${id}`,{sellable:true,order:o.id,driver,dist:distributor,city,date:dstr,iso}));
  setStatus(o,'در حال ارسال',`ارسال با خروجی ${id} · شهر ${city||'—'} · راننده ${driver} · مأمور پخش ${distributor}`);
 });
 if(!db.drivers.includes(driver))db.drivers.push(driver);
 if(!db.distributors.includes(distributor))db.distributors.push(distributor);
 db.dispatches.unshift({id,date:dstr,driver,distributor,veh:veh||'',city:city||'',orders:ids});
 save();return{id};
}

/* =====================================================
   ۱) سفارش‌ها: تأیید ← در حال آماده‌سازی ← آماده ارسال
   ===================================================== */
let qTab='in';const QS={page:1,size:20};
reg('warehouse',(c,page)=>{
 sync();
 const G={in:db.orders.filter(o=>o.status==='تأیید شده'),prep:db.orders.filter(o=>o.status==='در حال آماده‌سازی'),rdy:db.orders.filter(o=>o.status==='آماده ارسال')};
 const low=db.products.filter(p=>p.stock<=p.min).length,near=db.batches.filter(b=>expInfo(b.exp)[2]==='near').length,exp=db.batches.filter(b=>expInfo(b.exp)[2]==='expired').length;
 const pend=db.receipts.filter(r=>r.status==='ارسال به انبار').length;
 const chips=[[pend,'ورود در انتظار تحویل','#4f6bed','stock-in.html?tab=requests'],[low,'کالا در سطح کمبود','#d9a441','stock-table.html'],[near,'بچ نزدیک انقضا','#e8a33d','batches.html'],[exp,'بچ منقضی','#e0626f','batches.html']]
  .filter(x=>x[0]).map(([n,t,col,h])=>`<a class="wh-chip" href="${h}"><i style="background:${col}"></i>${fa(n)} ${t}</a>`).join('');
 const acts=o=>(qTab==='in'?`<button class="btn primary sm" data-a="confirm" data-id="${o.id}">تأیید</button> <button class="btn ghost sm" data-a="back" data-id="${o.id}">بازگشت به مدیریت</button>`
  :qTab==='prep'?`<button class="btn primary sm" data-a="ready" data-id="${o.id}">آماده ارسال شد</button>`
  :`<a class="btn soft sm" href="stock-out.html">ثبت خروج ←</a>`)+` <a class="btn ghost sm" href="order-detail.html?id=${o.id}">جزئیات</a>`;
 c.innerHTML=takeFlash()+`<div class="wh-hero"><div><small>${todayFa()}</small><h1>سلام، ${WH} 👋</h1><p>${G.in.length?`${fa(G.in.length)} سفارش جدید برای آماده‌سازی دارید.`:'سفارش جدیدی در صف نیست.'}</p></div>
  <div class="wh-hstats"><div><b>${fa(G.in.length)}</b><span>سفارش جدید</span></div><div><b>${fa(G.prep.length)}</b><span>در آماده‌سازی</span></div><div><b>${fa(G.rdy.length)}</b><span>آماده ارسال</span></div><div><b>${fa(pend)}</b><span>ورود در انتظار</span></div></div></div>`+
  (chips?`<div class="wh-chips">${chips}</div>`:'')+
  `<section class="panel">${tabsHTML([['in','سفارش جدید',G.in.length],['prep','در حال آماده‌سازی',G.prep.length],['rdy','آماده ارسال',G.rdy.length]],qTab)}<div id="ql"></div></section>`;
 const draw=()=>{
  const list=G[qTab],pg=pgHTML(list.length,QS),f=(QS.page-1)*QS.size,part=list.slice(f,f+QS.size);
  $('#ql').innerHTML=part.length?`<div class="tablewrap"><table><thead><tr><th>فاکتور</th><th>اقلام</th><th>مبلغ</th>${qTab==='in'?'<th>موجودی</th>':''}<th></th></tr></thead><tbody>${
   part.map(o=>`<tr><td><div class="wh-two"><b>FL-${o.id}</b> · ${esc(o.customer)}<small>${esc(custCity(o)||'—')} · ${esc(o.date)}</small></div></td><td style="white-space:normal;min-width:240px">${itemsShort(o)}</td><td>${money(total(o))}</td>
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
   ۲) ارسال و تحویل: خروجی روزانه · شهر · راننده · مأمور پخش · چاپ
   ===================================================== */
let dayLimit=7;
reg('deliveries',(c,page)=>{
 sync();
 const ready=db.orders.filter(o=>o.status==='آماده ارسال');
 const inDispatch=new Set(db.dispatches.flatMap(d=>d.orders));
 const orphan=db.orders.filter(o=>o.status==='در حال ارسال'&&!inDispatch.has(o.id));
 const days={};db.dispatches.forEach(d=>(days[d.date]=days[d.date]||[]).push(d));
 const dk=Object.keys(days);
 const dispTotal=d=>d.orders.reduce((a,id)=>a+total(ordById(id)||{items:[]}),0);
 const resultCtl=o=>o.status==='در حال ارسال'
  ?`<div class="wh-acts"><select class="field" data-res="${o.id}" style="min-width:120px;padding:7px 10px;font-size:13px"><option>تحویل کامل</option><option>تحویل جزئی</option><option>تحویل ناموفق</option></select><button class="btn primary sm" data-a="deliver" data-id="${o.id}">ثبت</button></div>`
  :pill(o.status,statusClass(o.status));
 const dispRow=d=>{
  const list=d.orders.map(ordById).filter(Boolean),done=list.every(o=>o.status!=='در حال ارسال');
  const inv=list.map(o=>`<tr><td><a href="order-detail.html?id=${o.id}">FL-${o.id}</a></td><td><div class="wh-two">${esc(o.customer)}<small>${esc(custCity(o)||'—')}</small></div></td><td style="white-space:normal">${itemsShort(o)}</td><td>${money(total(o))}</td><td><button class="btn ghost sm" data-a="pi" data-id="${o.id}" data-d="${d.id}">🖨</button></td><td>${resultCtl(o)}</td></tr>`).join('');
  return `<tr><td><b>${fa(d.id)}</b></td><td>${esc(d.city||'—')}</td><td>${esc(d.driver)}</td><td>${esc(d.distributor)}</td><td>${fa(list.length)}</td><td>${money(dispTotal(d))}</td><td>${pill(done?'تکمیل شد':'در مسیر',done?'done':'shipping')}</td>
  <td><div class="wh-acts"><button class="btn ghost sm" data-a="pp" data-id="${d.id}">🖨 کالا</button><button class="btn ghost sm" data-a="pc" data-id="${d.id}">🖨 مشتری</button><button class="btn soft sm" data-a="tg" data-id="${d.id}">فاکتورها ▾</button></div></td></tr>
  <tr id="dd${d.id}" class="wh-sub wh-hide"><td colspan="8">${d.veh?`<p class="sub" style="margin:8px 0">خودرو: ${esc(d.veh)}</p>`:''}<table><thead><tr><th>فاکتور</th><th>مشتری / شهر</th><th>اقلام</th><th>مبلغ</th><th></th><th>وضعیت / ثبت تحویل</th></tr></thead><tbody>${inv}</tbody></table></td></tr>`;
 };
 const dayRows=dk.slice(0,dayLimit).map(date=>{
  const ds=days[date],n=ds.reduce((a,d)=>a+d.orders.length,0),sum=ds.reduce((a,d)=>a+dispTotal(d),0);
  return `<tr class="wh-day"><td colspan="8">${esc(date)} · ${fa(ds.length)} خروجی · ${fa(n)} فاکتور · جمع روز: ${money(sum)}</td></tr>${ds.map(dispRow).join('')}`;
 }).join('');
 c.innerHTML=head('ارسال و تحویل','خروجی‌های روزانه با شهر، فاکتور، راننده و مأمور پخش',`<button class="btn primary" id="dnew">＋ ثبت خروجی جدید${ready.length?` (${fa(ready.length)} آماده)`:''}</button>`)+
 (orphan.length?`<section class="panel"><b>در مسیر (بدون خروجی ثبت‌شده)</b><div class="tablewrap"><table><tbody>${orphan.map(o=>`<tr><td>FL-${o.id}</td><td>${esc(o.customer)}</td><td>${money(total(o))}</td><td>${resultCtl(o)}</td></tr>`).join('')}</tbody></table></div></section>`:'')+
 `<section class="panel">${dk.length?`<div class="tablewrap"><table><thead><tr><th>خروجی</th><th>شهر</th><th>راننده</th><th>مأمور پخش</th><th>فاکتور</th><th>جمع مبلغ</th><th>وضعیت</th><th></th></tr></thead><tbody>${dayRows}</tbody></table></div>
  ${dk.length>dayLimit?`<div style="text-align:center;margin-top:16px"><button class="btn outline" data-a="more">نمایش روزهای قبل</button></div>`:''}`:empty('هنوز خروجی ثبت نشده است.')}</section>`;

 $('#dnew').onclick=()=>{
  if(!ready.length)return alert('سفارشی آماده ارسال نیست. ابتدا در «سفارش‌ها» سفارش‌ها را تأیید و آماده کنید.');
  const cs=[...new Set(ready.map(custCity).filter(Boolean))];
  openModal('ثبت خروجی جدید',
   `<div class="tablewrap"><table><thead><tr><th></th><th>فاکتور</th><th>مشتری</th><th>شهر</th><th>مبلغ</th></tr></thead><tbody>${ready.map(o=>`<tr><td><input type="checkbox" class="pick" value="${o.id}" checked></td><td>FL-${o.id}</td><td>${esc(o.customer)}</td><td>${esc(custCity(o)||'—')}</td><td>${money(total(o))}</td></tr>`).join('')}</tbody></table></div>
   <div class="wz-grid" style="margin-top:18px">
    <div class="group"><label>شهر مقصد *</label><input class="field" id="dcity" list="dcityl" value="${cs.length===1?esc(cs[0]):''}" placeholder="مثلاً تهران"><datalist id="dcityl">${cities().map(x=>`<option value="${esc(x)}">`).join('')}</datalist></div>
    <div class="group"><label>راننده *</label><input class="field" id="drv" list="drvl" placeholder="انتخاب یا نام جدید"><datalist id="drvl">${db.drivers.map(x=>`<option value="${esc(x)}">`).join('')}</datalist></div>
    <div class="group"><label>مأمور پخش همراه *</label><input class="field" id="dst" list="dstl" placeholder="انتخاب یا نام جدید"><datalist id="dstl">${db.distributors.map(x=>`<option value="${esc(x)}">`).join('')}</datalist></div>
    <div class="group"><label>خودرو / پلاک (اختیاری)</label><input class="field" id="veh"></div>
    <div class="group"><label>تاریخ خروج</label><input class="field" id="ddate" value="${todayFa()}"></div></div>
   <p class="sub" style="margin:14px 0 0">کالا به روش «نزدیک‌ترین انقضا اول» از بچ‌ها کسر می‌شود (بچ منقضی برداشته نمی‌شود).</p>`,
   'ثبت خروجی و ارسال',()=>{
    const ids=[...document.querySelectorAll('.pick')].filter(x=>x.checked).map(x=>+x.value);
    const city=$('#dcity').value.trim(),driver=$('#drv').value.trim(),distributor=$('#dst').value.trim();
    if(!ids.length){alert('حداقل یک فاکتور انتخاب کنید.');return false}
    if(!city){alert('شهر مقصد را وارد کنید.');return false}
    if(!driver||!distributor){alert('راننده و مأمور پخش را مشخص کنید.');return false}
    if(!parseJ($('#ddate').value)){alert('تاریخ خروج معتبر نیست. نمونه: ۱۴۰۵/۰۸/۱۵');return false}
    const r=createDispatch({ids,driver,distributor,veh:$('#veh').value.trim(),date:$('#ddate').value,city});
    if(r.error){alert(r.error);return false}
    FLASH=`خروجی ${r.id} برای شهر ${city} ثبت شد و موجودی کسر گردید.`;render(page);
   },true);
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
   ۳) ورود به انبار / خروج از انبار: اسناد، ویزارد چندمرحله‌ای، درخواست‌های مدیریت
   ===================================================== */
const IN={tab:'docs',wiz:null,ver:null,page:1,size:20,init:false};
const OUT={tab:'docs',wiz:null,page:1,size:20};
const TYPE_LBL=t=>shortLbl((MV[t]||['—'])[0]);
const docCls=s=>/مغایرت|رد/.test(s)?'rejected':/ارسال به انبار/.test(s)?'pending':'done';
const newWiz=kind=>({step:1,h:{date:todayFa(),type:(kind==='in'?ENTRY_TYPES:EXIT_TYPES)[0],inv:'',party:'',city:'',driver:'',dist:'',veh:'',order:'',note:''},lines:[],pick:{cat:'',pid:'',qty:'',batchNo:'',exp:'',note:'',batchId:''}});
const partyLabel=(kind,t)=>kind==='in'?(t==='purchase'?'تأمین‌کننده *':t==='customer_return'?'نام مشتری / فاکتور مرجوعی *':'مسئول / علت انبارگردانی *'):(t==='return_supplier'?'نام شرکت فروشنده *':t==='return_factory'?'نام کارخانه *':'');
const needsNote=(kind,t)=>kind==='out'&&['spoiled','discard','adjust_out'].includes(t);
const outOrders=()=>db.orders.filter(o=>['تأیید شده','در حال آماده‌سازی','آماده ارسال'].includes(o.status));
const refText=(h,l,kind)=>[h.party.trim(),h.inv.trim()?`فاکتور ${h.inv.trim()}`:'',l&&l.note?`مغایرت: ${l.note}`:'',kind==='out'&&h.note.trim()?h.note.trim():''].filter(Boolean).join(' · ')||TYPE_LBL(h.type);

function checkStep1(kind,w){
 const h=w.h,iso=parseJ(h.date);
 if(!iso)return 'تاریخ معتبر نیست. نمونه: ۱۴۰۵/۰۸/۱۵';
 if(iso>todayISO())return 'تاریخ نمی‌تواند در آینده باشد.';
 if(kind==='in')return h.party.trim()?'':'نام تأمین‌کننده / مبدأ را وارد کنید.';
 if(h.type==='invoice'){
  if(!h.order)return 'فاکتور را انتخاب کنید.';
  if(!h.city.trim())return 'شهر مقصد را وارد کنید.';
  if(!h.driver.trim()||!h.dist.trim())return 'راننده و مأمور پخش را وارد کنید.';
  return '';
 }
 if(['return_supplier','return_factory'].includes(h.type)&&!h.party.trim())return 'نام شرکت یا کارخانه را وارد کنید.';
 if(needsNote(kind,h.type)&&!h.note.trim())return 'علت را در توضیحات بنویسید.';
 return '';
}
function checkOutLines(lines){
 const per={},bat={};
 for(const l of lines){
  if(l.batchId){bat[l.batchId]=r3((bat[l.batchId]||0)+l.qty)}else per[l.pid]=r3((per[l.pid]||0)+l.qty);
 }
 for(const id in bat){const b=db.batches.find(x=>x.id===id);if(!b||b.qty<bat[id])return `موجودی بچ ${b?b.no:''} برای ${prod(b?.pid)?.name||'کالا'} کافی نیست.`}
 const tot={};
 lines.forEach(l=>tot[l.pid]=r3((tot[l.pid]||0)+l.qty));
 for(const pid in tot){if(prod(pid).stock<tot[pid])return `موجودی ${prod(pid).name} کافی نیست.`}
 return '';
}

/* ثبت نهایی ورود: افزودن به بچ‌ها، به‌روزرسانی موجودی کل، ثبت در دفتر حرکت و پیام به مدیریت */
function registerIn(w){
 const h=w.h,iso=parseJ(h.date),date=fmtJ(iso),id=nextId(db.receipts),no=`ورود ${id}`,lines=[];
 try{
  w.lines.forEach(l=>{
   const used=logMove(h.type,l.pid,l.qty,refText(h,l,'in'),no,{batchNo:l.batchNo||undefined,exp:l.exp||null,date,iso});
   lines.push({...l,batchNo:used[0].no});
  });
 }catch(e){return{error:e.message}}
 db.receipts.unshift({id,no,date,iso,type:h.type,inv:h.inv.trim(),party:h.party.trim(),note:h.note.trim(),lines,status:'ثبت شد',source:'انباردار',by:WH,events:[`ثبت ورود توسط ${WH}`]});
 notify(`${WH} سند ${no} (${TYPE_LBL(h.type)}${h.inv.trim()?` - فاکتور ${h.inv.trim()}`:''}) را با ${fa(lines.length)} قلم کالا در انبار ثبت کرد.`,no);
 save();return{id,no};
}
function registerOut(w){
 const h=w.h,iso=parseJ(h.date),date=fmtJ(iso),id=nextId(db.exits),no=`خروج ${id}`;
 if(h.type==='invoice'){
  const o=ordById(h.order);
  const r=createDispatch({ids:[o.id],driver:h.driver.trim(),distributor:h.dist.trim(),veh:h.veh.trim(),date:h.date,city:h.city.trim()});
  if(r.error)return r;
  db.exits.unshift({id,no,date,iso,type:'invoice',inv:`FL-${o.id}`,party:o.customer,city:h.city.trim(),driver:h.driver.trim(),dist:h.dist.trim(),veh:h.veh.trim(),note:h.note.trim(),lines:o.items.map(x=>({pid:x.product,qty:x.qty})),dispatch:r.id,status:'ارسال شد',by:WH,events:[`ثبت خروج و ارسال با خروجی ${r.id}`]});
  notify(`${WH} سند ${no}: فاکتور FL-${o.id} (${o.customer}) به شهر ${h.city.trim()} ارسال شد.`,no);
  save();return{id,no,dispatch:r.id};
 }
 const err=checkOutLines(w.lines);if(err)return{error:err};
 try{w.lines.forEach(l=>logMove(h.type,l.pid,l.qty,refText(h,l,'out'),no,{batchId:l.batchId||undefined,city:h.city.trim(),date,iso}))}catch(e){return{error:e.message}}
 db.exits.unshift({id,no,date,iso,type:h.type,inv:h.inv.trim(),party:h.party.trim(),city:h.city.trim(),driver:'',dist:'',note:h.note.trim(),lines:w.lines.map(l=>({...l})),status:'تکمیل شد',by:WH,events:[`ثبت خروج توسط ${WH}`]});
 notify(`${WH} سند ${no} (${TYPE_LBL(h.type)}) را با ${fa(w.lines.length)} قلم کالا ثبت کرد.`,no);
 save();return{id,no};
}

/* تأیید یا مغایرت‌گیری درخواست ورودی که مدیریت به انبار فرستاده است */
function finalizeVerify(r,rows,note){
 const mism=[];
 r.lines.forEach((l,i)=>{if(rows[i].qty!==l.qty)mism.push({pid:l.pid,expected:l.qty,received:rows[i].qty})});
 const iso=todayISO(),date=fmtJ(iso);
 if(mism.length){
  r.status='مغایرت - بازگشت به مدیریت';r.mismatch=mism;r.mnote=note||'';
  r.events.push(`ثبت مغایرت توسط ${WH}: ${mism.map(m=>`${prod(m.pid).name} (فاکتور ${m.expected}، تحویلی ${m.received})`).join('، ')}${note?' - '+note:''}`);
  notify(`مغایرت در سند ${r.no} (فاکتور ${r.inv||'—'}): ${mism.map(m=>`${prod(m.pid).name}: فاکتور ${fa(m.expected)}، تحویلی ${fa(m.received)}`).join('، ')}. سند به مدیریت برگشت داده شد.`,r.no);
  save();return{ok:false,mism};
 }
 try{
  r.lines.forEach((l,i)=>{
   const used=logMove(r.type,l.pid,rows[i].qty,refText(r,{note:''},'in'),r.no,{batchNo:rows[i].batchNo||undefined,exp:rows[i].exp||null,date,iso});
   l.batchNo=used[0].no;l.exp=rows[i].exp||null;l.received=rows[i].qty;
  });
 }catch(e){return{error:e.message}}
 r.status='تحویل گرفته شد';r.events.push(`تحویل و ورود به انبار توسط ${WH}`);
 notify(`${WH} فاکتور ${r.inv||r.no} (${r.party}) را تحویل گرفت و اقلام را در انبار ثبت کرد.`,r.no);
 save();return{ok:true};
}

/* چاپ رسید ورود / حواله خروج */
function printRec(kind,rec){
 const rows=rec.lines.map((l,i)=>`<tr><td>${fa(i+1)}</td><td>${esc(prod(l.pid)?.name)}</td><td>${esc(unitOf(l.pid))}</td><td><b>${fa(l.received??l.qty)}</b></td><td class="sm">${esc(l.batchNo||'—')}${l.exp?` (انقضا ${fmtJ(l.exp)})`:''}</td><td class="sm">${esc(l.note||'')}</td></tr>`).join('');
 printHTML(rec.no,`<section class="pg"><div class="hd"><div><h1>Food Link</h1>${kind==='in'?'رسید ورود به انبار':'حواله خروج از انبار'}</div><div>شماره سند: ${esc(rec.no)}<br>تاریخ: ${esc(rec.date)}</div></div>
 <div class="meta"><span>نوع: <b>${TYPE_LBL(rec.type)}</b></span>${rec.inv?`<span>فاکتور: <b>${esc(rec.inv)}</b></span>`:''}${rec.party?`<span>طرف حساب: <b>${esc(rec.party)}</b></span>`:''}${rec.city?`<span>شهر: <b>${esc(rec.city)}</b></span>`:''}${rec.driver?`<span>راننده: <b>${esc(rec.driver)}</b></span><span>مأمور پخش: <b>${esc(rec.dist)}</b></span>`:''}</div>
 <table><thead><tr><th>ردیف</th><th>کالا</th><th>واحد</th><th>تعداد</th><th>بچ / انقضا</th><th>توضیحات</th></tr></thead><tbody>${rows}</tbody></table>
 ${rec.note?`<p>توضیحات: ${esc(rec.note)}</p>`:''}${sigs('انباردار','تحویل‌دهنده / گیرنده','مدیر')}</section>`);
}
function showRec(kind,id){
 const rec=(kind==='in'?db.receipts:db.exits).find(x=>x.id==id);if(!rec)return;
 openModal(esc(rec.no),
  `<div class="wz-kv"><div><small>تاریخ</small><b>${esc(rec.date)}</b></div><div><small>نوع</small><b>${TYPE_LBL(rec.type)}</b></div><div><small>وضعیت</small>${pill(rec.status,docCls(rec.status))}</div>
   <div><small>فاکتور / سند</small><b>${esc(rec.inv||'—')}</b></div><div><small>طرف حساب</small><b>${esc(rec.party||'—')}</b></div>${rec.city?`<div><small>شهر</small><b>${esc(rec.city)}</b></div>`:''}
   ${rec.driver?`<div><small>راننده</small><b>${esc(rec.driver)}</b></div><div><small>مأمور پخش</small><b>${esc(rec.dist)}</b></div>`:''}</div>
   <div class="tablewrap" style="margin-top:18px"><table><thead><tr><th>کالا</th><th>تعداد</th><th>بچ / انقضا</th><th>توضیحات</th></tr></thead><tbody>${
    rec.lines.map(l=>`<tr><td>${esc(prod(l.pid)?.name)}</td><td><b>${fa(l.received??l.qty)}</b> ${esc(unitOf(l.pid))}</td><td>${esc(l.batchNo||'—')}${l.exp?` · ${fmtJ(l.exp)}`:''}</td><td>${esc(l.note||'')}</td></tr>`).join('')}</tbody></table></div>
   ${rec.note?`<p class="sub">توضیحات: ${esc(rec.note)}</p>`:''}
   <h4 style="margin:18px 0 8px">تاریخچه</h4>${rec.events.map((e,i)=>`<div class="mk-row" style="margin-bottom:6px"><span>${esc(e)}</span><span class="sub">مرحله ${fa(i+1)}</span></div>`).join('')}
   <button class="btn outline" id="rprint" style="margin-top:14px">🖨 چاپ سند</button>`,null,null,true);
 $('#rprint').onclick=()=>printRec(kind,rec);
}

function docsPage(kind){
 const isIn=kind==='in',S=isIn?IN:OUT;
 return (c,page)=>{
  sync();
  if(isIn&&!S.init){S.init=true;const t=new URLSearchParams(location.search).get('tab');if(t)S.tab=t}
  if(S.wiz)return wizView(kind,c,page);
  if(isIn&&S.ver)return verifyView(c,page);
  const all=isIn?db.receipts:db.exits;
  const pending=isIn?all.filter(r=>r.status==='ارسال به انبار'):[];
  const docs=all.filter(r=>r.status!=='ارسال به انبار');
  const tabs=[['docs',isIn?'اسناد ورود':'اسناد خروج',docs.length],...(isIn?[['requests','درخواست‌ها از مدیریت',pending.length]]:[]),['moves','ریز حرکت‌ها (تاریخچه)',null]];
  const top=head(isIn?'ورود به انبار':'خروج از انبار',isIn?'ثبت ورود کالا، دریافت فاکتور خرید و تأیید درخواست‌های مدیریت':'ثبت خروج فاکتور، مرجوعی، فاسدی و دورریز',
   `<button class="btn primary" id="wnew" data-a="new">＋ ثبت ${isIn?'ورود':'خروج'} جدید</button>`);
  const common=(e)=>{
   const b=e.target.closest('[data-a]');if(!b)return false;
   const a=b.dataset.a;
   if(a==='new'){S.wiz=newWiz(kind);S.tab='docs';render(page);return true}
   if(a==='show'){showRec(kind,b.dataset.id);return true}
   if(a==='prn'){const r=(isIn?db.receipts:db.exits).find(x=>x.id==b.dataset.id);if(r)printRec(kind,r);return true}
   if(a==='ver'){IN.ver=+b.dataset.id;render(page);return true}
   return false;
  };
  if(S.tab==='moves')return renderLedger(kind,c,page,top,tabsHTML(tabs,S.tab),common,S);
  const rows=S.tab==='requests'?pending:docs;
  c.innerHTML=top+`<section class="panel">${tabsHTML(tabs,S.tab)}<div id="dl"></div></section>`;
  const draw=()=>{
   const pg=pgHTML(rows.length,S),f=(S.page-1)*S.size,part=rows.slice(f,f+S.size);
   const nm=r=>`<div class="wh-two"><b>${esc(r.no)}</b><small>${esc(r.date)}</small></div>`;
   const lines=r=>`<div class="wh-two">${fa(r.lines.length)} قلم<small>${esc(r.lines.slice(0,2).map(l=>prod(l.pid)?.name).join('، '))}${r.lines.length>2?'…':''}</small></div>`;
   let html;
   if(S.tab==='requests')html=`<thead><tr><th>سند</th><th>فاکتور</th><th>تأمین‌کننده</th><th>اقلام</th><th>ارسال‌کننده</th><th></th></tr></thead><tbody>${
    part.map(r=>`<tr><td>${nm(r)}</td><td>${esc(r.inv||'—')}</td><td>${esc(r.party)}</td><td>${lines(r)}</td><td>${esc(r.by)}</td><td><div class="wh-acts"><button class="btn primary sm" data-a="ver" data-id="${r.id}">بررسی و تحویل</button><button class="btn ghost sm" data-a="show" data-id="${r.id}">جزئیات</button></div></td></tr>`).join('')}</tbody>`;
   else if(isIn)html=`<thead><tr><th>سند</th><th>نوع</th><th>فاکتور / طرف حساب</th><th>اقلام</th><th>منبع</th><th>وضعیت</th><th></th></tr></thead><tbody>${
    part.map(r=>`<tr><td>${nm(r)}</td><td>${TYPE_LBL(r.type)}</td><td><div class="wh-two">${esc(r.party||'—')}<small>${esc(r.inv||'')}</small></div></td><td>${lines(r)}</td><td>${esc(r.source)}</td><td>${pill(r.status,docCls(r.status))}</td><td><div class="wh-acts"><button class="btn ghost sm" data-a="show" data-id="${r.id}">جزئیات</button><button class="btn ghost sm" data-a="prn" data-id="${r.id}">🖨</button></div></td></tr>`).join('')}</tbody>`;
   else html=`<thead><tr><th>سند</th><th>نوع</th><th>فاکتور / طرف حساب</th><th>شهر</th><th>راننده / مأمور</th><th>اقلام</th><th>وضعیت</th><th></th></tr></thead><tbody>${
    part.map(r=>`<tr><td>${nm(r)}</td><td>${TYPE_LBL(r.type)}</td><td><div class="wh-two">${esc(r.party||'—')}<small>${esc(r.inv||'')}</small></div></td><td>${esc(r.city||'—')}</td><td>${r.driver?`<div class="wh-two">${esc(r.driver)}<small>${esc(r.dist)}</small></div>`:'—'}</td><td>${lines(r)}</td><td>${pill(r.status,docCls(r.status))}</td><td><div class="wh-acts"><button class="btn ghost sm" data-a="show" data-id="${r.id}">جزئیات</button><button class="btn ghost sm" data-a="prn" data-id="${r.id}">🖨</button></div></td></tr>`).join('')}</tbody>`;
   $('#dl').innerHTML=part.length?`<div class="tablewrap"><table>${html}</table></div>${pg}`:empty(S.tab==='requests'?'درخواستی از مدیریت در انتظار تحویل نیست.':'هنوز سندی ثبت نشده است. با «ثبت جدید» شروع کنید.');
  };
  draw();
  c.onclick=e=>{
   if(pgClick(e,S,draw))return;
   const t=e.target.closest('[data-tab]');if(t){S.tab=t.dataset.tab;S.page=1;return render(page)}
   common(e);
  };
  c.onchange=e=>pgSize(e,S,draw);
 };
}
reg('stock-in',docsPage('in'));
reg('stock-out',docsPage('out'));
reg('inventory',()=>{location.replace('stock-in.html')});
reg('stock-status',()=>{location.replace('stock-table.html')});

/* ---------- بررسی و تحویل درخواست ورودی مدیریت ---------- */
function verifyView(c,page){
 const r=db.receipts.find(x=>x.id===IN.ver&&x.status==='ارسال به انبار');
 if(!r){IN.ver=null;return render(page)}
 c.innerHTML=head(`بررسی و تحویل ${esc(r.no)}`,`فاکتور ${esc(r.inv||'—')} · ${esc(r.party)} · ارسال‌شده توسط ${esc(r.by)}`,`<button class="btn outline" data-a="vx">← بازگشت</button>`)+
 `<section class="panel"><p class="sub" style="margin-top:0">اقلام تحویلی را با فاکتور تطبیق دهید. اگر تعداد دریافتی با فاکتور برابر نبود، سند با مغایرت به مدیریت برمی‌گردد و چیزی به موجودی اضافه نمی‌شود.</p>
  <div class="tablewrap"><table><thead><tr><th>کالا</th><th>واحد</th><th>تعداد فاکتور</th><th>تعداد تحویلی</th><th>اختلاف</th><th>شماره بچ</th><th>تاریخ انقضا</th></tr></thead><tbody>${
   r.lines.map((l,i)=>`<tr><td>${esc(prod(l.pid)?.name)}</td><td>${esc(unitOf(l.pid))}</td><td><b>${fa(l.qty)}</b></td>
   <td><input class="field" data-vq="${i}" type="number" min="0" step="${isDec(unitOf(l.pid))?'0.01':'1'}" value="${l.qty}" style="max-width:120px"></td><td id="vd${i}">—</td>
   <td><input class="field" data-vb="${i}" placeholder="خودکار" style="max-width:140px"></td><td><input class="field" data-ve="${i}" placeholder="۱۴۰۶/۰۵/۱۰" style="max-width:150px"></td></tr>`).join('')}</tbody></table></div>
  <div class="group" id="vnw" style="margin-top:16px" hidden><label>توضیحات مغایرت *</label><input class="field" id="vnote" placeholder="مثلاً ۱۰ کارتن کمتر تحویل داده شد"></div>
  <div class="wz-nav"><span class="sub" id="vinfo"></span><button class="btn primary" id="vok" data-a="vok">تأیید و ورود به انبار</button></div></section>`;
 const read=()=>r.lines.map((l,i)=>{
  const u=unitOf(l.pid),q=Number(normDigits($(`[data-vq="${i}"]`).value));
  return{q:(q>=0&&(isDec(u)||Number.isInteger(q)))?r3(q):null,batchNo:$(`[data-vb="${i}"]`).value.trim(),ex:$(`[data-ve="${i}"]`).value.trim()};
 });
 const upd=()=>{
  const rows=read();let mis=0;
  rows.forEach((x,i)=>{const d=x.q==null?null:r3(x.q-r.lines[i].qty);if(d!==0)mis++;const el=$('#vd'+i);if(el)el.innerHTML=d===0?pill('مطابق','done'):d==null?pill('نامعتبر','rejected'):pill(`${d>0?'+':'−'}${fa(Math.abs(d))}`,'rejected')});
  $('#vnw').hidden=!mis;$('#vok').textContent=mis?'ثبت مغایرت و بازگشت به مدیریت':'تأیید و ورود به انبار';
  $('#vinfo').textContent=mis?`${fa(mis)} قلم مغایرت دارد`:'همه اقلام با فاکتور مطابق است';
 };
 upd();
 c.oninput=upd;
 c.onclick=e=>{
  const b=e.target.closest('[data-a]');if(!b)return;
  if(b.dataset.a==='vx'){IN.ver=null;return render(page)}
  if(b.dataset.a!=='vok')return;
  const rows=read(),out=[];
  for(let i=0;i<rows.length;i++){
   if(rows[i].q==null)return alert('تعداد تحویلی یکی از اقلام معتبر نیست.');
   let exp=null;if(rows[i].ex){exp=parseJ(rows[i].ex);if(!exp)return alert('تاریخ انقضا معتبر نیست. نمونه: ۱۴۰۶/۰۵/۱۰')}
   out.push({qty:rows[i].q,batchNo:rows[i].batchNo,exp});
  }
  const mis=out.some((x,i)=>x.qty!==r.lines[i].qty),note=($('#vnote').value||'').trim();
  if(mis&&!note)return alert('توضیحات مغایرت را بنویسید.');
  const res=finalizeVerify(r,out,note);
  if(res.error)return alert(res.error);
  IN.ver=null;IN.tab='docs';
  FLASH=res.ok?`${r.no} تحویل گرفته شد، موجودی انبار به‌روز و به مدیریت اطلاع داده شد.`:`مغایرت ثبت شد و ${r.no} برای بررسی به مدیریت برگشت.`;
  render(page);
 };
}

/* ---------- ویزارد ثبت ورود / خروج (۳ مرحله) ---------- */
function wizView(kind,c,page){
 const isIn=kind==='in',S=isIn?IN:OUT,w=S.wiz,h=w.h,types=isIn?ENTRY_TYPES:EXIT_TYPES;
 const isInv=()=>!isIn&&h.type==='invoice';
 const field=(k,label,ph,list)=>`<div class="group"><label>${label}</label><input class="field" data-h="${k}" value="${esc(h[k])}" placeholder="${ph||''}" ${list?`list="${list}"`:''}></div>`;
 const syncOrder=()=>{const o=ordById(h.order);w.lines=o?o.items.map(x=>({pid:x.product,qty:x.qty})):[];if(o&&!h.city)h.city=custCity(o)};
 const step1=()=>`<div class="wz-grid">
  ${field('date','تاریخ '+(isIn?'ورود':'خروج')+' *','۱۴۰۵/۰۸/۱۵')}
  <div class="group"><label>نوع ${isIn?'ورود':'خروج'} *</label><select class="field" data-h="type" data-redraw>${types.map(k=>`<option value="${k}" ${h.type===k?'selected':''}>${TYPE_LBL(k)}</option>`).join('')}</select></div>
  ${isInv()?`<div class="group" style="grid-column:1/-1"><label>فاکتور فروش *</label><select class="field" data-h="order" data-redraw><option value="">— انتخاب فاکتور —</option>${outOrders().map(o=>`<option value="${o.id}" ${String(h.order)===String(o.id)?'selected':''}>FL-${o.id} · ${esc(o.customer)} · ${esc(custCity(o)||'—')} · ${money(total(o))}</option>`).join('')}</select></div>
   <div class="group"><label>شهر مقصد *</label><input class="field" data-h="city" list="wcity" value="${esc(h.city)}" placeholder="مثلاً تهران"><datalist id="wcity">${cities().map(x=>`<option value="${esc(x)}">`).join('')}</datalist></div>
   ${field('driver','راننده *','',  'wdrv')}<datalist id="wdrv">${db.drivers.map(x=>`<option value="${esc(x)}">`).join('')}</datalist>
   ${field('dist','مأمور پخش همراه *','','wdst')}<datalist id="wdst">${db.distributors.map(x=>`<option value="${esc(x)}">`).join('')}</datalist>
   ${field('veh','خودرو / پلاک (اختیاری)')}`
  :`${field('inv',isIn?'شماره فاکتور / سند (اختیاری)':'شماره فاکتور / سند (اختیاری)')}
   ${partyLabel(kind,h.type)?field('party',partyLabel(kind,h.type)):''}
   ${!isIn?`<div class="group"><label>شهر (اختیاری)</label><input class="field" data-h="city" list="wcity" value="${esc(h.city)}"><datalist id="wcity">${cities().map(x=>`<option value="${esc(x)}">`).join('')}</datalist></div>`:''}`}
  <div class="group" style="grid-column:1/-1"><label>توضیحات ${needsNote(kind,h.type)?'(علت) *':'(اختیاری)'}</label><input class="field" data-h="note" value="${esc(h.note)}" placeholder="${isIn?'مثلاً مغایرت یا شرایط تحویل':'علت یا توضیح'}"></div></div>`;

 const linesTable=(editable)=>w.lines.length?`<div class="tablewrap"><table><thead><tr><th>#</th><th>کالا</th><th>واحد</th><th>تعداد</th>${isIn?'<th>بچ / انقضا</th><th>توضیحات</th>':'<th>بچ</th>'}${editable?'<th></th>':''}</tr></thead><tbody>${
  w.lines.map((l,i)=>{const p=prod(l.pid),b=l.batchId?db.batches.find(x=>x.id===l.batchId):null;
   return `<tr><td>${fa(i+1)}</td><td><div class="wh-two">${esc(p?.name)}<small>${esc(p?.cat||'')}</small></div></td><td>${esc(p?.unit)}</td><td><b>${fa(l.qty)}</b></td>
   ${isIn?`<td>${esc(l.batchNo||'خودکار')}<small class="sub"> ${l.exp?'· انقضا '+fmtJ(l.exp):''}</small></td><td>${esc(l.note||'—')}</td>`:`<td>${b?esc(b.no):isInv()?'خودکار (FEFO)':'خودکار (FEFO)'}</td>`}
   ${editable?`<td><button class="btn ghost sm" data-a="rm" data-i="${i}">حذف</button></td>`:''}</tr>`}).join('')}</tbody></table></div>`:empty('هنوز کالایی به لیست اضافه نشده است.');

 const step2=()=>{
  if(isInv()){
   const o=ordById(h.order),bad=o?o.items.filter(x=>avail(x.product)<x.qty):[];
   return `<div class="wz-box"><b>اقلام فاکتور FL-${o?.id} · ${esc(o?.customer||'')}</b><p class="sub" style="margin:6px 0 0">اقلام از روی فاکتور پر شده است و هنگام ثبت از بچ‌ها (نزدیک‌ترین انقضا اول) کسر می‌شود.</p></div>
   <div class="tablewrap"><table><thead><tr><th>کالا</th><th>واحد</th><th>تعداد فاکتور</th><th>موجودی قابل فروش</th><th>وضعیت</th></tr></thead><tbody>${
    (o?.items||[]).map(x=>{const a=avail(x.product);return `<tr><td>${esc(prod(x.product)?.name)}</td><td>${esc(unitOf(x.product))}</td><td><b>${fa(x.qty)}</b></td><td>${fa(a)}</td><td>${a>=x.qty?pill('کافی','done'):pill('کسری','rejected')}</td></tr>`}).join('')}</tbody></table></div>
   ${bad.length?`<p class="status rejected" style="margin-top:14px">موجودی ${bad.map(x=>esc(prod(x.product).name)).join('، ')} کافی نیست.</p>`:''}`;
  }
  const pk=w.pick,p=prod(pk.pid),bs=p?db.batches.filter(b=>b.pid==p.id&&b.qty>0).sort(byExp):[];
  return `<div class="wz-box"><div class="wz-grid">
   <div class="group"><label>۱. دسته کالا *</label><select class="field" data-p="cat" data-redraw><option value="">— انتخاب دسته —</option>${db.categories.map(x=>`<option ${pk.cat===x.name?'selected':''}>${esc(x.name)}</option>`).join('')}</select></div>
   <div class="group"><label>۲. کالا *</label><select class="field" data-p="pid" data-redraw ${pk.cat?'':'disabled'}><option value="">${pk.cat?'— انتخاب کالا —':'ابتدا دسته را انتخاب کنید'}</option>${db.products.filter(x=>x.cat===pk.cat).map(x=>`<option value="${x.id}" ${String(pk.pid)===String(x.id)?'selected':''}>${esc(x.name)}</option>`).join('')}</select></div>
   <div class="group"><label>واحد سنجش</label><div class="wz-unit">${p?esc(p.unit):'—'}${p&&!isIn?` <span class="sub" style="margin-right:10px">موجودی: ${fa(p.stock)}</span>`:''}</div></div>
   <div class="group"><label>۳. تعداد ${p?`(${esc(p.unit)})`:''} *</label><input class="field" data-p="qty" type="number" min="0" step="${isDec(p?.unit)?'0.01':'1'}" value="${esc(pk.qty)}" ${p?'':'disabled'}></div>
   ${isIn?`<div class="group"><label>شماره بچ (خالی = خودکار)</label><input class="field" data-p="batchNo" value="${esc(pk.batchNo)}"></div>
   <div class="group"><label>تاریخ انقضا (اختیاری)</label><input class="field" data-p="exp" value="${esc(pk.exp)}" placeholder="۱۴۰۶/۰۵/۱۰"></div>
   <div class="group" style="grid-column:1/-1"><label>توضیحات مغایرت (اگر دارد)</label><input class="field" data-p="note" value="${esc(pk.note)}"></div>`
   :`<div class="group" style="grid-column:1/-1"><label>بچ برداشت</label><select class="field" data-p="batchId"><option value="">خودکار (نزدیک‌ترین انقضا اول)</option>${bs.map(b=>`<option value="${b.id}" ${pk.batchId===b.id?'selected':''}>${esc(b.no)} · ${b.exp?'انقضا '+fmtJ(b.exp):'بدون انقضا'} · ${fa(b.qty)} ${esc(p.unit)}</option>`).join('')}</select></div>`}
  </div><button class="btn soft" data-a="add" style="margin-top:16px">＋ افزودن به لیست</button></div>
  <h3 style="margin:6px 0 12px">اقلام این سند (${fa(w.lines.length)})</h3>${linesTable(true)}`;
 };
 const step3=()=>{
  const o=isInv()?ordById(h.order):null,n=w.lines.length,sum=r3(w.lines.reduce((a,l)=>a+l.qty,0));
  return `<div class="wz-box"><div class="wz-kv"><div><small>تاریخ</small><b>${esc(h.date)}</b></div><div><small>نوع</small><b>${TYPE_LBL(h.type)}</b></div>
   ${o?`<div><small>فاکتور</small><b>FL-${o.id} · ${esc(o.customer)}</b></div><div><small>شهر مقصد</small><b>${esc(h.city)}</b></div><div><small>راننده</small><b>${esc(h.driver)}</b></div><div><small>مأمور پخش</small><b>${esc(h.dist)}</b></div>`
   :`${h.inv?`<div><small>فاکتور / سند</small><b>${esc(h.inv)}</b></div>`:''}${h.party?`<div><small>طرف حساب</small><b>${esc(h.party)}</b></div>`:''}${h.city?`<div><small>شهر</small><b>${esc(h.city)}</b></div>`:''}`}
   ${h.note?`<div><small>توضیحات</small><b>${esc(h.note)}</b></div>`:''}<div><small>تعداد اقلام</small><b>${fa(n)} قلم</b></div></div></div>
  ${linesTable(false)}
  <p class="sub" style="margin:14px 0 0">${isIn?'با ثبت، تعداد هر کالا به موجودی کل انبار (و بچ مربوطه) اضافه می‌شود و برای مدیریت پیام ارسال می‌گردد.':'با ثبت، تعداد هر کالا از موجودی کل انبار کم می‌شود و برای مدیریت پیام ارسال می‌گردد.'}</p>`;
 };
 const draw=()=>{
  const steps=['اطلاعات سند','انتخاب کالاها','بازبینی و ثبت'];
  const stepper=`<div class="wz-steps">${steps.map((t,i)=>`<div class="wz-step ${w.step===i+1?'on':w.step>i+1?'done':''}"><b>${w.step>i+1?'✓':fa(i+1)}</b><span>${t}</span></div>`).join('')}</div>`;
  const nav=`<div class="wz-nav"><div>${w.step>1?'<button class="btn outline" data-a="prev">→ قبلی</button>':''}</div><div>${w.step<3?'<button class="btn primary" data-a="next">بعدی ←</button>':'<button class="btn primary" data-a="ok">✓ ثبت در انبار</button>'}</div></div>`;
  c.innerHTML=head(isIn?'ثبت ورود جدید':'ثبت خروج جدید',isIn?'ورود کالا به انبار در سه مرحله':'خروج کالا از انبار در سه مرحله',`<button class="btn outline" data-a="wzx">✕ انصراف</button>`)+
   `<section class="panel">${stepper}${w.step===1?step1():w.step===2?step2():step3()}${nav}</section>`;
 };
 const addLine=()=>{
  const pk=w.pick,p=prod(pk.pid);
  if(!p)return alert('ابتدا دسته و کالا را انتخاب کنید.');
  const q=qtyOf(pk.qty,p.unit);
  if(q==null)return alert(isDec(p.unit)?'تعداد معتبر وارد کنید.':`تعداد باید عدد صحیح و بزرگ‌تر از صفر باشد (واحد: ${p.unit}).`);
  const line={pid:p.id,qty:q};
  if(isIn){
   line.exp=null;
   if(pk.exp.trim()){line.exp=parseJ(pk.exp);if(!line.exp)return alert('تاریخ انقضا معتبر نیست. نمونه: ۱۴۰۶/۰۵/۱۰');if(line.exp<todayISO()&&!confirm('تاریخ انقضا گذشته است. ادامه می‌دهید؟'))return}
   line.batchNo=pk.batchNo.trim();line.note=pk.note.trim();
  }else{
   line.batchId=pk.batchId||'';
   const usedAll=w.lines.filter(l=>l.pid===p.id).reduce((a,l)=>a+l.qty,0);
   if(line.batchId){const b=db.batches.find(x=>x.id===line.batchId),u=w.lines.filter(l=>l.batchId===line.batchId).reduce((a,l)=>a+l.qty,0);if(!b||q>r3(b.qty-u))return alert('موجودی بچ انتخاب‌شده کافی نیست.')}
   if(q>r3(p.stock-usedAll))return alert(`موجودی ${p.name} کافی نیست (موجودی: ${p.stock} ${p.unit}).`);
  }
  const same=w.lines.find(l=>l.pid===line.pid&&(l.batchNo||'')===(line.batchNo||'')&&(l.exp||null)===(line.exp||null)&&(l.batchId||'')===(line.batchId||'')&&(l.note||'')===(line.note||''));
  same?same.qty=r3(same.qty+q):w.lines.push(line);
  Object.assign(w.pick,{qty:'',batchNo:'',exp:'',note:'',batchId:''});draw();
 };
 draw();
 c.oninput=e=>{const d=e.target.dataset;if(d.h)h[d.h]=e.target.value;if(d.p)w.pick[d.p]=e.target.value};
 c.onchange=e=>{
  const t=e.target,d=t.dataset;
  if(d.h){h[d.h]=t.value;if(d.redraw!==undefined){if(d.h==='order')syncOrder();if(d.h==='type'){h.order='';w.lines=[]}draw()}}
  if(d.p){w.pick[d.p]=t.value;if(d.redraw!==undefined){if(d.p==='cat')w.pick.pid='';w.pick.batchId='';draw()}}
 };
 c.onclick=e=>{
  const b=e.target.closest('[data-a]');if(!b)return;
  const a=b.dataset.a;
  if(a==='wzx'){if(w.lines.length&&!isInv()&&!confirm('اطلاعات واردشده حذف می‌شود. انصراف؟'))return;S.wiz=null;return render(page)}
  if(a==='prev'){w.step--;return draw()}
  if(a==='rm'){w.lines.splice(+b.dataset.i,1);return draw()}
  if(a==='add')return addLine();
  if(a==='next'){
   if(w.step===1){const er=checkStep1(kind,w);if(er)return alert(er);if(isInv())syncOrder()}
   if(w.step===2){
    if(!w.lines.length)return alert('حداقل یک کالا به لیست اضافه کنید.');
    if(isInv()&&!enough(ordById(h.order)))return alert('موجودی قابل فروش برای این فاکتور کافی نیست.');
   }
   w.step++;return draw();
  }
  if(a==='ok'){
   const r=isIn?registerIn(w):registerOut(w);
   if(r.error)return alert(r.error);
   S.wiz=null;S.tab='docs';S.page=1;
   FLASH=isIn?`سند ${r.no} ثبت شد، موجودی انبار به‌روز گردید و پیام برای مدیریت ارسال شد.`:`سند ${r.no} ثبت شد و موجودی انبار کم گردید.`;
   render(page);
  }
 };
}

/* =====================================================
   ۴) ریز حرکت‌ها (تاریخچه): فیلتر، جستجو، صفحه‌بندی، خروجی اکسل
   ===================================================== */
const blankLF=()=>({from:'',to:'',fromT:'',toT:'',pid:'',cat:'',type:'',q:'',page:1,size:20});
const LF={in:blankLF(),out:blankLF()};
function renderLedger(kind,c,page,topHTML,tabsH,common,S){
 const isIn=kind==='in',st=LF[kind],sign=isIn?1:-1;
 const types=Object.keys(MV).filter(k=>MV[k][1]===sign);
 const rows=()=>db.stockLog.filter(x=>{
  if(!MV[x.type]||MV[x.type][1]!==sign)return false;
  const p=prod(x.pid),iso=isoOf(x);
  if(st.from&&iso<st.from)return false;
  if(st.to&&iso>st.to)return false;
  if(st.pid&&x.pid!=st.pid)return false;
  if(st.cat&&p?.cat!==st.cat)return false;
  if(st.type&&x.type!==st.type)return false;
  return !st.q||[p?.name,x.ref,x.doc,x.batchNo,x.driver,x.dist,x.city].join(' ').includes(st.q);
 });
 c.innerHTML=topHTML+`<section class="panel">${tabsH}<div class="wh-bar">
  <input class="field" data-f="q" placeholder="جستجو: کالا، بچ، شرح، شهر، راننده..." value="${esc(st.q)}" style="min-width:230px">
  <select class="field" data-f="pid"><option value="">همه کالاها</option>${db.products.map(p=>`<option value="${p.id}" ${st.pid==p.id?'selected':''}>${esc(p.name)}</option>`).join('')}</select>
  <select class="field" data-f="cat"><option value="">همه دسته‌ها</option>${db.categories.map(x=>`<option ${st.cat===x.name?'selected':''}>${esc(x.name)}</option>`).join('')}</select>
  <select class="field" data-f="type"><option value="">همه انواع</option>${types.map(k=>`<option value="${k}" ${st.type===k?'selected':''}>${shortLbl(MV[k][0])}</option>`).join('')}</select>
  <input class="field" data-f="from" placeholder="از تاریخ" value="${esc(st.fromT)}" style="width:115px"><input class="field" data-f="to" placeholder="تا تاریخ" value="${esc(st.toT)}" style="width:115px">
  <button class="btn ghost sm" id="wclr" hidden>پاک‌کردن فیلترها</button><button class="btn outline sm" id="wcsv">⬇ خروجی اکسل</button></div><div id="wl"></div></section>`;
 const active=()=>st.from||st.to||st.pid||st.cat||st.type||st.q;
 const draw=()=>{
  const all=rows(),pg=pgHTML(all.length,st),f=(st.page-1)*st.size,part=all.slice(f,f+st.size);
  $('#wclr').hidden=!active();
  $('#wl').innerHTML=part.length?`<div class="tablewrap"><table><thead><tr><th>تاریخ</th><th>کالا</th><th>نوع</th><th>تعداد</th><th>بچ / انقضا</th><th>شرح و سند</th><th></th></tr></thead><tbody>${
   part.map(x=>{const p=prod(x.pid),m=/^خروجی (\d+)$/.exec(x.doc||'');
    return `<tr><td>${esc(x.date)}</td><td><div class="wh-two">${esc(p?.name)}<small>${esc(p?.cat||'')}</small></div></td><td>${pill(shortLbl(MV[x.type][0]),mvClass(x.type))}</td>
    <td dir="ltr" style="text-align:right"><b>${x.qty>0?'+':'−'}${fa(Math.abs(x.qty))}</b> <small>${esc(unitOf(x.pid))}</small></td>
    <td><div class="wh-two">${esc(x.batchNo||'—')}<small>${x.exp?'انقضا '+fmtJ(x.exp):'بدون انقضا'}</small></div></td>
    <td><div class="wh-two">${esc(x.ref||'—')}<small>${esc(x.doc||'')}${x.city?` · شهر ${esc(x.city)}`:''}${x.driver||x.dist?` · راننده ${esc(x.driver||'—')} · مأمور ${esc(x.dist||'—')}`:''}</small></div></td>
    <td>${m?`<div class="wh-acts"><button class="btn ghost sm" data-a="pp" data-id="${m[1]}">🖨 کالا</button><button class="btn ghost sm" data-a="pc" data-id="${m[1]}">🖨 مشتری</button></div>`:''}</td></tr>`}).join('')}</tbody></table></div>${pg}`
   :empty('موردی با این فیلترها یافت نشد.');
 };
 draw();
 const clear=()=>Object.assign(st,{from:'',to:'',fromT:'',toT:'',pid:'',cat:'',type:'',q:'',page:1});
 $('#wcsv').onclick=()=>exportCSV(`stock-${kind}.csv`,[['تاریخ','کالا','دسته','نوع','تعداد','واحد','شماره بچ','انقضا','شرح','سند','شهر','راننده','مأمور پخش']].concat(
  rows().map(x=>[x.date,prod(x.pid)?.name,prod(x.pid)?.cat,MV[x.type][0],x.qty,unitOf(x.pid),x.batchNo||'',x.exp?fmtJ(x.exp):'',x.ref,x.doc,x.city||'',x.driver,x.dist])));
 $('#wclr').onclick=()=>{clear();render(page)};
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
  const t=e.target.closest('[data-tab]');if(t){S.tab=t.dataset.tab;S.page=1;return render(page)}
  const b=e.target.closest('[data-a]');if(!b)return;
  if(b.dataset.a==='pp')return printDispatch(b.dataset.id,'product');
  if(b.dataset.a==='pc')return printDispatch(b.dataset.id,'customer');
  common(e);
 };
}

/* =====================================================
   ۵) جدول موجودی انبار + کاردکس + کنترل مغایرت
   ===================================================== */
function level(p){
 const s=p.stock,m=p.min;
 if(s<=0)return 'out';
 if(m<=0)return 'ok';
 return s<=m*0.5?'crit':s<=m?'low':s<=m*3?'ok':'high';
}
const LVL={out:['تمام شده','rejected','#e0626f'],crit:['بحرانی','rejected','#e0626f'],low:['کمبود','pending','#d9a441'],ok:['مناسب','done','#159b78'],high:['موجودی زیاد','shipping','#4a8fd9']};
const LORDER=['out','crit','low','ok','high'];
const levelGrp=p=>{const l=level(p);return l==='out'||l==='crit'?'crit':l};
const ledgerSum=pid=>r3(db.stockLog.filter(x=>x.pid==pid).reduce((a,x)=>a+x.qty,0));
const batchSum=pid=>r3(db.batches.filter(b=>b.pid==pid).reduce((a,b)=>a+b.qty,0));
/* تطبیق سه عدد: موجودی کل (p.stock) · جمع بچ‌ها · جمع دفتر حرکت‌ها */
const auditAll=()=>db.products.map(p=>{const L=ledgerSum(p.id),B=batchSum(p.id);return{p,L,B,S:p.stock,ok:Math.abs(L-B)<1e-6&&Math.abs(B-p.stock)<1e-6}});

function showKardex(pid){
 const p=prod(pid),list=db.stockLog.filter(x=>x.pid==pid).slice().reverse();
 let bal=0;
 const rows=list.map(x=>{bal=r3(bal+x.qty);return `<tr><td>${esc(x.date)}</td><td>${esc(x.doc||'—')}</td><td>${pill(shortLbl(MV[x.type]?MV[x.type][0]:x.type),MV[x.type]?mvClass(x.type):'')}</td><td style="color:#159b78">${x.qty>0?'+'+fa(x.qty):''}</td><td style="color:#d85b69">${x.qty<0?'−'+fa(-x.qty):''}</td><td><b>${fa(bal)}</b></td><td class="sub">${esc(x.batchNo||'')}</td></tr>`}).join('');
 const B=batchSum(pid),ok=Math.abs(bal-B)<1e-6&&Math.abs(B-p.stock)<1e-6;
 openModal(`کاردکس: ${esc(p.name)}`,
  `<div class="wz-kv"><div><small>واحد سنجش</small><b>${esc(p.unit)}</b></div><div><small>موجودی جدول</small><b>${fa(p.stock)}</b></div><div><small>جمع بچ‌ها</small><b>${fa(B)}</b></div><div><small>مانده طبق حرکت‌ها</small><b>${fa(bal)}</b></div></div>
  <p style="margin:16px 0">${ok?pill('هر سه عدد با هم برابرند ✓','done'):pill('مغایرت: موجودی جدول، بچ‌ها و دفتر حرکت‌ها یکی نیستند','rejected')}</p>
  <div class="tablewrap"><table><thead><tr><th>تاریخ</th><th>سند</th><th>نوع</th><th>ورود</th><th>خروج</th><th>مانده</th><th>بچ</th></tr></thead><tbody>${rows||'<tr><td colspan="7">حرکتی ثبت نشده است.</td></tr>'}</tbody></table></div>`,null,null,true);
}
function showAudit(){
 const a=auditAll(),bad=a.filter(x=>!x.ok);
 openModal('کنترل مغایرت موجودی',
  bad.length?`<p>${pill(`${fa(bad.length)} کالا مغایرت دارد`,'rejected')}</p><div class="tablewrap"><table><thead><tr><th>کالا</th><th>موجودی جدول</th><th>جمع بچ‌ها</th><th>طبق دفتر حرکت‌ها</th><th></th></tr></thead><tbody>${
   bad.map(x=>`<tr><td>${esc(x.p.name)}</td><td>${fa(x.S)}</td><td>${fa(x.B)}</td><td>${fa(x.L)}</td><td><button class="btn ghost sm" data-a="kx" data-id="${x.p.id}">کاردکس</button></td></tr>`).join('')}</tbody></table></div>`
  :`<div class="wh-empty" style="padding:30px">همه ${fa(a.length)} کالا کنترل شد؛ موجودی جدول، بچ‌ها و دفتر حرکت‌ها کاملاً یکی است ✓</div>`,null,null,true);
 const m=document.getElementById('whov');
 if(m)m.addEventListener('click',e=>{const b=e.target.closest('[data-a="kx"]');if(b)showKardex(b.dataset.id)});
}

const ST2={tab:'all',q:'',cat:'',page:1,size:20};
reg('stock-table',(c,page)=>{
 sync();
 const cnt=k=>k==='all'?db.products.length:db.products.filter(p=>levelGrp(p)===k).length;
 const rows=()=>db.products.filter(p=>(ST2.tab==='all'||levelGrp(p)===ST2.tab)&&(!ST2.cat||p.cat===ST2.cat)&&(!ST2.q||(p.name+p.cat).includes(ST2.q)))
  .sort((a,b)=>LORDER.indexOf(level(a))-LORDER.indexOf(level(b))||a.name.localeCompare(b.name,'fa'));
 const suggest=p=>Math.max(0,r3(p.min*2-p.stock));
 const aud=auditAll(),bad=aud.filter(x=>!x.ok).length,okMap=Object.fromEntries(aud.map(x=>[x.p.id,x.ok]));
 const value=db.products.reduce((a,p)=>a+p.stock*p.price,0),lowN=db.products.filter(p=>['out','crit','low'].includes(level(p))).length,expN=db.batches.filter(b=>expInfo(b.exp)[2]==='expired').length;
 const dist=LORDER.map(k=>[k,db.products.filter(p=>level(p)===k).length]).filter(x=>x[1]);
 c.innerHTML=head('موجودی انبار','جدول زنده‌ی موجودی؛ با هر ورود و خروج خودکار به‌روز می‌شود',`<button class="btn outline" id="saud" data-a="aud">🔍 کنترل مغایرت</button><button class="btn outline" id="scsv" data-a="csv">⬇ خروجی اکسل</button>`)+
 `<div class="wh-tiles">
  <div class="wh-tile"><i>📦</i><div><small>تعداد کالا</small><b>${fa(db.products.length)}</b></div></div>
  <div class="wh-tile"><i>💰</i><div><small>ارزش کل موجودی</small><b>${money(value)}</b></div></div>
  <div class="wh-tile"><i>⚠️</i><div><small>کالا در سطح کمبود</small><b>${fa(lowN)}</b></div></div>
  <div class="wh-tile"><i>${bad?'❗':'✅'}</i><div><small>مغایرت حسابداری</small><b>${bad?fa(bad)+' کالا':'ندارد'}</b></div></div></div>
 <section class="panel"><div class="wh-dist">${dist.map(([k,n])=>`<span title="${LVL[k][0]}: ${fa(n)}" style="width:${n/db.products.length*100}%;background:${LVL[k][2]}"></span>`).join('')}</div>
  ${tabsHTML([['all','همه',cnt('all')],['crit','تمام‌شده / بحرانی',cnt('crit')],['low','کمبود',cnt('low')],['ok','مناسب',cnt('ok')],['high','موجودی زیاد',cnt('high')]],ST2.tab)}
  <div class="wh-bar"><input class="field" data-f="q" placeholder="جستجوی کالا..." value="${esc(ST2.q)}" style="min-width:230px">
  <select class="field" data-f="cat"><option value="">همه دسته‌ها</option>${db.categories.map(x=>`<option ${ST2.cat===x.name?'selected':''}>${esc(x.name)}</option>`).join('')}</select></div><div id="sl"></div></section>`;
 const draw=()=>{
  const all=rows(),pg=pgHTML(all.length,ST2),f=(ST2.page-1)*ST2.size,part=all.slice(f,f+ST2.size);
  $('#sl').innerHTML=part.length?`<div class="tablewrap"><table><thead><tr><th>کالا</th><th>واحد سنجش</th><th>موجودی کل</th><th>قابل فروش</th><th>حداقل</th><th style="width:170px">سطح</th><th>وضعیت</th><th>تطبیق</th><th></th></tr></thead><tbody>${
   part.map(p=>{const l=level(p),pct=Math.min(100,Math.round(p.stock/Math.max(p.min*3,1)*100)),av=avail(p.id),bs=db.batches.filter(b=>b.pid==p.id).sort(byExp);
    return `<tr><td><div class="wh-two"><b>${esc(p.name)}</b><small>${esc(p.cat)}</small></div></td><td>${esc(p.unit)}</td>
    <td><b>${fa(p.stock)}</b></td><td>${fa(av)}${av!==p.stock?`<small class="sub"> (${fa(r3(p.stock-av))} منقضی)</small>`:''}</td><td>${fa(p.min)}</td>
    <td><div class="wh-lv"><i style="width:${pct}%;background:${LVL[l][2]}"></i><u style="right:33.3%"></u></div></td><td>${pill(LVL[l][0],LVL[l][1])}</td>
    <td>${okMap[p.id]?pill('✓ مطابق','done'):pill('مغایرت','rejected')}</td>
    <td><div class="wh-acts"><button class="btn ghost sm" data-a="kx" data-id="${p.id}">کاردکس</button><button class="btn soft sm" data-a="tg" data-id="${p.id}">بچ‌ها ▾</button></div></td></tr>
    <tr id="sd${p.id}" class="wh-sub wh-hide"><td colspan="9">${bs.length?`<table><thead><tr><th>شماره بچ</th><th>موجودی</th><th>انقضا</th><th>وضعیت</th></tr></thead><tbody>${bs.map(b=>{const [t,cl]=expInfo(b.exp);return `<tr><td>${esc(b.no)}</td><td>${fa(b.qty)} ${esc(p.unit)}</td><td>${fmtJ(b.exp)}</td><td>${pill(t,cl)}</td></tr>`}).join('')}</tbody></table>`:'<p class="sub">موجودی ندارد.</p>'}</td></tr>`}).join('')}</tbody></table></div>${pg}`:empty('کالایی یافت نشد.');
 };
 draw();
 c.oninput=e=>{if(e.target.dataset.f==='q'){ST2.q=e.target.value.trim();ST2.page=1;draw()}};
 c.onchange=e=>{if(pgSize(e,ST2,draw))return;if(e.target.dataset.f==='cat'){ST2.cat=e.target.value;ST2.page=1;draw()}};
 c.onclick=e=>{
  if(pgClick(e,ST2,draw))return;
  const t=e.target.closest('[data-tab]');if(t){ST2.tab=t.dataset.tab;ST2.page=1;return render(page)}
  const b=e.target.closest('[data-a]');if(!b)return;
  const a=b.dataset.a;
  if(a==='kx')return showKardex(b.dataset.id);
  if(a==='aud')return showAudit();
  if(a==='tg')return document.getElementById('sd'+b.dataset.id)?.classList.toggle('wh-hide');
  if(a==='csv')exportCSV('stock-table.csv',[['کالا','دسته','واحد سنجش','موجودی کل','قابل فروش','حداقل','وضعیت','پیشنهاد خرید','تطبیق']].concat(
   rows().map(p=>[p.name,p.cat,p.unit,p.stock,avail(p.id),p.min,LVL[level(p)][0],suggest(p),okMap[p.id]?'مطابق':'مغایرت'])));
 };
});

/* =====================================================
   ۶) بچ‌ها و تاریخ انقضا
   ===================================================== */
const BS={tab:'all',q:'',page:1,size:20};
reg('batches',(c,page)=>{
 sync();
 const all=[...db.batches].sort(byExp),cnt=k=>k==='all'?all.length:all.filter(b=>expInfo(b.exp)[2]===k).length;
 const rows=()=>all.filter(b=>(BS.tab==='all'||expInfo(b.exp)[2]===BS.tab)&&(!BS.q||(prod(b.pid)?.name+b.no).includes(BS.q)));
 const acts={spoiled:'ثبت فاسدی',discard:'دورریز',return_supplier:'مرجوع به فروشنده',return_factory:'مرجوع به کارخانه'};
 c.innerHTML=head('بچ‌ها و تاریخ انقضا','فروش به روش نزدیک‌ترین انقضا اول انجام می‌شود و بچ منقضی فروخته نمی‌شود')+
 `<section class="panel">${tabsHTML([['all','همه',cnt('all')],['expired','منقضی',cnt('expired')],['near','نزدیک انقضا',cnt('near')],['ok','سالم',cnt('ok')],['none','بدون تاریخ',cnt('none')]],BS.tab)}
  <div class="wh-bar"><input class="field" data-f="q" placeholder="جستجوی کالا یا شماره بچ..." value="${esc(BS.q)}" style="min-width:240px"></div><div id="bl"></div></section>`;
 const draw=()=>{
  const list=rows(),pg=pgHTML(list.length,BS),f=(BS.page-1)*BS.size,part=list.slice(f,f+BS.size);
  $('#bl').innerHTML=part.length?`<div class="tablewrap"><table><thead><tr><th>کالا</th><th>شماره بچ</th><th>موجودی</th><th>تاریخ ورود</th><th>انقضا</th><th>وضعیت</th><th></th></tr></thead><tbody>${
   part.map(b=>{const [t,cl]=expInfo(b.exp);return `<tr><td><div class="wh-two">${esc(prod(b.pid)?.name)}<small>${esc(prod(b.pid)?.cat||'')}</small></div></td><td>${esc(b.no)}</td><td><b>${fa(b.qty)}</b> ${esc(unitOf(b.pid))}</td><td>${esc(b.date||'—')}</td><td>${fmtJ(b.exp)}</td><td>${pill(t,cl)}</td>
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
   <div class="wz-grid"><div class="group"><label>نوع اقدام</label><select class="field" id="bt">${Object.entries(acts).map(([k,v])=>`<option value="${k}">${v}</option>`).join('')}</select></div>
   <div class="group"><label>تعداد (حداکثر ${fa(b.qty)})</label><input class="field" id="bq" type="number" min="0" step="${isDec(unitOf(b.pid))?'0.01':'1'}" value="${b.qty}"></div></div>
   <div class="group" style="margin-top:14px"><label>شرح / علت</label><input class="field" id="bw" value="${isExp?'انقضای تاریخ مصرف':''}"></div>`,
   'ثبت اقدام',()=>{
    const type=$('#bt').value,q=qtyOf($('#bq').value,unitOf(b.pid));
    if(q==null||q>b.qty){alert('تعداد معتبر نیست.');return false}
    logMove(type,b.pid,q,$('#bw').value.trim()||acts[type],'اقدام روی بچ',{batchId:b.id});
    notify(`${WH}: ${acts[type]} - ${prod(b.pid).name} (بچ ${b.no}) به تعداد ${fa(q)} ${prod(b.pid).unit}.`,b.no);
    save();FLASH='اقدام ثبت شد و موجودی به‌روز گردید.';render(page);
   });
 };
});

/* =====================================================
   ۷) کالاها، دسته‌ها و واحدهای سنجش (تعریف کالا با واحد شمارش اجباری)
   ===================================================== */
const CS={tab:'products',q:'',cat:'',page:1,size:20};
reg('categories',(c,page)=>{
 sync();
 const unitSel=(cur,attr)=>`<select class="field" ${attr} style="min-width:130px;padding:8px 10px;font-size:13px">${db.units.map(u=>`<option ${u===cur?'selected':''}>${esc(u)}</option>`).join('')}</select>`;
 const rows=()=>db.products.filter(p=>(!CS.cat||p.cat===CS.cat)&&(!CS.q||p.name.includes(CS.q)));
 const used=u=>db.products.filter(p=>p.unit===u).length;
 c.innerHTML=head('کالاها و واحدهای سنجش','تعریف کالا، دسته‌ها و واحد شمارش هر کالا (قلم، کارتن، کیلو، لیتر و ...)',
  `<button class="btn primary" data-a="newp">＋ کالای جدید</button><button class="btn outline" data-a="newc">＋ دسته جدید</button>`)+
 `<section class="panel">${tabsHTML([['products','کالاها',db.products.length],['cats','دسته‌ها',db.categories.length],['units','واحدهای سنجش',db.units.length]],CS.tab)}
  <div class="wh-bar" ${CS.tab==='products'?'':'hidden'}><input class="field" data-f="q" placeholder="جستجوی کالا..." value="${esc(CS.q)}" style="min-width:230px">
  <select class="field" data-f="cat"><option value="">همه دسته‌ها</option>${db.categories.map(x=>`<option ${CS.cat===x.name?'selected':''}>${esc(x.name)}</option>`).join('')}</select></div><div id="cl"></div></section>`;
 const draw=()=>{
  if(CS.tab==='units'){
   $('#cl').innerHTML=`<div class="wh-bar"><input class="field" id="nu" placeholder="واحد جدید، مثلاً «کارتن ۱۲تایی»" style="min-width:260px"><button class="btn primary sm" data-a="addu">＋ افزودن واحد</button></div>
   <div class="tablewrap"><table><thead><tr><th>واحد سنجش</th><th>تعداد کالاهای دارای این واحد</th><th></th></tr></thead><tbody>${
    db.units.map(u=>`<tr><td><b>${esc(u)}</b></td><td>${fa(used(u))}</td><td>${used(u)?'<span class="sub">در حال استفاده</span>':`<button class="btn ghost sm" data-delu="${esc(u)}">حذف</button>`}</td></tr>`).join('')}</tbody></table></div>`;
   return;
  }
  if(CS.tab==='cats'){
   $('#cl').innerHTML=`<div class="tablewrap"><table><thead><tr><th>دسته</th><th>واحد پیش‌فرض کالاهای دسته</th><th>تعداد کالا</th><th></th></tr></thead><tbody>${
    db.categories.map(cat=>{const a=db.products.filter(p=>p.cat===cat.name);return `<tr><td><b>${esc(cat.name)}</b></td><td>${unitSel(cat.unit,`data-cu="${esc(cat.name)}"`)}</td><td>${fa(a.length)}</td><td>${a.length?'':`<button class="btn ghost sm" data-del="${esc(cat.name)}">حذف</button>`}</td></tr>`}).join('')}</tbody></table></div>`;
   return;
  }
  const all=rows(),pg=pgHTML(all.length,CS),f=(CS.page-1)*CS.size,part=all.slice(f,f+CS.size);
  $('#cl').innerHTML=part.length?`<div class="tablewrap"><table><thead><tr><th>کالا</th><th>دسته</th><th>واحد سنجش *</th><th>تعداد در هر واحد</th><th>حداقل موجودی</th><th>موجودی فعلی</th></tr></thead><tbody>${
   part.map(p=>`<tr><td>${p.emoji||''} <b>${esc(p.name)}</b></td>
   <td><select class="field" data-cat="${p.id}" style="min-width:140px;padding:8px 10px;font-size:13px">${db.categories.map(x=>`<option ${x.name===p.cat?'selected':''}>${esc(x.name)}</option>`).join('')}</select></td>
   <td>${unitSel(p.unit,`data-unit="${p.id}"`)}</td>
   <td><input class="field" type="number" min="1" data-pack="${p.id}" value="${p.pack}" style="max-width:90px;padding:8px 10px"></td>
   <td><input class="field" type="number" min="0" data-min="${p.id}" value="${p.min}" style="max-width:100px;padding:8px 10px"></td>
   <td><b>${fa(p.stock)}</b> ${esc(p.unit)}</td></tr>`).join('')}</tbody></table></div>${pg}`:empty('کالایی یافت نشد.');
 };
 draw();
 const newProduct=()=>openModal('تعریف کالای جدید',
  `<div class="wz-grid">
   <div class="group"><label>نام کالا *</label><input class="field" id="np"></div>
   <div class="group"><label>دسته کالا *</label><select class="field" id="npc">${db.categories.map(x=>`<option>${esc(x.name)}</option>`).join('')}</select></div>
   <div class="group"><label>واحد سنجش / شمارش *</label><select class="field" id="npu">${db.units.map(u=>`<option>${esc(u)}</option>`).join('')}</select></div>
   <div class="group"><label>تعداد در هر واحد (مثلاً ۱۲ در کارتن)</label><input class="field" id="npk" type="number" min="1" value="1"></div>
   <div class="group"><label>قیمت واحد (تومان) *</label><input class="field" id="npr" type="number" min="1"></div>
   <div class="group"><label>حداقل موجودی (هشدار)</label><input class="field" id="npm" type="number" min="0" value="30"></div></div>
   <p class="sub" style="margin:14px 0 0">موجودی اولیه صفر است؛ با «ورود به انبار» موجودی ثبت کنید.</p>`,
  'تعریف کالا',()=>{
   const name=$('#np').value.trim(),unit=$('#npu').value,price=Number(normDigits($('#npr').value));
   if(!name){alert('نام کالا را وارد کنید.');return false}
   if(!unit){alert('واحد سنجش کالا اجباری است.');return false}
   if(!(price>0)){alert('قیمت معتبر وارد کنید.');return false}
   if(db.products.some(p=>p.name===name)){alert('کالایی با این نام قبلاً تعریف شده است.');return false}
   db.products.push({id:nextId(db.products),name,price,stock:0,discount:0,emoji:'📦',history:[{date:fmtDate(),price}],cat:$('#npc').value,unit,pack:Math.max(1,Math.floor(Number($('#npk').value))||1),min:Math.max(0,Math.floor(Number($('#npm').value))||0)});
   save();FLASH=`کالای «${name}» با واحد ${unit} تعریف شد.`;render(page);
  });
 const newCat=()=>openModal('دسته جدید',
  `<div class="wz-grid"><div class="group"><label>نام دسته *</label><input class="field" id="newcat" placeholder="مثلاً لبنیات"></div>
  <div class="group"><label>واحد پیش‌فرض این دسته *</label><select class="field" id="newunit">${db.units.map(u=>`<option>${esc(u)}</option>`).join('')}</select></div></div>`,
  'افزودن دسته',()=>{
   const n=$('#newcat').value.trim(),u=$('#newunit').value;
   if(!n||!u){alert('نام دسته و واحد را وارد کنید.');return false}
   if(db.categories.some(x=>x.name===n)){alert('این دسته قبلاً ثبت شده است.');return false}
   db.categories.push({name:n,unit:u});save();FLASH='دسته جدید افزوده شد.';render(page);
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
  const dl=e.target.closest('[data-del]');if(dl){db.categories=db.categories.filter(x=>x.name!==dl.dataset.del);save();return render(page)}
  const du=e.target.closest('[data-delu]');if(du){db.units=db.units.filter(x=>x!==du.dataset.delu);save();return render(page)}
  const b=e.target.closest('[data-a]');if(!b)return;
  if(b.dataset.a==='newp')return newProduct();
  if(b.dataset.a==='newc')return newCat();
  if(b.dataset.a==='addu'){
   const u=($('#nu').value||'').trim();
   if(!u)return alert('نام واحد را وارد کنید.');
   if(db.units.includes(u))return alert('این واحد قبلاً تعریف شده است.');
   db.units.push(u);save();FLASH=`واحد «${u}» افزوده شد.`;render(page);
  }
 };
});
