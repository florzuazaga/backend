import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("🆗 Conectados a MongoDB");
  } catch (error) {
    console.error("⛔ Error al conectarse a MongoDB:", error.message);
  }
};

export default connectToMongoDB;
