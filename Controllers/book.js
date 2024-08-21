const mongoose = require('mongoose');
const Books = require('../model/books');
const STUDENT_SCHEMA = require('../model/user_students');
const path = require('path');
const fs = require('fs');
const { notFoundError, badRequestError } = require('../errors_2');
const { StatusCodes } = require('http-status-codes');
require('dotenv').config();
const admin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid'); // Import UUID
const generateRandomString = require('../utility/randomGenerator');

const bucket = admin.storage().bucket();

const createBook = async (req, res) => {
  const { title, caption, bookClass } = req.body;
  // if (!bookPDF) {
  // return badRequestError(res, 'pleaseProvideBookPDF');
  //}
  // if (!bookCover) {
  // return badRequestError(res, 'pleaseProvideBookCover');
  // }

  if (!title) {
    return badRequestError(res, 'pleaseProvideTitle');
  }

  if (!bookClass) {
    return badRequestError(res, 'pleaseProvidebookClass');
  }

  const randomValue = generateRandomString(10);
  //=====================================================

  const bookPdf = req.files.bookPDF;
  const bookCover = req.files.bookCover;
  console.log(bookPdf);
  console.log(bookCover);

  //=====================================================
  if (!bookPdf.mimetype.startsWith('application/pdf')) {
    return badRequestError(res, 'pleaseProvideBook');
  }

  let size = 1024 * 1024 * 40;
  if (bookPdf.size > size) {
    return badRequestError(res, 'pleaseProvidebookPdfThatSizeIsLessThan40MB');
  }

  //if (!bookCover.mimetype.startsWith('application/pdf')) {
  //return badRequestError(res, 'pleaseProvideBook');
  //}

  size = 1024 * 1024 * 10;
  if (bookPdf.size > size) {
    return badRequestError(res, 'pleaseProvidebookCoverThatSizeIsLessThan10MB');
  }

  bookPdf.name = bookPdf.name.split(' ').join('');

  const booksPdfPath = path.join(
    __dirname,
    `../public/booksPdf/`,
    `${bookPdf.name}`
  );
  await bookPdf.mv(booksPdfPath);
  //=====================================================
  bookCover.name = bookCover.name.split(' ').join('');

  const bookCoverPath = path.join(
    __dirname,
    `../public/booksCover/`,
    `${bookCover.name}`
  );
  await bookCover.mv(bookCoverPath);
  //=====================================================

  const downloadTokenbookPdf = uuidv4(); // Generate a unique token

  try {
    const metadataBookPdf = {
      metadata: {
        firebaseStorageDownloadTokens: downloadTokenbookPdf,
      },
      contentType: bookPdf.mimetype,
    };

    await bucket.upload(booksPdfPath, {
      destination: `public/booksPdf/${randomValue + bookPdf.name}`,
      metadata: metadataBookPdf,
    });

    const fileBookPdf = bucket.file(
      `public/booksPdf/${randomValue + bookPdf.name}`
    );
    const bookPdfUrl = `https://firebasestorage.googleapis.com/v0/b/${
      bucket.name
    }/o/${encodeURIComponent(
      fileBookPdf.name
    )}?alt=media&token=${downloadTokenbookPdf}`;

    //=====================================================

    const downloadTokenbookCover = uuidv4(); // Generate a unique token

    const metadataBookCover = {
      metadata: {
        firebaseStorageDownloadTokens: downloadTokenbookCover,
      },
      contentType: bookCover.mimetype,
    };

    await bucket.upload(bookCoverPath, {
      destination: `public/booksCover/${randomValue + bookCover.name}`,
      metadata: metadataBookCover,
    });

    const fileBookCover = bucket.file(
      `public/booksCover/${randomValue + bookCover.name}`
    );
    const bookCoverUrl = `https://firebasestorage.googleapis.com/v0/b/${
      bucket.name
    }/o/${encodeURIComponent(
      fileBookCover.name
    )}?alt=media&token=${downloadTokenbookCover}`;

    //=====================================================

    const bookInfo = await Books.create({
      ...req.body,
      bookPDF: bookPdfUrl,
      bookCover: bookCoverUrl,
    });

    res.json({
      data: bookInfo,
      msg: '',
      authenticatedUser: res.locals.user,
    });
  } catch (error) {
    console.error(error);
    return badRequestError(res, 'FailedToUploadImageToFirebaseStorage');
  } finally {
    fs.unlinkSync(booksPdfPath); // Remove the image from local storage after uploading
    fs.unlinkSync(bookCoverPath); // Remove the image from local storage after uploading
  }
};

const getMyBooks = async (req, res) => {
  const studentInfo = await STUDENT_SCHEMA.findOne({ _id: req.user.userId });
  if (!studentInfo) {
    return badRequestError(res, 'somethingWrongPleaseTryAgainLater');
  }

  const myBooks = await Books.find({ bookClass: studentInfo.className }).select(
    '-bookClass -_id'
  );
  if (!myBooks) {
    return badRequestError(res, 'somethingWrongWithBooksPleaseTryAgainLater');
  }

  res.json({ data: myBooks, msg: '', authenticatedUser: res.locals.user });
};

const getAllBooks = async (req, res) => {
  const allBooks = await Books.find({});
  if (!allBooks) {
    return notFoundError(res, 'thereIsNoBookInDB');
  }

  res.json({ data: allBooks, msg: '', authenticatedUser: res.locals.user });
};

const deleteBook = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return badRequestError(res, 'PleasePorvideId');
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return badRequestError(res, 'PleasePorvideValidId');
  }

  const deleteBook = await Books.findOneAndDelete({
    _id: id,
  });

  if (!deleteBook) {
    return notFoundError(res, 'ThereIsNoSuchBookInDataBase');
  }

  // Extract the image URL from the deleted post
  const deleteBookPdf = deleteBook.bookPDF;
  const deleteBookCover = deleteBook.bookCover;

  // Extract the file path from the image URL
  const bookPDFPath = decodeURIComponent(
    deleteBookPdf.split('/o/')[1].split('?')[0]
  );
  const bookCoverPath = decodeURIComponent(
    deleteBookCover.split('/o/')[1].split('?')[0]
  );

  try {
    // Delete the file from Firebase Storage
    await bucket.file(bookPDFPath).delete();
    await bucket.file(bookCoverPath).delete();

    console.log(
      `Successfully deleted file: ${bookPDFPath} and ${bookCoverPath}`
    );
  } catch (error) {
    console.error(
      `Failed to delete file: ${bookPDFPath} and ${bookCoverPath}`,
      error
    );
    return badRequestError(
      res,
      'FailedToDeleteAssociatedImageFromFirebaseStorage'
    );
  }

  res.json({
    data: deleteBook,
    msg: '',
    authenticatedUser: res.locals.user,
  });
};

const updateMonthlyCalenderNote = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return badRequestError(res, 'PleasePorvideId');
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return badRequestError(res, 'PleasePorvideValidId');
  }

  const updateMonthlyCalenderNote = await Monthly_calender.findOneAndUpdate(
    {
      _id: id,
    },
    { ...req.body },
    { new: true, runValidators: true }
  );

  if (!updateMonthlyCalenderNote) {
    return notFoundError(res, 'ThereIsNoSuchMonthlyCalenderNoteInDataBase');
  }

  res.json({
    data: updateMonthlyCalenderNote,
    msg: '',
    authenticatedUser: res.locals.user,
  });
};

module.exports = { createBook, getMyBooks, deleteBook, getAllBooks };
