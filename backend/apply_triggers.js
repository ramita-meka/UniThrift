// Script to push triggers to DB directly
require('dotenv').config();
const mysql = require('mysql2/promise');

async function applyTriggers() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'unithrift',
      multipleStatements: true
    });

    console.log('Connected to Database. Applying Triggers...');

    // Drop first if it exists to be safe
    await connection.query(`DROP TRIGGER IF EXISTS After_Order_Completed;`);
    
    // Create execution string dynamically (multipleStatements required parsing accurately)
    const triggerSQL = `
      CREATE TRIGGER After_Order_Completed
      AFTER UPDATE ON Orders
      FOR EACH ROW
      BEGIN
          IF NEW.OrderStatus = 'Completed' AND OLD.OrderStatus = 'Pending' THEN
              UPDATE Products SET Status = 'Sold' WHERE ProductID = NEW.ProductID;
              DELETE FROM CartItems WHERE ProductID = NEW.ProductID;
              DELETE FROM WishlistItems WHERE ProductID = NEW.ProductID;
          END IF;
      END;
    `;

    await connection.query(triggerSQL);
    console.log('✅ Trigger After_Order_Completed applied seamlessly!');
    connection.end();

  } catch (err) {
    console.error('Failed pushing triggers:', err);
  }
}

applyTriggers();
