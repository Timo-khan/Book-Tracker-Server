import mongoose from "mongoose";

const haveReadSchema = new mongoose.Schema(
    {
        google_id: { type: String, unique: true, required: true },
        title: String,
        author: String,
        publisher: String,
        published_date: String,
        description: String,
        thumbnail_url: String,
        isbn: String,
        category: String,
    },
    { timestamps: true }
);

haveReadSchema.index({ category: 1 });

const HaveRead = mongoose.model('HaveRead', haveReadSchema);
export default HaveRead;