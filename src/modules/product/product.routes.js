import express from "express";
import { productController, upload } from "./product.controller.js";
import { verifyUserAuth } from "../../middlewares/verifyUserAuth.js";

const router = express.Router();

/**
 * Routes (Protected for Admin actions)
 */

// GET /api/admin/products - Fetch all products
router.get("/", verifyUserAuth, productController.getAllProducts);

// GET /api/admin/products/:id - Fetch single product
router.get("/:id", verifyUserAuth, productController.getProductById);

// POST /api/admin/products - Create product
router.post(
  "/", 
  verifyUserAuth, 
  upload.single("image"), 
  productController.createProduct
);

// POST /api/admin/products/:id - Update product
router.post(
  "/:id", 
  verifyUserAuth, 
  upload.single("image"), 
  productController.updateProduct
);

// DELETE /api/admin/products/:id - Delete product
router.delete(
  "/:id", 
  verifyUserAuth, 
  productController.deleteProduct
);

// PATCH /api/admin/products/:id/toggle-status - Toggle status
router.patch(
  "/:id/toggle-status", 
  verifyUserAuth, 
  productController.toggleStatus
);

export default router;
