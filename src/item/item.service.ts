import { Injectable, NotFoundException, UseGuards } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateItemDto, EditItemDto } from './dto';
import { Roles } from 'src/auth/decorator';
import { e_Roles } from 'src/auth/enum/role.enum';
import { GetItemsDto } from './dto/get-items.dto';

@Injectable()
export class ItemService {
  constructor(private prisma: PrismaService) {}

  async getItems(dto: GetItemsDto) {
    const items = this.prisma.item.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        image: {
          select: {
            id: true,
            url: true,
            alt: true,
            isClippable: true,
          },
        },
        BookingItem: {
          where: {
            booking: {
              pickupDate: {
                gte: dto.from && new Date(dto.from),
              },
            },
          },
          select: {
            booking: {
              select: {
                id: true,
                createdAt: true,
                pickupDate: true,
                returnDate: true,
                comment: true,
                isPickedUp: true,
                isReturned: true,
                user: {
                  select: {
                    firstName: true,
                    lastName: true,
                    email: true,
                    phone: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    return (await items).map((item) => {
      const { BookingItem, ...rest } = item;
      return {
        ...rest,
        bookings: BookingItem.map((bookingItem) => bookingItem.booking),
      };
    });
  }

  async getItemById(id: number) {
    const item = await this.prisma.item.findUnique({
      where: { id },
    });

    if (!item) {
      throw new NotFoundException('Item not found');
    }

    return item;
  }

  @Roles(e_Roles.Admin)
  async createItem(item: CreateItemDto) {
    if (item.imageId) {
      const image = await this.prisma.image.findUnique({
        where: { id: item.imageId },
      });
      if (!image) {
        throw new NotFoundException('Image not found');
      }
    }

    return this.prisma.item.create({
      data: {
        title: item.title,
        description: item.description,
        imageId: item.imageId,
      },
    });
  }

  @Roles(e_Roles.Admin)
  async editItem(id: number, item: EditItemDto) {
    return this.prisma.item.update({
      where: { id },
      data: { ...item },
    });
  }

  @Roles(e_Roles.Admin)
  async deleteItem(id: number) {
    return this.prisma.item.delete({
      where: { id },
    });
  }
}
