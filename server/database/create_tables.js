const database = include('databaseConnection');

// Define a stored function to generate unique URL-friendly PKs
const createShortUrlPrimaryKeyFunction = `
    CREATE FUNCTION generateUniqueShortUrlPK() RETURNS VARCHAR(7)
    BEGIN
        DECLARE shortCode VARCHAR(7);
        SET shortCode = LEFT(CONV(FLOOR(RAND() * 9999999), 10, 36), 7);
        
        WHILE EXISTS(SELECT id FROM short_url WHERE short_code = shortCode) DO
            SET shortCode = LEFT(CONV(FLOOR(RAND() * 9999999), 10, 36), 7);
        END WHILE;
        
        RETURN shortCode;
    END;
`;

async function createTables() {
    let createUserSQL = `
        CREATE TABLE IF NOT EXISTS user (
            user_id INT NOT NULL AUTO_INCREMENT,
            username VARCHAR(25) NOT NULL,
            password VARCHAR(100) NOT NULL,
            PRIMARY KEY (user_id),
            UNIQUE INDEX unique_username (username ASC) VISIBLE
        );
    `;

    let createShortUrlTableSQL = `
        CREATE TABLE IF NOT EXISTS short_url (
            short_code VARCHAR(7) NOT NULL,
            original_url TEXT NOT NULL,
            user_id INT NOT NULL,
            hits INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (short_code),
            FOREIGN KEY (user_id) REFERENCES user(user_id)
        );
    `;

    try {
        const userResults = await database.query(createUserSQL);
        const shortUrlResults = await database.query(createShortUrlPrimaryKeyFunction);
        const createFunctionResults = await database.query(createShortUrlTableSQL);

        console.log("Successfully created tables and function");
        console.log("User Table:", userResults[0]);
        console.log("Short URL Table:", createFunctionResults[0]);

        return true;
    } catch (err) {
        console.log("Error Creating tables and function");
        console.log(err);
        return false;
    }
}

module.exports = { createTables };
