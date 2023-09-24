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

router.get("/:image", async (req, res) => {
  const image_id = req.params.image;
  const imageData = await db_imageUrl.getImage(image_id);
  const user_id = req.session ? req.session.user_id : 1;
  if (!imageData) {
    res.send("/404");
    return;
  }
  if (imageData.is_active === 0 && imageData.uploader_id !== user_id) {
    res.render("inactive");
    return;
  }
  if (imageData.uploader_id === user_id) {
    imageData.push("owner", true);
  }
  await db_imageUrl.imageClicked(imageData.url_info_id);
  res.render("image", imageData);
});

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
    await db_imageUrl.uploadImage(uploadData);
    res.redirect("/home?image=true");
    return;
  });
});

module.exports = router;
