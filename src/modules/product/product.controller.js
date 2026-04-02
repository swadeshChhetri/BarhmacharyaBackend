import { productService } from "./product.service.js";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer for local storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/products";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

export const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only images (jpeg, jpg, png, webp) are allowed"));
  },
});

class ProductController {
  async getAllProducts(req, res, next) {
    try {
      const products = await productService.getAllProducts(req.query);
      res.json(products);
    } catch (err) {
      next(err);
    }
  }

  async getProductById(req, res, next) {
    try {
      const product = await productService.getProductById(req.params.id);
      res.json(product);
    } catch (err) {
      next(err);
    }
  }

  async createProduct(req, res, next) {
    try {
      const productData = {
        name: req.body.name,
        details: req.body.details,
        price: Number(req.body.price),
        discount: Number(req.body.discount || 0),
        stock: Number(req.body.stock || 0),
      };

      if (req.file) {
        // Store relative path for frontend access
        productData.imageUrl = `/uploads/products/${req.file.filename}`;
      }

      const product = await productService.createProduct(productData);
      res.status(201).json({
        message: "Product created successfully",
        product,
      });
    } catch (err) {
      next(err);
    }
  }

  async updateProduct(req, res, next) {
    try {
      const updateData = { ...req.body };
      
      if (updateData.price !== undefined) updateData.price = Number(updateData.price);
      if (updateData.discount !== undefined) updateData.discount = Number(updateData.discount);
      if (updateData.stock !== undefined) updateData.stock = Number(updateData.stock);
      
      if (req.file) {
        updateData.imageUrl = `/uploads/products/${req.file.filename}`;
        
        // Optional: Delete old image if it exists
        try {
          const oldProduct = await productService.getProductById(req.params.id);
          if (oldProduct.imageUrl && oldProduct.imageUrl.startsWith("/uploads/")) {
            const oldPath = path.join(process.cwd(), oldProduct.imageUrl);
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
          }
        } catch (e) {
          console.error("Failed to delete old image:", e);
        }
      }

      const product = await productService.updateProduct(req.params.id, updateData);
      res.json({
        message: "Product updated successfully",
        product,
      });
    } catch (err) {
      next(err);
    }
  }

  async deleteProduct(req, res, next) {
    try {
      const result = await productService.deleteProduct(req.params.id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async toggleStatus(req, res, next) {
    try {
      const product = await productService.toggleStatus(req.params.id);
      res.json({
        message: `Product status changed to ${product.status}`,
        product,
      });
    } catch (err) {
      next(err);
    }
  }
}

export const productController = new ProductController();
