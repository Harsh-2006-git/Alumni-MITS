import cloudinary from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

/* =========================
   Cloudinary Configuration
   ========================= */
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

/* =========================
   Folders to Clean
   (as per your screenshot)
   ========================= */
const FOLDERS = [
    "campaigns",
    "events",
    "profile_photos",
    "profiles",
    "resumes",
    "student_profiles",
];

/* =========================
   Force Cleanup Function
   ========================= */
const cleanCloudinary = async () => {
    try {
        console.log("⚠️ STARTING CLOUDINARY FORCE CLEANUP");

        // 🔐 Safety guard
        if (process.env.NODE_ENV === "production") {
            throw new Error("❌ Cleanup blocked in PRODUCTION");
        }

        for (const folder of FOLDERS) {
            console.log(`🧹 Cleaning folder: ${folder}`);

            // Delete all files inside folder
            await cloudinary.v2.api.delete_resources_by_prefix(folder);

            // Delete the folder itself
            await cloudinary.v2.api.delete_folder(folder);

            console.log(`🔥 Deleted: ${folder}`);
        }

        console.log("✅ CLOUDINARY CLEANUP COMPLETED");
        process.exit(0);
    } catch (error) {
        console.error("❌ CLOUDINARY CLEANUP FAILED:", error.message);
        process.exit(1);
    }
};

/* =========================
   RUN
   ========================= */
cleanCloudinary();
