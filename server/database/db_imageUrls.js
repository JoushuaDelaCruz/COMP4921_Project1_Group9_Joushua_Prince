const database = include("mySQLDatabaseConnection");
const urlInfo = require("./db_urls_info");

const uploadImage = async (data) => {
  const urlInfoFk = await urlInfo.insertUrlInfoAndGetUrlInfoId();
  const uploadImageSQL = `
    INSERT INTO image_url
    (image_id, uploader_id, cloudinary_public_id, url_info_id)
    VALUES
    (:image_id, :uploader_id, :cloudinary_public_id, :url_info_id);
  `;

  const params = {
    image_id: data.image_id,
    uploader_id: data.uploader_id,
    cloudinary_public_id: data.cloudinary_public_id,
    url_info_id: urlInfoFk,
  };

  try {
    // console.log(params);
    const results = await database.query(uploadImageSQL, params);
    console.log("Successfully created image");
    console.log(results[0]);
    return true;
  } catch (err) {
    console.log("Error inserting image");
    console.log(err);
    urlInfo.deleteUrlInfo(urlInfoFk);
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
    FROM image_url as image
    LEFT JOIN user on uploader_id = user_id
    LEFT JOIN urls_info as ui on ui.url_info_id = image.url_info_id
	`;

  try {
    const results = await database.query(imagesSQL);

    // console.log("Successfully retrieves all uploaded images");
    // console.log(results[0]);
    // return results[0];
  } catch (err) {
    console.log("Error failed to retrieve uploaded images");
    console.log(err);
    return;
  }
};

const getImage = async (image_id) => {
  const imageSQL = `
    SELECT image_id, cloudinary_public_id, date_created, uploader_id, username, is_active, ui.url_info_id
    FROM image_url
    JOIN user on uploader_id = user_id
    JOIN urls_info as ui on ui.url_info_id = image_url.url_info_id
    WHERE image_id = :image_id
  `;

  const param = {
    image_id: image_id,
  };

  try {
    const results = await database.query(imageSQL, param);

    console.log("Successfully retrieves image");
    // console.log(results[0]);
    return results[0];
  } catch (err) {
    console.log("Error failed to retrieve image");
    console.log(err);
    return;
  }
};

module.exports = {
  uploadImage,
  getUploadedImages,
  getImage,
};