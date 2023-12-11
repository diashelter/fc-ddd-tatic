import { Sequelize } from "sequelize-typescript";
import Customer from "../../src/domain/customer/entity/customer";
import Address from "../../src/domain/customer/value-object/address";
import CustomerModel from "../../src/infrastructure/customer/repository/sequelize/customer.model";
import CustomerRepository from "../../src/infrastructure/customer/repository/sequelize/customer.repository";

describe("Customer repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([CustomerModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a customer", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    customer.changeAddress(new Address("Street 1", 1, "Zipcode 1", "City 1"));
    await customerRepository.create(customer);

    const customerModel = await CustomerModel.findOne({ where: { id: "123" } });

    expect(customerModel.toJSON()).toStrictEqual({
      id: "123",
      name: customer.getName(),
      active: customer.isActive(),
      rewardPoints: customer.getRewardPoints(),
      street: customer.getAddress().getStreet(),
      number: customer.getAddress().getNumber(),
      zipcode: customer.getAddress().getZip(),
      city: customer.getAddress().getCity(),
    });
  });

  it("should update a customer", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    customer.changeAddress(new Address("Street 1", 1, "Zipcode 1", "City 1"));
    await customerRepository.create(customer);
    
    customer.changeName("Customer 2");
    await customerRepository.update(customer);
    const customerModel = await CustomerModel.findOne({ where: { id: "123" } });

    expect(customerModel.toJSON()).toStrictEqual({
      id: "123",
      name: customer.getName(),
      active: customer.isActive(),
      rewardPoints: customer.getRewardPoints(),
      street: customer.getAddress().getStreet(),
      number: customer.getAddress().getNumber(),
      zipcode: customer.getAddress().getZip(),
      city: customer.getAddress().getCity(),
    });
  });

  it("should find a customer", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    customer.changeAddress(new Address("Street 1", 1, "Zipcode 1", "City 1"));
    await customerRepository.create(customer);

    const customerResult = await customerRepository.find(customer.getId());

    expect(customer).toStrictEqual(customerResult);
  });

  it("should throw an error when customer is not found", async () => {
    const customerRepository = new CustomerRepository();

    expect(async () => {
      await customerRepository.find("456ABC");
    }).rejects.toThrow("Customer not found");
  });

  it("should find all customers", async () => {
    const customerRepository = new CustomerRepository();
    const customer1 = new Customer("123", "Customer 1");
    customer1.changeAddress(new Address("Street 1", 1, "Zipcode 1", "City 1"));
    customer1.addRewardPoints(10);
    customer1.activate();

    const customer2 = new Customer("456", "Customer 2");
    customer2.changeAddress(new Address("Street 2", 2, "Zipcode 2", "City 2"));
    customer2.addRewardPoints(20);

    await customerRepository.create(customer1);
    await customerRepository.create(customer2);

    const customers = await customerRepository.findAll();

    expect(customers).toHaveLength(2);
    expect(customers).toContainEqual(customer1);
    expect(customers).toContainEqual(customer2);
  });
});
