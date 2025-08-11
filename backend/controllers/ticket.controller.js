const Ticket = require("../models/Ticket.model");
const Event = require("../models/Event.model");
const QR = require("../utils/qr.util");

exports.buyTicket = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ msg: "Event not found" });
    const sold = await Ticket.countDocuments({ event: eventId });
    if (sold >= event.maxCapacity)
      return res.status(400).json({ msg: "Sold out" });

    const ticket = new Ticket({ event: eventId, attendee: req.user._id });
    await ticket.save();

    // update event sold count
    event.ticketsSold = sold + 1;
    await event.save();

    const payload = JSON.stringify({ ticketId: ticket._id.toString() });
    const qrDataUrl = await QR.generateDataURL(payload);

    ticket.qrPayload = payload;
    await ticket.save();

    res.status(201).json({ ticketId: ticket._id, qrDataUrl, ticket });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.getTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.ticketId).populate(
      "event attendee"
    );
    if (!ticket) return res.status(404).json({ msg: "Ticket not found" });

    // expire if event already started
    if (ticket.event && new Date() > new Date(ticket.event.date)) {
      ticket.status = "expired";
      await ticket.save();
    }
    res.json(ticket);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};
