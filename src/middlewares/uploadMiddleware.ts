import multer from "multer";

// * Store file in memory (buffer) instead of disk
const storage = multer.memoryStorage();

// * This name with frontend formData.append("avatar", file)
const uploadMiddleware = multer({ storage }).single("avatar");

export default uploadMiddleware;
