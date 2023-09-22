require("../utils");
require("dotenv").config();
const express = require("express");
const router = express.Router();
const db_imageUrl = include("database/db_imageUrls");
const shortId = require("shortid");

const cloudinary_name = process.env.CLOUDINARY_CLOUD_NAME;

const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: cloudinary_name,
  api_key: process.env.CLOUDINARY_CLOUD_KEY,
  api_secret: process.env.CLOUDINARY_CLOUD_SECRET,
});

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/addContent", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.redirect("/home?image=true");
  }
  const buffer = req.file.buffer.toString("base64");
  const image = "data:image/png;base64," + buffer;
  cloudinary.uploader.upload(image).then(async (response) => {
    const uploader_id = 8;
    const image_id = shortId.generate();
    const public_id = response.public_id;
    const uploadData = {
      uploader_id: uploader_id,
      cloudinary_public_id: public_id,
      image_id: image_id,
    };
    console.log(uploadData);
    await db_imageUrl.uploadImage(uploadData);
    res.redirect("/home?image=true");
    return;
  });
});

module.exports = router;