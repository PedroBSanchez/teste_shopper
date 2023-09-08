import {
  InterfaceProduct,
  InterfaceProductUpdateRequest,
} from "../interfaces/ProductsInterface";
import { ProductRepository } from "../repositories/ProductRepository";

enum TypeProduct {
  "[Produto]",
  "[Pacote]",
  "[Componente]",
}

class ProductService {
  private productRepository: ProductRepository;
  constructor() {
    this.productRepository = new ProductRepository();
  }

  public async validateProducts(
    products: Array<InterfaceProductUpdateRequest>
  ) {
    let arrayProductsValidation = [];
    let valid = true;
    const results: any = await Promise.all(
      products.map(async (product: InterfaceProductUpdateRequest, index) => {
        const productInDb = await this.productRepository.findProductByCode(
          product.code
        );

        if (!productInDb) {
          valid = false;
          arrayProductsValidation.push({
            code: product.code,
            sales_price: product.sales_price,
            validation: {
              error: `Produto com código: ${product.code} não encontrado`,
            },
          });
          return {
            error: `Produto com código: ${product.code} não encontrado`,
          };
        }

        const packInDb = await this.productRepository.findPackByPackCode(
          product.code
        );

        // Alteração de pacote
        if (packInDb) {
          // Buscar o componente
          const packComponent = await this.productRepository.findProductByCode(
            packInDb.product_id
          );

          const packageValidation: any = this.validateProductRules(
            productInDb.sales_price,
            product.sales_price,
            productInDb.cost_price,
            product.code,
            TypeProduct["[Produto]"]
          );

          if (packageValidation.error) {
            valid = false;
            arrayProductsValidation.push({
              code: product.code,
              sales_price: product.sales_price,
              validation: packageValidation,
            });
            return packageValidation;
          }

          // Validação componente
          const oldUnitPrice = productInDb.sales_price / packInDb.qty;
          const newUnitPrice = product.sales_price / packInDb.qty;

          const componentValidation: any = this.validateProductRules(
            oldUnitPrice,
            newUnitPrice,
            packComponent.cost_price,
            packComponent.code,
            TypeProduct["[Componente]"]
          );

          if (componentValidation.error) {
            valid = false;
            arrayProductsValidation.push({
              code: product.code,
              sales_price: product.sales_price,
              validation: componentValidation,
            });
            return componentValidation;
          }
        } else {
          // Validar preço do produto em si
          const productComponentValidation: any = this.validateProductRules(
            productInDb.sales_price,
            product.sales_price,
            productInDb.cost_price,
            product.code,
            TypeProduct["[Produto]"]
          );

          if (productComponentValidation.error) {
            valid = false;
            arrayProductsValidation.push({
              code: product.code,
              sales_price: product.sales_price,
              validation: productComponentValidation,
            });
            return productComponentValidation;
          }

          // Buscar pacotes que são compostos por este componente

          const packsWithComponent =
            await this.productRepository.findPacksByComponentCode(product.code);

          if (packsWithComponent.length > 0) {
            let isPackResultValid = true;
            const packsResult: any = await Promise.all(
              packsWithComponent.map(async (pack) => {
                const productPack =
                  await this.productRepository.findProductByCode(pack.pack_id);

                const oldPackagePrice = productPack.sales_price;
                const newPackagePrice =
                  productPack.sales_price -
                  pack.qty * productInDb.sales_price +
                  pack.qty * product.sales_price;

                const productPackValidation: any = this.validateProductRules(
                  oldPackagePrice,
                  newPackagePrice,
                  productPack.cost_price,
                  productPack.code,
                  TypeProduct["[Pacote]"]
                );

                if (productPackValidation.error) {
                  isPackResultValid = false;
                  arrayProductsValidation.push({
                    code: product.code,
                    sales_price: product.sales_price,
                    validation: productPackValidation,
                  });
                  return productPackValidation;
                }
              })
            );

            if (!isPackResultValid) {
              valid = false;
              return packsResult[0];
            }
          }
        }

        arrayProductsValidation.push({
          code: product.code,
          sales_price: product.sales_price,
          validation: { success: "Produto validado com sucesso" },
        });
      })
    );

    return { products: arrayProductsValidation, valid: valid };
  }

