import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import { authorizeRoles } from "../middleware/authorize.js";
import {
  getDashboard,
  listUsers,
  getUser,
  listStoreOwners,
  createNormalUser,
  createStoreOwner,
} from "../controllers/admin.controller.js";

const router = Router();

// All admin routes require a valid token AND the ADMIN role.
router.use(authenticate, authorizeRoles("ADMIN"));

router.get("/dashboard", getDashboard);
router.get("/users", listUsers);
router.get("/users/:id", getUser);
router.get("/store-owners", listStoreOwners);
router.post("/users", createNormalUser);
router.post("/store-owners", createStoreOwner);

export default router;
