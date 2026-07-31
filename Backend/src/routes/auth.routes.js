const express = require("express");
const authControllers = require("../controllers/auth.controller");
const authmiddleware = require("../middlewares/auth.middleware");
const upload = require("../middlewares/multer.middleware");


const router = express.Router();

// This is called Route Definition (or Route Mapping).
router.post('/register',authControllers.registerUser);
router.post("/login",authControllers.loginUser );
router.post("/logout",authControllers.logoutUser);

// New routes for favourites feature
router.post("/like",authmiddleware.authenticate, authControllers.likeMusic);
router.post("/unlike",authmiddleware.authenticate, authControllers.unlikeMusic);
router.get("/favourites",authmiddleware.authenticate, authControllers.getFavourites);
router.get("/me", authmiddleware.authenticate, authControllers.getCurrentUser);
router.put("/profile", authmiddleware.authenticate, upload.single('profilePicture'), authControllers.updateProfile);
router.put("/password", authmiddleware.authenticate, authControllers.updatePassword);

module.exports = router;