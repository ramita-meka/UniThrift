const db = require('./config/db');

async function alterTables() {
    try {
        console.log('Adding ImageUrl column to Products...');
        await db.query(`ALTER TABLE Products ADD COLUMN ImageUrl VARCHAR(500);`);
        console.log('ImageUrl column added.');
    } catch (err) {
        if (err.code === 'ER_DUP_FIELDNAME') console.log('ImageUrl column already exists.');
        else console.error(err);
    }
    
    process.exit();
}

alterTables();
