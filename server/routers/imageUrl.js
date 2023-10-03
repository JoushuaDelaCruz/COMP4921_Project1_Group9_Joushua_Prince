require("../utils");
require("dotenv").config();
const express = require("express");
const router = express.Router();
const db_urlInfo = require("../database/db_urls_info");
const id_checker = require("./modules/idChecker");
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

router.get("/", async (req, res) => {
  const image_id = req.query.image;
  const imageData = await db_imageUrl.getImage(image_id);
  const user_id = req.session ? req.session.user_id : -1;
  if (!imageData[0]) {
    res.send("/404");
    return;
  }
  const uploader_id = imageData[0].uploader_id;
  const owner = uploader_id === user_id;
  if (imageData[0].is_active === 0 && !owner) {
    res.render("inactive");
    return;
  }
  imageData[0].owner = owner;
  await db_urlInfo.urlClicked(imageData[0].url_info_id);
  res.render("image", imageData[0]);
});

router.post("/upload", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.redirect("/home?image=true");
  }
  const buffer = req.file.buffer.toString("base64");
  const image = "data:image/png;base64," + buffer;
  const customized_name = req.body.customized_name;
  const nameErr = id_checker.checkName(db_imageUrl.isIdExists, customized_name);
  if (nameErr) {
    res.redirect(`/home?image=true&error=${nameErr}`);
    return;
  }
  res.redirect(`/home?image=true`);
  return;
  cloudinary.uploader.upload(image).then(async (response) => {
    const uploader_id = req.session.user_id;
    const image_id = customized_name || shortId.generate();
    const public_id = response.public_id;
    const uploadData = {
      uploader_id: uploader_id,
      cloudinary_public_id: public_id,
      image_id: image_id,
    };
    const successful = await db_imageUrl.uploadImage(uploadData);
    if (!successful) {
      cloudinary.uploader.destroy(public_id);
    }
    res.redirect("/home?image=true");
    return;
  });
});

router.post("/deactivate", async (req, res) => {
  const url_info_id = req.body.url_info_id;
  const image_id = req.body.image_id;
  await db_urlInfo.deactivateUrl(url_info_id);
  if (image_id) {
    res.redirect(`/imageUrls?image=${image_id}`);
    return;
  }
  res.redirect("/home");
});

router.post("/activate", async (req, res) => {
  const url_info_id = req.body.url_info_id;
  const image_id = req.body.image_id;
  await db_urlInfo.activateUrl(url_info_id);
  if (image_id) {
    res.redirect(`/imageUrls?image=${image_id}`);
    return;
  }
  res.redirect("/home");
});

module.exports = router;
