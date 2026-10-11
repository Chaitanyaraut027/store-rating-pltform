import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import { authorizeRoles } from "../middleware/authorize.js";
import {
  getOwnerDashboard,
  getOwnerRatings,
} from "../controllers/owner.controller.js";

const router = Router();

// All owner routes require a valid token AND the STORE_OWNER role.
router.use(authenticate, authorizeRoles("STORE_OWNER"));

router.get("/dashboard", getOwnerDashboard);
router.get("/ratings", getOwnerRatings);

export default router;
