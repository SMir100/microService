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

هر Query در فایل `preparedQueries.js` تعریف شده و فقط همان کوئری‌ها قابل اجراست.

---

### ✔ **۳. Validation خودکار برای ورودی‌ها**

تمام پارامترهای مسیر (`params`) و بدنه (`body`) با Fastify Schema اعتبارسنجی می‌شوند.

---

### ✔ **۴. Streaming Query Execution**

به جای گرفتن تمام داده‌ها یکجا، نتایج به صورت Stream از PostgreSQL دریافت می‌شود:

مزایا:

* مصرف RAM کمتر
* مناسب Queryهای سنگین
* پایدار روی دیتاست‌های بزرگ

---

### ✔ **۵. Monitoring — اندازه‌گیری زمان اجرای هر Query**

در `dbService` زمان اجرای Query ثبت شده و در Log ظاهر می‌شود.

---

### ✔ **۶. Redis Caching + Auto Invalidation**

برای Queryهای مشخص:

* کش با TTL
* پاک کردن کش مرتبط (Invalidate)
* پرسرعت برای داده‌های ثابت

---

### ✔ **۷. Prepared Statement Cache**

با تعریف name ثابت برای هر Query:

```
stmt_queryName
```

PostgreSQL دیگر Plan را دوباره نمی‌سازد → سرعت ۲۰ تا ۳۰٪ افزایش.

---

### ✔ **۸. Logger Plugin (ورودی + خروجی + زمان)**

در هر درخواست:

* method
* url
* body
* زمان اجرای Query
* نتیجه

در Log ثبت می‌شود.

---

### ✔ **۹. Error Handler Plugin**

تمام خطاها به شکل استاندارد تبدیل می‌شوند:

```json
{
  "success": false,
  "message": "Error message"
}
```

---

### ✔ **۱۰. CORS Plugin کاملاً امن**

فقط دامنه‌های معتبر می‌توانند به سرویس دسترسی داشته باشند.

---

### ✔ **۱۱. Healthcheck + Metrics**

دو مسیر استاندارد:

```
/health  → وضعیت سرویس
/metrics → uptime ، memoryUsage و ...
```

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
│     └── metricsRoutes.js     # مسیر Metrics
│
├── services/
│     ├── dbService.js         # Streaming + Prepared + Cache + Monitoring
│     └── redis.js             # اتصال Redis
│
├── queries/
│     └── preparedQueries.js   # تمام Queryهای مجاز
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

برای مانیتورینگ با Prometheus قابل استفاده است.

---

# 🎯 نتیجه

این سیستم یک **Query Microservice سازمانی** است که ویژگی‌های زیر را دارد:

* Fastify سریع و پایدار
* Validation کامل
* Streaming Query
* Cache + Auto Invalidate
* Monitoring حرفه‌ای
* Logging Plugin
* CORS امن
* ErrorHandling استاندارد

در صورت نیاز می‌توانیم:

🔹 Swagger (OpenAPI)
🔹 Load Testing (k6)
🔹 Docker Compose
🔹 Kubernetes Deployment
🔹 Role-based ACL

هم اضافه کنیم.

---

اگر می‌خواهی، این README را در **فایل Canvas** هم اضافه کنم، بگو تا برایت ایجاد کنم.
