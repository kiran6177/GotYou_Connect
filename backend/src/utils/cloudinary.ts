import cloudinary from "cloudinary";
import dotenv from "dotenv";

dotenv.config();
const cloudinaryV2 = cloudinary.v2;

cloudinaryV2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

async function destroyFromCloudinary(url : string, FOLDER : string) {
  try {
    const publicId = url?.split("/").reverse()[0].split(".")[0];
    await cloudinaryV2.uploader.destroy(
      FOLDER + "/" + publicId,
      (error, result) => {
        if (error) {
          console.error("Error deleting asset from Cloudinary:", error); // Log any errors
        } else {
          console.log("Successfully deleted asset:", result); // Log successful deletion
        }
      }
    );
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    throw new Error(errorMessage);
  }
}

export { destroyFromCloudinary };

export default cloudinaryV2;
