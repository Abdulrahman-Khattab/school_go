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
