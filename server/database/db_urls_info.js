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
    return results[0].insertId;
  } catch (err) {
    console.log("Error inserting new row for url_info");
    console.log(err);
    return false;
  }
};

exports.urlClicked = async (url_info_id) => {
  const updateSQL = `
  UPDATE urls_info 
  SET num_hits = num_hits + 1, 
  last_date_visited = :date 
  WHERE url_info_id = :url_info_id;`;

  const params = {
    url_info_id: url_info_id,
    date: new Date(),
  };

  try {
    const results = await database.query(updateSQL, params);
    return true;
  } catch (err) {
    console.log("Error failed to update urls_info");
    console.log(err);
    return false;
  }
};

exports.deactivateUrl = async (url_info_id) => {
  const deactivateSQL = `
  UPDATE urls_info 
  SET is_active = 0
  WHERE url_info_id = :url_info_id;`;

  const params = {
    url_info_id: url_info_id,
  };

  try {
    await database.query(deactivateSQL, params);
    return true;
  } catch (err) {
    console.log("Error failed to deactivate image");
    console.log(err);
    return false;
  }
};

exports.activateUrl = async (url_info_id) => {
  const activateSQL = `
  UPDATE urls_info 
  SET is_active = 1
  WHERE url_info_id = :url_info_id;`;

  const params = {
    url_info_id: url_info_id,
  };

  try {
    await database.query(activateSQL, params);
    return true;
  } catch (err) {
    console.log("Error failed to activate image");
    console.log(err);
    return false;
  }
};

exports.deleteUrlInfo = async (url_info_id) => {
  const deleteSQL = `
  DELETE FROM urls_info 
  WHERE url_info_id = :url_info_id;`;

  const params = {
    url_info_id: url_info_id,
  };

  try {
    await database.query(deleteSQL, params);
    return true;
  } catch (err) {
    console.log("Error failed to delete url_info");
    console.log(err);
    return false;
  }
};
