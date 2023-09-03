import multer, { diskStorage } from "multer";

export const customValidation = {
  image: ["image/png", "image/jpg"],
  file: ["application/pdf", "application/msword"],
  video: ["video/mp4"],
};
export const fileUpload = (filterArray) => {
  const fileFilter = (req, file, cb) => {
    if (!filterArray.includes(file.mimetype)) {
      return cb(new Error("inVaild Format"), false);
    }
    return cb(null, true);
  };
  return multer({ storage: diskStorage({}), fileFilter });
};
