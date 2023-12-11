import { Sequelize } from "sequelize-typescript";
import Order from "../../src/domain/checkout/entity/order";
import OrderItem from "../../src/domain/checkout/entity/order_item";
import Customer from "../../src/domain/customer/entity/customer";
import Address from "../../src/domain/customer/value-object/address";
import Product from "../../src/domain/product/entity/product";
import CustomerModel from "../../src/infrastructure/customer/repository/sequelize/customer.model";
import CustomerRepository from "../../src/infrastructure/customer/repository/sequelize/customer.repository";
import ProductModel from "../../src/infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../src/infrastructure/product/repository/sequelize/product.repository";
import OrderItemModel from "../../src/infrastructure/order/repository/sequilize/order-item.model";
import OrderModel from "../../src/infrastructure/order/repository/sequilize/order.model";
import OrderRepository from "../../src/infrastructure/order/repository/sequilize/order.repository";

describe("Order repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a new order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "1",
      product.getName(),
      product.getPrice(),
      product.getId(),
      2
    );

    const order = new Order("123", "123", [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.getId() },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "123",
      customer_id: "123",
      total: order.getTotal(),
      items: [
        {
          id: orderItem.getId(),
          name: orderItem.getName(),
          price: orderItem.getPrice(),
          quantity: orderItem.getQuantity(),
          order_id: "123",
          product_id: "123",
        },
      ],
    });
  });

  it("should update a order", async () => {
    const idBase = "1";
    const mockData = createMockData(idBase);
    const customer = mockData[0] as Customer;
    const productA = mockData[1] as Product;
    let order = mockData[2] as Order;

    const customerRepository = new CustomerRepository();
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    await productRepository.create(productA);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    let orderModel = await orderRepository.find(order.getId());
    expect(order).toStrictEqual(orderModel);

    const productB = new Product("2", 'Product 2', 500.01);
    await productRepository.create(productB);

    const ordemItem2 = new OrderItem(
      "25",
      productB.getName(),
      productB.getPrice(),
      productB.getId(),
      1
    );

    order = new Order(orderModel.getId(), orderModel.getCustomerId(), [ordemItem2]);

    await orderRepository.update(order);

    orderModel = await orderRepository.find(order.getId());
    expect(order).toStrictEqual(orderModel);
  });

  it("should find a order", async () => {
    const idBase = "1";
    const mockData = createMockData(idBase);
    const customer = mockData[0];
    const product = new Product(idBase, 'Product ' + idBase, 100.01);
    const order = mockData[2]

    const customerRepository = new CustomerRepository();
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    await productRepository.create(product);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderResult = await orderRepository.find(order.id);

    expect(order).toStrictEqual(orderResult);
  });

  it("should throw an error when order is not found", async () => {
    const orderRepository = new OrderRepository();

    expect(async () => {
      await orderRepository.find("1356");
    }).rejects.toThrow("Order not found");
  });

  it("should find all orders", async () => {

    const mockData = createMockData("1");
    const customer = mockData[0];
    const product = mockData[1];
    const order = mockData[2];

    const mockDataB = createMockData("2");
    const customerB = mockDataB[0];
    const productB = mockDataB[1];
    const orderB = mockDataB[2];

    const customerRepository = new CustomerRepository();
    await customerRepository.create(customer);
    await customerRepository.create(customerB);

    const productRepository = new ProductRepository();
    await productRepository.create(product);
    await productRepository.create(productB);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);
    await orderRepository.create(orderB);

    const orders = await orderRepository.findAll();

    expect(orders).toHaveLength(2);
    expect(orders).toContainEqual(order);
    expect(orders).toContainEqual(orderB);
  });

});

export function createMockData(id: string): any[] {

  const customer = new Customer(id, 'Customer ' + id);
  const address = new Address('Street ' + id, 1, 'Zipcode ' + id, 'City ' + id);
  customer.changeAddress(address);

  const product = new Product(id, 'Product ' + id, 100.01);
  const orderItem = new OrderItem(
    id,
    product.getName(),
    product.getPrice(),
    product.getId(),
    1
  );
  const order = new Order(id, id, [orderItem]);

  return [customer, product, order];
}