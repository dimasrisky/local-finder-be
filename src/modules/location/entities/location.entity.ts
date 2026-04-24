import { BaseEntity } from 'src/common/bases/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { ILocation } from '../interfaces/location.interface';
import { LocationItem } from 'src/modules/location-item/entities/location-item.entity';

@Entity()
export class Location extends BaseEntity implements ILocation {
  @Column({ name: 'name', unique: false, nullable: false })
  name!: string;

  @Column({ name: 'search_query', unique: false, nullable: false })
  searchQuery!: string;

  @Column({ name: 'total_items', unique: false, nullable: false })
  totalItems!: number;

  @OneToMany(() => LocationItem, (locationItem) => locationItem.location)
  locationItems!: LocationItem[];
}
