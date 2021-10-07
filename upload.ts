// import express, {Request,Express} from 'express'
import multer from "multer";
import path from "path/posix";
const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public', 'uploads')
    filename(_req: Request, file:Express.Multer.File, cb) {
        cb(null, Date.now()+path.extname(file.originalname))
    }
})

const upload = multer({storage})