export function validateMyUser(req, res, next) {
  const { firstName, lastName, emailAddress, username } = req.body;

  if (!firstName) {
    return res.status(400).json({ message: "First name is required!" });
  }

  if (!lastName) {
    return res.status(400).json({ message: "Last name is required!" });
  }

  if (!emailAddress) {
    return res.status(400).json({ message: "Email address is required!" });
  }

  if (!username) {
    return res.status(400).json({ message: "Username is required!" });
  }

  next();
}
