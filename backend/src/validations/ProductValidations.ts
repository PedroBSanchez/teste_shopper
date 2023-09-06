import Joi from "joi";

import { InterfaceProduct } from "../interfaces/ProductsInterface";
class ProductValidation {
  public validateProduct(product: InterfaceProduct) {
    let { code, name, cost_price, sales_price } = product;

    const schema = Joi.object({
      code: Joi.number().required(),
      name: Joi.string().required(),
      cost_price: Joi.number().required(),
      sales_price: Joi.number().required(),
    });

    return schema.validate({ code, name, cost_price, sales_price });
  }
}

export { ProductValidation };
