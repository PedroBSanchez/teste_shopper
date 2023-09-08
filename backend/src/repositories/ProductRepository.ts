import Pack from "../models/Packs";
import Product from "../models/Product";

class ProductRepository {
  constructor() {}

  public async findProductByCode(code: number) {
    return await Product.findOne({
      where: {
        code: code,
      },
    });
  }

  public async findPackByPackCode(code: number) {
    return await Pack.findOne({
      where: {
        pack_id: code,
      },
    });
  }

  public async findPacksByComponentCode(componentCode: number) {
    return await Pack.findAll({
      where: {
        product_id: componentCode,
      },
    });
  }

  public async findPacksByPackCode(code: number) {
    return await Pack.findAll({ where: { pack_id: code } });
  }

  public async updateProduct(code: number, newPrice: number) {
    return await Product.update(
      { sales_price: newPrice },
      { where: { code: code } }
    );
  }

  public async updateProductCostPrice(code: number, newCostPrice: number) {
    return await Product.update(
      { cost_price: newCostPrice },
      { where: { code: code } }
    );
  }
}

export { ProductRepository };
