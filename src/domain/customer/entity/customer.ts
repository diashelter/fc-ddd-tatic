import Address from "../value-object/address";

export default class Customer {
  private id: string;
  private name: string = "";
  private address!: Address;
  private active: boolean = false;
  private rewardPoints: number = 0;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
    this.validate();
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getRewardPoints(): number {
    return this.rewardPoints;
  }

  validate() {
    if (this.id.length === 0) {
      throw new Error("Id is required");
    }
    if (this.name.length === 0) {
      throw new Error("Name is required");
    }
  }

  changeName(name: string) {
    this.name = name;
    this.validate();
  }

  getAddress(): Address {
    return this.address;
  }
  
  changeAddress(address: Address) {
    this.address = address;
  }

  isActive(): boolean {
    return this.active;
  }

  activate() {
    if (this.address === undefined) {
      throw new Error("Address is mandatory to activate a customer");
    }
    this.active = true;
  }

  deactivate() {
    this.active = false;
  }

  addRewardPoints(points: number) {
    this.rewardPoints += points;
  }
}
