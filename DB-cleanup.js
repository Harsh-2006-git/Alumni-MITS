import cloudinary from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Cloudinary config
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * 🔥 Delete all files under a specific folder / ID
 * @param {string} folderPath - e.g. "campaigns/12345"
 */
export const deleteCloudinaryFolder = async (folderPath) => {
  try {
    if (!folderPath) {
      throw new Error("Folder path is required");
    }

    // Safety check
    if (process.env.NODE_ENV === "production") {
      throw new Error("Cloudinary force delete blocked in production");
    }

    // Delete all assets in folder
    await cloudinary.v2.api.delete_resources_by_prefix(folderPath);

    // Delete the folder itself
    await cloudinary.v2.api.delete_folder(folderPath);

    console.log(`🔥 Cloudinary cleaned: ${folderPath}`);
    return true;
  } catch (error) {
    console.error("❌ Cloudinary cleanup failed:", error.message);
    return false;
  }
};
