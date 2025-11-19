# 📘 قابلیت‌های توسعه آینده (Future Enhancements)

این بخش شامل قابلیت‌هایی است که می‌توان در نسخه‌های آینده به میکروسرویس **Query Service** اضافه کرد. برای هر قابلیت، توضیحات مربوط به **نحوه پیاده‌سازی** و **مزایا** آورده شده است.

---

# ✔ افزودن Rate Limiting (جلوگیری از حملات)

## 🔧 نحوه انجام (Implementation)

```bash
npm install express-rate-limit
```

در `server.js`:

```js
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100
});

app.use(limiter);
```

## ⭐ مزایا

* جلوگیری از حملات **DDoS** و **Brute Force**
* کنترل مصرف منابع
* حفظ پایداری سرویس در زمان ترافیک بالا

---

# ✔ افزودن JWT Authentication (احراز هویت کاربران)

## 🔧 نحوه انجام

```bash
npm install jsonwebtoken
```

Middleware:

```js
const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).send("Unauthorized");

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(403).send("Invalid Token");
  }
}
```

در مسیر:

```js
app.use("/query", auth);
```

## ⭐ مزایا

* افزایش امنیت
* جلوگیری از استفاده غیرمجاز
* امکان تعریف Role-Based Access

---

# ✔ ۱.۲ فعال‌کردن HTTPS اجباری

## توضیح

سرویس فقط اجازه درخواست از طریق HTTPS را می‌دهد.

## مزیت

* امنیت در انتقال داده
* جلوگیری از حملات MITM

---

# ✔ ۱.۳ محدودسازی CORS

## توضیح

تعریف دامنه‌های مجاز برای دسترسی به API.

## مزیت

* جلوگیری از سوءاستفاده در وب
* افزایش امنیت API

---

# ✔ پشتیبانی از GraphQL Wrapper

## 🔧 نحوه انجام

```bash
npm install @apollo/server graphql
```

ایجاد Schema:

```graphql
type Query {
  selEquFilterGrid(type_id: Int!, equ_id: Int!): [Equ]
}
```

Resolvers با استفاده از `dbService` نوشته می‌شود.

## ⭐ مزایا

* API واحد و بهینه
* امکان ارسال چندین کوئری در یک درخواست
* مناسب UIهای مدرن (React, Flutter)

---

# ✔ اضافه‌کردن Monitoring (Prometheus + Grafana)

## 🔧 نحوه انجام

```bash
npm install prom-client
```

ایجاد Endpoint:

```js
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", "text/plain");
  res.send(await register.metrics());
});
```

## ⭐ مزایا

* مشاهده وضعیت سرور به صورت Realtime
* مانیتورینگ درخواست‌ها، خطاها و latency
* ایجاد داشبوردهای تحلیلی

---

# ✔ افزودن Batch Query / Bulk Execute

## 🔧 نحوه انجام

نمونه درخواست:

```json
{
  "batch": [
    { "query": "getUser", "params": { "id": 1 } },
    { "query": "getOrders", "params": { "user_id": 1 } }
  ]
}
```

ویژگی در Controller:

```js
const results = [];
for (let item of req.body.batch) {
  results.push(await executePreparedQuery(item.query, item.params));
}
res.json({ success: true, results });
```

## ⭐ مزایا

* کاهش تعداد درخواست‌ها
* افزایش سرعت اجرای صفحه‌های داشبورد

---

# ✔ پشتیبانی از خروجی Excel (XLSX)

## 🔧 نحوه انجام

```bash
npm install exceljs
```

نمونه:

```js
const Excel = require("exceljs");
const wb = new Excel.Workbook();
const sheet = wb.addWorksheet("data");

sheet.columns = Object.keys(rows[0]).map(c => ({ header: c, key: c }));
sheet.addRows(rows);

res.setHeader(
  "Content-Type",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
);
await wb.xlsx.write(res);
```

## ⭐ مزایا

* مناسب واحدهای اداری
* خروجی قابل استفاده در Excel و Power BI

---

# ✔ نسخه‌بندی API (Versioning)

## 🔧 نحوه انجام

```
/v1/query/...
/v2/query/...
```

در Express:

```js
app.use("/v1/query", routesV1);
app.use("/v2/query", routesV2);
```

## ⭐ مزایا

* جلوگیری از اختلال در نسخه‌های قدیمی
* توسعه API بدون شکستن نسخه قبلی

---

# ✔ Pagination داخلی

## 🔧 نحوه انجام

پارامتر:

```json
{
  "page": 1,
  "pageSize": 50
}
```

کوئری:

```sql
SELECT ... LIMIT $1 OFFSET $2
```

خروجی:

```json
{
  "total": 5000,
  "page": 1,
  "pageSize": 50,
  "data": [...]
}
```

## ⭐ مزایا

* سرعت بالاتر
* کاهش حجم داده
* مناسب جدول‌های سنگین

---

# ✔ Query Description + Metadata

## نمونه تعریف کوئری

```js
{
  sql: "...",
  params: ["id"],
  description: "دریافت اطلاعات تجهیز",
  tags: ["equipment", "grid", "read-only"]
}
```

## مزایا

* مستندسازی بهتر
* افزایش توسعه‌پذیری

---

# ✔ قوانین Cache برای هر کوئری (Per-Query Caching)

## 🔧 نحوه انجام

در `preparedQueries.js`:

```js
selEquFilterGrid: {
  sql: "...",
  params: ["type_id", "equ_id"],
  cache: true,
  cacheTTL: 120
}
```

در `dbService.js`:

```js
if (query.cache) {
  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);
}
```

بعد از اجرای کوئری:

```js
await redis.set(cacheKey, JSON.stringify(rows), "EX", query.cacheTTL);
```

## ⭐ مزایا

* افزایش سرعت تا ۵۰x
* کاهش بار دیتابیس
* مناسب سرویس‌های پرترافیک

---

# ✔ بهبود مقیاس‌پذیری (Scalability)

## ۳.۱ اجرای Multi-Thread با PM2 Cluster Mode

```
pm2 start src/server.js -i max
```

### مزیت

* استفاده از همه هسته‌های CPU

## ۳.۲ Load Balancing با Nginx

### مزیت

* توزیع ترافیک
* جلوگیری از Down شدن سرویس

## ۳.۳ استفاده از Docker Swarm یا Kubernetes

### مزیت

* اجرای سرویس روی چند سرور
* Auto-Scaling
* High Availability

---

