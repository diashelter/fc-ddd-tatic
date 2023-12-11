import Customer from "../../src/domain/customer/entity/customer";
import Order from "../../src/domain/checkout/entity/order";
import OrderItem from "../../src/domain/checkout/entity/order_item";
import OrderService from "../../src/domain/checkout/service/order.service";
describe("Order service unit tets", () => {
  it("should place an order", () => {
    const customer = new Customer("c1", "Customer 1");
    const item1 = new OrderItem("i1", "Item 1", 10, "p1", 1);

    const order = OrderService.placeOrder(customer, [item1]);

    expect(customer.getRewardPoints()).toBe(5);
    expect(order.getTotal()).toBe(10);
  });

  it("should get total of all orders", () => {
    const item1 = new OrderItem("i1", "Item 1", 100, "p1", 1);
    const item2 = new OrderItem("i2", "Item 2", 200, "p2", 2);

    const order = new Order("o1", "c1", [item1]);
    const order2 = new Order("o2", "c1", [item2]);

    const total = OrderService.total([order, order2]);

    expect(total).toBe(500);
  });
});
