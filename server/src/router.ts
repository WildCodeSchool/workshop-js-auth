import express from "express";

const router = express.Router();

/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */

// Define item-related routes
import itemActions from "./modules/item/itemActions";

router.get("/api/items", itemActions.browse);
router.get("/api/items/:id", itemActions.read);

// Define user-related routes
import userActions from "./modules/user/userActions";

router.get("/api/users", userActions.browse);
router.get("/api/users/:id", userActions.read);

// Define auth-related routes
import authActions from "./modules/auth/authActions";

router.post("/api/login", authActions.login);

router.post("/api/users", authActions.hashPassword, userActions.add);

// Authentication wall
router.use(authActions.verifyToken);

// This route is protected
router.post("/api/items", itemActions.add);

/* ************************************************************************* */

export default router;
