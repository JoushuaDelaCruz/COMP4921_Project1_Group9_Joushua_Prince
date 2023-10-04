const database = include("mySQLDatabaseConnection");
const urlInfo = require("./db_urls_info");

const _uploadText = async (data, urlInfoFk) => {
  const generateShortCodeQuery = `
  SELECT generateUniqueShortCodeForText() AS shortCode;
  `;
  let id = data.customized_id;
  if (!id) {
    const generatedCode = await database.query(generateShortCodeQuery);
    id = generatedCode[0][0].shortCode;
  }
  const uploadTextSQL = `
    	INSERT INTO text_url
    	(text_id, uploader_id, content, title, url_info_id)
    	VALUES
    	(:text_id,  :uploader_id, :text, :title, :url_info_id);
    `;
  const params = {
    text_id: id,
    uploader_id: data.uploader_id,
    text: data.text,
    title: data.title,
    url_info_id: urlInfoFk,
  };
  await database.query(uploadTextSQL, params);
};

const uploadText = async (data) => {
  const urlInfoFk = await urlInfo.insertUrlInfoAndGetUrlInfoId();
  do {
    try {
      await database.query("START TRANSACTION");
      await _uploadText(data, urlInfoFk);
      await database.query("COMMIT");
      return true;
    } catch (err) {
      if (err.errno === 1062) {
        await database.query("ROLLBACK");
      } else {
        console.log("Error inserting image");
        console.log(err);
        urlInfo.deleteUrlInfo(urlInfoFk);
        await database.query("ROLLBACK");
        return false;
      }
    }
  } while (!data.customized_id);
};

const getUserTexts = async (user_id) => {
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
          WHERE uploader_id = :user_id
          ORDER BY date_created DESC
    	`;
  const params = {
    user_id: user_id,
  };
  try {
    const results = await database.query(textsSQL, params);
    return results[0];
  } catch (err) {
    console.log("Error failed to retrieve uploaded texts");
    console.log(err);
    return;
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
          ORDER BY date_created DESC
    	`;
  try {
    const results = await database.query(textsSQL);
    return results[0];
  } catch (err) {
    console.log("Error failed to retrieve uploaded texts");
    console.log(err);
    return;
  }
};

const getText = async (text_id) => {
  const textSQL = `
              SELECT 
            	  text_id, 
            	  title,
                content, 
            	  date_created, 
            	  uploader_id, 
            	  username, 
            	  is_active, 
            	  ui.url_info_id
            	FROM text_url as text
            	JOIN user on uploader_id = user_id
            	JOIN urls_info as ui on ui.url_info_id = text.url_info_id
            	WHERE text_id = :text_id
        	`;
  const params = {
    text_id: text_id,
  };
  try {
    const results = await database.query(textSQL, params);
    return results[0];
  } catch (err) {
    console.log("Error failed to retrieve text");
    console.log(err);
    return;
  }
};

const isIdExists = async (id) => {
  const imageSQL = `
    SELECT text_id
    FROM text_url
    WHERE text_id = :text_id;
  `;

  const param = {
    text_id: id,
  };

  try {
    const results = await database.query(imageSQL, param);
    return results[0][0] !== undefined;
  } catch (err) {
    console.log("Error failed to retrieve image");
    console.log(err);
    return;
  }
};

module.exports = {
  uploadText,
  getUploadedTexts,
  getText,
  isIdExists,
  getUserTexts,
};