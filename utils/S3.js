const aws = require('aws-sdk');

module.exports = new aws.S3({
  bucketName: process.env.AWS_BUCKET_NAME,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// exports.deleteObject = async Key => {
//   try {
//     const params = {
//       Bucket: process.env.AWS_BUCKET_NAME,
//       Key,
//     };

//     await s3Client.deleteObject(params).promise();
//   } catch (err) {
//     console.log('Error deleting file from s3 bucket!', err.message);
//   }
// };
