import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookingDto } from './dto';

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) {}

  async getAllBookings() {
    return this.prisma.booking.findMany();
  }

  async getUserBookings(userId: number) {
    return this.prisma.booking.findMany({
      where: { userId },
    });
  }

  async getBookingById(id: number) {
    const booking = this.prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return booking;
  }

  async createBooking(userId: number, dto: CreateBookingDto) {
    const { itemIds, ...dtoRest } = dto;

    return this.prisma.booking.create({
      data: {
        ...dtoRest,
        userId,
        BookingItem: {
          create: itemIds.map((itemId) => ({
            itemId,
          })),
        },
      },
    });
  }

  async deleteBooking(userId: number, bookingId: number) {
    this.assertBookingOwnership(userId, bookingId);
    return this.prisma.booking.delete({
      where: { id: bookingId },
    });
  }

  private async assertBookingOwnership(userId: number, bookingId: number) {
    const booking = await this.prisma.booking.findUnique({
      where: {
        id: bookingId,
      },
    });
    if (!booking || booking.userId !== userId) {
      throw new UnauthorizedException('Access to resource denied');
    }
  }
}
