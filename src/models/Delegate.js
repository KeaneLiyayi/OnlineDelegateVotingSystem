import mongoose from "mongoose";

const DelegateSchema = new mongoose.Schema({
    fName: String,
    bio: String,
    imageUrl: String,
    faculty: String,
    department: String,
    year: Number,

    votes: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.Delegate || mongoose.model("Delegate", DelegateSchema);