  public async updateProducts(products: Array<InterfaceProductUpdateRequest>) {
    let valid = true;
    await Promise.all(
      products.map(async (product: InterfaceProductUpdateRequest) => {
        const productInDb = await this.productRepository.findProductByCode(
          product.code
        );

        if (!productInDb) {
          valid = false;
          return {
            error: `Produto com código: ${product.code} não encontrado`,
          };
        }
        //Buscar se existe pacote (Alteração de preço de pacote + alteração de componentes)
        const packInDb = await this.productRepository.findPackByPackCode(
          product.code
        );

        if (packInDb) {
          const packComponent = await this.productRepository.findProductByCode(
            packInDb.product_id
          );

          //Atualização do pacote
          await this.productRepository.updateProduct(
            product.code,
            product.sales_price
          );

          await this.productRepository.updateProductCostPrice(
            product.code,
            packInDb.qty * packComponent.cost_price
          );

          //Atualização do componente
          const newUnitPrice = product.sales_price / packInDb.qty;
          await this.productRepository.updateProduct(
            packComponent.code,
            newUnitPrice
          );
        } else {
          // Atualizar preço do produto em Si
          this.productRepository.updateProduct(
            product.code,
            product.sales_price
          );

          // Buscar pacotes com código de componente
          const packsWithComponent =
            await this.productRepository.findPacksByComponentCode(product.code);

          if (packsWithComponent.length > 0) {
            await Promise.all(
              packsWithComponent.map(async (pack) => {
                const productPack =
                  await this.productRepository.findProductByCode(pack.pack_id);

                const newPackagePrice =
                  productPack.sales_price -
                  pack.qty * productInDb.sales_price +
                  pack.qty * product.sales_price;

                //Atualizar pacotes que possuem o componente
                await this.productRepository.updateProduct(
                  productPack.code,
                  newPackagePrice
                );

                const packsInDb =
                  await this.productRepository.findPacksByPackCode(
                    productPack.code
                  );
                let newCostPrice = 0;

                await Promise.all(
                  packsInDb.map(async (packInDb: any) => {
                    const productInPack =
                      await this.productRepository.findProductByCode(
                        packInDb.product_id
                      );

                    newCostPrice += productInPack.cost_price * packInDb.qty;
                  })
                );

                await this.productRepository.updateProductCostPrice(
                  productPack.code,
                  newCostPrice
                );
              })
            );
          }
        }
      })
    );

    if (!valid) {
      return { error: "Falha ao atualizar produtos" };
    }

    return { success: "Produtos atualizados com sucesso" };
  }

  private isHigherThanCostPrice(costPrice: number, newPrice: number): boolean {
    if (costPrice >= newPrice) {
      return false;
    }
    return true;
  }

  private is10PercentagePriceDifference(
    oldPrice: number,
    newPrice: number
  ): boolean {
    const percentage = 10;
    const higherLimit = oldPrice * (1 + percentage / 100);
    const lowerLimit = oldPrice * (1 - percentage / 100);

    if (newPrice > higherLimit || newPrice < lowerLimit) {
      return false;
    }

    return true;
  }

  private validateProductRules(
    oldPrice: number,
    newPrice: number,
    costPrice: number,
    code: number,
    type: TypeProduct
  ) {
    let typeText: string = "";

    switch (type) {
      case TypeProduct["[Componente]"]:
        typeText = "[COMPONENTE]";
        break;

      case TypeProduct["[Pacote]"]:
        typeText = "[PACOTE]";
        break;

      case TypeProduct["[Produto]"]:
        typeText = "[PRODUTO]";
        break;

      default:
        break;
    }

    if (!this.isHigherThanCostPrice(costPrice, newPrice))
      return {
        error: `Novo preço de venda unitário do ${typeText} ${code} deve ser maior que o preço de custo`,
      };

    if (!this.is10PercentagePriceDifference(oldPrice, newPrice))
      return {
        error: `Novo preço de venda unitário do ${typeText} ${code} deve estar na faixa de 10%`,
      };

    return true;
  }
}

export { ProductService };
