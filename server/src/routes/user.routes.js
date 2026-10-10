import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import { authorizeRoles } from "../middleware/authorize.js";
import { browseStores } from "../controllers/user.controller.js";

const router = Router();

// All normal user routes require a valid token AND the USER role.
router.use(authenticate, authorizeRoles("USER"));

router.get("/stores", browseStores);

export default router;
