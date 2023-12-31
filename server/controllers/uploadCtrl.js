const AWS = require('aws-sdk');
const dotenv = require('dotenv');

dotenv.config();

//S3 Bucket Connection
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const AWS_REGION = process.env.AWS_REGION;
const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME;

AWS.config.update({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  region: AWS_REGION,
});

const s3 = new AWS.S3();

// Upload to S3 Bucket
const uploadCtrl = {
  // @route   POST api/upload/uploadprofilePic/:userId
  uploadprofilePic: async (req, res) => {
    try {
      const { file } = req;
      const { userId } = req.params;

      //Validate
      if (!file) return res.status(400).json({ msg: 'No file uploaded' });

      //S3 Bucket params
      const params = {
        Bucket: AWS_BUCKET_NAME,
        Key: `profilePicture/${userId}/${Date.now()}${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
      };

      //Upload image to S3 Bucket
      await s3.upload(params, (err, data) => {
        if (err) {
          return res.status(400).json({ msg: err.message });
        }
        return res.status(200).json({ imgUrl: data.Location });
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  // @route   DELETE api/upload/deleteprofilePic/:filename/:userId
  deleteprofilePic: async (req, res) => {
    const { filename, userId } = req.params;

    const params = {
      Bucket: AWS_BUCKET_NAME,
      Key: `profilePicture/${userId}/${filename}`,
    };

    await s3.deleteObject(params, (err) => {
      if (err) {
        return res.status(400).json({ msg: err.message });
      }
      return res.status(200).json({ msg: 'Image deleted successfully' });
    });
  },
  // @route   POST api/upload/uploadPostImgs/:userId
  uploadPostImgs: async (req, res) => {
    try {
      const { file } = req;
      const { userId } = req.params;

      //Validate
      if (!file) return res.status(400).json({ msg: 'No file uploaded' });

      //S3 Bucket params
      const params = {
        Bucket: AWS_BUCKET_NAME,
        Key: `postImages/${userId}/${Date.now()}${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
      };

      //Upload image to S3 Bucket
      await s3.upload(params, (err, data) => {
        if (err) {
          return res.status(400).json({ msg: err.message });
        }
        return res.status(200).json({
          imgUrl: data.Location,
          public_id: data.Key,
        });
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  // @route   DELETE api/upload/deletePostImgs/:filename/:userId
  deletePostImgs: async (req, res) => {
    const { filename, userId } = req.params;

    const params = {
      Bucket: AWS_BUCKET_NAME,
      Key: `postImages/${userId}/${filename}`,
    };

    await s3.deleteObject(params, (err) => {
      if (err) {
        return res.status(400).json({ msg: err.message });
      }
      return res.status(200).json({ msg: 'Image deleted successfully' });
    });
  },
};

module.exports = uploadCtrl;
