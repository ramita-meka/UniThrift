const db = require('./config/db');

async function alterTables() {
    try {
        console.log('Altering ImageUrl to ImageUrls in Products...');
        await db.query(`ALTER TABLE Products CHANGE ImageUrl ImageUrls TEXT;`);
        console.log('ImageUrls column modified successfully.');
    } catch (err) {
        if (err.code === 'ER_BAD_FIELD_ERROR') console.log('ImageUrl column does not exist or already updated.');
        else console.error(err);
    }
    
    process.exit();
}

alterTables();
