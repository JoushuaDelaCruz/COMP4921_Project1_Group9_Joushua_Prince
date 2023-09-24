const database = include("mySQLDatabaseConnection");

async function createUser(postData) {
  let createUserSQL = `
		INSERT INTO user
		(username, password)
		VALUES
		(:username,  :passwordHash);
	`;

  let params = {
    username: postData.username,
    passwordHash: postData.password,
  };

  try {
    console.log(params);
    const results = await database.query(createUserSQL, params);

    console.log("Successfully created user");
    console.log(results[0]);
    return true;
  } catch (err) {
    console.log("Error inserting user");
    console.log(err);
    return false;
  }
}

async function getUser(postData) {
  console.log("Checking users in database" + postData);
  console.log(postData);
  let getUsersSQL = `
		SELECT *
		FROM user
		WHERE username = :username;
	`;
  let params = {
    username: postData.user,
  };
  try {
    const results = await database.query(getUsersSQL, params);
    if (results) {
      console.log("Successfully retrieved users");
      console.log(results[0]);
      return results[0];
    } else {
    }
  } catch (err) {
    console.log("Error getting users");
    console.log(err);
    return false;
  }
}

module.exports = { createUser, getUser };
