require("dotenv").config();

const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT, // SSL (secure connection)
  secure: false, // Must be true for port 465
  auth: {
    user: process.env.MAIL_USER,

    pass: process.env.MAIL_PASS,
  },
  authMethod: "PLAIN",
});

const sendEmail = async (to, subject, data, templateFile) => {
  const templatePath = path.join(
    path.resolve(__dirname, "../"),
    "views",
    templateFile
  );
  const emailTemplate = await ejs.renderFile(`${templatePath}`, {
    data,
  });
  const mailOptions = {
    from: process.env.MAIL_USER,
    to: to,
    subject: subject,
    html: emailTemplate,
  };

  return transporter.sendMail(mailOptions);
};

// Configure the transporter
const mail_transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: process.env.MAIL_PORT == "587" ? false : true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const sendEmailWithTemplate = async ({ to, subject, templateFile }) => {
  // Define mail options
  const mailOptions = {
    from: process.env.MAIL_USER,
    to: to,
    subject: subject,
    html: templateFile,
  };

  // Send email
  const info = await mail_transporter.sendMail(mailOptions);
  return { success: true, messageId: info.messageId };
};

module.exports = {
  sendEmail,
  sendEmailWithTemplate,
};
