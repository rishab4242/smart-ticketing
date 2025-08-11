const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    description: { type: String },
    date: { type: Date, required: true },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], required: true }, // [lng, lat]
    },
    maxCapacity: { type: Number, default: 100 },
    ticketsSold: { type: Number, default: 0 },
  },
  { timestamps: true }
);

eventSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Event", eventSchema);
