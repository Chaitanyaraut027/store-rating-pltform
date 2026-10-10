import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import { authorizeRoles } from "../middleware/authorize.js";
import { submitRating, getMyRatings } from "../controllers/rating.controller.js";

const router = Router();

// All rating routes require a valid token AND the USER role.
router.use(authenticate, authorizeRoles("USER"));

router.post("/", submitRating);
router.get("/my", getMyRatings);

export default router;