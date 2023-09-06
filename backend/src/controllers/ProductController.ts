import { Router } from "express";
import { Request, Response } from "express";
import { ProductService } from "../services/ProductService";
import Product from "../models/Product";
import { InterfaceProduct } from "../interfaces/ProductsInterface";
import { ProductValidation } from "../validations/ProductValidations";

const router = Router();

class ProductController {
  private router: Router;
  private productService: ProductService;
  private productValidation: ProductValidation;

  constructor(router: Router) {
    this.router = router;
    this.productService = new ProductService();
  }

  getRouter(): Router {
    return this.router;
  }

  useRoutes(): void {
    this.router.post("/validar", async (req: Request, res: Response) => {
      try {
        const products: Array<InterfaceProduct> = req.body;

        if (products.length <= 0) {
          return res.status(400).send({ error: "Lista de produtos vazia" });
        }

        for (let index = 0; index < products.length; index++) {
          const validation = this.productValidation.validateProduct(
            products[index]
          );

          if (validation.error) {
            return res.status(400).send({
              error: validation.error.message[0],
              product: products[index],
            });
          }
        }

        const validateProducts = await this.productService.validateProducts(
          products
        );

        if (validateProducts.error) {
          return res.status(400).send("ok");
        }

        return res
          .status(200)
          .send({ success: "Produtos Validados corretamente" });
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
