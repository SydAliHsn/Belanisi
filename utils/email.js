const nodemailer = require('nodemailer');

const createTransport = () => {
  if (process.env.NODE_ENV === 'production') {
    return nodemailer.createTransport({
      host: process.env.SENDINBLUE_HOST,
      port: process.env.SENDINBLUE_PORT,

      auth: {
        user: process.env.SENDINBLUE_USER,
        pass: process.env.SENDINBLUE_PASSWORD,
      },
    });
  }

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST, // USING mailtrap.io as an email trap for testing, change it before production
    port: process.env.EMAIL_PORT,

    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

const sendEmail = async options => {
  const transporter = createTransport();

  let mailObj = {
    from: `Belinasi <${process.env.EMAIL_FROM}>`,
    to: options.email,
    subject: options.subject,
  };

  options.html ? (mailObj.html = options.html) : (mailObj.text = options.message);

  await transporter.sendMail(mailObj);
};

module.exports = sendEmail;
