
# میکروسرویس Query Service
این میکروسرویس یک API سریع، امن و قابل توسعه برای اجرای کوئری‌های از پیش تعریف‌شده در PostgreSQL است.
در این سرویس، کلاینت‌ها بدون ارسال SQL خام و تنها با استفاده از نام کوئری و پارامترهای لازم، می‌توانند داده دریافت کنند.

---

## 🚀 ویژگی‌ها

- **اجرای کوئری‌های از پیش تعریف‌شده (Prepared Queries)**
  همه‌ی کوئری‌ها در فایل `preparedQueries.js` ثبت می‌شوند.

- **پشتیبانی از خروجی‌های مختلف با Header → Accept**
  - `Accept: application/json` → خروجی JSON (پیش‌فرض)
  - `Accept: text/csv` → خروجی CSV استاندارد

- **پارامترهای کوئری فقط از طریق Body**
- **جلوگیری کامل از SQL Injection**
- **طراحی ماژولار و قابل توسعه**

---

## 📁 ساختار پروژه

```

/src
/controllers
queryController.js        → کنترل اصلی پردازش و خروجی
/services
dbService.js              → اجرای کوئری با Prepared Statement
/queries
preparedQueries.js        → لیست کوئری‌های مجاز
db.js                         → اتصال به پایگاه‌داده PostgreSQL
server.js                     → راه‌اندازی سرور API

````

---

## ⚙️ نصب و اجرا

### 1) نصب پکیج‌ها
```bash
npm install
````

### 2) ایجاد فایل `.env`

```env
PG_HOST=localhost
PG_PORT=5432
PG_USER=postgres
PG_PASSWORD=yourpass
PG_DATABASE=mydb
```

### 3) اجرای سرویس

```bash
node src/server.js
```

پورت پیش‌فرض: **3000**

---

## 🧩 نحوه استفاده از API

### 🔹 مسیر API

```
POST /query/:queryName
```

مثال:

```
POST /query/selEquFilterGrid
```

---

## 🔹 ارسال پارامترها (فقط در Body)

```json
{
  "type_id": 10510,
  "equ_id": 6
}
```

---

## 🔹 تعیین نوع خروجی با Header

### ✔ خروجی JSON (پیش‌فرض)

```
Accept: application/json
```

### ✔ خروجی CSV

```
Accept: text/csv
```

---

## 🟦 نمونه خروجی JSON

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

---

## 🟨 نمونه خروجی CSV

```
id,code,title,is_active
1,GR01,Group A,true
2,GR02,Group B,true
```

این خروجی در:

* Excel
* Google Sheets
* Power BI
* AG-Grid
* DataTables

کاملاً قابل استفاده است.

---

## 🛠 افزودن یک کوئری جدید

در فایل زیر:

```
src/queries/preparedQueries.js
```

یک کوئری اضافه کنید:

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

## 🔒 امنیت

* هیچ SQL خامی از کلاینت اجرا نمی‌شود
* تنها کوئری‌هایی اجرا می‌شوند که تعریف شده‌اند
* استفاده از Prepared Statement امنیت را تضمین می‌کند

---

## 🧪 نمونه cURL

### JSON:

```bash
curl -X POST http://localhost:4000/query/selEquFilterGrid \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{"type_id":10510, "equ_id":6}'
```

### CSV:

```bash
curl -X POST http://localhost:4000/query/selEquFilterGrid \
  -H "Accept: text/csv" \
  -H "Content-Type: application/json" \
  -d '{"type_id":10510, "equ_id":6}'
```

---

## 🧱 تکنولوژی‌ها

* Node.js
* Express
* PostgreSQL
* Prepared Statements
* CSV Output
* Content Negotiation با Accept Header

---


## 👤 نگهدارنده

طراحی شده برای استفاده در سیستم‌های سازمانی و مقیاس‌پذیر.


مثال در console :

---
$ curl -X POST http://192.168.11.129:3000/query/selEquFilterGrid -H "Content-Type: application/json" -d '{"type_id":10510,"equ_id":6}'
$ curl -X POST http://192.168.11.129:3000/query/selEquGrid

