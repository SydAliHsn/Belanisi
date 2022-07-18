const midtransClient = require('midtrans-client');

const prodStatus = process.env.NODE_ENV === 'production' ? true : false;

const snap = new midtransClient.Snap({
  isProduction: prodStatus,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

module.exports = snap;

// const basicAuth = 'Basic ' + Buffer.from(process.env.MIDTRANS_SERVER_KEY + ':').toString('base64');

// exports.config = {
//   headers: {
//     'Content-Type': 'application/json',
//     Accept: 'application/json',
//     Authorization: basicAuth,
//   },
// };

// const baseUrl =
//   process.env.NODE_ENV === 'production'
//     ? process.env.MIDTRANS_PRODUCTION_URL
//     : process.env.MIDTRANS_SANDBOX_URL;
