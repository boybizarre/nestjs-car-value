import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Entity,
  Column,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Report } from '../reports/report.entity';

@Entity()
export class User { 
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  admin: boolean

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[]

  @AfterInsert()
  logInsert() {
    console.log('Inserted User with this id, ', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Updated User with this id, ', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('Removed User with this id, ', this.id);
  }
}
