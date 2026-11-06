/* پنل انباردار */
navs.warehouse=[['warehouse','▣','صف آماده‌سازی'],['deliveries','➤','ارسال و تحویل']];

registerPage('warehouse',(c,page)=>{let worders=db.orders.filter(o=>['تأیید شده','در حال آماده‌سازی','آماده ارسال'].includes(o.status));c.innerHTML=pageHead('پنل انباردار','سفارش‌های تأییدشده را جمع‌آوری و برای ارسال آماده کنید')+`<div class="stats"><div class="stat"><small>در صف انبار</small><h2>${worders.length}</h2></div><div class="stat"><small>در حال آماده‌سازی</small><h2>${db.orders.filter(o=>o.status==='در حال آماده‌سازی').length}</h2></div><div class="stat"><small>آماده ارسال</small><h2>${db.orders.filter(o=>o.status==='آماده ارسال').length}</h2></div><div class="stat"><small>کل اقلام کالا</small><h2>${db.products.length}</h2></div></div><section class="panel"><h3>صف سفارش‌های انبار</h3>${orderTable(worders)}<p class="sub">برای تغییر وضعیت، از جزئیات سفارش اقدام کنید.</p></section>`;});

