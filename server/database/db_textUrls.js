const database = include("mySQLDatabaseConnection");
const urlInfo = require("./db_urls_info");

const uploadText = async (data) => {
  const urlInfoFk = await urlInfo.insertUrlInfoAndGetUrlInfoId();
  const uploadTextSQL = `
    	INSERT INTO text_url
    	(text_id, uploader_id, content, title, url_info_id)
    	VALUES
    	(:text_id,  :uploader_id, :text, :title, :url_info_id);
    `;
  const params = {
    text_id: data.text_id,
    uploader_id: data.uploader_id,
    text: data.text,
    title: data.title,
    url_info_id: urlInfoFk,
  };
  console.log(params);
  try {
    const results = await database.query(uploadTextSQL, params);
    console.log("Successfully created text");
    console.log(results[0]);
    return true;
  } catch (err) {
    console.log("Error inserting text");
    console.log(err);
    urlInfo.deleteUrlInfo(urlInfoFk);
    return false;
  }
};

const getUploadedTexts = async () => {
  const textsSQL = `
        	SELECT 
        	  text_id, 
        	  title, 
        	  date_created, 
        	  uploader_id, 
        	  username, 
        	  num_hits, 
        	  last_date_visited, 
        	  is_active, 
        	  ui.url_info_id
        	FROM text_url as text
        	JOIN user on uploader_id = user_id
        	JOIN urls_info as ui on ui.url_info_id = text.url_info_id
    	`;
  try {
    const results = await database.query(textsSQL);
    console.log("Successfully retrieves all uploaded texts");
    console.log(results[0]);
    return results[0];
  } catch (err) {
    console.log("Error failed to retrieve uploaded texts");
    console.log(err);
    return;
  }
};

module.exports = { uploadText, getUploadedTexts };