import { BaseEntity } from 'src/common/bases/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { IUser } from '../interfaces/user.interface';
import { Location } from 'src/modules/location/entities/location.entity';

@Entity()
export class User extends BaseEntity implements IUser {
  @Column({ name: 'username', unique: false, nullable: false })
  username!: string;

  @Column({ name: 'full_name', unique: false, nullable: true })
  fullName!: string;

  @Column({ name: 'password', unique: false, nullable: false })
  password!: string;

  @Column({ name: 'email', unique: true, nullable: false })
  email!: string;

  @Column({
    name: 'current_request',
    unique: false,
    nullable: false,
    default: 0,
  })
  currentRequest!: number;

  @OneToMany(() => Location, (location) => location.user)
  locations!: Location[];
}
