import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { AccessTokenGuard, RolesGuard } from 'src/auth/guard';
import { ImageService } from './image.service';
import { Roles } from 'src/auth/decorator';
import { e_Roles } from 'src/auth/enum/role.enum';
import { EditImageDto } from './dto/edit-image.dto';

@Controller('images')
@UseGuards(AccessTokenGuard, RolesGuard)
@Roles(e_Roles.User)
export class ImageController {
  constructor(private imageService: ImageService) {}

  @Get()
  getImages() {
    return this.imageService.getImages();
  }

  @Roles(e_Roles.Admin)
  @Patch(':id')
  editImage(@Param('id') id: number, @Body() dto: EditImageDto) {
    return this.imageService.editImage(id, dto);
  }
}
