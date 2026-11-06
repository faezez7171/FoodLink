# مدل داده و API — Food Link
**نسخه:** 2.0  
**یادداشت:** این سند طرح پیشنهادی برای پیاده‌سازی بک‌اند است؛ وجود این موجودیت‌ها در نمونه HTML به معنی وجود پایگاه داده واقعی نیست.

## 1. موجودیت‌های اصلی
### User
- `id`, `full_name`, `username`, `phone`, `password_hash`
- `status`, `created_at`, `last_login_at`

### Role و Permission
- `Role(id, name, description)`
- `Permission(id, code, description)`
- `RolePermission(role_id, permission_id)`
- `UserRole(user_id, role_id)`
- مجوزها باید ریزدانه باشند؛ مانند `orders.view`, `orders.approve`, `products.manage`, `prices.view`, `prices.manage`, `users.invite`, `warehouse.pick`, `delivery.confirm`, `reports.view`.

### Customer
- `id`, `name`, `phone`, `address`, `city`, `region`
- `assigned_marketer_id`, `status`, `credit_limit`
- `can_view_prices`, `can_view_discounts`
- در صورت نیاز: `pricing_group_id`, `payment_terms`

### Product و Inventory
- `Product(id, sku, name, category_id, unit, description, image, is_active)`
- `Inventory(id, product_id, warehouse_id, on_hand, reserved, available, updated_at)`
- `available` باید از منطق موجودی محاسبه یا با تراکنش امن به‌روزرسانی شود.

### Price و Discount
- `ProductPrice(id, product_id, price, currency, valid_from, valid_to, created_by, reason)`
- `CustomerPrice(id, customer_id, product_id, price, valid_from, valid_to, created_by)`
- `Discount(id, product_id, customer_id, pricing_group_id, type, value, valid_from, valid_to, conditions, is_active)`
- تاریخچه قیمت append-only باشد؛ رکورد قبلی حذف نشود.
- در سفارش، قیمت و تخفیف نهایی اعمال‌شده به‌صورت snapshot ذخیره شود تا تغییرات بعدی قیمت، سفارش قدیمی را تغییر ندهد.

### Order و OrderItem
- `Order(id, order_number, customer_id, created_by_user_id, marketer_id)`
- `status`, `requested_delivery_date`, `delivery_address`
- `subtotal`, `discount_total`, `tax_total`, `shipping_total`, `grand_total`
- `currency`, `notes`, `created_at`, `updated_at`
- `OrderItem(id, order_id, product_id, quantity, unit_price_snapshot, discount_snapshot, line_total)`

### OrderEvent / AuditLog
- `OrderEvent(id, order_id, from_status, to_status, actor_user_id, note, created_at)`
- `AuditLog(id, actor_user_id, action, entity_type, entity_id, before_json, after_json, created_at, ip_address)`
- رویدادها برای نمایش خط زمانی و حسابرسی استفاده می‌شوند.

### Warehouse و Shipment / Delivery
- `Warehouse(id, name, address)`
- `PickItem(id, order_item_id, requested_qty, picked_qty, shortage_qty, note, picked_by, picked_at)`
- `Shipment(id, order_id, driver_user_id, tracking_code, dispatched_at, status)`
- `DeliveryAttempt(id, shipment_id, result, delivered_items_json, note, proof_url, delivered_at, recorded_by)`

### MarketerAssignment
- `MarketerAssignment(id, marketer_user_id, customer_id, region_id, valid_from, valid_to)`
- شناسه بازاریاب ثبت‌کننده سفارش باید مستقل از مالک مشتری ذخیره شود تا گزارش‌ها دقیق باشند.

## 2. قواعد مهم داده
- مبلغ‌ها با نوع عددی دقیق (مانند decimal) نگهداری شوند، نه float.
- واحد پول و قواعد گردکردن صریح باشند.
- تاریخ‌ها در پایگاه داده با منطقه زمانی مشخص و در رابط کاربر به شمسی نمایش داده شوند.
- حذف فیزیکی سفارش، رویداد، فاکتور یا تاریخچه قیمت توصیه نمی‌شود؛ از وضعیت غیرفعال/ابطال استفاده شود.
- دسترسی به مشتری و سفارش باید علاوه بر نقش، محدوده داده را هم بررسی کند.
- جمع کل باید در سمت سرور دوباره محاسبه شود؛ مقدار ارسالی مرورگر قابل اعتماد نیست.

## 3. API پیشنهادی
### احراز هویت و کاربران
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/me`
- `GET /api/users`
- `POST /api/users/invitations`
- `PATCH /api/users/{id}/roles`
- `PATCH /api/users/{id}/permissions`

### مشتریان و محصولات
- `GET /api/customers`
- `POST /api/customers`
- `PATCH /api/customers/{id}`
- `GET /api/products`
- `POST /api/products`
- `PATCH /api/products/{id}`

### قیمت و تخفیف
- `GET /api/products/{id}/price-profile`
- `POST /api/products/{id}/prices`
- `GET /api/discounts`
- `POST /api/discounts`
- `PATCH /api/customers/{id}/visibility-policy`

### سفارش و گردش
- `GET /api/orders`
- `POST /api/orders`
- `GET /api/orders/{id}`
- `POST /api/orders/{id}/submit`
- `POST /api/orders/{id}/approve`
- `POST /api/orders/{id}/reject`
- `POST /api/orders/{id}/request-revision`
- `GET /api/orders/{id}/timeline`

### انبار و تحویل
- `GET /api/warehouse/queue`
- `POST /api/orders/{id}/picking`
- `POST /api/orders/{id}/ready-to-dispatch`
- `POST /api/shipments`
- `POST /api/shipments/{id}/delivery-attempts`

### گزارش‌ها
- `GET /api/reports/sales`
- `GET /api/reports/marketers`
- `GET /api/reports/products`
- `GET /api/reports/customers`
- `GET /api/reports/order-flow`

## 4. امنیت API
- احراز هویت امن با نشست یا توکن کوتاه‌عمر و سازوکار تمدید.
- بررسی مجوز در هر درخواست سمت سرور.
- فیلتر داده بر اساس مشتری، منطقه، بازاریاب و محموله تخصیص‌یافته.
- اعتبارسنجی نوع، مقدار، موجودی، قیمت و تاریخ.
- محدودسازی تلاش ورود، ثبت رویدادهای حساس و محافظت در برابر CSRF/XSS/SQL injection متناسب با فناوری انتخابی.
