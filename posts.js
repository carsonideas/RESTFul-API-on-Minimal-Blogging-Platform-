export function validateMyPost(req, res, next) {
  const { title, content, authorId } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Title is required!" });
  }

  if (!content) {
    return res.status(400).json({ message: "Content is required!" });
  }

  if (!authorId) {
    return res.status(400).json({ message: "Author ID is required!" });
  }

  next();
}
