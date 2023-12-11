import CustomerFactory from "../../src/domain/customer/factory/customer.factory";
import Address from "../../src/domain/customer/value-object/address";

describe("Customer factory unit test", () => {
  it("should create a customer", () => {
    let customer = CustomerFactory.create("John");

    expect(customer.getId()).toBeDefined();
    expect(customer.getName()).toBe("John");
    expect(customer.getAddress()).toBeUndefined();
  });

  it("should create a customer with an address", () => {
    const address = new Address("Street", 1, "13330-250", "São Paulo");

    let customer = CustomerFactory.createWithAddress("John", address);

    expect(customer.getId()).toBeDefined();
    expect(customer.getName()).toBe("John");
    expect(customer.getAddress()).toBe(address);
  });
});
