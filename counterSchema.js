import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
  count: {
    type: Number,
  },
});

counterSchema.virtual("increment").set((value) => {
  this.set({ count: value + 1 });
});

export default mongoose.model("Counter", counterSchema);
