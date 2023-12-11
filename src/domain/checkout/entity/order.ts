import OrderItem from "./order_item";
export default class Order {
  private id: string;
  private customerId: string;
  private items: OrderItem[];
  private total: number;

  constructor(id: string, customerId: string, items: OrderItem[] = []) {
    this.id = id;
    this.customerId = customerId;
    this.items = items;
    this.total = 0;
    // this.total = this.getTotal();
    // this.validate();
  }

  getId(): string {
    return this.id;
  }

  getCustomerId(): string {
    return this.customerId;
  }

  getItems(): OrderItem[] {
    return this.items;
  }

  validate(): boolean {
    if (this.id.length === 0) {
      throw new Error("Id is required");
    }
    if (this.customerId.length === 0) {
      throw new Error("CustomerId is required");
    }
    if (this.items.length === 0) {
      throw new Error("Items are required");
    }

    if (this.items.some((item) => item.getQuantity() <= 0)) {
      throw new Error("Quantity must be greater than 0");
    }

    return true;
  }

  getTotal(): number {
    const total = this.items.reduce((acc, item) => acc + item.orderItemTotal(), 0);
    this.validate();
    return total;
  }

  addItem(item: OrderItem): void {
    this.items.push(item);
  }
}
