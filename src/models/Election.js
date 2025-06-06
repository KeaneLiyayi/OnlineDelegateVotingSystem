import mongoose from "mongoose";

const ElectionSchema = new mongoose.Schema({
    name: String,
    status: String,
    start: Date,
    end: Date,
    faculty: String,
    year: Number,
    delegates: [{ type: mongoose.Schema.Types.ObjectId, ref: "Delegate" }],
    results: {type: Boolean, default: false},

    
}, { timestamps: true });

//creates a compound index to ensure one election per faculty per year
ElectionSchema.index({ faculty: 1, year: 1 }, { unique: true });

export default mongoose.models.Election || mongoose.model("Election", ElectionSchema);  