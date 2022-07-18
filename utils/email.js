const nodemailer = require('nodemailer');

const sendEmail = async options => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST, // USING mailtrap.io as an email trap for testing, change it before production
    port: process.env.EMAIL_PORT,

    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: 'Belanisi <Contact@Belinasi.com>', // CHANGE IT LATER
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html: options.html,
  });
};

module.exports = sendEmail;
