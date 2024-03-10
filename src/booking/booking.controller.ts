import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { AccessTokenGuard, RolesGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { CreateBookingDto } from './dto';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { e_Roles } from 'src/auth/enum/role.enum';

@Controller('bookings')
@UseGuards(AccessTokenGuard, RolesGuard)
@Roles(e_Roles.User)
export class BookingController {
  constructor(private bookingService: BookingService) {}

  @Get()
  getBookings() {
    return this.bookingService.getAllBookings();
  }

  @Get(':id')
  getBookingById(@Param('id') id: number) {
    return this.bookingService.getBookingById(id);
  }

  @Get('me')
  getUserBookings(@GetUser('id') id: number) {
    return this.bookingService.getUserBookings(id);
  }

  @Post()
  createBooking(@GetUser('id') id: number, @Body() dto: CreateBookingDto) {
    return this.bookingService.createBooking(id, dto);
  }

  @Delete(':id')
  deleteBooking(@GetUser('id') userId: number, @Param('id') bookingId: number) {
    return this.bookingService.deleteBooking(userId, bookingId);
  }
}
