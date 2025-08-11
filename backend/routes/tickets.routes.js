const router = require("express").Router();
const { protect } = require("../middlewares/auth.middleware");
const { authorizeRoles } = require("../middlewares/role.middleware");
const { buyTicket, getTicket } = require("../controllers/ticket.controller");

router.post(
  "/:eventId/tickets",
  protect,
  authorizeRoles("attendee"),
  buyTicket
);
router.get("/:ticketId", protect, getTicket);

module.exports = router;
