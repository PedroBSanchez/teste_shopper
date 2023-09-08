import Joi from "joi";

import {
  InterfaceProduct,
  InterfaceProductUpdateRequest,
} from "../interfaces/ProductsInterface";
class ProductValidation {
  public validateProduct(product: InterfaceProductUpdateRequest) {
    let { code, sales_price } = product;

    const schema = Joi.object({
      code: Joi.number().required(),
      sales_price: Joi.number().required(),
    });

    return schema.validate({ code, sales_price });
  }
}

export { ProductValidation };
