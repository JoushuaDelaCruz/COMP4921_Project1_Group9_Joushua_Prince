const database = include("mySQLDatabaseConnection");

exports.insertUrlInfoAndGetUrlInfoId = async () => {
  const newUrl = `
      INSERT INTO urls_info (date_created) VALUES (:date_created);
    `;

  const params = {
    date_created: new Date(),
  };

  try {
    const results = await database.query(newUrl, params);

    console.log("Successfully created an url_info");
    console.log(results[0]);
    return results[0].insertId;
  } catch (err) {
    console.log("Error inserting new row for url_info");
    console.log(err);
    return false;
  }
};

const deactivateUrl = async (url_info_id) => {
  const deactivateSQL = `
  UPDATE urls_info 
  SET is_active = 0
  WHERE url_info_id = :url_info_id;`;

  const params = {
    url_info_id: url_info_id,
  };

  try {
    const results = await database.query(deactivateSQL, params);
    console.log("Successfully deactivated image");
    console.log(results[0]);
    return true;
  } catch (err) {
    console.log("Error failed to deactivate image");
    console.log(err);
    return false;
  }
};

const activateUrl = async (url_info_id) => {
  const activateSQL = `
  UPDATE urls_info 
  SET is_active = 1
  WHERE url_info_id = :url_info_id;`;

  const params = {
    url_info_id: url_info_id,
  };

  try {
    const results = await database.query(activateSQL, params);
    console.log("Successfully activated image");
    console.log(results[0]);
    return true;
  } catch (err) {
    console.log("Error failed to activate image");
    console.log(err);
    return false;
  }
};

module.exports = { activateUrl, deactivateUrl };
