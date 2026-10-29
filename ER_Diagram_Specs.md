# UniThrift ER Diagram Specifications

This document outlines the exact analytical Entity-Relationship (ER) metadata required to accurately draw a formal DBMS ER Diagram for your academic submission.

## 1. Entities and Attributes

*Primary Keys are marked with (PK). Multi-valued or derived attributes are noted if applicable.*

### **User** (Strong Entity)
- **UserID (PK)**
- Name
- RegNumber (Unique)
- Email (Unique)
- Phone
- Password
- Department
- University
- Role *(Buyer, Seller, Both, Admin)*
- CreatedAt

### **Product** (Strong Entity)
- **ProductID (PK)**
- Title
- Price
- ItemCondition
- Status
- University
- Description
- ImageUrls
- CreatedAt

### **Category** (Strong Entity)
- **CategoryID (PK)**
- CategoryName (Unique)

### **Order** (Associative / Weak Entity relying on User and Product)
- **OrderID (PK)**
- OrderStatus
- OrderDate

### **Review** (Weak/Dependent Entity)
- **ReviewID (PK)**
- Rating
- Comment
- ReviewDate

### **CartItem / WishlistItem** (Associative Entities)
*(Often represented as many-to-many relationships in a conceptual ERD, but mapped as entities due to tracking `AddedAt`)*
- **CartItemID / WishlistItemID (PK)**
- AddedAt

---

## 2. Relationships and Cardinality

When drawing the ER Diagram, use diamonds (`◇`) for relationships and connect them to the respective entities with the following cardinalities:

### 1. User **[Lists]** Product
- **Type:** One-to-Many (1:N)
- **Description:** One User (Seller) can list many Products. A Product is listed by exactly one User.
- **Participation:** Product has total (double-line) participation (it cannot exist without a User).

### 2. Category **[Categorizes]** Product
- **Type:** One-to-Many (1:N)
- **Description:** One Category contains many Products. A Product sits in exactly one Category.

### 3. User **[Requests]** Order *(As Buyer)*
- **Type:** One-to-Many (1:N)
- **Description:** A User can request many Orders. An Order strictly belongs to one Buyer.

### 4. User **[Receives]** Order *(As Seller)*
- **Type:** One-to-Many (1:N)
- **Description:** A User can receive multiple Orders. An Order strictly belongs to one Seller.

### 5. Product **[Has]** Order
- **Type:** One-to-Many (1:N)
- **Description:** A single Product can receive multiple "Pending" Order requests from different buyers.

### 6. Order **[Receives]** Review
- **Type:** One-to-One (1:1)
- **Description:** An Order can have at most one Review. A Review strictly belongs to one specific finished Order.
- **Participation:** Review has total participation (cannot exist without an Order).

### 7. User **[Adds to Cart/Wishlist]** Product
- **Conceptual ERD Type:** Many-to-Many (M:N) Relationship. 
- **Description:** A User can add Many Products to their cart. A Product can be added to Many Users' carts.
- *(Note: If drawing a Logical ERD, represent this as the bridge entity `CartItem` connecting 1:N from User and 1:N from Product).*

---

## 3. How to Draw the Notation 

1. Draw **Rectangles** for Entities (`User`, `Product`, `Category`, `Order`, `Review`).
2. Draw **Ovals** for Attributes (Attach `UserID` to `User` and underline it as the Primary Key).
3. Draw **Diamonds** for Relationships (`Lists`, `Categorizes`, `Places`, `Receives`).
4. Connect them with lines marking cardinality:
   - Example: `[User] --- (1) --- <Lists> --- (N) --- [Product]`
5. Use **Double Lines** connecting `Product` to `Lists` because every product absolutely MUST have a seller.
