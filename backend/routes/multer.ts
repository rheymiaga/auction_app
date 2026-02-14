import multer, { StorageEngine } from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath =
            process.env.NODE_ENV === "production"
                ? "/uploads"
                : path.join(process.cwd(), "uploads");
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage });



export default upload;
