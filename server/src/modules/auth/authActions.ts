import type { RequestHandler } from "express";

// Import access to data
import userRepository from "../user/userRepository";

const login: RequestHandler = async (req, res, next) => {
  try {
    // Fetch a specific user from the database based on the provided email
    const user = await userRepository.readByEmail(req.body.email);

    if (user == null || user.password !== req.body.password) {
      res.sendStatus(422);
    } else {
      // Respond with the user in JSON format
      res.json(user);
    }
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

export default { login };
