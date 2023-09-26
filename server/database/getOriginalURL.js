const database = include("mySQLDatabaseConnection");


const getOriginalURL = async () => {
    const urlSQL = `
      SELECT original_url
      FROM short_url 
      WHERE shortcode = :short_code
      `;

      let params = {
        username: postData.short_code,
      };
  
    try {
      const results = await database.query(urlSQL, params);
      return results[0];
    } catch (err) {
      console.log("Error failed to retrieve uploaded images");
      console.log(err);
      return;
    }
  };

  module.exports = { getOriginalURL };
