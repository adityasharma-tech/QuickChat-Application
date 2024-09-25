import { Cloudinary } from "@cloudinary/url-gen";

export const cloudinary = new Cloudinary({
    cloud: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME
    }
})