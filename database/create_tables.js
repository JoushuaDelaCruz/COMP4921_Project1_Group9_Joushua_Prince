const database = include("mySQLDatabaseConnection");

async function createTables() {
  let createUserSQL = `
        CREATE TABLE IF NOT EXISTS user (
            user_id INT NOT NULL AUTO_INCREMENT,
            username VARCHAR(25) NOT NULL,
            password VARCHAR(100) NOT NULL,
            PRIMARY KEY (user_id),
            UNIQUE INDEX unique_username (username ASC) VISIBLE
        );
    `;



  let createShortUrlTableSQL = `
    CREATE TABLE IF NOT EXISTS short_urls (
      id VARCHAR(10) NOT NULL,
      original_url TEXT NOT NULL,
      short_code VARCHAR(45) NOT NULL,
      user_id INT NOT NULL,
      url_info_id INT, 
      PRIMARY KEY (id),
      FOREIGN KEY (user_id) REFERENCES user(user_id),
      FOREIGN KEY (url_info_id) REFERENCES urls_info(url_info_id) 
  );
  
`;


  try {
    const userResults = await database.query(createUserSQL);
    // const shortUrlResults = await database.query(createShortUrlPrimaryKeyFunction);
    const createFunctionResults = await database.query(createShortUrlTableSQL);

    console.log("Successfully created tables and function");
    console.log("User Table:", userResults[0]);
    console.log("Short URL Table:", createFunctionResults[0]);

    return true;
  } catch (err) {
    console.log("Error Creating tables and function");
    console.log(err);
    return false;
  }
}

module.exports = {
  createTables
};