import multer from 'multer';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

// Get max file size limit from environment variables (Default: 10MB)
const maxFileSizeMB = parseInt(process.env.MAX_FILE_SIZE_MB || '10', 10);
const maxFileSizeBytes = maxFileSizeMB * 1024 * 1024;

// Upload directory path setup
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage Configuration
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `product-${uniqueSuffix}${ext}`);
  },
});

// File Type Filter
const checkFileTypes = (file, cb) => {
  const filetypes = /jpe?g|png|webp|gif|svg/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  }
  cb(new Error('Only image files (JPG, JPEG, PNG, WEBP, GIF, SVG) are allowed!'));
};

const upload = multer({
  storage,
  limits: { fileSize: maxFileSizeBytes }, // Dynamic limit from process.env.MAX_FILE_SIZE_MB
  fileFilter(req, file, cb) {
    checkFileTypes(file, cb);
  },
});

export default upload;
