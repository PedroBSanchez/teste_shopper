import { InterfaceProduct } from "../interfaces/ProductsInterface";
import { ProductRepository } from "../repositories/ProductRepository";

class ProductService {
  private productRepository: ProductRepository;
  constructor() {
    this.productRepository = new ProductRepository();
  }

  public async validateProducts(products: Array<InterfaceProduct>) {
    return { error: "ok" };
  }
}

export { ProductService };
