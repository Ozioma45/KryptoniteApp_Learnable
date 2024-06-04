const { cloudinary } = require("../config/cloudinary");

const File = require("../models/file");

const uploadFile = async (req, res) => {
  const uploadedFile = req.file;
  console.log("Uploaded File:", uploadedFile);

  try {
    if (!uploadedFile) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    if (!req.user && req.user.id) {
      console.log("User ID:", req.user.id);
      return res.status(401).json({ error: "User Authentication Required" });
    }

    cloudinary.uploader.upload(req.file.path, (error, result) => {
      if (error) {
        return res
          .status(500)
          .json({ error: "Error uploading file to Cloudinary" });
      }

      const file = new File({
        fileName: req.file.originalname,
        uploaderUserId: req.user.id,
        fileUrl: req.file.path, // URL to access the uploaded file
        cloudinaryId: req.file.filename, // Cloudinary ID to manage the file later
      });

      file.save();
      console.log("File saved:", file);
    });

    res.status(200).json({ message: "File uploaded successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  uploadFile,
};
