import cloudinary from 'cloudinary'
import {CloudinaryStorage} from 'multer-storage-cloudinary'
import multer from 'multer'
import { Config } from '../config/config.js'


const Cloudinary = cloudinary.v2


Cloudinary.config({
    cloud_name : Config.CLOUDINARY_NAME,
    api_key : Config.CLOUDINARY_API_KEY,
    api_secret : Config.CLOUDINARY_API_SECRET
})


const storage = new CloudinaryStorage({
    cloudinary : Cloudinary,
    params : {
        folder : 'profile_images',
        allowed_formats : ['jpg','png','jpeg'],

    },
})


export const upload = multer({storage : storage})