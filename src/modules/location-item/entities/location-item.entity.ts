import { BaseEntity } from 'src/common/bases/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { ILocationItem } from '../interfaces/location-item.interface';
import { Location } from 'src/modules/location/entities/location.entity';

@Entity()
export class LocationItem extends BaseEntity implements ILocationItem {
  @Column({ name: 'title', unique: false, nullable: false })
  title: string;

  @Column({ name: 'rating', unique: false, nullable: false })
  rating: string;

  @Column({ name: 'address', unique: false, nullable: true })
  address: string;

  @Column({ name: 'url', unique: false, nullable: true })
  url: string;

  @Column({ name: 'phone_number', unique: false, nullable: true })
  phoneNumber: string;

  @Column({ name: 'google_maps_url', unique: false, nullable: false })
  googleMapsUrl: string;

  @ManyToOne(() => Location, (location) => location.locationItems)
  location: Location;
}
