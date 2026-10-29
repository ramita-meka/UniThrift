const db = require('./config/db');

async function alterTables() {
    try {
        console.log('Adding Role column to Users...');
        await db.query(`ALTER TABLE Users ADD COLUMN Role ENUM('Buyer', 'Seller', 'Both') DEFAULT 'Buyer';`);
        console.log('Role column added.');
    } catch (err) {
        if (err.code === 'ER_DUP_FIELDNAME') console.log('Role column already exists.');
        else console.error(err);
    }
    
    try {
        console.log('Adding Description column to Products...');
        await db.query(`ALTER TABLE Products ADD COLUMN Description TEXT;`);
        console.log('Description column added.');
    } catch (err) {
        if (err.code === 'ER_DUP_FIELDNAME') console.log('Description column already exists.');
        else console.error(err);
    }
    
    process.exit();
}

alterTables();
