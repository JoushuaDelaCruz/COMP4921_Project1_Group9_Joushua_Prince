const database = include("mySQLDatabaseConnection");

const getOriginalURL = async (postData) => {
  const urlSQL = `
      SELECT original_url, url_info_id, user_id, is_active
      FROM short_urls 
      JOIN urls_info USING (url_info_id)
      WHERE short_code = :short_code
      `;

  let params = {
    short_code: postData,
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
  console.log("LOGGING POST DATA" + postData.url_info_id);

  // Call the stored function to generate a unique short code
  const generateShortCodeQuery = `
      SELECT generateUniqueShortCode() AS shortCode;
  `;
  const shortCodeResult = await database.query(generateShortCodeQuery);
  const id = shortCodeResult[0][0].shortCode;
  console.log(id);

  let createURL = `
    INSERT INTO short_urls (id,  original_url,short_code, user_id,url_info_id)
     VALUES (:id, :originalURL, :shortURL,:user_id, :url_info_id);
	`;

  let params = {
    originalURL: postData.originalURL,
    shortURL: postData.shortURL,
    id: id,
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
const getShortURLIdInfoByOriginalURL = async (originalURL) => {
  const urlSQL = `
    SELECT url_info_id
    FROM short_urls 
    WHERE original_url = :original_url
  `;

  let params = {
    original_url: originalURL,
  };

  try {
    const results = await database.query(urlSQL, params);
    if (results.length > 0) {
      return results[0][0].url_info_id;
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

// Function to get a short URL info by its original URL
const getShortURLIdInfoByShortCode = async (shortcode) => {
  const urlSQL = `
    SELECT url_info_id
    FROM short_urls 
    WHERE short_code = :short_code
  `;

  let params = {
    short_code: shortcode,
  };

  try {
    const results = await database.query(urlSQL, params);
    if (results.length > 0) {
      return results[0][0].url_info_id;
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

// Function to get a short URL info by its original URL
const getShortURLByOriginalURL = async (originalURL) => {
  const urlSQL = `
    SELECT short_code
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
      console.log("short_code not found in the database.");
      return null;
    }
  } catch (err) {
    console.log("Error while retrieving original URL from the database.");
    console.log(err);
    return null;
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
    SELECT s.original_url, s.short_code, i.num_hits, i.date_created, i.last_date_visited, i.is_active, u.username, u.user_id, i.url_info_id
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

// Function to delete a URL redirect by shortcode
const deleteRedirect = async (shortcode) => {
  const deleteSQL = `
    DELETE FROM short_url
    WHERE short_code = :short_code;
  `;

  let params = {
    short_code: shortcode,
  };
  try {
    const results = await database.query(deleteSQL, params);
    if (results.affectedRows > 0) {
      console.log("URL deleted");
      return true; // URL deleted successfully
    } else {
      return false; // URL with the specified shortcode was not found
    }
  } catch (err) {
    console.log("Error while deleting URL from the database.");
    console.log(err);
    return 0;
  }
};

// Function to delete a URL redirect by shortcode
const getIdByShortcode = async (shortcode) => {
  const deleteSQL = `
    SELECT user_id FROM short_urls
    WHERE short_code = :short_code;
  `;

  let params = {
    short_code: shortcode,
  };
  try {
    const results = await database.query(deleteSQL, params);
    return results[0][0].user_id;
  } catch (err) {
    console.log("Error while deleting URL from the database.");
    console.log(err);
    return 0;
  }
};

module.exports = {
  getOriginalURL,
  createURL,
  getShortURLIdInfoByOriginalURL,
  getClicks,
  getRecentURLs,
  deleteRedirect,
  getIdByShortcode,
  getShortURLByOriginalURL,
  getShortURLIdInfoByShortCode,
};
