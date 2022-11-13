import mongoose from "mongoose";

const shortenerSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  shortUrl: {
    type: String,
    required: true,
    unique: true,
  },
  counterValue: {
    type: Number,
    required: true,
  },
});

const Shortener = mongoose.model("Shortener", shortenerSchema);
export default Shortener;
