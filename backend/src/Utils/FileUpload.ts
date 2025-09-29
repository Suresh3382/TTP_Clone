import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

export const UploadOnCloudinary = async (localFilePath: string) => {
    try {
        if (process.env.CLOUDINARY_API_SCERET){
            const res = cloudinary.utils.api_sign_request({ timestamp: Math.round(Date.now() / 1000), public_id: 'sample_image' }, process.env.CLOUDINARY_API_SCERET)
            console.log("Path: ", localFilePath, res)
            if (!localFilePath) return null
            const uploadStream = await cloudinary.uploader.upload_stream({
                resource_type: 'auto',
                public_id : 'sample_image',
                
            },(err,res)=>{
            console.log(err,res)
            })
            uploadStream.end(localFilePath)
            // console.log('response-------------->', response);
            // return response
        }
    }
    catch (error) {
        console.log("error :", error)
        fs.unlinkSync(localFilePath);
        return null;
    }
} 

