const database = include("mySQLDatabaseConnection");



async function createURL(postData) {

      // Call the stored function to generate a unique short code
      const generateShortCodeQuery = `
      SELECT generateUniqueShortCode() AS shortCode;
  `;
  const shortCodeResult = await database.query(generateShortCodeQuery);
  const id = shortCodeResult[0][0].shortCode;
  console.log( id)



  let createURL = `
    INSERT INTO short_url (id,  original_url,short_code, user_id)
     VALUES (:id, :originalURL, :shortURL, 1);

	
	`;

  let params = {
    originalURL: postData.originalURL,
    shortURL: postData.shortURL,
    id: id
  };

  try {
    const results = await database.query(createURL, params);

    console.log("Successfully recorded url");
    console.log(results[0]);
    return true;
  } catch (err) {
    console.log("Error inserting url");
    console.log(err);
    return false;
  }
}

module.exports = { createURL };
