const nodemailer = require('nodemailer');

const createTransport = () => {
  if (process.env.NODE_ENV === 'production') {
    return nodemailer.createTransport({
      service: 'SendinBlue',

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
    subject: options.subject,
    bcc: options.email,
  };

  options.html ? (mailObj.html = options.html) : (mailObj.text = options.message);

  await transporter.sendMail(mailObj);
};

const sendWelcome = async user => {
  return await sendEmail({
    email: user.email,
    subject: 'Welcome to Belinasi',
    message: `Thanks ${
      user.name.split(' ')[0]
    } for signing up to Belinasi. Let's start buying and donating!`,
  });
};

// module.exports = sendEmail;

exports.sendEmail = sendEmail;
exports.sendWelcome = sendWelcome;
