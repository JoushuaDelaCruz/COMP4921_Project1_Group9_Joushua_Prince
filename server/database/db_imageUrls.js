const database = include("mySQLDatabaseConnection");
const urlInfo = require("./db_urls_info");

const uploadImage = async (data) => {
  const urlInfoFk = await urlInfo.insertUrlInfoAndGetUrlInfoId();
  console.log("LOGGING POST DATA" + postData.url_info_id);

  // Call the stored function to generate a unique short code
  const generateShortCodeQuery = `
      SELECT generateUniqueShortCodeForImage() AS shortCode;
  `;
  const shortCodeResult = await database.query(generateShortCodeQuery);
  const image_id = shortCodeResult[0][0].shortCode;
  console.log(id);

  const uploadImageSQL = `
    INSERT INTO image_url
    (image_id, uploader_id, cloudinary_public_id, url_info_id)
    VALUES
    (:image_id, :uploader_id, :cloudinary_public_id, :url_info_id);
  `;

  const params = {
    image_id: image_id,
    uploader_id: data.uploader_id,
    cloudinary_public_id: data.cloudinary_public_id,
    url_info_id: urlInfoFk,
  };

  try {
    await database.query(uploadImageSQL, params);
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
    url_info_id
  FROM image_url as image
  JOIN user on uploader_id = user_id
  JOIN urls_info using (url_info_id)
  ORDER BY date_created DESC
	`;

  try {
    const results = await database.query(imagesSQL);
    return results[0];
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
    return results[0];
  } catch (err) {
    console.log("Error failed to retrieve image");
    console.log(err);
    return;
  }
};

const isIdExists = async (id) => {
  const imageSQL = `
    SELECT image_id
    FROM image_url
    WHERE image_id = :image_id
  `;

  const param = {
    image_id: id,
  };

  try {
    const results = await database.query(imageSQL, param);
    console.log(results);
    if (results[0][0]) {
      return true;
    }
    return false;
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
  isIdExists,
};
