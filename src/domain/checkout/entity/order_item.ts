export default class OrderItem {
  private id: string;
  private productId: string;
  private name: string;
  private price: number;
  private quantity: number;
  private total: number;

  constructor(
    id: string,
    name: string,
    price: number,
    productId: string,
    quantity: number
  ) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.productId = productId;
    this.quantity = quantity;
    this.total = this.orderItemTotal();
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getProductId(): string {
    return this.productId;
  }

  getQuantity(): number {
    return this.quantity;
  }

  getPrice(): number {
    return this.price;
  }

  orderItemTotal(): number {
    return this.price * this.quantity
  }
}
