const database = include("mySQLDatabaseConnection");


const getOriginalURL = async (postData) => {
    const urlSQL = `
      SELECT original_url
      FROM short_url 
      WHERE short_code = :short_code
      `;

      let params = {
        short_code: postData,
      };
  
    try {
      const results = await database.query(urlSQL, params);
      if (results.length > 0) {
        const originalURL = results[0][0].original_url;;
        return originalURL;
      } else {
        console.log("Short URL not found in the database.");
      }
      console.log("database result " + results[0])
    } catch (err) {
      console.log("Error while retrieving original URL from the database.");
      console.log(err);
      return;
    }
  };



async function createURL(postData) {

      // Call the stored function to generate a unique short code
      const generateShortCodeQuery = `
      SELECT generateUniqueShortCode() AS shortCode;
  `;
  const shortCodeResult = await database.query(generateShortCodeQuery);
  const id = shortCodeResult[0][0].shortCode;
console.log(id)



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

    // console.log("Successfully recorded url");
    // console.log(results[0]);
    return true;
  } catch (err) {
    console.log("Error inserting url");
    console.log(err);
    return false;
  }
}



module.exports = { getOriginalURL, createURL };
