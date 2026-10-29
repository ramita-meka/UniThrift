const db = require('./config/db');

async function createTables() {
    try {
        console.log('Creating CartItems table...');
        await db.query(`
            CREATE TABLE IF NOT EXISTS CartItems (
                CartItemID INT AUTO_INCREMENT PRIMARY KEY,
                UserID INT NOT NULL,
                ProductID INT NOT NULL,
                AddedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
                FOREIGN KEY (ProductID) REFERENCES Products(ProductID) ON DELETE CASCADE,
                UNIQUE(UserID, ProductID)
            );
        `);
        console.log('CartItems table created.');

        console.log('Creating WishlistItems table...');
        await db.query(`
            CREATE TABLE IF NOT EXISTS WishlistItems (
                WishlistItemID INT AUTO_INCREMENT PRIMARY KEY,
                UserID INT NOT NULL,
                ProductID INT NOT NULL,
                AddedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
                FOREIGN KEY (ProductID) REFERENCES Products(ProductID) ON DELETE CASCADE,
                UNIQUE(UserID, ProductID)
            );
        `);
        console.log('WishlistItems table created.');

    } catch (err) {
        console.error(err);
    }
    
    process.exit();
}

createTables();
