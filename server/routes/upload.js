const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary").v2;

// Make sure cloudinary config is already set via env or in a separate config file

router.post("/", async (req, res) => {
  try {
    // ✅ Log the full request object to inspect the files
    console.log("Incoming upload request...");
    console.log("req.files:", req.files);

    // ✅ Check if any files are present and 'file' key exists
    if (!req.files || !req.files.file) {
      return res.status(400).json({ msg: "No file uploaded or wrong key used" });
    }

    const uploadedFile = req.files.file;

    // ✅ Check if tempFilePath exists (used by express-fileupload)
    if (!uploadedFile.tempFilePath) {
      console.log("Missing tempFilePath");
      return res.status(400).json({ msg: "File was not received correctly" });
    }

    console.log("Uploading to Cloudinary from:", uploadedFile.tempFilePath);

    // ✅ Upload to Cloudinary
    cloudinary.uploader.upload(uploadedFile.tempFilePath, (err, result) => {
      if (err) {
        console.error("Cloudinary Error:", err);
        return res.status(500).json({ msg: err.message });
      }

      console.log("Cloudinary Upload Result:", result);

      res.json({
        public_id: result.public_id,
        url: result.secure_url,
      });
    });
  } catch (err) {
    console.error("Server Error:", err);
    return res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
