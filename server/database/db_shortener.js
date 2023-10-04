const database = include("mySQLDatabaseConnection");

const getOriginalURL = async (postData) => {
  const urlSQL = `
      SELECT original_url, url_info_id, user_id, is_active
      FROM short_urls 
      JOIN urls_info USING (url_info_id)
      WHERE short_id = :short_id
      `;

  let params = {
    short_id: postData,
  };

  try {
    const results = await database.query(urlSQL, params);
    return results[0];
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
  let id = postData.customized_id;
  if (!id) {
    const shortCodeResult = await database.query(generateShortCodeQuery);
    id = shortCodeResult[0][0].shortCode;
  }
  let createURL = `
    INSERT INTO short_urls (short_id, original_url, user_id, url_info_id)
     VALUES (:short_id, :originalURL, :user_id, :url_info_id);
	`;

  let params = {
    originalURL: postData.originalURL,
    short_id: id,
    user_id: postData.user_id,
    url_info_id: postData.url_info_id,
  };
  try {
    await database.query(createURL, params);
    return true;
  } catch (err) {
    console.log("Error inserting url");
    console.log(err);
    return false;
  }
}

// Function to get a short URL info by its original URL
const getShortURLByOriginalURL = async (originalURL) => {
  const urlSQL = `
    SELECT short_id
    FROM short_urls 
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
      console.log("short_id not found in the database.");
      return null;
    }
  } catch (err) {
    console.log("Error while retrieving original URL from the database.");
    console.log(err);
    return null;
  }
};

// Function to get the 10 most recent records with click counts
const getRecentURLs = async () => {
  const recentURLsSQL = `
    SELECT s.original_url, s.short_id, i.num_hits, i.date_created, i.last_date_visited, i.is_active, u.username, u.user_id, i.url_info_id
    FROM short_urls s
    JOIN urls_info i ON s.url_info_id = i.url_info_id
    JOIN user u ON s.user_id = u.user_id 
    ORDER BY i.date_created DESC
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

const isIdExists = async (id) => {
  const imageSQL = `
    SELECT short_id
    FROM short_urls
    WHERE short_id = :short_id;
  `;

  const param = {
    short_id: id,
  };

  try {
    const results = await database.query(imageSQL, param);
    return results[0][0] !== undefined;
  } catch (err) {
    console.log("Error failed to retrieve image");
    console.log(err);
    return;
  }
};

module.exports = {
  getOriginalURL,
  createURL,
  getRecentURLs,
  getShortURLByOriginalURL,
  isIdExists,
};
