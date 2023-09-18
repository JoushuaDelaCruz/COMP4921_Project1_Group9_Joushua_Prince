const database = include('databaseConnection');

// Define a stored function to generate unique URL-friendly PKs
const createShortUrlPrimaryKeyFunction = `
DELIMITER //

CREATE FUNCTION generateUniqueShortCode() RETURNS VARCHAR(7)
BEGIN
    DECLARE shortCode VARCHAR(7);
    DECLARE isDuplicate INT;
    
    SET shortCode = SUBSTRING(MD5(RAND()), 1, 7);
    
    -- Check for duplicates in the table
    SELECT COUNT(*) INTO isDuplicate FROM short_url WHERE short_code = shortCode;
    
    -- Keep generating until a unique short code is found
    WHILE isDuplicate > 0 DO
        SET shortCode = SUBSTRING(MD5(RAND()), 1, 7);
        SELECT COUNT(*) INTO isDuplicate FROM short_url WHERE short_code = shortCode;
    END WHILE;
    
    RETURN shortCode;
END//

DELIMITER ;


`;


async function createURL(postData) {
	let createURL = `
    INSERT INTO short_url (id,  original_url,short_code, user_id)
     VALUES (88888, :originalURL, :shortURL, 1);

	
	`;

	let params = {
		originalURL: postData.originalURL,
		shortURL: postData.shortURL,
	}       
	
	try {
		const results = await database.query(createURL, params);

        console.log("Successfully recorded url");
		console.log(results[0]);
		return true;
	}
	catch(err) {
		console.log("Error inserting user");
        console.log(err);
		return false;
	}
}

module.exports = { createURL };

