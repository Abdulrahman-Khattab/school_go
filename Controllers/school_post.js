const School_post = require('../model/school_post');
const monggose = require('mongoose');
const path = require('path');
const fs = require('fs');
const { notFoundError, badRequestError } = require('../errors_2');
const { StatusCodes } = require('http-status-codes');
require('dotenv').config();

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

  const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' });

  try {
    // Dynamic import
    const { Octokit } = await import('@octokit/rest');

    const octokit = new Octokit({
      auth: process.env.GIT_SECRET, // Replace with your GitHub personal access token
    });

    const response = await octokit.rest.repos.createOrUpdateFileContents({
      owner: 'Abdulrahman-Khattab', // Replace with your GitHub username
      repo: 'school_go', // Replace with your repository name
      path: `public/photo/${imageValue.name}`,
      message: `Add new image ${imageValue.name}`,
      content: imageBase64,
      committer: {
        name: 'YOUR_NAME', // Replace with your name
        email: 'YOUR_EMAIL', // Replace with your email
      },
      author: {
        name: 'YOUR_NAME', // Replace with your name
        email: 'YOUR_EMAIL', // Replace with your email
      },
    });

    const imageUrl = `https://raw.githubusercontent.com/Abdulrahman-Khattab/school_go/main/public/photo/${imageValue.name}`;

    const school_post = await School_post.create({
      ...req.body,
      image: imageUrl,
    });

    res.json({ data: school_post, msg: '' });
  } catch (error) {
    console.error(error);
    return badRequestError(res, 'Failed to upload image to GitHub');
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
