import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AccessTokenGuard, RolesGuard } from 'src/auth/guard';
import { ItemService } from './item.service';
import { CreateItemDto, EditItemDto } from './dto';
import { Roles } from 'src/auth/decorator';
import { e_Roles } from 'src/auth/enum/role.enum';

@UseGuards(AccessTokenGuard, RolesGuard)
@Roles(e_Roles.User)
@Controller('items')
export class ItemController {
  constructor(private itemService: ItemService) {}

  @Get()
  getItems() {
    return this.itemService.getItems();
  }

  @Get(':id')
  getItemById(@Param('id', ParseIntPipe) id: number) {
    return this.itemService.getItemById(id);
  }

  @Post()
  createItem(@Body() dto: CreateItemDto) {
    return this.itemService.createItem(dto);
  }

  @Patch(':id')
  @Roles(e_Roles.Admin)
  editItemById(
    @Param('id', ParseIntPipe) id: number,
    @Body() item: EditItemDto,
  ) {
    return this.itemService.editItem(id, item);
  }

  @Roles(e_Roles.Admin)
  @Delete(':id')
  deleteItemById(@Param('id', ParseIntPipe) id: number) {
    return this.itemService.deleteItem(id);
  }
}
