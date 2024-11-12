import express from "express";
const router = express.Router();

import {
  newOrder,
  getOrderDetails,
  myOrders,
  allOrders,
  updateOrder,
  deleteOrder,
} from "../controllers/orderController.js";

import { isAuthenticatedUser, authorizeRoles } from "../middlewares/auth.js";

router.route("/order/new").post(isAuthenticatedUser, newOrder);

router.route("/order/:id").get(isAuthenticatedUser, getOrderDetails);
router.route("/me/orders").get(isAuthenticatedUser, myOrders);

router
  .route("/admin/orders")
  .get(isAuthenticatedUser, authorizeRoles("admin"), allOrders);
router
  .route("/admin/orders/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateOrder)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteOrder);

export default router;
