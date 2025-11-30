import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI!;
if (!MONGO_URI) throw new Error("MONGO_URI is missing!");

let isConnected = false; // track connection

export async function connect() {
  if (isConnected) {
    return; // already connected → no need to reconnect
  }

  try {
    const db = await mongoose.connect(MONGO_URI);
    isConnected = db.connections[0].readyState === 1;

    console.log("Database Connected!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}
