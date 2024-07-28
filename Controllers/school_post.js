const School_post = require('../model/school_post');
const monggose = require('mongoose');
const path = require('path');
const fs = require('fs');
const { notFoundError, badRequestError } = require('../errors_2');
const { StatusCodes } = require('http-status-codes');
require('dotenv').config();
const admin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid'); // Import UUID
const generateRandomString = require('../utility/randomGenerator');

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  }),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

const bucket = admin.storage().bucket();

const createSchoolPost = async (req, res) => {
  const { description } = req.body;

  const randomValue = generateRandomString(10);
  console.log(randomValue);

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
      destination: `public/photo/${randomValue + imageValue.name}`,
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

const getAllSchoolPost = async (req, res) => {
  const school_post = await School_post.find({});

  if (!school_post) {
    return notFoundError(res, 'there is not post in your database');
  }

  res.status(StatusCodes.ACCEPTED).json({ data: school_post, msg: '' });
};

const getSingleSchoolPost = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return notFoundError(res, 'please provide ID');
  }

  if (!monggose.Types.ObjectId.isValid(id)) {
    return notFoundError(res, 'Please return valid id format');
  }

  const single_school_post = await School_post.findOne({ _id: id });

  if (!single_school_post) {
    return notFoundError(res, 'there no such post in database');
  }

  res.status(StatusCodes.OK).json({
    data: single_school_post,
    msg: '',
  });
};

const deleteSchoolPost = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return notFoundError(res, 'please provide ID');
  }

  const deleted_school_post = await School_post.findOneAndDelete({ _id: id });

  if (!deleted_school_post) {
    return notFoundError(res, 'there no such post in database');
  }

  res.status(StatusCodes.ACCEPTED).json({
    data: deleted_school_post,
    msg: '',
  });
};

module.exports = {
  createSchoolPost,
  getAllSchoolPost,
  getSingleSchoolPost,
  deleteSchoolPost,
};
