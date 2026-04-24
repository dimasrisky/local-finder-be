import { PartialType } from '@nestjs/swagger';
import { CreateLocationItemDto } from './create-location-item.dto';

export class UpdateLocationItemDto extends PartialType(CreateLocationItemDto) {}
