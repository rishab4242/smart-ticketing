const Event = require("../models/Event.model");
const Ticket = require("../models/Ticket.model");
const { exportAttendeesCSV } = require("../utils/csv.util");

exports.createEvent = async (req, res) => {
  try {
    const { name, date, location, maxCapacity, description } = req.body;
    if (!name || !date || !location || !location.lat || !location.lng)
      return res.status(400).json({ msg: "Missing fields" });
    const event = new Event({
      organizer: req.user._id,
      name,
      description,
      date,
      location: { type: "Point", coordinates: [location.lng, location.lat] },
      maxCapacity,
    });
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      "organizer",
      "name email"
    );
    if (!event) return res.status(404).json({ msg: "Event not found" });
    const sold = await Ticket.countDocuments({ event: event._id });
    res.json({ event, soldTickets: sold });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.editEvent = async (req, res) => {
  try {
    const updates = req.body;
    if (updates.location && updates.location.lat && updates.location.lng) {
      updates.location = {
        type: "Point",
        coordinates: [updates.location.lng, updates.location.lat],
      };
    }
    const event = await Event.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });
    if (!event) return res.status(404).json({ msg: "Event not found" });
    res.json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.exportCSV = async (req, res) => {
  try {
    const filePath = await exportAttendeesCSV(req.params.id);
    res.download(filePath);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};
