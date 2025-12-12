import mongoose from "mongoose";

export const connectMongo = async () => {
  if (mongoose.connection.readyState === 1) return;

  try {
    await mongoose.connect(process.env.MONGODB_URI || "");
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("MongoDB Error:", err);
  }
};
