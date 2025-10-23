import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CheckoutDto } from './dto/checkout.dto';
import { DatabaseService } from '../database/database.service';
import { Order } from '../../generated/prisma';

@Injectable()
export class OrdersService {
  constructor(private readonly databaseService: DatabaseService) {}

  // Create a single order
  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const { user_id, product_id, quantity, status } = createOrderDto;

    // Verify user exists
    const user = await this.databaseService.user.findUnique({
      where: { id: user_id },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${user_id} not found`);
    }

    // Verify product exists
    const product = await this.databaseService.product.findUnique({
      where: { id: product_id },
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${product_id} not found`);
    }

    // Create the order
    return this.databaseService.order.create({
      data: {
        user: {
          connect: { id: user_id },
        },
        product: {
          connect: { id: product_id },
        },
        quantity,
        status: status || 'pending',
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        product: true,
      },
    });
  }

  // Checkout: Convert all cart items to orders for a user
  async checkout(checkoutDto: CheckoutDto): Promise<Order[]> {
    const { user_id } = checkoutDto;

    // Verify user exists
    const user = await this.databaseService.user.findUnique({
      where: { id: user_id },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${user_id} not found`);
    }

    // Get all cart items for the user
    const cartItems = await this.databaseService.cart_items.findMany({
      where: { user_id },
      include: {
        product: true,
      },
    });

    if (cartItems.length === 0) {
      throw new BadRequestException('Cart is empty. Cannot checkout.');
    }

    // Create orders from cart items
    const orders: Order[] = [];
    for (const cartItem of cartItems) {
      const order = await this.databaseService.order.create({
        data: {
          user: {
            connect: { id: user_id },
          },
          product: {
            connect: { id: cartItem.product_id },
          },
          quantity: cartItem.quantity,
          status: 'pending',
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
          product: true,
        },
      });
      orders.push(order);
    }

    // Clear the cart after successful checkout
    await this.databaseService.cart_items.deleteMany({
      where: { user_id },
    });

    return orders;
  }

  // Get all orders with user and product details
  async findAll(): Promise<Order[]> {
    return this.databaseService.order.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        product: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // Get all orders for a specific user
  async findByUserId(userId: string): Promise<Order[]> {
    const user = await this.databaseService.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return this.databaseService.order.findMany({
      where: { user_id: userId },
      include: {
        product: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // Get a single order by ID
  async findOne(id: string): Promise<Order> {
    const order = await this.databaseService.order.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        product: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  // Update an order (quantity or status)
  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.databaseService.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return this.databaseService.order.update({
      where: { id },
      data: updateOrderDto,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        product: true,
      },
    });
  }

  // Cancel an order (update status to 'cancelled')
  async cancel(id: string): Promise<Order> {
    const order = await this.databaseService.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    if (order.status === 'delivered' || order.status === 'cancelled') {
      throw new BadRequestException(
        `Cannot cancel order with status: ${order.status}`,
      );
    }

    return this.databaseService.order.update({
      where: { id },
      data: { status: 'cancelled' },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        product: true,
      },
    });
  }

  // Delete an order
  async remove(id: string): Promise<Order> {
    const order = await this.databaseService.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return this.databaseService.order.delete({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        product: true,
      },
    });
  }

  // Get order statistics for a user
  async getUserOrderStats(userId: string) {
    const user = await this.databaseService.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const orders = await this.databaseService.order.findMany({
      where: { user_id: userId },
      include: {
        product: true,
      },
    });

    const totalOrders = orders.length;
    const totalSpent = orders.reduce(
      (sum, order) => sum + order.product.price * order.quantity,
      0,
    );

    const statusCounts = orders.reduce(
      (acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      userId,
      totalOrders,
      totalSpent,
      statusCounts,
    };
  }
}
