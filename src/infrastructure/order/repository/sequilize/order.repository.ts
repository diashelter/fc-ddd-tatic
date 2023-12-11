import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import OrderRepositoryInterface from "../../../../domain/checkout/repository/order-repository.interface";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";

export default class OrderRepository implements OrderRepositoryInterface {
  async update(entity: Order): Promise<void> {

    try {

      await OrderModel.update(
        {
          total: entity.getTotal(),
        },
        {
          where: { id: entity.getId() }
        },
      );

      await OrderItemModel.destroy(
        {
          where: { order_id: entity.getId() }
        },
      );

      await OrderItemModel.bulkCreate(entity.getItems().map((item) => {
        return {
          id: item.getId(),
          product_id: item.getProductId(),
          order_id: entity.getId(),
          quantity: item.getQuantity(),
          name: item.getName(),
          price: item.getPrice(),
        }
      }));

    } catch (e) {
      console.log('error updating user:', e);
    }
  }

  async find(id: string): Promise<Order> {
    let orderModel;
    try {
      orderModel = await OrderModel.findOne({
        where: {
          id,
        },
        include: [{ model: OrderItemModel }],
        rejectOnEmpty: true,
      });
    } catch (error) {
      throw new Error("Order not found");
    }

    const itens = orderModel.items.map((i): OrderItem =>
      new OrderItem(
        i.id,
        i.name,
        i.price,
        i.product_id,
        i.quantity)
    );

    const order = new Order(orderModel.id, orderModel.customer_id, itens);

    return order;
  }

  async findAll(): Promise<Order[]> {

    const orderModels = await OrderModel.findAll({
      include: [{ model: OrderItemModel }],
    });

    const orders = orderModels.map((orderModel) => {
      const itens = orderModel.items.map((i): OrderItem =>
        new OrderItem(
          i.id,
          i.name,
          i.price,
          i.product_id,
          i.quantity)
      );
      return new Order(orderModel.id, orderModel.customer_id, itens);
    });

    return orders;
  }

  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.getId(),
        customer_id: entity.getCustomerId(),
        total: entity.getTotal(),
        items: entity.getItems().map((item) => ({
          id: item.getId(),
          name: item.getName(),
          price: item.getPrice(),
          product_id: item.getProductId(),
          quantity: item.getQuantity(),
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }
}
