import { ProductModel } from "./product.model.js";

class ProductService {
  async getAllProducts(query = {}) {
    const filter = { isDeleted: false };
    
    if (query.status) {
      filter.status = query.status;
    }

    return ProductModel.find(filter).sort({ createdAt: -1 }).lean();
  }

  async getProductById(id) {
    const product = await ProductModel.findOne({ _id: id, isDeleted: false });
    if (!product) {
      const err = new Error("Product not found");
      err.statusCode = 404;
      throw err;
    }
    return product;
  }

  async createProduct(productData) {
    return ProductModel.create(productData);
  }

  async updateProduct(id, updateData) {
    const product = await ProductModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!product) {
      const err = new Error("Product not found");
      err.statusCode = 404;
      throw err;
    }

    return product;
  }

  async deleteProduct(id) {
    const result = await ProductModel.updateOne(
      { _id: id },
      { $set: { isDeleted: true } }
    );

    if (result.matchedCount === 0) {
      const err = new Error("Product not found");
      err.statusCode = 404;
      throw err;
    }

    return { success: true, message: "Product deleted successfully" };
  }

  async toggleStatus(id) {
    const product = await this.getProductById(id);
    const newStatus = product.status === "active" ? "inactive" : "active";
    
    product.status = newStatus;
    await product.save();
    
    return product;
  }
}

export const productService = new ProductService();
