import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserKuliah } from './auth.entity';

@Entity()
export class ResetPassword extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserKuliah) // relasikan many to one dengan table userKuUserKuliah
  @JoinColumn({ name: 'user_id' })
  user: UserKuliah;

  @Column({ nullable: true })
  token: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
