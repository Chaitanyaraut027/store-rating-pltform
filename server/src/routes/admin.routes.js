import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import { authorizeRoles } from "../middleware/authorize.js";
import {
  getDashboard,
  listUsers,
  getUser,
  listStoreOwners,
  adminCreateUser,
  createStoreOwner,
} from "../controllers/admin.controller.js";
import {
  adminCreateStore,
  adminListStores,
} from "../controllers/store.controller.js";

const router = Router();

// All admin routes require a valid token AND the ADMIN role.
router.use(authenticate, authorizeRoles("ADMIN"));

router.get("/dashboard", getDashboard);
router.get("/users", listUsers);
router.get("/users/:id", getUser);
router.get("/store-owners", listStoreOwners);
router.post("/users", adminCreateUser);
router.post("/store-owners", createStoreOwner);

router.post("/stores", adminCreateStore);
router.get("/stores", adminListStores);

export default router;
