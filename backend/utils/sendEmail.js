const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "itzmeyogesh2k4@gmail.com",      // your Gmail
    pass: "kplbllkqmbusejhq"            // app password (no spaces)
  }
});

const sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: "Hall Booking <hallbooking@gmail.com>",
      to,
      subject,
      text
    });

    console.log("Email sent to:", to);

  } catch (error) {
    console.error("Email error:", error);
  }
};

module.exports = sendEmail;