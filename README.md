# 📘 **Query Service (Fastify Edition)**

یک میکروسرویس سریع، امن و توسعه‌پذیر برای اجرای *Prepared Queries* در PostgreSQL با پشتیبانی از Cache، Streaming، Monitoring و ساختار کاملاً سازمانی.

---

# 🚀 ویژگی‌های کلیدی سیستم

### ✔ **۱. Fastify — سرعت ۲ تا ۳ برابر Express**

موتور اصلی پروژه به Fastify مهاجرت داده شده که باعث می‌شود:

* سرعت بسیار بالا
* مصرف کمتر CPU
* پشتیبانی از Schema Validation
* ساختار معماری Plugin-Based

---

### ✔ **۲. Prepared Queries (ایمن و ضد SQL Injection)**

هر Query فقط در فایل `preparedQueries.js` تعریف می‌شود و همین باعث امنیت بالا و جلوگیری از تزریق SQL می‌شود.

---

### ✔ **۳. Validation خودکار برای ورودی‌ها (Schema-Based)**

برای هر Route:

* params
* query
* body

توسط Fastify اعتبارسنجی می‌شوند.

---

### ✔ **۴. Streaming Query Execution**

نتایج از PostgreSQL به‌صورت Stream دریافت می‌شود. مزایا:

* مصرف RAM کمتر
* مناسب برای دیتاست‌های بزرگ
* اجرای پایدار کوئری‌های سنگین

---

### ✔ **۵. Monitoring زمان اجرای Query**

در سرویس `dbService` زمان اجرای هر Query ثبت می‌شود و در Log نمایش داده می‌شود.

---

### ✔ **۶. Redis Caching + Auto Invalidation (غیرفعال اما آماده)**

پشتیبانی کامل Cache برای Queryهایی که نیاز دارند:

* TTL
* Invalidations
* افزایش سرعت بازیابی داده

---

### ✔ **۷. Prepared Statement Cache**

برای هر Query نام ثابت ایجاد می‌شود:

```
stmt_queryName
```

این باعث می‌شود PostgreSQL Plan را دوباره نسازد → حدود ۳۰٪ سرعت بیشتر.

---

### ✔ **۸. Logger Plugin (ورودی، خروجی، زمان)**

تمام درخواست‌ها شامل:

* method
* url
* body
* زمان اجرای Query

در گزارش ثبت می‌شوند.

---

### ✔ **۹. Error Handler Plugin استاندارد**

ساختار خطا کاملاً یکپارچه است:

```json
{
  "success": false,
  "message": "Error message"
}
```

---

### ✔ **۱۰. CORS کنترل‌شده و امن**

فقط دامنه‌های مجاز می‌توانند به سرویس دسترسی داشته باشند.

---

### ✔ **۱۱. Healthcheck + Metrics**

دو مسیر کاربردی:

```
/health   → بررسی سلامت سرویس
/metrics → وضعیت حافظه، uptime و ...
```

---

### ✔ **۱۲. 🆕 قابلیت جدید: Route مخصوص نمایش لیست کامل Queryها + پارامترهای لازم**

در فایل `queryDefinitionsRoutes.js` یک Route جدید اضافه شده:

```
GET /query-definitions
```

این صفحه به‌صورت HTML جدول زیر را نمایش می‌دهد:

* نام هر Query
* لیست پارامترهای لازم

این قابلیت برای Debug، مستندسازی داخلی و کاربرد تیم Front-End بسیار مفید است.

---

# 📁 ساختار پوشه‌ها

```
src/
│
├── server.js                  # راه‌اندازی Fastify + ثبت Pluginها
│
├── plugins/
│     ├── logger.js            # Logger Plugin
│     ├── errorHandler.js      # Error Handler Plugin
│     └── cors.js              # CORS Plugin
│
├── controllers/
│     └── queryController.js   # پردازش درخواست Query
│
├── routes/
│     ├── queryRoutes.js       # مسیر Query
│     ├── healthRoutes.js      # مسیر Health
│     ├── metricsRoutes.js     # مسیر Metrics
│     └── queryDefinitionsRoutes.js # مسیر جدید نمایش لیست Queryها
│
├── services/
│     ├── dbService.js         # Streaming + Prepared + Cache + Monitoring
│
├── queries/
│     └── preparedQueries.js   # لیست Queryهای مجاز
│
├── db.js                      # اتصال PostgreSQL
└── README.md
```

---

# ⚙️ نصب و اجرا

### ۱) نصب پکیج‌ها

```bash
npm install
```

### ۲) تنظیم `.env`

```env
PG_HOST=localhost
PG_PORT=5432
PG_USER=postgres
PG_PASSWORD=yourpass
PG_DATABASE=mydb

REDIS_HOST=127.0.0.1
REDIS_PORT=6379

PORT=3000
```

### ۳) اجرا

```bash
node src/server.js
```

---

# 🧪 روش استفاده از API

### URL:

```
POST /query/:queryName
```

### نمونه درخواست:

```json
{
  "type_id": 10510,
  "equ_id": 6
}
```

### نمونه پاسخ:

```json
{
  "success": true,
  "data": [...]
}
```

---

# 📦 افزودن یک Query جدید

فایل:

```
src/queries/preparedQueries.js
```

مثال:

```js
userById: {
  sql: "SELECT * FROM users WHERE id = $1",
  params: ["id"],
  cache: true,
  cacheTTL: 60,
  invalidateOn: ["getAllUsers"]
}
```

---

# 📊 Metrics و Healthcheck

```
GET /health
GET /metrics
```

---

# 🎯 جمع‌بندی

این سیستم شامل تمام قابلیت‌های یک **Query Microservice سازمانی** است:

* Fastify سریع و پایدار
* Validation کامل
* Streaming Query
* Cache آماده برای فعال‌سازی
* Monitoring حرفه‌ای
* Logger اختصاصی
* CORS امن
* Error Handling استاندارد
* **🆕 Route جدید برای لیست Queryها**


