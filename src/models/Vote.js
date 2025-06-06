import mongoose from "mongoose";

const VoteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        unique: true,
        required: true
    },
    delegate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Delegate',
        required: true
    },
    election: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Election',
        required: true
    }
})
export default mongoose.models.Vote || mongoose.model("Vote", VoteSchema);      