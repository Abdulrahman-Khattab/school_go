const School_post = require('../model/school_post');
const { BadRequestError, NotFoundError } = require('../errors');
const path = require('path');

const createSchoolPost = async (req, res) => {
  const { description } = req.body;

  if (!description) {
    throw new BadRequestError('please provide description');
  }

  if (!req.files) {
    const school_post = await School_post.create({ description });
    res
      .json({ data: school_post, msg: 'school post created successfully' })
      .status(201);
  }

  const imageValue = req.files.image;

  console.log('hello world');
  console.log(req.files.image);

  if (!imageValue.mimetype.startsWith('image')) {
    throw new BadRequestError('please provide image');
  }

  const size = 1024 * 1024 * 5;
  if (imageValue.size > size) {
    throw new BadRequestError(
      'please provide image that size is less than 5MB'
    );
  }

  const imagePath = path.join(
    __dirname,
    `../public/photo/` + `${imageValue.name}`
  );

  await imageValue.mv(imagePath);

  const image = `/photo/${imageValue.name}`;
  console.log(image);

  const school_post = await School_post.create({ ...req.body, image });

  res.json({ data: school_post, msg: 'school post created sucessfully' });
};

const getAllSchoolPost = async (req, res) => {
  const school_post = await School_post.find({});

  if (!school_post) {
    throw new NotFoundError('there is not post in your database');
  }

  res
    .json({ data: school_post, msg: 'school post retreived sucessfully ' })
    .status(200);
};

const getSingleSchoolPost = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new NotFoundError('please provide ID');
  }

  const single_school_post = await School_post.findOne({ _id: id });

  if (!single_school_post) {
    throw new NotFoundError('there no such post in database');
  }

  res
    .json({
      data: single_school_post,
      msg: 'School_post retreived sucessfully',
    })
    .status(200);
};

const deleteSchoolPost = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new NotFoundError('please provide ID');
  }

  const deleted_school_post = await School_post.findOneAndDelete({ _id: id });

  if (!deleted_school_post) {
    throw new NotFoundError('there no such post in database');
  }

  res
    .json({
      data: deleted_school_post,
      msg: 'School_post deleted sucessfully',
    })
    .status(200);
};

module.exports = {
  createSchoolPost,
  getAllSchoolPost,
  getSingleSchoolPost,
  deleteSchoolPost,
};
