import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  AccessTokenGuard,
  IsEmailConfirmedGuard,
  RolesGuard,
} from 'src/auth/guard';
import { ItemService } from './item.service';
import { CreateItemDto, EditItemDto } from './dto';
import { Roles } from 'src/auth/decorator';
import { e_Roles } from 'src/auth/enum/role.enum';
import { GetItemsDto } from './dto/get-items.dto';

@UseGuards(AccessTokenGuard, RolesGuard, IsEmailConfirmedGuard)
@Roles(e_Roles.Member, e_Roles.Admin)
@Controller('items')
export class ItemController {
  constructor(private itemService: ItemService) {}

  @Get()
  getItems(@Query() query: GetItemsDto) {
    return this.itemService.getItems(query);
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
