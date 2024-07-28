const deleteSchoolPost = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return notFoundError(res, 'please provide ID');
  }

  const deleted_school_post = await School_post.findOneAndDelete({ _id: id });

  if (!deleted_school_post) {
    return notFoundError(res, 'there is no such post in the database');
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
      'Failed to delete associated image from Firebase Storage'
    );
  }

  res.status(StatusCodes.ACCEPTED).json({
    data: deleted_school_post,
    msg: '',
  });
};
