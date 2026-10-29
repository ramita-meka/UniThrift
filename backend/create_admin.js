// Script to natively expand the database schema to accept the Admin ENUM and strictly seed the admin
require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function seedAdmin() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'unithrift',
      multipleStatements: true
    });

    console.log('Connected to DB. Enhancing Enum structure inherently...');
    
    // 1. Alter Table
    await connection.query("ALTER TABLE Users MODIFY Role ENUM('Buyer', 'Seller', 'Both', 'Admin') DEFAULT 'Buyer'");
    
    // 2. Hash Password
    const passwordHash = await bcrypt.hash('ramita@18', 10);
    
    // 3. Drop existing admin if exists to ensure idempotency
    await connection.query("DELETE FROM Users WHERE Email = 'admin@unithrift.com'");

    // 4. Insert God Mode
    const [result] = await connection.query(`
        INSERT INTO Users (Name, RegNumber, Email, Phone, Password, Department, University, Role)
        VALUES ('System Administrator', 'ADMIN-001', 'admin@unithrift.com', '9999999999', ?, 'Administration', 'SRMAP', 'Admin')
    `, [passwordHash]);

    console.log('✅ Admin explicitly injected! Role ENUM correctly updated natively.');
    connection.end();

  } catch (err) {
    console.error('Failed pushing Admin Logic:', err);
  }
}

seedAdmin();
