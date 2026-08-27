const axios = require("axios");

const formatPhone = (phone) => {
  return phone
    .replace(/\D/g, "")
    .slice(-10);
};

const sendSMS = async (phone, message) => {

  try {

    const formattedPhone =
      formatPhone(phone);

    const response = await axios.post(

      "https://www.fast2sms.com/dev/bulkV2",

      {
        route: "q",

        message: message,

        language: "english",

        flash: 0,

        numbers: formattedPhone
      },

      {
        headers: {
          authorization:
            process.env.FAST2SMS_API_KEY,

          "Content-Type":
            "application/json"
        }
      }
    );

    console.log(
      "SMS Success:",
      response.data
    );

  } catch (error) {

    console.log(
      "SMS failed:",
      error.response?.data ||
      error.message
    );
  }
};

module.exports = sendSMS;