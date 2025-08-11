const QRCode = require("qrcode");

exports.generateDataURL = async (text) => {
  return await QRCode.toDataURL(text);
};
