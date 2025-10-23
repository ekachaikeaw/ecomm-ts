import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { DatabaseService } from '../database/database.service';
import { cart_items } from '../../generated/prisma/client';

@Injectable()
export class CartItemsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(dto: CreateCartItemDto): Promise<cart_items> {
    // Verify user exists
    const user = await this.databaseService.user.findUnique({
      where: { id: dto.user_id },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${dto.user_id} not found`);
    }

    // Verify product exists
    const product = await this.databaseService.product.findUnique({
      where: { id: dto.product_id },
    });
    if (!product) {
      throw new NotFoundException(
        `Product with ID ${dto.product_id} not found`,
      );
    }

    return this.databaseService.cart_items.create({
      data: {
        user: {
          connect: { id: dto.user_id },
        },
        product: {
          connect: { id: dto.product_id },
        },
        quantity: dto.quantity,
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

  async findAll() {
    return this.databaseService.cart_items.findMany({
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

  async findOne(id: string) {
    const cartItem = await this.databaseService.cart_items.findUnique({
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

    if (!cartItem) {
      throw new NotFoundException(`Cart item with ID ${id} not found`);
    }

    return cartItem;
  }

  async update(id: string, updateCartItemDto: UpdateCartItemDto) {
    const cartItem = await this.databaseService.cart_items.findUnique({
      where: { id },
    });

    if (!cartItem) {
      throw new NotFoundException(`Cart item with ID ${id} not found`);
    }

    const { quantity } = updateCartItemDto;
    return this.databaseService.cart_items.update({
      where: { id },
      data: { quantity },
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

  async remove(id: string) {
    const cartItem = await this.databaseService.cart_items.findUnique({
      where: { id },
    });

    if (!cartItem) {
      throw new NotFoundException(`Cart item with ID ${id} not found`);
    }

    return this.databaseService.cart_items.delete({
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
}
