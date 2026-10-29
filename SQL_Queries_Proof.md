# UniThrift Database Query Implementations
*Use this document as proof of advanced SQL implementations for your academic report.*

## 1. Relational JOINS (Inner Joins)
Your project heavily leverages `JOIN` conditions to reconstruct normalized data across multiple tables. Instead of storing the user's name or category name directly in the `Products` table (which violates normalization), the backend dynamically joins them.

**Location in Code:** `backend/controllers/productController.js` (Lines 10-14)
**SQL Implementation:**
```sql
SELECT P.*, C.CategoryName, U.Name as SellerName 
FROM Products P
JOIN Categories C ON P.CategoryID = C.CategoryID
JOIN Users U ON P.UserID = U.UserID
WHERE P.University = ?
ORDER BY P.CreatedAt DESC;
```
**Explanation:** This query performs an `INNER JOIN` between `Products`, `Categories`, and `Users` to fetch the specific string value of the Category and the physical Name of the Seller using their respective Foreign Keys (`CategoryID` and `UserID`).

---

## 2. Aggregate Functions (`COUNT()`)
Your project uses mathematical aggregation to calculate absolute metrics across the entire marketplace platform for the global dashboard.

**Location in Code:** `backend/controllers/adminController.js` (Lines 24-28)
**SQL Implementation:**
```sql
SELECT COUNT(*) FROM Users;
SELECT COUNT(*) FROM Products;
SELECT COUNT(*) FROM Orders;
```
**Explanation:** The `COUNT(*)` aggregate function explicitly mathematically sums the total number of physical rows present inside the tracking tables.

---

## 3. Subqueries (Nested Queries)
Your project implements strict, performance-optimized Subqueries to fetch all three distinct aggregate metrics inside a single, unified database execution call.

**Location in Code:** `backend/controllers/adminController.js` (Line 24)
**SQL Implementation:**
```sql
SELECT 
    (SELECT COUNT(*) FROM Users) as totalUsers,
    (SELECT COUNT(*) FROM Products) as totalProducts,
    (SELECT COUNT(*) FROM Orders) as totalOrders;
```
**Explanation:** This acts as a Master Query containing three distinct nested Subqueries `(SELECT ...)`. It allows the Node.js backend to make a single asynchronous hit to the MySQL database but cleanly retrieve fully structured aggregations spanning three completely different tables simultaneously.
