import mongoose from "mongoose";

const currentReadSchema = new mongoose.Schema(
  {
    google_id: { type: String, required: true }, // no global unique here
    title: String,
    author: String,
    publisher: String,
    published_date: String,
    description: String,
    thumbnail_url: String,
    isbn: String,
    category: String,
    webReaderLink: String,
    pdfLink: String,
    epubLink: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

// 🔒 Uniqueness per user (user + google_id), NOT global
currentReadSchema.index({ user: 1, google_id: 1 }, { unique: true });

const CurrentRead = mongoose.model("CurrentRead", currentReadSchema);
export default CurrentRead;