const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "itzmeyogesh2k4@gmail.com",
    pass: "htxlllmkyfppvizm"
  }
});

const sendEmail = async (to, subject, text) => {
  const info = await transporter.sendMail({
    from: `"Hall Booking" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text
  });

  console.log("=================================");
  console.log("EMAIL SENT SUCCESSFULLY");
  console.log("To:", to);
  console.log("Subject:", subject);
  console.log("Message ID:", info.messageId);
  console.log("Response:", info.response);
  console.log("=================================");

  return info;
};

module.exports = sendEmail;