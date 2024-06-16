import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookingDto, EditBookingDto } from './dto';
import type { Prisma } from '@prisma/client';

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) {}

  async getAllBookings() {
    return this.prisma.booking.findMany({
      where: { isArchived: false },
    });
  }

  async getArchivedBookings() {
    return this.prisma.booking.findMany({
      where: { isArchived: true },
    });
  }

  async getUserBookings(userId: number) {
    return this.prisma.booking.findMany({
      where: { userId, isArchived: false },
    });
  }

  async getBookingById(id: number) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        BookingItem: {
          include: {
            item: true,
          },
        },
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return { ...booking, items: booking.BookingItem.map((item) => item.item) };
  }

  async createBooking(userId: number, dto: CreateBookingDto) {
    const { itemIds, ...dtoRest } = dto;

    if (await this.doesBookingOverlap(dtoRest, itemIds)) {
      throw new ConflictException('Booking overlaps with existing booking');
    }

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

  private async doesBookingOverlap(
    dtoRest: { pickupDate: string; returnDate: string; comment?: string },
    itemIds: number[],
  ) {
    const itemOverlaps = await Promise.all(
      itemIds.map((itemId) => this.getOverlapCount(dtoRest, itemId)),
    );
    return itemOverlaps.some((overlap) => overlap > 0);
    return !!(await this.prisma.booking.findFirst(
      this.getOverlappingBookingsPrismaObject(dtoRest, itemIds),
    ));
  }

  private async getOverlapCount(
    dtoRest: { pickupDate: string; returnDate: string },
    itemId: number,
  ) {
    return this.prisma.bookingItem.count({
      where: {
        booking: {
          pickupDate: {
            lte: dtoRest.returnDate,
          },
          returnDate: {
            gte: dtoRest.pickupDate,
          },
          isArchived: false,
        },
        item: {
          id: itemId,
          count: {
            gte: 0,
          },
        },
      },
    });
  }

  private getOverlappingBookingsPrismaObject(
    booking: { pickupDate: string; returnDate: string },
    itemIds: number[],
  ): Prisma.BookingFindFirstArgs {
    return {
      where: {
        isArchived: false,
        pickupDate: {
          lte: booking.returnDate,
        },
        returnDate: {
          gte: booking.pickupDate,
        },
        AND: {
          BookingItem: {
            some: {
              itemId: {
                in: itemIds,
              },
            },
          },
        },
      },
    };
  }

  async editBooking(userId: number, bookingId: number, dto: EditBookingDto) {
    return this.prisma.booking.update({
      where: { id: bookingId },
      data: dto,
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
