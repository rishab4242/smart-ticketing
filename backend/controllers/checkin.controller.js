const Ticket = require("../models/Ticket.model");
const Event = require("../models/Event.model");
const { distanceInMeters } = require("../utils/geo.util");
const { getIO } = require("../sockets/socket");

exports.doCheckin = async (req, res) => {
  try {
    const { ticketId, lat, lng } = req.body;
    if (!ticketId || !lat || !lng)
      return res.status(400).json({ msg: "Missing fields" });

    const ticket = await Ticket.findById(ticketId).populate("attendee event");
    if (!ticket) return res.status(404).json({ msg: "Ticket not found" });
    if (ticket.status !== "valid")
      return res.status(400).json({ msg: "Ticket not valid" });

    const event = await Event.findById(ticket.event._id);
    if (!event) return res.status(404).json({ msg: "Event not found" });

    const [evLng, evLat] = event.location.coordinates;
    const dist = distanceInMeters(evLat, evLng, lat, lng);
    if (dist > 100)
      return res
        .status(403)
        .json({
          msg: `Attendee is ${Math.round(dist)}m away — must be within 100m`,
        });

    ticket.status = "used";
    await ticket.save();

    const io = getIO();
    if (io)
      io.to(String(event._id)).emit("checkin", {
        ticketId: ticket._id,
        attendee: {
          id: ticket.attendee._id,
          name: ticket.attendee.name,
          email: ticket.attendee.email,
        },
        time: new Date(),
      });

    res.json({ msg: "Checked in", ticket });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};
