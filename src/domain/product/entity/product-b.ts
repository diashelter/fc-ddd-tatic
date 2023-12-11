import ProductInterface from "./product.interface";

export default class ProductB implements ProductInterface {
  private id: string;
  private name: string;
  private price: number;

  constructor(id: string, name: string, price: number) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.validate();
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getPrice(): number {
    return this.price * 2;
  }

  changeName(name: string): void {
    this.name = name;
    this.validate();
  }

  changePrice(price: number): void {
    this.price = price;
    this.validate();
  }

  validate(): boolean {
    if (this.id.length === 0) {
      throw new Error("Id is required");
    }
    if (this.name.length === 0) {
      throw new Error("Name is required");
    }
    if (this.price < 0) {
      throw new Error("Price must be greater than zero");
    }
    return true;
  }
}
