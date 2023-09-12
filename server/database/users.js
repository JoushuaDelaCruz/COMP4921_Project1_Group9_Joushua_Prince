const database = include('databaseConnection');

async function createUser(postData) {
	let createUserSQL = `
		INSERT INTO user
		(username, password)
		VALUES
		(:user,  :passwordHash);
	`;


	let params = {
		user: postData.user,
		passwordHash: postData.hashedPassword,
        
	}
	
	try {
		const results = await database.query(createUserSQL, params);

        console.log("Successfully created user");
		console.log(results[0]);
		return true;
	}
	catch(err) {
		console.log("Error inserting user");
        console.log(err);
		return false;
	}
}

module.exports = {createUser};