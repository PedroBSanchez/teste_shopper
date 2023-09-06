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
}

export { ProductRepository };
