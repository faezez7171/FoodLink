/* ورود به پنل‌ها و انتخاب نقش در صفحه اصلی */
(() => {
    const panelConfig = {
        admin: {
            name: 'پنل مدیریت',
            indexTarget: 'AdminPanel/dashboard.html',
            panelTarget: 'dashboard.html'
        },
        customer: {
            name: 'پنل مشتری',
            indexTarget: 'Customers/orders.html',
            panelTarget: 'orders.html'
        },
        marketer: {
            name: 'پنل بازاریاب',
            indexTarget: 'Marketer/orders.html',
            panelTarget: 'orders.html'
        },
        warehouse: {
            name: 'پنل انبار',
            indexTarget: 'Warehouse/warehouse.html',
            panelTarget: 'warehouse.html'
        }
    };

    const panelRole = document.documentElement.dataset.role;

    // فایل‌های login داخل هر پوشه فرم اختصاصی خود را نگه می‌دارند.
    if (panelRole && panelConfig[panelRole]) {
        const config = panelConfig[panelRole];
        const form = document.querySelector('#loginform');
        const quickLogin = document.querySelector('#demologin');

        document.title = `${config.name} | Food Link`;
        form?.insertAdjacentHTML(
            'afterbegin',
            `<div class="rolebadge panel-name" style="display:inline-block;margin-bottom:18px">${config.name}</div>`
        );

        const enterPanel = () => {
            localStorage.setItem('fl_role', panelRole);
            window.location.href = config.panelTarget;
        };

        form?.addEventListener('submit', event => {
            event.preventDefault();
            enterPanel();
        });
        quickLogin?.addEventListener('click', enterPanel);
        return;
    }

    // صفحه اصلی امکان انتخاب و ورود به هر چهار پنل را فراهم می‌کند.
    document.body.innerHTML = `<section class="login"><div class="hero"><div class="brand" style="color:white"><span class="logo">↗</span>Food Link</div><div><div class="eyebrow">SMART DISTRIBUTION WORKSPACE</div><h1>از ثبت سفارش تا تحویل، همه‌چیز یکپارچه.</h1><p>سامانه مدیریت فروش، مشتریان، انبار و توزیع؛ ساده، شفاف و قابل پیگیری.</p></div><div>✦ سفارش‌گیری ۲۴ ساعته　 ✦ گردش شفاف　 ✦ کنترل دسترسی</div></div><div class="loginbox"><form class="loginform" id="loginform"><div class="brand"><span class="logo">↗</span><span>Food Link<small>سامانه مدیریت پخش مویرگی</small></span></div><h2>ورود به فضای کاری</h2><p>برای مشاهده نسخه نمایشی، پنل خود را انتخاب کنید.</p><div class="group"><label for="role">پنل کاربری</label><select id="role" class="field"><option value="admin">پنل مدیریت</option><option value="customer">پنل مشتری</option><option value="marketer">پنل بازاریاب</option><option value="warehouse">پنل انبار</option></select></div><div class="group"><label>نام کاربری</label><input class="field" value="demo@foodlink.ir"></div><div class="group"><label>رمز عبور نمایشی</label><input class="field" type="password" value="123456"></div><button class="btn primary">ورود به سامانه ←</button><p>نسخه نمایشی · ورود و دسترسی‌ها در این نسخه واقعی و امن نیستند.</p></form></div></section>`;

    document.querySelector('#loginform').addEventListener('submit', event => {
        event.preventDefault();
        const selectedRole = document.querySelector('#role').value;
        localStorage.setItem('fl_role', selectedRole);
        window.location.href = panelConfig[selectedRole].indexTarget;
    });
})();
