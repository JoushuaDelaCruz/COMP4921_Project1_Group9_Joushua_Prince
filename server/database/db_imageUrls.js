const database = include("mySQLDatabaseConnection");

const uploadImage = async (data) => {
  const uploadImageSQL = `
		INSERT INTO ImageUrls
		(image_id, uploader_id, cloudinary_public_id, date_created)
		VALUES
		(:image_id,  :uploader_id, :cloudinary_public_id, :date_created);
	`;

  const params = {
    image_id: data.image_id,
    uploader_id: data.uploader_id,
    cloudinary_public_id: data.cloudinary_public_id,
    date_created: new Date(),
  };

  try {
    console.log(params);
    const results = await database.query(uploadImageSQL, params);

    console.log("Successfully created image");
    console.log(results[0]);
    return true;
  } catch (err) {
    console.log("Error inserting image");
    console.log(err);
    return false;
  }
};

const getUploadedImages = async () => {
  const imagesSQL = `
    SELECT image_id, cloudinary_public_id, date_created, uploader_id, username, num_hits, date_last_visited
    FROM ImageUrls
    LEFT JOIN user on uploader_id = user_id
	`;

  try {
    const results = await database.query(imagesSQL);

    console.log("Successfully retrieves all uploaded images");
    console.log(results[0]);
    return results[0];
  } catch (err) {
    console.log("Error failed to retrieve uploaded images");
    console.log(err);
    return;
  }
};

module.exports = { uploadImage, getUploadedImages };
