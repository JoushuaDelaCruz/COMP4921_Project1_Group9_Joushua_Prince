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
