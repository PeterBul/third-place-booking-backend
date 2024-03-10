import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateItemDto, EditItemDto } from './dto';

@Injectable()
export class ItemService {
  constructor(private prisma: PrismaService) {}

  async getItems() {
    return this.prisma.item.findMany();
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

  async editItem(id: number, item: EditItemDto) {
    return this.prisma.item.update({
      where: { id },
      data: {
        title: item.title,
        description: item.description,
      },
    });
  }

  async deleteItem(id: number) {
    return this.prisma.item.delete({
      where: { id },
    });
  }
}
