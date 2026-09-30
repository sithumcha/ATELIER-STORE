import multer from 'multer';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

// Get max file size limit from environment variables (Default: 10MB)
const maxFileSizeMB = parseInt(process.env.MAX_FILE_SIZE_MB || '10', 10);
const maxFileSizeBytes = maxFileSizeMB * 1024 * 1024;

// Memory Storage (Direct stream to Cloudinary - NO local disk file creation)
const storage = multer.memoryStorage();

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
  limits: { fileSize: maxFileSizeBytes },
  fileFilter(req, file, cb) {
    checkFileTypes(file, cb);
  },
});

export default upload;
