const mysql = require('mysql2/promise');

// koneksi ke database
const db = mysql.createPool({
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    database: process.env.MYSQL_DBNAME || 'todolist',
    password: process.env.MYSQL_PASSWORD || 'root',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// migrasi database
const migration = async () => {
    try {
        // query mysql untuk membuat table contacts
        await db.query(
            `
            CREATE TABLE IF NOT EXISTS activities (
            activity_id int not null auto_increment,
            title varchar(255) not null,
            email varchar(255) not null,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            primary key (activity_id)
            )
        `
        );
        await db.query(
            `
            CREATE TABLE IF NOT EXISTS todos (
                todo_id int not null auto_increment,
                activity_group_id int not null,
                title varchar(255) not null,
                priority varchar(255) not null DEFAULT "very-high",
                is_active boolean not null,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                primary key (todo_id),
                FOREIGN KEY(activity_group_id) REFERENCES activities(activity_id)
                )
            `
        );
        console.log('Running Migration Successfully!');
    } catch (err) {
        throw err;
    }
};

module.exports = { db, migration };
