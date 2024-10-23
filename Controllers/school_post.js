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
const create_notification = require('../utility/create_notification');

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
    return badRequestError(res, 'pleaseProvideDescription');
  }

  if (!req.files) {
    const school_post = await School_post.create({ description });
    await create_notification(
      [
        'ftYfLBnUQz6GXr-UOMam81:APA91bEI5UN1l-zyhCe_Swluf9GPgXrI5739EvYVTCjR30XOrrFrETFhDzA84l66Fk-PO5k2uJvBAYkWfqBUvHY5d7zGht6YLUJ5bqohNV2ZDwK9u90mt6i_s9zcSDNQwagsFehHrQIi',
        'dbDE0jj0SOC5XwoqK9i36n:APA91bG9Rb6nmk2d-_mgU97Fy8JXul-zB_4HiMeobCwXwhNmxRkTh-Gnw9EDwls-ITSkU64svsnUhwmAtUFcLZmLJMRS4XyXWFWICl2VFRPx5X95XI0VHJ25lBtSRSVqjzUYBg12GruV',
        'def789uvw012',
        'ghi345rst678',
        'abc123xyz456',
        'dl-V0oHmRnqQaPMfh3B-hb:APA91bHsBi0MLcWWaiqdRq7k0mE7Bg0IvaxtCEsTT5fLyzy_e5TQC6hHDI39IdACUA-K_8S7VCGCN2CcmYDSckj8ax_1CzCwdnLaf-ZYxoWA8xa6I0K7tvbfwZMbqZhjybpCuhyA6xGF',
      ],
      'شوفو البوست لا بقندرة',
      'باجر الي مايجيب كتابه اطلع من المدرسة بانعل',
      'ماكو داتا انجبو وادرسو',
      true
    );
    return res
      .status(StatusCodes.ACCEPTED)
      .json({ data: school_post, authenticatedUser: res.locals.user });
  }

  const imageValue = req.files.image;

  if (!imageValue.mimetype.startsWith('image')) {
    return badRequestError(res, 'pleaseProvideImage');
  }

  const size = 1024 * 1024 * 5;
  if (imageValue.size > size) {
    return badRequestError(res, 'pleaseProvideImageThatSizeIsLessThan5MB');
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

    const file = bucket.file(`public/photo/${randomValue + imageValue.name}`);
    const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${
      bucket.name
    }/o/${encodeURIComponent(file.name)}?alt=media&token=${downloadToken}`;

    const school_post = await School_post.create({
      ...req.body,
      image: imageUrl,
    });

    await create_notification(
      [
        'ftYfLBnUQz6GXr-UOMam81:APA91bEI5UN1l-zyhCe_Swluf9GPgXrI5739EvYVTCjR30XOrrFrETFhDzA84l66Fk-PO5k2uJvBAYkWfqBUvHY5d7zGht6YLUJ5bqohNV2ZDwK9u90mt6i_s9zcSDNQwagsFehHrQIi',
        'dbDE0jj0SOC5XwoqK9i36n:APA91bG9Rb6nmk2d-_mgU97Fy8JXul-zB_4HiMeobCwXwhNmxRkTh-Gnw9EDwls-ITSkU64svsnUhwmAtUFcLZmLJMRS4XyXWFWICl2VFRPx5X95XI0VHJ25lBtSRSVqjzUYBg12GruV',
      ],
      'شوفو البوست لا بقندرة',
      'باجر الي مايجيب كتابه اطلع من المدرسة بانعل',
      'ماكو داتا انجبو وادرسو',
      true
    );
    res.json({
      data: school_post,
      msg: '',
      authenticatedUser: res.locals.user,
    });
  } catch (error) {
    console.error(error);
    return badRequestError(res, 'FailedToUploadImageToFirebaseStorage');
  } finally {
    fs.unlinkSync(imagePath); // Remove the image from local storage after uploading
  }
};

const getAllSchoolPost = async (req, res) => {
  const school_post = await School_post.find({});

  if (!school_post) {
    return notFoundError(res, 'thereIsNotPostInYourDatabase');
  }

  res
    .status(StatusCodes.ACCEPTED)
    .json({ data: school_post, msg: '', authenticatedUser: res.locals.user });
};

const getSingleSchoolPost = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return notFoundError(res, 'pleaseProvideID');
  }

  if (!monggose.Types.ObjectId.isValid(id)) {
    return notFoundError(res, 'pleaseReturnValidIdFormat');
  }

  const single_school_post = await School_post.findOne({ _id: id });

  if (!single_school_post) {
    return notFoundError(res, 'thereNoSuchPostInDatabase');
  }

  res.status(StatusCodes.OK).json({
    data: single_school_post,
    msg: '',
    authenticatedUser: res.locals.user,
  });
};

const deleteSchoolPost = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return notFoundError(res, 'pleaseProvideID');
  }

  const school_post_no_image = await School_post.findOne({ _id: id });

  if (school_post_no_image.image == '') {
    const deleted_school_post_no_image = await School_post.findOneAndDelete({
      _id: id,
    });

    return res.status(StatusCodes.ACCEPTED).json({
      data: deleted_school_post_no_image,
      msg: '',
      authenticatedUser: res.locals.user,
    });
  }

  // Now code with school post with image

  const deleted_school_post = await School_post.findOneAndDelete({ _id: id });

  if (!deleted_school_post) {
    return notFoundError(res, 'thereIsNoSuchPostInTheDatabase');
  }

  // Extract the image URL from the deleted post
  const imageUrl = deleted_school_post.image;

  // Extract the file path from the image URL
  const filePath = decodeURIComponent(imageUrl.split('/o/')[1].split('?')[0]);

  try {
    // Delete the file from Firebase Storage
    await bucket.file(filePath).delete();
    console.log(`Successfully deleted file: ${filePath}`);
  } catch (error) {
    console.error(`Failed to delete file: ${filePath}`, error);
    return badRequestError(
      res,
      'FailedToDeleteAssociatedImageFromFirebaseStorage'
    );
  }

  res.status(StatusCodes.ACCEPTED).json({
    data: deleted_school_post,
    msg: '',
    authenticatedUser: res.locals.user,
  });
};

const updatePost = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return badRequestError(res, 'pleaseProvideID');
  }
  const postInfo = await School_post.findOne({ _id: id });
  let updatedImagePostURL;
  const randomValue = generateRandomString(10);

  if (req.files) {
    const imageValue = req.files.image;
    if (imageValue) {
      if (!imageValue.mimetype.startsWith('image')) {
        return badRequestError(res, 'pleaseProvideImage');
      }

      const size = 1024 * 1024 * 5;
      if (imageValue.size > size) {
        return badRequestError(res, 'pleaseProvideImageThatSizeIsLessThan5MB');
      }

      const imagePath = path.join(
        __dirname,
        `../public/photo/`,
        `${imageValue.name}`
      );
      await imageValue.mv(imagePath);
      const downloadToken = uuidv4(); // Generate a unique token

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

      const file = bucket.file(`public/photo/${randomValue + imageValue.name}`);
      const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${
        bucket.name
      }/o/${encodeURIComponent(file.name)}?alt=media&token=${downloadToken}`;
      fs.unlinkSync(imagePath); // Remove the image from local storage after uploading
      updatedImagePostURL = imageUrl;
      //=========================================================================

      if (postInfo.image) {
        console.log(postInfo.image);
        console.log(postInfo.image);
        // Extract the image URL from the deleted post
        const imageUrlDelete = postInfo.image;

        // Extract the file path from the image URL
        const filePath = decodeURIComponent(
          imageUrlDelete.split('/o/')[1].split('?')[0]
        );

        try {
          // Delete the file from Firebase Storage
          await bucket.file(filePath).delete();
          console.log(`Successfully deleted file: ${filePath}`);
        } catch (error) {
          console.error(`Failed to delete file: ${filePath}`, error);
          return badRequestError(
            res,
            'FailedToDeleteAssociatedImageFromFirebaseStorage'
          );
        }
      }
    }
  }

  const updatedPost = await School_post.findOneAndUpdate(
    { _id: id },
    { image: updatedImagePostURL, ...req.body },
    {
      new: true,
      runValidators: true,
    }
  );

  await create_notification(
    [
      'ftYfLBnUQz6GXr-UOMam81:APA91bEI5UN1l-zyhCe_Swluf9GPgXrI5739EvYVTCjR30XOrrFrETFhDzA84l66Fk-PO5k2uJvBAYkWfqBUvHY5d7zGht6YLUJ5bqohNV2ZDwK9u90mt6i_s9zcSDNQwagsFehHrQIi',
      'dbDE0jj0SOC5XwoqK9i36n:APA91bG9Rb6nmk2d-_mgU97Fy8JXul-zB_4HiMeobCwXwhNmxRkTh-Gnw9EDwls-ITSkU64svsnUhwmAtUFcLZmLJMRS4XyXWFWICl2VFRPx5X95XI0VHJ25lBtSRSVqjzUYBg12GruV',
    ],
    'update_post',
    'باجر الي مايجيب كتابه اطلع من المدرسة بانعل',
    'ماكو داتا انجبو وادرسو',
    true
  );

  res.status(StatusCodes.ACCEPTED).json({
    data: updatedPost,
    msg: '',
    authenticatedUser: res.locals.user,
  });
};

module.exports = {
  createSchoolPost,
  getAllSchoolPost,
  getSingleSchoolPost,
  deleteSchoolPost,
  updatePost,
};
