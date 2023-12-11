import Product from "../entity/product";

export default class ProductService {
  static increasePrice(products: Product[], percentage: number): Product[] {
    products.forEach((product) => {
      product.changePrice((product.getPrice() * percentage) / 100 + product.getPrice());
    });
    return products;
  }
}
