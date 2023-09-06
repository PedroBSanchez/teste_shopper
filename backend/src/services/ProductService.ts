import { InterfaceProduct } from "../interfaces/ProductsInterface";
import { ProductRepository } from "../repositories/ProductRepository";

class ProductService {
  private productRepository: ProductRepository;
  constructor() {
    this.productRepository = new ProductRepository();
  }

  public async validateProducts(products: Array<InterfaceProduct>) {
    const results = await Promise.all(
      products.map(async (product: InterfaceProduct, index) => {
        const productInDb = await this.productRepository.findProductByCode(
          product.code
        );

        if (!productInDb) {
          return {
            error: `Produto com código: ${product.code} não encontrado`,
          };
        }

        //Buscar se existe pacote (Alteração de preço de pacote + alteração de componentes)

        const packInDb = await this.productRepository.findPackByPackCode(
          product.code
        );

        if (packInDb) {
          // Buscar o componente
          const packComponent = await this.productRepository.findProductByCode(
            packInDb.product_id
          );

          //Validação do preço do pacote
          if (
            !this.isHigherThanCostPrice(
              productInDb.cost_price,
              product.sales_price
            )
          ) {
            return {
              error: `Preço de venda do pacote [${product.code}] deve ser maior que de custo`,
            };
          }

          if (
            !this.is10PercentagePriceDifference(
              productInDb.sales_price,
              product.sales_price
            )
          ) {
            return {
              error: `Novo preço de venda do pacote [${product.code}] deve estar na faixa de 10% do preço atual`,
            };
          }

          //Novo Preço unitário
          const oldUnitPrice = productInDb.sales_price / packInDb.qty;
          const newUnitPrice = product.sales_price / packInDb.qty;

          if (
            !this.isHigherThanCostPrice(packComponent.cost_price, newUnitPrice)
          ) {
            return {
              error: `Novo preço de venda unitário do componente ${packComponent.code} deve ser maior que o preço de custo`,
            };
          }

          if (!this.is10PercentagePriceDifference(oldUnitPrice, newUnitPrice)) {
            return {
              error: `Novo preço de venda unitário do componente ${packComponent.code} deve estar na faixa de 10%`,
            };
          }
        } else {
          // Validar preço do componente em si
          // Buscar pacotes com código de componente
          // Para cada pacote encontrado Verificar se o novo preço está de acordo
          // oldpricepkg = preço do pacote
          // newpricepkg = totalPrice - (qty * componenteOldPrice) + (qty * componentNewPrice)
          // Validar novo preço do pacote
        }
      })
    );

    return { error: "ok" };
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
}

export { ProductService };
