const express = require("express");

const router = express.Router();

/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */

// Import itemActions module for handling item-related operations
const itemActions = require("../../controllers/itemActions");

router.get("/items", itemActions.browse);
router.get("/items/:id", itemActions.read);
router.post("/items", itemActions.add);

// Import userActions module for handling user-related operations
const userActions = require("../../controllers/userActions");

router.get("/users", userActions.browse);
router.get("/users/:id", userActions.read);
router.post("/users", userActions.add);

// Import authActions module for handling auth-related operations
const authActions = require("../../controllers/authActions");

router.post("/login", authActions.login);

/* ************************************************************************* */

module.exports = router;
