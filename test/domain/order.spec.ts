import Order from "../../src/domain/checkout/entity/order";
import OrderItem from "../../src/domain/checkout/entity/order_item";

describe("Order unit tests", () => {
  it("should throw error when id is empty", () => {
    expect(() => {
      let order = new Order("", "123");
      order.getTotal();
    }).toThrowError("Id is required");
  });

  it("should throw error when customerId is empty", () => {
    expect(() => {
      let order = new Order("123", "");
      order.getTotal();
    }).toThrowError("CustomerId is required");
  });

  it("should throw error when items is empty", () => {
    expect(() => {
      let order = new Order("123", "123");
      order.getTotal();
    }).toThrowError("Items are required");
  });

  it("should calculate total", () => {
    const item = new OrderItem("i1", "Item 1", 100, "p1", 2);
    const item2 = new OrderItem("i2", "Item 2", 200, "p2", 2);
    const order = new Order("o1", "c1");
    order.addItem(item);

    let total = order.getTotal();

    expect(order.getTotal()).toBe(200);

    const order2 = new Order("o1", "c1");
    order2.addItem(item);
    order2.addItem(item2);
    total = order2.getTotal();
    expect(total).toBe(600);
  });

  it("should throw error if the item qte is less or equal zero 0", () => {
    expect(() => {
      const item = new OrderItem("i1", "Item 1", 100, "p1", 0);
      const order = new Order("o1", "c1");
      order.addItem(item);
      order.getTotal();
    }).toThrowError("Quantity must be greater than 0");
  });
});
