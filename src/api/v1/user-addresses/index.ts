import express from "express";
import * as userAddressController from "../../../controllers/user-addresses/UserAddressController";
import validateRequest from "../../../middleware/validate-request";
import authenticateUser from "../../../middleware/authenticate-user";
import {
  createUserAddressSchema,
  updateUserAddressSchema,
} from "../../../data/request-schemas";

const router = express.Router();

router.use(authenticateUser);

router.get("/me", userAddressController.getMine);
router.get("/:id", userAddressController.getOne);

router.post(
  "/",
  validateRequest(createUserAddressSchema),
  userAddressController.create,
);

router.put(
  "/:id",
  validateRequest(updateUserAddressSchema),
  userAddressController.update,
);

router.delete("/:id", userAddressController.remove);

export default router;
