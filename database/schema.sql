CREATE DATABASE IF NOT EXISTS unithrift;
USE unithrift;

-- 🔹 Users Table
CREATE TABLE IF NOT EXISTS Users (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    RegNumber VARCHAR(50) NOT NULL UNIQUE,
    Email VARCHAR(150) NOT NULL UNIQUE,
    Phone VARCHAR(20),
    Password VARCHAR(255) NOT NULL,
    Department VARCHAR(100),
    University ENUM('SRMAP', 'VIT-AP', 'KL University') NOT NULL,
    Role ENUM('Buyer', 'Seller', 'Both') DEFAULT 'Buyer',
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 🔹 Categories Table
CREATE TABLE IF NOT EXISTS Categories (
    CategoryID INT AUTO_INCREMENT PRIMARY KEY,
    CategoryName VARCHAR(100) NOT NULL UNIQUE
);

-- 🔹 Products Table
CREATE TABLE IF NOT EXISTS Products (
    ProductID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT NOT NULL,
    CategoryID INT NOT NULL,
    Title VARCHAR(200) NOT NULL,
    Price DECIMAL(10, 2) NOT NULL,
    ItemCondition ENUM('New', 'Like New', 'Used - Good', 'Used - Fair') NOT NULL,
    Status ENUM('Available', 'Sold') DEFAULT 'Available',
    University ENUM('SRMAP', 'VIT-AP', 'KL University') NOT NULL,
    Description TEXT,
    ImageUrls TEXT,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
    FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID) ON DELETE CASCADE
);

-- 🔹 Orders Table
CREATE TABLE IF NOT EXISTS Orders (
    OrderID INT AUTO_INCREMENT PRIMARY KEY,
    ProductID INT NOT NULL,
    BuyerID INT NOT NULL,
    SellerID INT NOT NULL,
    OrderStatus ENUM('Pending', 'Completed', 'Cancelled') DEFAULT 'Pending',
    OrderDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID) ON DELETE CASCADE,
    FOREIGN KEY (BuyerID) REFERENCES Users(UserID) ON DELETE CASCADE,
    FOREIGN KEY (SellerID) REFERENCES Users(UserID) ON DELETE CASCADE
);

-- 🔹 Reviews Table
CREATE TABLE IF NOT EXISTS Reviews (
    ReviewID INT AUTO_INCREMENT PRIMARY KEY,
    OrderID INT NOT NULL UNIQUE,
    Rating INT NOT NULL CHECK (Rating BETWEEN 1 AND 5),
    Comment TEXT,
    ReviewDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (OrderID) REFERENCES Orders(OrderID) ON DELETE CASCADE
);

-- 🔹 CartItems Table
CREATE TABLE IF NOT EXISTS CartItems (
    CartItemID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT NOT NULL,
    ProductID INT NOT NULL,
    AddedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID) ON DELETE CASCADE,
    UNIQUE(UserID, ProductID)
);

-- 🔹 WishlistItems Table
CREATE TABLE IF NOT EXISTS WishlistItems (
    WishlistItemID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT NOT NULL,
    ProductID INT NOT NULL,
    AddedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID) ON DELETE CASCADE,
    UNIQUE(UserID, ProductID)
);

-- Views for Buyer and Seller logs (as requested so they are mixed up properly)

-- 🔹 View: Buyer Transactions
CREATE OR REPLACE VIEW Buyer_View AS
SELECT 
    O.OrderID, 
    O.BuyerID, 
    P.Title AS ProductTitle, 
    O.OrderStatus, 
    O.OrderDate,
    P.Price
FROM Orders O
JOIN Products P ON O.ProductID = P.ProductID;

-- 🔹 View: Seller Transactions
CREATE OR REPLACE VIEW Seller_View AS
SELECT 
    O.OrderID, 
    O.SellerID, 
    P.Title AS ProductTitle, 
    O.OrderStatus, 
    O.OrderDate,
    P.Price
FROM Orders O
JOIN Products P ON O.ProductID = P.ProductID;

-- Insert Seed Categories
INSERT IGNORE INTO Categories (CategoryName) VALUES 
('Books'), ('Electronics'), ('Furniture'), ('Accessories');

-- 🔹 Triggers
-- Automatically handle Product Sold states and cascading rejection logic when an Order goes 'Completed'
DELIMITER //

CREATE TRIGGER After_Order_Completed
AFTER UPDATE ON Orders
FOR EACH ROW
BEGIN
    IF NEW.OrderStatus = 'Completed' AND OLD.OrderStatus = 'Pending' THEN
        -- 1. Automate changing the Product to 'Sold'
        UPDATE Products SET Status = 'Sold' WHERE ProductID = NEW.ProductID;
        
        -- 2. Clean out automatically natively out of all Carts
        DELETE FROM CartItems WHERE ProductID = NEW.ProductID;
        
        -- 3. Clean out automatically natively out of all Wishlists
        DELETE FROM WishlistItems WHERE ProductID = NEW.ProductID;
    END IF;
END;
//

DELIMITER ;
