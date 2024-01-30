import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Entity,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

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
