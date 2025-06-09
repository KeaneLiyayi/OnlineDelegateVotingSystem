import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDB() {
  if (cached.conn) {
    return cached.conn;
  }
  console.log("Connecting to DB...")

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: "voting_system",
    });
  }

  try {
    cached.conn = await cached.promise;
    console.log("DB connected successfully");
  } catch (err) {
    console.log("DB connection error", err);
    cached.promise = null;
    throw err;
  }

  return cached.conn;
}
