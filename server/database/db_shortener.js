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
     VALUES (:id, :originalURL, :shortURL,:user_id);

	
	`;

  let params = {
    originalURL: postData.originalURL,
    shortURL: postData.shortURL,
    id: id,
    user_id: postData.user_id
  };

  try {
    await database.query(createURL, params);

    // console.log("Successfully recorded url");
    // console.log(results[0]);
    return true;
  } catch (err) {
    console.log("Error inserting url");
    console.log(err);
    return false;
  }
}

// Function to get a short URL by its original URL
const getShortURLByOriginalURL = async (originalURL) => {
  const urlSQL = `
    SELECT short_code
    FROM short_url 
    WHERE original_url = :original_url
  `;

  let params = {
    original_url: originalURL,
  };

  try {
    const results = await database.query(urlSQL, params);
    if (results.length > 0) {
      return results[0][0];
    } else {
      console.log("short_code not found in the database.");
      return null;
    }
  } catch (err) {
    console.log("Error while retrieving original URL from the database.");
    console.log(err);
    return null;
  }
};



// Function to increment clicks for a short code
const incrementClicks = async (shortcode) => {
  const updateSQL = `
    UPDATE short_url
    SET numofhits = numofhits + 1
    WHERE short_code = :short_code
  `;

  let params = {
    short_code: shortcode,
  };

  try {
    await database.query(updateSQL, params);
  } catch (err) {
    console.log("Error while incrementing clicks for the short URL.");
    console.log(err);
  }
};

// Function to get the click count for a short code
const getClicks = async (shortcode) => {
  const clickSQL = `
    SELECT numofhits
    FROM short_url 
    WHERE short_code = :short_code
  `;

  let params = {
    short_code: shortcode,
  };

  try {
    const results = await database.query(clickSQL, params);
    if (results.length > 0) {
      return results[0][0].clicks;
    } else {
      console.log("Short URL not found in the database.");
      return 0;
    }
  } catch (err) {
    console.log("Error while retrieving click count from the database.");
    console.log(err);
    return 0;
  }
};

// Function to get the 10 most recent records with click counts
const getRecentURLs = async () => {
  const recentURLsSQL = `
    SELECT original_url, short_code, numofhits
    FROM short_url
    ORDER BY datelastvisited DESC
    LIMIT 10;
  `;

  try {
    const results = await database.query(recentURLsSQL);
    return results[0];
  } catch (err) {
    console.log("Error while retrieving recent URLs from the database.");
    console.log(err);
    return [];
  }
};



module.exports = {
  getOriginalURL,
  createURL,
  getShortURLByOriginalURL,
  incrementClicks,
  getClicks,
  getRecentURLs
};