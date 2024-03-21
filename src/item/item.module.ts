import { Module } from '@nestjs/common';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';
import { UserService } from 'src/user/user.service';

@Module({
  controllers: [ItemController],
  providers: [ItemService, UserService],
})
export class ItemModule {}
