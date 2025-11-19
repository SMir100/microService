# میکروسرویس Query Service
این میکروسرویس یک API سبک، سریع، امن و قابل‌توسعه برای اجرای کوئری‌های از پیش تعریف‌شده در PostgreSQL است.
در این سرویس، کلاینت‌ها بدون ارسال SQL خام و تنها با استفاده از نام کوئری و پارامترهای لازم، داده دریافت می‌کنند.

---

# 🚀 ویژگی‌ها

- **اجرای کوئری‌های امن (Prepared Queries)**
- **خروجی‌های مختلف بر اساس Accept Header**
  - `application/json` → JSON (پیش‌فرض)
  - `text/csv` → فایل CSV استاندارد
- **عدم اجرای SQL خام و جلوگیری کامل از SQL Injection**
- **ساختار ماژولار (Controller / Service / Query Registry / Middleware)**
- **پشتیبانی از Redis برای Cache (اختیاری)**
- **قابل‌استفاده برای انواع سیستم‌های کلاینت (Django, React, Excel, BI Tools)**
- **مناسب سامانه‌های پرفشار و سازمانی**
- **فقط دامنه‌های تایید شده → دسترسی دارند.
- **استفاده از Prepared Statement Plan


---

# 📁 ساختار پروژه

```

src/
│
├── config/
│     └── cors.js        #
│
├── controllers/
│     └── queryController.js        # کنترل پردازش کوئری و ساخت خروجی
│
├── services/
│     ├── dbService.js             # اجرای Prepared Statement با پارامترها
│     └── redis.js                 # اتصال به Redis (اختیاری)
│
├── middlewares/
│     ├── logger.js                # لاگ درخواست‌ها
│     └── errorHandler.js          # مدیریت خطاهای سراسری
│
├── queries/
│     └── preparedQueries.js       # لیست کوئری‌های مجاز
│
├── routes/
│     └── queryRoutes.js           # مسیرهای API
│
├── db.js                          # اتصال به PostgreSQL
└── server.js                      # راه‌اندازی سرور Express
```

---

# 🧠 معماری کلی

میکروسرویس بر پایه معماری زیر طراحی شده است:

```

Client → Routes → Controller → Service → PostgreSQL
↓
Redis Cache (اختیاری)

````

- **Routes:** دریافت URL مانند: `/query/:queryName`
- **Controller:** بررسی ورودی + انتخاب JSON یا CSV بر اساس Accept
- **Service:** اجرای Prepared Query
- **Queries Registry:** تعریف تمام کوئری‌های مجاز
- **Redis:** ذخیره‌ی نتایج کوئری‌ها (برای افزایش سرعت)
- **Middleware:** لاگ + مدیریت خطا

---

# ⚙️ نصب و اجرا

### 1) نصب پکیج‌ها
```bash
mkdir queryservice && cd queryservice
npm init -y
npm install express pg dotenv redis morgan json2csv cors
````

### 2) ایجاد فایل محیطی `.env`

```env
PG_HOST=localhost
PG_PORT=5432
PG_USER=postgres
PG_PASSWORD=yourpass
PG_DATABASE=mydb
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
PG_POOL_MAX=30
PG_IDLE_TIMEOUT=30000
PG_CONNECTION_TIMEOUT=2000
```

### 3) اجرای سرویس

```bash
node src/server.js
```

پورت پیش‌فرض: **3000**

---

# 🧩 نحوه استفاده از API

### 🔹 مسیر اصلی:

```
POST /query/:queryName
```

مثال:

```
POST /query/selEquFilterGrid
```

---

### 🔹 پارامترها (فقط در Body)

```json
{
  "type_id": 10510,
  "equ_id": 6
}
```

---

### 🔹 تعیین نوع خروجی با Header

#### ✔ خروجی JSON

```
Accept: application/json
```

#### ✔ خروجی CSV

```
Accept: text/csv
```

---

# 🟦 نمونه خروجی JSON

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "code": "GR01",
      "title": "Group A",
      "is_active": true
    }
  ]
}
```



# 🟨 نمونه خروجی CSV

```
id,code,title,is_active
1,GR01,Group A,true
2,GR02,Group B,true
```



# 🛠 افزودن یک کوئری جدید

در فایل زیر:

```
src/queries/preparedQueries.js
```

مثال اضافه‌کردن کوئری:

```js
myQuery: {
  sql: "SELECT * FROM my_table WHERE id = $1",
  params: ["id"]
}
```

فراخوانی:

```
POST /query/myQuery
```

Body:

```json
{
  "id": 5
}
```

---

# 🧪 نمونه cURL

## JSON

```bash
curl -X POST http://localhost:3000/query/selEquFilterGrid \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{"type_id":10510, "equ_id":6}'
```

## CSV

```bash
curl -X POST http://localhost:3000/query/selEquFilterGrid \
  -H "Accept: text/csv" \
  -H "Content-Type: application/json" \
  -d '{"type_id":10510, "equ_id":6}'
```



# 🧱 تکنولوژی‌های استفاده‌شده

* Node.js
* Express
* PostgreSQL
* Redis (اختیاری)
* Prepared Statements
* Content Negotiation (Accept Header)
* Middleware‌های استاندارد



# 🎯 مزایای اصلی سیستم

* **بسیار امن** به دلیل حذف کامل SQL خام
* **سریع و سبک**
* **قابل اتصال به هر سیستم خارجی (Django, React, ERP, گزارشات)**
* **قابل کش شدن** برای سرعت بسیار بالا
* **خروجی سازگار با ابزارهای تحلیلی**
* **توسعه آسان با ساختار ماژولار**


# 🔮 پیشنهادهای ارتقا
# ✔ بهبود مقیاس‌پذیری (Scalability)
## اجرای Multi-Core با PM2 Cluster Mode

استفاده از تمام هسته‌های CPU:
```bash
pm2 start src/server.js -i max
```
### مزیت

* استفاده از همه هسته‌های


## ۲.۲. Load Balancing با Nginx یا HAProxy

پیکربندی Nginx:
```bash
upstream query_service {
    server localhost:3001;
    server localhost:3002;
    server localhost:3003;
}
```

### مزیت

توزیع بار

جلوگیری از Down شدن سرویس

## ۲.۳. اجرای چند Container با Docker Compose Scale
```bash
docker compose up --scale query-service=5
```

### مزیت


افزایش تعداد Workerها

تحمل بار بیشتر

## ۲.۴. Auto Scaling با Kubernetes

در K8S:
```bash
kind: HorizontalPodAutoscaler
```

### مزیت

افزایش/کاهش خودکار تعداد سرویس‌ها

مناسب تولید، ERP و سامانه‌های پرترافیک




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


# ✔ ۱.۲ فعال‌کردن HTTPS اجباری

## توضیح

سرویس فقط اجازه درخواست از طریق HTTPS را می‌دهد.

## مزیت

* امنیت در انتقال داده
* جلوگیری از حملات MITM


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
