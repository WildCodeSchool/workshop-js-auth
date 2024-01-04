// Import access to database tables
const tables = require("../tables");

const login = async (req, res, next) => {
  try {
    // Fetch all users from the database
    const user = await tables.user.readByEmail(req.body.email);

    if (user == null || user.password !== req.body.password) {
      res.sendStatus(422);
    } else {
      // Respond with the users in JSON format
      res.json(user);
    }
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

module.exports = {
  login,
};
