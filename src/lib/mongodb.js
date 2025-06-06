import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable");
}

// Global caching for MongoDB connection
let cached = global.mongoose || { conn: null, promise: null };

export async function connectToDB() {
    // If the connection is already cached, return it
    if (cached.conn) {
        return cached.conn;
    }

    // If no promise, initialize the connection
    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, {
            dbName: "voting_system", // Optional: If your DB has a specific name
            useNewUrlParser: true,    // Deprecated but harmless
            useUnifiedTopology: true // Deprecated but harmless
        }).then((mongooseInstance) => mongooseInstance); // Wait for the connection to resolve
    }

    cached.conn = await cached.promise; // Store the promise result in the cache
    return cached.conn; // Return the connection object
}
