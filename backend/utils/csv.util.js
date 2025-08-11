const path = require("path");
const fs = require("fs");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const Ticket = require("../models/Ticket.model");

exports.exportAttendeesCSV = async (eventId) => {
  const tickets = await Ticket.find({ event: eventId }).populate(
    "attendee",
    "name email"
  );
  const rows = tickets.map((t) => ({
    name: t.attendee.name,
    email: t.attendee.email,
    status: t.status,
    purchasedAt: t.purchasedAt,
  }));
  const tmpDir = path.join(__dirname, "..", "..", "tmp");
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);
  const filePath = path.join(tmpDir, `attendees_${eventId}.csv`);
  const csvWriter = createCsvWriter({
    path: filePath,
    header: [
      { id: "name", title: "Name" },
      { id: "email", title: "Email" },
      { id: "status", title: "Status" },
      { id: "purchasedAt", title: "PurchasedAt" },
    ],
  });
  await csvWriter.writeRecords(rows);
  return filePath;
};
