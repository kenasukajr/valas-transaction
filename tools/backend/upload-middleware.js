// Middleware upload gambar dengan multer
const multer = require('multer');
const path = require('path');
const fs = require('fs');

function sanitizeFilename(name) {
  // Remove invalid characters and trim
  return name.replace(/[^a-zA-Z0-9-_ ]/g, '').replace(/\s+/g, '_').substring(0, 50);
}

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Always save with a temporary unique filename
    const ext = path.extname(file.originalname);
    const tempName = 'temp_' + Date.now() + '_' + Math.floor(Math.random() * 100000) + ext;
    cb(null, tempName);
  }
});

const upload = multer({ storage });

module.exports = upload;
module.exports.sanitizeFilename = sanitizeFilename;
