import { v4 as uuid } from "uuid";
import OrderFactory from "../../src/domain/checkout/factory/order.factory";

describe("Order factory unit test", () => {
  it("should create an order", () => {
    const orderProps = {
      id: uuid(),
      customerId: uuid(),
      items: [
        {
          id: uuid(),
          name: "Product 1",
          productId: uuid(),
          quantity: 1,
          price: 100,
        },
      ],
    };

    const order = OrderFactory.create(orderProps);

    expect(order.getId()).toEqual(orderProps.id);
    expect(order.getCustomerId()).toEqual(orderProps.customerId);
    expect(order.getItems().length).toBe(1);
  });
});
