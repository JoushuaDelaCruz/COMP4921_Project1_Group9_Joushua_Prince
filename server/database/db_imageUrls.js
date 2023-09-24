const database = include("mySQLDatabaseConnection");

const insertUrlInfoAndGetUrlInfoId = async () => {
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

const uploadImage = async (data) => {
  const urlInfoFk = await insertUrlInfoAndGetUrlInfoId();
  const uploadImageSQL = `
  	INSERT INTO ImageUrls
  	(image_id, uploader_id, cloudinary_public_id, url_info_id)
  	VALUES
  	(:image_id,  :uploader_id, :cloudinary_public_id, :url_info_id);
  `;

  const params = {
    image_id: data.image_id,
    uploader_id: data.uploader_id,
    cloudinary_public_id: data.cloudinary_public_id,
    url_info_id: urlInfoFk,
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
    SELECT 
      image_id, 
      cloudinary_public_id, 
      date_created, 
      uploader_id, 
      username, 
      num_hits, 
      last_date_visited, 
      is_active, 
      ui.url_info_id
    FROM ImageUrls as image
    LEFT JOIN user on uploader_id = user_id
    LEFT JOIN urls_info as ui on ui.url_info_id = image.url_info_id
	`;

  try {
    const results = await database.query(imagesSQL);

    // console.log("Successfully retrieves all uploaded images");
    // console.log(results[0]);
    return results[0];
  } catch (err) {
    console.log("Error failed to retrieve uploaded images");
    console.log(err);
    return;
  }
};

const getImage = async (image_id) => {
  const imageSQL = `
    SELECT cloudinary_public_id, date_created, uploader_id, username, is_active, ui.url_info_id
    FROM ImageUrls
    JOIN user on uploader_id = user_id
    JOIN urls_info as ui on ui.url_info_id = ImageUrls.url_info_id
    WHERE image_id = :image_id
  `;

  const param = {
    image_id: image_id,
  };

  try {
    const results = await database.query(imageSQL, param);

    console.log("Successfully retrieves image");
    console.log(results[0][0]);
    return results[0][0];
  } catch (err) {
    console.log("Error failed to retrieve image");
    console.log(err);
    return;
  }
};

const imageClicked = async (url_info_id) => {
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
    console.log("Successfully updated urls_info");
    console.log(results[0]);
    return true;
  } catch (err) {
    console.log("Error failed to update urls_info");
    console.log(err);
    return false;
  }
};

const deactivateImage = async (url_info_id) => {
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

const activateImage = async (url_info_id) => {
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

module.exports = {
  uploadImage,
  getUploadedImages,
  getImage,
  imageClicked,
  deactivateImage,
  activateImage,
};
