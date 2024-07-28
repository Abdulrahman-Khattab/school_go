const path = require('path');
const fs = require('fs');
const { StatusCodes } = require('http-status-codes');
const School_post = require('./models/School_post'); // Adjust the path to your model
const { badRequestError } = require('./errors'); // Adjust the path to your error handler
const admin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid'); // Import UUID
const serviceAccount = require('./path/to/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'schoolsystem-76875.appspot.com',
});

const bucket = admin.storage().bucket();

const createSchoolPost = async (req, res) => {
  const { description } = req.body;

  if (!description) {
    return badRequestError(res, 'please provide description');
  }

  if (!req.files) {
    const school_post = await School_post.create({ description });
    return res.status(StatusCodes.ACCEPTED).json({ data: school_post });
  }

  const imageValue = req.files.image;

  if (!imageValue.mimetype.startsWith('image')) {
    return badRequestError(res, 'please provide image');
  }

  const size = 1024 * 1024 * 5;
  if (imageValue.size > size) {
    return badRequestError(
      res,
      'please provide image that size is less than 5MB'
    );
  }

  const imagePath = path.join(
    __dirname,
    `../public/photo/`,
    `${imageValue.name}`
  );
  await imageValue.mv(imagePath);

  const downloadToken = uuidv4(); // Generate a unique token

  try {
    const metadata = {
      metadata: {
        firebaseStorageDownloadTokens: downloadToken,
      },
      contentType: imageValue.mimetype,
    };

    await bucket.upload(imagePath, {
      destination: `public/photo/${imageValue.name}`,
      metadata: metadata,
    });

    const file = bucket.file(`public/photo/${imageValue.name}`);
    const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${
      bucket.name
    }/o/${encodeURIComponent(file.name)}?alt=media&token=${downloadToken}`;

    const school_post = await School_post.create({
      ...req.body,
      image: imageUrl,
    });

    res.json({ data: school_post, msg: '' });
  } catch (error) {
    console.error(error);
    return badRequestError(res, 'Failed to upload image to Firebase Storage');
  } finally {
    fs.unlinkSync(imagePath); // Remove the image from local storage after uploading
  }
};
