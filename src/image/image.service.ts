import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateImageDto } from './dto';
import { EditImageDto } from './dto/edit-image.dto';

@Injectable()
export class ImageService {
  constructor(private prisma: PrismaService) {}
  getImages() {
    return this.prisma.image.findMany();
  }

  getImage(id: number) {
    return this.prisma.image.findUnique({
      where: { id },
    });
  }

  addImage(dto: CreateImageDto) {
    return this.prisma.image.create({
      data: dto,
    });
  }

  async editImage(id: number, dto: EditImageDto) {
    return await this.prisma.image.update({
      where: { id },
      data: { ...dto },
    });
  }

  deleteImage(id: number) {
    return this.prisma.image.delete({
      where: { id },
    });
  }
}
