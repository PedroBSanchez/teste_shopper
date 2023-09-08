interface InterfaceProduct {
  code: number;
  name: string;
  cost_price: number;
  sales_price: number;
}

interface InterfaceProductUpdateRequest {
  code: number;
  sales_price: number;
}

export { InterfaceProduct, InterfaceProductUpdateRequest };
