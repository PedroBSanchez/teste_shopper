import { NextFunction, Router } from "express";
import { Request, Response } from "express";
import { ProductService } from "../services/ProductService";
import Product from "../models/Product";
import {
  InterfaceProduct,
  InterfaceProductUpdateRequest,
} from "../interfaces/ProductsInterface";
import { ProductValidation } from "../validations/ProductValidations";

const router = Router();

class ProductController {
  private router: Router;
  private productService: ProductService;
  private productValidation: ProductValidation;

  constructor(router: Router) {
    this.router = router;
    this.productService = new ProductService();
    this.productValidation = new ProductValidation();
  }

  getRouter(): Router {
    return this.router;
  }

  useRoutes(): void {
    this.router.post("/validate", async (req: Request, res: Response) => {
      try {
        const products: Array<InterfaceProductUpdateRequest> =
          req.body.products;

        if (products.length <= 0) {
          return res.status(400).send({ error: "Lista de produtos vazia" });
        }

        for (let index = 0; index < products.length; index++) {
          const validation: any = this.productValidation.validateProduct(
            products[index]
          );

          if (validation.error) {
            return res.status(400).send({
              error: validation.error.message,
              product: products[index],
            });
          }
        }

        const validateProducts: any =
          await this.productService.validateProducts(products);

        return res.status(200).send(validateProducts);
      } catch (error) {
        console.log(error);
        throw error;
      }
    });

    this.router.put("/update", async (req: Request, res: Response) => {
      try {
        const products: Array<InterfaceProductUpdateRequest> =
          req.body.products;

        if (products.length <= 0) {
          return res.status(400).send({ error: "Lista de produtos vazia" });
        }

        for (let index = 0; index < products.length; index++) {
          const validation: any = this.productValidation.validateProduct(
            products[index]
          );

          if (validation.error) {
            return res.status(400).send({
              error: validation.error.message,
              product: products[index],
            });
          }
        }

        const updateProducts = await this.productService.updateProducts(
          products
        );

        if (updateProducts.error) {
          return res.status(400).send(updateProducts);
        }

        return res.status(200).send(updateProducts);
      } catch (error) {
        console.log(error);
        throw error;
      }
    });
  }
}

const routes = new ProductController(router);
routes.useRoutes();
const ProductControllerRoutes = routes.getRouter();

export { ProductControllerRoutes };
