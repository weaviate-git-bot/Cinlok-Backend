import multer from "multer";

const memoryStorage = multer.memoryStorage();
const upload = multer({ storage: memoryStorage });

export default upload;
