import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import dotenv from "dotenv"


dotenv.config({ path: './.env' })

// Configure Cloudinary with credentials from environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// console.log("cloudinary .env : ", process.env.CLOUDINARY_CLOUD_NAME);


const uploadOnCloudinary = async (localFilePath) => {
    try {

        console.log('cloudinary file: ', localFilePath);

        // if provided file is empty, return null
        if (!localFilePath) return null;

        // upload the file to the cloudinary, and detect automaticaly detect type
        const repsonse = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto'
        });

        // remove the local file path after the successfully upload
        fs.unlinkSync(localFilePath);

        // return the response
        return repsonse;

    } catch (error) {
        // log the error
        console.error('uploadOnCloudinary error: ', error);
        fs.unlinkSync(localFilePath);
        return null;
    }
};


export { uploadOnCloudinary };